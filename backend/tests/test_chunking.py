import pytest

from zerocost.chunking import merge_semantic_blocks
from zerocost.documents import DocumentBlock, parse_markdown


def test_small_blocks_merge_with_heading_but_sections_never_cross():
    blocks = parse_markdown("""# Birinci

Kısa giriş.

İkinci paragraf.

## İkinci

Yeni bölüm.
""")
    chunks = merge_semantic_blocks(blocks, target_chars=100, max_chars=160)
    assert len(chunks) == 2
    assert chunks[0].block_kinds == ('heading', 'paragraph', 'paragraph')
    assert chunks[0].heading_path == ('Birinci',)
    assert chunks[1].heading_path == ('Birinci', 'İkinci')
    assert chunks[0].end_line < chunks[1].start_line


def test_target_prefers_natural_boundary_and_never_loses_content():
    blocks = [
        DocumentBlock('paragraph', 'a' * 35, 1, 1),
        DocumentBlock('paragraph', 'b' * 35, 3, 3),
        DocumentBlock('paragraph', 'c' * 35, 5, 5),
    ]
    chunks = merge_semantic_blocks(blocks, target_chars=60, max_chars=100)
    assert [len(chunk.content) for chunk in chunks] == [72, 35]
    assert [part for chunk in chunks for part in chunk.content.split('\n\n')] == [
        block.content for block in blocks]
    assert all(not chunk.oversized for chunk in chunks)


def test_oversized_body_stays_with_heading_and_is_explicitly_marked():
    blocks = [
        DocumentBlock('heading', 'API', 1, 1, ('API',)),
        DocumentBlock('code', 'x' * 200, 3, 20, ('API',)),
    ]
    chunks = merge_semantic_blocks(blocks, target_chars=50, max_chars=100)
    assert len(chunks) == 1
    assert chunks[0].oversized is True
    assert chunks[0].block_kinds == ('heading', 'code')
    assert (chunks[0].start_line, chunks[0].end_line) == (1, 20)


def test_frontmatter_stays_with_first_heading_and_body():
    blocks = parse_markdown("""---
title: Rehber
---
# Rehber

İçerik.
""")
    chunks = merge_semantic_blocks(blocks, target_chars=100, max_chars=200)
    assert len(chunks) == 1
    assert chunks[0].block_kinds == ('metadata', 'heading', 'paragraph')


@pytest.mark.parametrize('target,maximum', [(31, 100), (100, 99), (100, 32_001)])
def test_invalid_chunk_sizes_are_rejected(target, maximum):
    with pytest.raises(ValueError, match='Chunk boyutları'):
        merge_semantic_blocks([], target_chars=target, max_chars=maximum)
