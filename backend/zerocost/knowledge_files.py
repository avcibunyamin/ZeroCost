"""Read user-selected knowledge sources inside registered workspaces."""
from __future__ import annotations

import os
from pathlib import Path
import stat

from .documents import MARKDOWN_SUFFIXES
from .workspace_tools import IGNORED_NAMES, WorkspaceAccessError

KNOWLEDGE_SUFFIXES = MARKDOWN_SUFFIXES | {'.txt'}
MAX_KNOWLEDGE_FILE_BYTES = 1024 * 1024


def read_knowledge_source(store, workspace_id: str, relative: str) -> tuple[str, str]:
    """Return canonical relative path and bounded UTF-8 content without following symlinks."""
    workspace = store.workspace(workspace_id)
    if workspace is None:
        raise WorkspaceAccessError('Çalışma alanı bulunamadı.')
    path = Path(relative)
    if (path.is_absolute() or not path.name
            or any(part.startswith('.') or part in IGNORED_NAMES for part in path.parts)):
        raise WorkspaceAccessError('Bilgi kaynağı güvenli bir çalışma alanı göreli yolu olmalı.')
    if path.suffix.casefold() not in KNOWLEDGE_SUFFIXES:
        raise WorkspaceAccessError('Yalnız `.txt` ve Markdown belgeleri indekslenebilir.')

    root = Path(workspace.path).resolve(strict=True)
    unresolved = root / path
    cursor = root
    try:
        for part in path.parts:
            cursor /= part
            if cursor.is_symlink():
                raise WorkspaceAccessError('Sembolik bağlantılar bilgi kaynağı olamaz.')
        target = unresolved.resolve(strict=True)
        target.relative_to(root)
    except WorkspaceAccessError:
        raise
    except (FileNotFoundError, RuntimeError, ValueError):
        raise WorkspaceAccessError('Bilgi kaynağı çalışma alanının dışında veya bulunamadı.') from None

    flags = os.O_RDONLY | getattr(os, 'O_NOFOLLOW', 0)
    try:
        descriptor = os.open(target, flags)
    except (FileNotFoundError, OSError):
        raise WorkspaceAccessError('Bilgi kaynağı güvenle açılamadı.') from None
    try:
        metadata = os.fstat(descriptor)
        if not stat.S_ISREG(metadata.st_mode):
            raise WorkspaceAccessError('Bilgi kaynağı normal bir dosya olmalı.')
        if metadata.st_size > MAX_KNOWLEDGE_FILE_BYTES:
            raise WorkspaceAccessError('Belge 1 MiB dosya sınırını aşıyor.')
        with os.fdopen(descriptor, 'rb', closefd=False) as handle:
            raw = handle.read(MAX_KNOWLEDGE_FILE_BYTES + 1)
        if len(raw) > MAX_KNOWLEDGE_FILE_BYTES:
            raise WorkspaceAccessError('Belge 1 MiB dosya sınırını aşıyor.')
    finally:
        os.close(descriptor)
    try:
        content = raw.decode('utf-8')
    except UnicodeDecodeError:
        raise WorkspaceAccessError('Belge UTF-8 metin değil.') from None
    if '\0' in content:
        raise WorkspaceAccessError('İkili dosya içeriği reddedildi.')
    if not content.strip():
        raise WorkspaceAccessError('Boş belge indekslenemez.')
    return target.relative_to(root).as_posix(), content
