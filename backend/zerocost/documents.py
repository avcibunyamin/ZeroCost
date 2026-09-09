"""Deterministic text and Markdown parsing with source line provenance."""
from __future__ import annotations
from dataclasses import dataclass
import re
from pathlib import PurePath
from typing import Literal

MAX_DOCUMENT_CHARS = 1_000_000
MAX_DOCUMENT_LINES = 50_000
MARKDOWN_SUFFIXES = {'.md', '.markdown', '.mdown', '.mkd'}

BlockKind = Literal['metadata', 'heading', 'paragraph', 'list', 'table', 'quote', 'code']
ATX_HEADING = re.compile(r'^(#{1,6})[ \t]+(.+?)[ \t]*#*[ \t]*$')
SETEXT_HEADING = re.compile(r'^[ \t]*(=+|-+)[ \t]*$')
LIST_LINE = re.compile(r'^[ \t]{0,3}(?:[-+*]|\d+[.)])[ \t]+')
TABLE_DIVIDER = re.compile(
    r'^[ \t]*\|?[ \t]*:?-{3,}:?[ \t]*(?:\|[ \t]*:?-{3,}:?[ \t]*)+\|?[ \t]*$')
FENCE = re.compile(r'^[ \t]{0,3}(`{3,}|~{3,})(.*)$')


@dataclass(frozen=True)
class DocumentBlock:
    kind: BlockKind
    content: str
    start_line: int
    end_line: int
    heading_path: tuple[str, ...] = ()


def _validate(content: str) -> list[str]:
    if not isinstance(content, str) or '\0' in content:
        raise ValueError('Belge geçerli bir metin olmalı.')
    if len(content) > MAX_DOCUMENT_CHARS:
        raise ValueError('Belge 1.000.000 karakter sınırını aşıyor.')
    normalized = content.replace('\r\n', '\n').replace('\r', '\n')
    lines = normalized.split('\n')
    if len(lines) > MAX_DOCUMENT_LINES:
        raise ValueError('Belge 50.000 satır sınırını aşıyor.')
    return lines


def parse_text(content: str) -> list[DocumentBlock]:
    lines = _validate(content)
    blocks = []
    start = None
    collected = []
    for number, line in enumerate(lines, 1):
        if not line.strip():
            if collected:
                blocks.append(DocumentBlock('paragraph', '\n'.join(collected), start, number - 1))
                start, collected = None, []
        else:
            if start is None:
                start = number
            collected.append(line)
    if collected:
        blocks.append(DocumentBlock('paragraph', '\n'.join(collected), start, len(lines)))
    return blocks


def parse_markdown(content: str) -> list[DocumentBlock]:
    lines = _validate(content)
    blocks: list[DocumentBlock] = []
    headings: list[str | None] = []
    pending: list[str] = []
    pending_kind: BlockKind | None = None
    pending_start = 0

    def heading_path():
        return tuple(item for item in headings if item)

    def flush(end_line: int):
        nonlocal pending, pending_kind, pending_start
        if pending:
            blocks.append(DocumentBlock(
                pending_kind or 'paragraph', '\n'.join(pending), pending_start,
                end_line, heading_path()))
        pending, pending_kind, pending_start = [], None, 0

    def add_heading(level: int, title: str, start_line: int, end_line: int):
        del headings[level - 1:]
        while len(headings) < level - 1:
            headings.append(None)
        headings.append(title)
        blocks.append(DocumentBlock(
            'heading', title, start_line, end_line, heading_path()))

    index = 0
    if len(lines) >= 2 and lines[0].strip() == '---':
        closing = next((position for position in range(1, len(lines))
                        if lines[position].strip() == '---'), None)
        if closing is not None:
            blocks.append(DocumentBlock(
                'metadata', '\n'.join(lines[:closing + 1]), 1, closing + 1))
            index = closing + 1

    while index < len(lines):
        line = lines[index]
        number = index + 1
        if not line.strip():
            flush(number - 1)
            index += 1
            continue

        fence = FENCE.match(line)
        if fence:
            flush(number - 1)
            marker = fence.group(1)[0]
            minimum = len(fence.group(1))
            code = [line]
            end = index
            while end + 1 < len(lines):
                end += 1
                code.append(lines[end])
                stripped = lines[end].lstrip()
                if stripped.startswith(marker * minimum) and set(stripped.split()[0]) == {marker}:
                    break
            blocks.append(DocumentBlock(
                'code', '\n'.join(code), number, end + 1, heading_path()))
            index = end + 1
            continue

        heading = ATX_HEADING.match(line)
        if heading:
            flush(number - 1)
            add_heading(len(heading.group(1)), heading.group(2).strip(), number, number)
            index += 1
            continue

        if (index + 1 < len(lines) and line.strip()
                and (underline := SETEXT_HEADING.match(lines[index + 1]))):
            flush(number - 1)
            level = 1 if underline.group(1).startswith('=') else 2
            add_heading(level, line.strip(), number, number + 1)
            index += 2
            continue

        if SETEXT_HEADING.match(line) and set(line.strip()) == {'-'}:
            flush(number - 1)
            index += 1
            continue

        if LIST_LINE.match(line):
            kind: BlockKind = 'list'
        elif line.lstrip().startswith('>'):
            kind = 'quote'
        elif (TABLE_DIVIDER.match(line)
              or ('|' in line and index + 1 < len(lines) and TABLE_DIVIDER.match(lines[index + 1]))
              or (pending_kind == 'table' and '|' in line)):
            kind = 'table'
        else:
            kind = 'paragraph'

        # CommonMark permits an unmarked, nonblank continuation line in a list item.
        if pending_kind == 'list' and kind == 'paragraph':
            kind = 'list'

        if pending and pending_kind != kind:
            flush(number - 1)
        if not pending:
            pending_start = number
            pending_kind = kind
        pending.append(line)
        index += 1

    flush(len(lines))
    return blocks


def parse_document(content: str, filename: str) -> list[DocumentBlock]:
    suffix = PurePath(filename).suffix.casefold()
    return parse_markdown(content) if suffix in MARKDOWN_SUFFIXES else parse_text(content)
