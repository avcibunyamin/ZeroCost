import pytest

from zerocost.chunking import merge_semantic_blocks, split_oversized_text
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


def test_oversized_paragraph_splits_at_sentence_boundaries_with_exact_lines():
    text = 'İlk cümle kısa.\n' + ('İkinci cümle uzundur ama bölünebilir. ' * 4) + '\nSon cümle.'
    block = DocumentBlock('paragraph', text, 20, 22, ('Rehber',))
    merged = merge_semantic_blocks([block], target_chars=60, max_chars=90)
    chunks = split_oversized_text(merged, target_chars=60, max_chars=90)
    assert len(chunks) > 1
    assert all(len(chunk.content) <= 90 and not chunk.oversized for chunk in chunks)
    assert chunks[0].start_line == 20 and chunks[-1].end_line == 22
    assert all(chunk.heading_path == ('Rehber',) for chunk in chunks)


def test_abbreviations_and_initials_do_not_create_false_sentence_boundaries():
    text = 'Dr. A. Yılmaz örn. bu yöntemi kullanır. Sonuç başarılıdır.'
    block = DocumentBlock('paragraph', text, 1, 1)
    merged = merge_semantic_blocks([block], target_chars=32, max_chars=45)
    chunks = split_oversized_text(merged, target_chars=32, max_chars=45)
    assert chunks[0].content.startswith('Dr. A. Yılmaz örn.')
    assert all(len(chunk.content) <= 45 for chunk in chunks)


def test_single_long_sentence_falls_back_to_words_then_unicode_boundaries():
    spaced = DocumentBlock('paragraph', 'kelime ' * 30, 5, 5)
    unbroken = DocumentBlock('paragraph', 'ş' * 180, 7, 7)
    for block in (spaced, unbroken):
        chunks = split_oversized_text(
            merge_semantic_blocks([block], target_chars=40, max_chars=64),
            target_chars=40, max_chars=64)
        assert len(chunks) > 1
        assert all(0 < len(chunk.content) <= 64 for chunk in chunks)
        assert all(chunk.start_line == chunk.end_line == block.start_line for chunk in chunks)


def test_code_chunks_are_deferred_unchanged_to_code_splitter():
    original = merge_semantic_blocks([
        DocumentBlock('heading', 'Kod', 1, 1, ('Kod',)),
        DocumentBlock('code', 'x' * 200, 3, 8, ('Kod',)),
    ], target_chars=50, max_chars=100)[0]
    assert split_oversized_text([original], target_chars=50, max_chars=100) == [original]


def test_heading_space_is_reserved_for_unbroken_first_body_piece():
    original = merge_semantic_blocks([
        DocumentBlock('heading', 'Başlık', 1, 1, ('Başlık',)),
        DocumentBlock('paragraph', 'x' * 250, 3, 3, ('Başlık',)),
    ], target_chars=50, max_chars=100)
    chunks = split_oversized_text(original, target_chars=50, max_chars=100)
    assert chunks[0].content.startswith('Başlık\n\n')
    assert all(len(chunk.content) <= 100 and not chunk.oversized for chunk in chunks)
