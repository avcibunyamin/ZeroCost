"""Semantic block packing; oversized block splitting and overlap are separate stages."""
from __future__ import annotations
from dataclasses import dataclass
import re

from .documents import BlockKind, DocumentBlock, FENCE

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
    source_blocks: tuple[DocumentBlock, ...] = ()


def _joined_length(parts: list[str], addition: str) -> int:
    return sum(len(part) for part in parts) + len(addition) + 2 * len(parts)


def _validate_sizes(target_chars: int, max_chars: int):
    if not MIN_TARGET_CHARS <= target_chars <= max_chars <= MAX_CHUNK_CHARS:
        raise ValueError('Chunk boyutları 32 ≤ hedef ≤ azami ≤ 32.000 olmalı.')


def merge_semantic_blocks(blocks: list[DocumentBlock], *, target_chars: int = 2_400,
                          max_chars: int = 3_200) -> list[SemanticChunk]:
    """Pack adjacent semantic blocks without crossing section headings or splitting blocks."""
    _validate_sizes(target_chars, max_chars)
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
            source_blocks=tuple(current),
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


SENTENCE_END = re.compile(r'[.!?…]+[\"\'”’)]*(?=\s+|$)')
COMMON_ABBREVIATIONS = {
    'dr.', 'prof.', 'doç.', 'örn.', 'vb.', 'vs.', 'bkz.', 'sn.', 'mr.', 'mrs.', 'ms.',
}


def _sentence_spans(text: str) -> list[tuple[int, int]]:
    spans = []
    start = 0
    for match in SENTENCE_END.finditer(text):
        token = text[start:match.end()].rstrip().rsplit(maxsplit=1)[-1].casefold()
        if token in COMMON_ABBREVIATIONS or re.fullmatch(r'[a-zçğıöşü]\.', token):
            continue
        end = match.end()
        spans.append((start, end))
        start = end
        while start < len(text) and text[start].isspace():
            start += 1
    if start < len(text):
        spans.append((start, len(text)))
    return [(start, end) for start, end in spans if text[start:end].strip()]


def _bounded_spans(text: str, start: int, end: int, max_chars: int,
                   first_max: int | None = None):
    """Split an overlong sentence by progressively weaker, deterministic boundaries."""
    limit = first_max or max_chars
    while end - start > limit:
        ceiling = start + limit
        floor = start + max(limit // 2, 1)
        window = text[floor:ceiling]
        candidates = []
        for pattern in ('\n', '; ', ': ', ', ', ' '):
            position = window.rfind(pattern)
            if position >= 0:
                candidates.append(floor + position + len(pattern.rstrip()))
                break
        cut = candidates[0] if candidates else ceiling
        yield start, cut
        start = cut
        limit = max_chars
        while start < end and text[start].isspace():
            start += 1
    if start < end:
        yield start, end


def _split_block(block: DocumentBlock, max_chars: int,
                 first_max: int | None = None) -> list[DocumentBlock]:
    pieces = []
    for sentence_start, sentence_end in _sentence_spans(block.content):
        first_limit = first_max if not pieces else None
        for start, end in _bounded_spans(
                block.content, sentence_start, sentence_end, max_chars, first_limit):
            raw = block.content[start:end]
            left = len(raw) - len(raw.lstrip())
            right = len(raw.rstrip())
            start += left
            end = start + max(right - left, 0)
            if end <= start:
                continue
            start_line = block.start_line + block.content.count('\n', 0, start)
            end_line = block.start_line + block.content.count('\n', 0, end - 1)
            pieces.append(DocumentBlock(
                block.kind, block.content[start:end], start_line, end_line,
                block.heading_path))
    return pieces


def split_oversized_text(chunks: list[SemanticChunk], *, target_chars: int = 2_400,
                         max_chars: int = 3_200) -> list[SemanticChunk]:
    """Split oversized non-code chunks at sentences, then repack within hard limits."""
    _validate_sizes(target_chars, max_chars)
    result = []
    for chunk in chunks:
        if not chunk.oversized or 'code' in chunk.block_kinds:
            result.append(chunk)
            continue
        source = chunk.source_blocks or (DocumentBlock(
            'paragraph', chunk.content, chunk.start_line, chunk.end_line,
            chunk.heading_path),)
        pieces = []
        context_parts = []
        body_seen = False
        for block in source:
            first_limit = None
            if not body_seen and block.kind in ('metadata', 'heading'):
                context_parts.append(block.content)
            elif not body_seen:
                body_seen = True
                context_length = len('\n\n'.join(context_parts))
                if context_parts and context_length < max_chars - 2:
                    first_limit = max_chars - context_length - 2
            limit = first_limit or max_chars
            if len(block.content) <= limit:
                pieces.append(block)
            else:
                pieces.extend(_split_block(block, max_chars, first_limit))
        packed = merge_semantic_blocks(pieces, target_chars=target_chars, max_chars=max_chars)
        if any(item.oversized for item in packed):
            raise ValueError('Metin azami chunk boyutuna indirilemedi.')
        result.extend(packed)
    return result


CODE_DECLARATION = re.compile(
    r'^(?:async\s+def|def|class|function|export\s+(?:default\s+)?(?:async\s+)?function|'
    r'interface|type|struct|enum|impl|fn|func|package|module|namespace)\b')


def _code_boundary(lines: list[str], position: int) -> bool:
    if position <= 0 or position >= len(lines):
        return False
    if not lines[position - 1].strip():
        return True
    return bool(CODE_DECLARATION.match(lines[position].strip())) and not lines[position][:1].isspace()


def _line_range_length(lines: list[str], start: int, end: int) -> int:
    return sum(len(line) for line in lines[start:end]) + max(end - start - 1, 0)


def _pack_code_lines(lines: list[str], target_chars: int, max_chars: int):
    """Return body text and zero-based inclusive source line indexes."""
    packed = []
    start = 0
    while start < len(lines):
        if len(lines[start]) > max_chars:
            # A generated/minified line has no safer structural boundary.
            offset = 0
            while len(lines[start]) - offset > max_chars:
                packed.append((lines[start][offset:offset + max_chars], start, start))
                offset += max_chars
            if offset < len(lines[start]):
                packed.append((lines[start][offset:], start, start))
            start += 1
            continue

        hard_end = start
        while (hard_end < len(lines)
               and _line_range_length(lines, start, hard_end + 1) <= max_chars):
            hard_end += 1
        if hard_end == len(lines):
            end = hard_end
        else:
            candidates = [position for position in range(start + 1, hard_end + 1)
                          if _code_boundary(lines, position)]
            useful = [position for position in candidates
                      if _line_range_length(lines, start, position) >= min(
                          target_chars // 2, max_chars // 2)]
            within_target = [position for position in useful
                             if _line_range_length(lines, start, position) <= target_chars]
            end = (within_target[-1] if within_target else
                   useful[-1] if useful else hard_end)
        if end <= start:
            end = start + 1
        packed.append(('\n'.join(lines[start:end]), start, end - 1))
        start = end
    return packed


def _fenced_code_parts(block: DocumentBlock, context: list[DocumentBlock], target_chars: int,
                       max_chars: int) -> list[SemanticChunk]:
    lines = block.content.split('\n')
    opening_match = FENCE.match(lines[0]) if lines else None
    if opening_match is None:
        raise ValueError('Code bloğunun açılış fence işareti bulunamadı.')
    marker = opening_match.group(1)
    indent = lines[0][:len(lines[0]) - len(lines[0].lstrip())]
    closing = indent + marker
    has_closing = False
    if len(lines) > 1:
        stripped = lines[-1].lstrip()
        token = stripped.split()[0] if stripped.split() else ''
        has_closing = (stripped.startswith(marker[0] * len(marker))
                       and token and set(token) == {marker[0]})
    body = lines[1:-1] if has_closing else lines[1:]
    wrapper_length = len(lines[0]) + len(closing) + 2
    prefix = '\n\n'.join(item.content for item in context)
    prefix_text = f'{prefix}\n\n' if prefix else ''
    first_max = max_chars - wrapper_length - len(prefix_text)
    later_max = max_chars - wrapper_length
    if first_max < 1 or later_max < 1:
        raise ValueError('Başlık veya code fence azami chunk boyutuna sığmıyor.')
    first_target = max(1, min(target_chars - wrapper_length - len(prefix_text), first_max))
    later_target = max(1, min(target_chars - wrapper_length, later_max))

    # Reserve prefix space only for the first piece, then use the full body budget.
    if body and len(body[0]) > first_max:
        packed = [(body[0][:first_max], 0, 0)]
        remainder = [body[0][first_max:], *body[1:]]
        packed.extend(_pack_code_lines(remainder, later_target, later_max))
    else:
        packed = _pack_code_lines(body, first_target, first_max)
    if len(packed) > 1 and not (body and len(body[0]) > first_max):
        remainder_start = packed[0][2] + 1
        packed = [packed[0], *[(text, start + remainder_start, end + remainder_start)
            for text, start, end in _pack_code_lines(
                body[remainder_start:], later_target, later_max)]]
    if not packed:
        packed = [('', 0, 0)]

    chunks = []
    for index, (body_text, start, end) in enumerate(packed):
        formatted = f'{lines[0]}\n{body_text}\n{closing}'
        if index == 0 and prefix_text:
            formatted = prefix_text + formatted
        source_start = block.start_line + 1 + start
        source_end = block.start_line + 1 + end
        if not body:
            source_start, source_end = block.start_line, block.end_line
        source_block = DocumentBlock(
            'code', formatted, source_start, source_end, block.heading_path)
        kinds: tuple[BlockKind, ...] = ('code',)
        source_blocks: tuple[DocumentBlock, ...] = (source_block,)
        chunk_start = source_start
        if index == 0 and context:
            kinds = (*tuple(item.kind for item in context), 'code')
            source_blocks = (*context, source_block)
            chunk_start = min(context[0].start_line, source_start)
        chunks.append(SemanticChunk(
            formatted, chunk_start, source_end, block.heading_path, kinds, False,
            source_blocks))
    return chunks


def split_oversized_code(chunks: list[SemanticChunk], *, target_chars: int = 2_400,
                         max_chars: int = 3_200) -> list[SemanticChunk]:
    """Re-fence oversized code at structural/line boundaries without adding overlap."""
    _validate_sizes(target_chars, max_chars)
    result = []
    for chunk in chunks:
        if not chunk.oversized or 'code' not in chunk.block_kinds:
            result.append(chunk)
            continue
        source = chunk.source_blocks
        code_blocks = [block for block in source if block.kind == 'code']
        context = [block for block in source if block.kind in ('metadata', 'heading')]
        if len(code_blocks) != 1 or len(code_blocks) + len(context) != len(source):
            raise ValueError('Oversized code chunk yapısı güvenli bölmeye uygun değil.')
        result.extend(_fenced_code_parts(
            code_blocks[0], context, target_chars, max_chars))
    return result
