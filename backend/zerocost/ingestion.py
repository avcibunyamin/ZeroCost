"""Idempotent knowledge indexing primitives shared by future document parsers."""
from __future__ import annotations
from dataclasses import dataclass
import hashlib

from .embeddings import MAX_EMBED_INPUTS
from .documents import DocumentBlock

INDEX_VERSION = 'zerocost-chunk-v1'
HASH_VERSION = INDEX_VERSION.encode() + b'\0'


@dataclass(frozen=True)
class DocumentChunk:
    content: str
    start_line: int
    end_line: int


@dataclass(frozen=True)
class IndexResult:
    status: str
    chunk_count: int
    embedded_count: int
    reused_count: int


def source_hash(content: str) -> str:
    """Hash exact UTF-8 document content; metadata changes do not invalidate vectors."""
    return hashlib.sha256(content.encode('utf-8')).hexdigest()


def chunk_hash(content: str) -> str:
    """Versioned hash allows future embedding-input changes to invalidate old cache rows."""
    digest = hashlib.sha256()
    digest.update(HASH_VERSION)
    digest.update(content.encode('utf-8'))
    return digest.hexdigest()


class KnowledgeIngestor:
    def __init__(self, store, embedding_factory):
        self.store = store
        self.embedding_factory = embedding_factory

    async def index_chunks(self, collection_id: str, workspace_id: str, path: str,
                           content: str,
                           chunks: list[DocumentChunk | DocumentBlock]) -> IndexResult:
        collection = self.store.knowledge_collection(collection_id)
        if collection is None or self.store.workspace(workspace_id) is None:
            raise ValueError('Bilgi koleksiyonu veya çalışma alanı bulunamadı.')
        digest = source_hash(content)
        current = self.store.knowledge_source_hash(collection_id, workspace_id, path)
        if (current and current['status'] == 'ready' and current['content_hash'] == digest
                and current['index_version'] == INDEX_VERSION):
            return IndexResult('unchanged', len(chunks), 0, len(chunks))

        hashes = [chunk_hash(item.content) for item in chunks]
        cached = self.store.cached_chunk_embeddings(collection_id, hashes)
        missing = []
        seen = set()
        for item, item_hash in zip(chunks, hashes):
            if item_hash not in cached and item_hash not in seen:
                missing.append((item_hash, item.content))
                seen.add(item_hash)

        provider = self.embedding_factory(collection['embedding_model'])
        for offset in range(0, len(missing), MAX_EMBED_INPUTS):
            batch = missing[offset:offset + MAX_EMBED_INPUTS]
            vectors = await provider.embed([item[1] for item in batch])
            if len(vectors) != len(batch):
                raise ValueError('Embedding yanıt sayısı chunk sayısıyla uyuşmuyor.')
            cached.update({item[0]: vector for item, vector in zip(batch, vectors)})

        prepared = [{
            'start_line': item.start_line,
            'end_line': item.end_line,
            'content': item.content,
            'content_hash': item_hash,
            'embedding': cached[item_hash],
        } for item, item_hash in zip(chunks, hashes)]
        self.store.replace_knowledge_source(
            collection_id, workspace_id, path, digest, prepared, INDEX_VERSION)
        return IndexResult('indexed', len(chunks), len(missing), len(chunks) - len(missing))
