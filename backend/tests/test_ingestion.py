import asyncio

from zerocost.chunking import SemanticChunk
from zerocost.ingestion import DocumentChunk, KnowledgeIngestor, chunk_hash, source_hash
from zerocost.models import KnowledgeCollectionInput, WorkspaceInput
from zerocost.storage import Store


class CountingEmbeddings:
    calls = []

    def __init__(self, model):
        assert model == 'embed-local'

    async def embed(self, texts):
        self.calls.append(list(texts))
        return [[1.0, 0.0, 0.0] for _ in texts]


def test_hashes_are_deterministic_and_chunk_versioned():
    assert source_hash('aynı') == source_hash('aynı')
    assert source_hash('aynı') != source_hash('aynı\n')
    assert chunk_hash('aynı') == chunk_hash('aynı')
    assert chunk_hash('aynı') != source_hash('aynı')


def test_idempotency_skips_unchanged_document_and_reuses_unchanged_chunks(tmp_path):
    async def scenario():
        root = tmp_path / 'project'
        root.mkdir()
        store = Store(tmp_path / 'knowledge.sqlite3')
        store.create_workspace(WorkspaceInput(name='Project', path=str(root)))
        workspace = store.snapshot().workspaces[0]
        collection_id = store.create_knowledge_collection(KnowledgeCollectionInput(
            name='Docs', embedding_model='embed-local'), 3)
        CountingEmbeddings.calls = []
        ingestor = KnowledgeIngestor(store, CountingEmbeddings)
        original = [DocumentChunk('değişmeyen parça', 1, 2),
                    DocumentChunk('eski parça', 3, 4)]
        first = await ingestor.index_chunks(
            collection_id, workspace.id, 'guide.md', 'belge v1', original)
        assert (first.embedded_count, first.reused_count) == (2, 0)
        assert CountingEmbeddings.calls == [['değişmeyen parça', 'eski parça']]

        unchanged = await ingestor.index_chunks(
            collection_id, workspace.id, 'guide.md', 'belge v1', original)
        assert unchanged.status == 'unchanged' and unchanged.embedded_count == 0
        assert len(CountingEmbeddings.calls) == 1

        store.db.execute("UPDATE knowledge_sources SET index_version='old-chunker'")
        store.db.commit()
        reversioned = await ingestor.index_chunks(
            collection_id, workspace.id, 'guide.md', 'belge v1', original)
        assert reversioned.status == 'indexed' and reversioned.embedded_count == 0
        assert len(CountingEmbeddings.calls) == 1

        changed = [DocumentChunk('değişmeyen parça', 1, 2),
                   DocumentChunk('yeni parça', 3, 4),
                   DocumentChunk('yeni parça', 5, 6)]
        updated = await ingestor.index_chunks(
            collection_id, workspace.id, 'guide.md', 'belge v2', changed)
        assert (updated.embedded_count, updated.reused_count) == (1, 2)
        assert CountingEmbeddings.calls[-1] == ['yeni parça']
        assert store.knowledge_snapshot().collections[0].chunk_count == 3
        assert store.db.execute('SELECT COUNT(DISTINCT content_hash) FROM knowledge_chunks').fetchone()[0] == 2
        store.close()

    asyncio.run(scenario())


def test_embedding_misses_are_batched_at_provider_limit(tmp_path):
    async def scenario():
        root = tmp_path / 'project'
        root.mkdir()
        store = Store(tmp_path / 'batched.sqlite3')
        store.create_workspace(WorkspaceInput(name='Project', path=str(root)))
        workspace = store.snapshot().workspaces[0]
        collection_id = store.create_knowledge_collection(KnowledgeCollectionInput(
            name='Docs', embedding_model='embed-local'), 3)
        CountingEmbeddings.calls = []
        chunks = [DocumentChunk(f'parça {index}', index + 1, index + 1) for index in range(33)]
        result = await KnowledgeIngestor(store, CountingEmbeddings).index_chunks(
            collection_id, workspace.id, 'large.md', 'large', chunks)
        assert result.embedded_count == 33
        assert [len(batch) for batch in CountingEmbeddings.calls] == [32, 1]
        store.close()

    asyncio.run(scenario())


def test_overlap_is_embedded_but_primary_content_is_stored(tmp_path):
    async def scenario():
        root = tmp_path / 'project'
        root.mkdir()
        store = Store(tmp_path / 'overlap.sqlite3')
        store.create_workspace(WorkspaceInput(name='Project', path=str(root)))
        workspace = store.snapshot().workspaces[0]
        collection_id = store.create_knowledge_collection(KnowledgeCollectionInput(
            name='Docs', embedding_model='embed-local'), 3)
        chunk = SemanticChunk(
            content='Güncel ve aranabilir ana içerik.',
            start_line=4,
            end_line=5,
            heading_path=('Bölüm',),
            block_kinds=('paragraph',),
            overlap_content='Önceki bağlam.',
            overlap_start_line=1,
            overlap_end_line=3,
            overlap_kind='text',
        )
        CountingEmbeddings.calls = []
        await KnowledgeIngestor(store, CountingEmbeddings).index_chunks(
            collection_id, workspace.id, 'guide.md', 'belge', [chunk])

        assert CountingEmbeddings.calls == [[chunk.embedding_content]]
        stored = store.db.execute(
            'SELECT content, content_hash FROM knowledge_chunks').fetchone()
        assert stored['content'] == chunk.content
        assert stored['content_hash'] == chunk_hash(chunk.embedding_content)
        store.close()

    asyncio.run(scenario())
