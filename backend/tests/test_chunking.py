import pytest

from zerocost.chunking import (SemanticChunk, apply_context_overlap,
                               build_semantic_chunks, merge_semantic_blocks,
                               split_oversized_code, split_oversized_text)
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


def test_oversized_python_is_refenced_with_language_and_content_preserved():
    body = '\n'.join([f'def function_{index}():\n    return {index}\n' for index in range(8)])
    block = DocumentBlock('code', f'```python\n{body}\n```', 10, 34, ('API',))
    original = merge_semantic_blocks([
        DocumentBlock('heading', 'API', 8, 8, ('API',)), block,
    ], target_chars=90, max_chars=120)
    chunks = split_oversized_code(original, target_chars=90, max_chars=120)
    assert len(chunks) > 1
    assert all(chunk.content.count('```python') == 1 for chunk in chunks)
    assert all(chunk.content.rstrip().endswith('```') for chunk in chunks)
    recovered = '\n'.join(chunk.content.split('```python\n', 1)[1].rsplit('\n```', 1)[0]
                          for chunk in chunks)
    assert recovered.replace('\n', '') == body.replace('\n', '')
    assert chunks[0].content.startswith('API\n\n```python')
    assert chunks[0].start_line == 8
    assert all(len(chunk.content) <= 120 and not chunk.oversized for chunk in chunks)


def test_code_split_prefers_top_level_declaration_boundary():
    body = 'x = 1\n' * 6 + '\ndef beta():\n    return 2\n' + 'y = 3\n' * 6
    block = DocumentBlock('code', f'~~~python\n{body}~~~', 1, 16, ('Kod',))
    chunks = split_oversized_code(
        merge_semantic_blocks([block], target_chars=50, max_chars=75),
        target_chars=50, max_chars=75)
    assert chunks[1].content.startswith('~~~python\ndef beta():')
    assert all(chunk.content.rstrip().endswith('~~~') for chunk in chunks)


def test_unclosed_fence_is_closed_and_long_line_falls_back_with_same_citation():
    block = DocumentBlock('code', '```json\n' + 'x' * 180, 40, 41, ('Veri',))
    chunks = split_oversized_code(
        merge_semantic_blocks([block], target_chars=50, max_chars=70),
        target_chars=50, max_chars=70)
    assert len(chunks) > 2
    assert all(chunk.content.startswith('```json\n') and chunk.content.endswith('\n```')
               for chunk in chunks)
    assert all(chunk.start_line == chunk.end_line == 41 for chunk in chunks)
    assert all(len(chunk.content) <= 70 for chunk in chunks)
    recovered = ''.join(chunk.content.removeprefix('```json\n').removesuffix('\n```')
                        for chunk in chunks)
    assert recovered == 'x' * 180


def test_code_splitter_leaves_text_and_regular_code_unchanged():
    text = SemanticChunk('metin', 1, 1, (), ('paragraph',), True)
    code = merge_semantic_blocks([
        DocumentBlock('code', '```py\nx = 1\n```', 1, 3),
    ], target_chars=50, max_chars=100)[0]
    assert split_oversized_code([text, code], target_chars=50, max_chars=100) == [text, code]


def test_text_overlap_uses_sentence_tail_without_crossing_sections():
    blocks = parse_markdown("""# Bir

Birinci cümle. İkinci cümle bağlamdır. Üçüncü cümle sondur.

Dördüncü cümle. Beşinci cümle.

# İki

Yeni bölüm önceki bağlamı almamalı.
""")
    chunks = build_semantic_chunks(blocks, target_chars=70, max_chars=180, overlap_chars=40)
    assert any(chunk.overlap_kind == 'text' for chunk in chunks)
    overlapped = next(chunk for chunk in chunks if chunk.overlap_kind == 'text')
    assert overlapped.overlap_content
    assert overlapped.overlap_content in chunks[chunks.index(overlapped) - 1].content
    assert 'Önceki metin bağlamı' in overlapped.embedding_content
    assert all(len(chunk.embedding_content) <= 180 for chunk in chunks)
    second_section = next(chunk for chunk in chunks if chunk.heading_path == ('İki',))
    assert second_section.overlap_content == ''


def test_code_overlap_is_quoted_and_marks_scope_as_reference():
    body = '\n'.join(f'def fn_{index}():\n    value = {index}\n    return value\n'
                     for index in range(8))
    chunks = build_semantic_chunks([
        DocumentBlock('code', f'```python\n{body}\n```', 1, 33, ('Kod',)),
    ], target_chars=100, max_chars=240, overlap_chars=70)
    overlapped = next(chunk for chunk in chunks[1:] if chunk.overlap_kind == 'code')
    assert 'referans, yeniden tanım değil' in overlapped.embedding_content
    assert '\n> ' in overlapped.embedding_content
    assert overlapped.content.startswith('```python\n')
    assert all(len(chunk.embedding_content) <= 240 for chunk in chunks)


def test_overlap_keeps_primary_content_and_respects_type_and_size():
    text = [
        SemanticChunk('a' * 50 + '. Son.', 1, 1, (), ('paragraph',)),
        SemanticChunk('b' * 80, 2, 2, (), ('paragraph',)),
    ]
    result = apply_context_overlap(text, overlap_chars=30, max_chars=120)
    assert result[1].content == text[1].content
    assert len(result[1].embedding_content) <= 120
    assert apply_context_overlap(text, overlap_chars=0, max_chars=120) == text
    with pytest.raises(ValueError, match='Overlap'):
        apply_context_overlap(text, overlap_chars=61, max_chars=120)


def test_overlap_does_not_cross_between_text_and_code():
    chunks = [
        SemanticChunk('Önceki açıklama.', 1, 1, ('Aynı',), ('paragraph',)),
        SemanticChunk('```py\nx = 1\n```', 2, 4, ('Aynı',), ('code',)),
        SemanticChunk('Sonraki açıklama.', 5, 5, ('Aynı',), ('paragraph',)),
    ]
    result = apply_context_overlap(chunks, overlap_chars=30, max_chars=160)
    assert all(chunk.overlap_content == '' for chunk in result)
