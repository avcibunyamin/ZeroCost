import pytest

from zerocost.documents import parse_document, parse_markdown, parse_text


def test_markdown_preserves_heading_hierarchy_and_line_ranges():
    blocks = parse_markdown("""# Proje

Giriş paragrafı.
İkinci satır.

## Kurulum

- npm ci
- npm run build
""")
    assert [(block.kind, block.start_line, block.end_line) for block in blocks] == [
        ('heading', 1, 1), ('paragraph', 3, 4), ('heading', 6, 6), ('list', 8, 9)]
    assert blocks[1].heading_path == ('Proje',)
    assert blocks[-1].heading_path == ('Proje', 'Kurulum')


def test_setext_table_quote_and_frontmatter_are_semantic_blocks():
    blocks = parse_markdown("""---
title: Rehber
---
Başlık
======

| Ad | Durum |
| --- | --- |
| RAG | Hazır |

> Kaynak alıntısı
""")
    assert [block.kind for block in blocks] == ['metadata', 'heading', 'table', 'quote']
    assert blocks[1].content == 'Başlık' and blocks[1].start_line == 4 and blocks[1].end_line == 5
    assert blocks[2].heading_path == ('Başlık',)


def test_fenced_code_is_kept_intact_even_with_blank_lines_and_headings():
    blocks = parse_markdown("""# Kod

```python
def run():

    return '# başlık değil'
```

Sonuç.
""")
    assert [block.kind for block in blocks] == ['heading', 'code', 'paragraph']
    assert blocks[1].start_line == 3 and blocks[1].end_line == 7
    assert "# başlık değil" in blocks[1].content


def test_plain_text_normalizes_line_endings_and_preserves_paragraphs():
    blocks = parse_text('Birinci\r\nsatır\r\n\r\nİkinci')
    assert [(block.content, block.start_line, block.end_line) for block in blocks] == [
        ('Birinci\nsatır', 1, 2), ('İkinci', 4, 4)]
    assert parse_document('# düz metin', 'notes.txt')[0].kind == 'paragraph'
    assert parse_document('# markdown', 'README.MD')[0].kind == 'heading'


def test_parser_rejects_binary_marker_and_unbounded_documents():
    with pytest.raises(ValueError, match='geçerli'):
        parse_text('a\0b')
    with pytest.raises(ValueError, match='1.000.000'):
        parse_text('x' * 1_000_001)


def test_skipped_heading_levels_and_lazy_list_continuation_keep_context():
    blocks = parse_markdown("""# Ana
### Ayrıntı

- İlk satır
  devam satırı
işaretlenmemiş devam
""")
    assert blocks[1].heading_path == ('Ana', 'Ayrıntı')
    assert blocks[2].kind == 'list'
    assert blocks[2].content.endswith('işaretlenmemiş devam')
