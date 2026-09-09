"""Semantic block packing; oversized block splitting and overlap are separate stages."""
from __future__ import annotations
from dataclasses import dataclass

from .documents import BlockKind, DocumentBlock

MIN_TARGET_CHARS = 32
MAX_CHUNK_CHARS = 32_000


@dataclass(frozen=True)
class SemanticChunk:
    content: str
    start_line: int
    end_line: int
    heading_path: tuple[str, ...]
    block_kinds: tuple[BlockKind, ...]
    oversized: bool = False


def _joined_length(parts: list[str], addition: str) -> int:
    return sum(len(part) for part in parts) + len(addition) + 2 * len(parts)


def merge_semantic_blocks(blocks: list[DocumentBlock], *, target_chars: int = 2_400,
                          max_chars: int = 3_200) -> list[SemanticChunk]:
    """Pack adjacent semantic blocks without crossing section headings or splitting blocks."""
    if not MIN_TARGET_CHARS <= target_chars <= max_chars <= MAX_CHUNK_CHARS:
        raise ValueError('Chunk boyutları 32 ≤ hedef ≤ azami ≤ 32.000 olmalı.')
    if any(not isinstance(block, DocumentBlock) for block in blocks):
        raise ValueError('Yalnız ayrıştırılmış belge blokları birleştirilebilir.')

    chunks: list[SemanticChunk] = []
    current: list[DocumentBlock] = []

    def flush():
        nonlocal current
        if not current:
            return
        content = '\n\n'.join(block.content for block in current)
        context = next((block.heading_path for block in current
                        if block.kind != 'metadata' and block.heading_path), ())
        chunks.append(SemanticChunk(
            content=content,
            start_line=current[0].start_line,
            end_line=current[-1].end_line,
            heading_path=context,
            block_kinds=tuple(block.kind for block in current),
            oversized=len(content) > max_chars,
        ))
        current = []

    for block in blocks:
        if not block.content:
            continue

        # A new section starts a new chunk. Initial frontmatter may stay with the title.
        if block.kind == 'heading' and current and any(
                item.kind != 'metadata' for item in current):
            flush()

        if not current:
            current.append(block)
            continue

        current_length = _joined_length([], '\n\n'.join(item.content for item in current))
        candidate_length = _joined_length([item.content for item in current], block.content)

        # Once the target is reached, prefer a natural block boundary. The hard maximum
        # remains useful for compact blocks that collectively fit below the target.
        if current_length >= target_chars or candidate_length > max_chars:
            # Keep a heading (and optional metadata) attached to its first body block;
            # the later oversized splitter will handle the body without losing context.
            only_context = all(item.kind in ('metadata', 'heading') for item in current)
            if only_context and block.kind != 'heading':
                current.append(block)
                flush()
            else:
                flush()
                current.append(block)
        else:
            current.append(block)

    flush()
    return chunks
