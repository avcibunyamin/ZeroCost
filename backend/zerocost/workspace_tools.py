"""Bounded, read-only workspace access with resolved-path containment checks."""
from pathlib import Path
from .models import WorkspaceEntry, WorkspaceFile, WorkspaceListing

MAX_ENTRIES = 200
MAX_FILE_BYTES = 128 * 1024
IGNORED_NAMES = {'.git', '.idea', '.venv', '.venv312', 'node_modules', 'target', 'dist', 'build', '__pycache__'}
TEXT_SUFFIXES = {'.c', '.cc', '.css', '.csv', '.go', '.h', '.html', '.ini', '.java', '.js', '.json',
                 '.jsx', '.md', '.mjs', '.py', '.rs', '.sh', '.sql', '.toml', '.ts', '.tsx', '.txt',
                 '.xml', '.yaml', '.yml'}


class WorkspaceAccessError(ValueError):
    pass


def _target(store, agent_id: str, workspace_id: str, relative: str):
    agent = store.agent(agent_id)
    if agent is None:
        raise WorkspaceAccessError('Ajan bulunamadı.')
    if 'workspace.read' not in agent.permissions:
        raise WorkspaceAccessError('Bu ajana çalışma alanı okuma izni verilmedi.')
    workspace = store.workspace(workspace_id)
    if workspace is None:
        raise WorkspaceAccessError('Çalışma alanı bulunamadı.')
    path = Path(relative)
    if path.is_absolute():
        raise WorkspaceAccessError('Yalnızca çalışma alanına göreli yollar kullanılabilir.')
    if any(part.startswith('.') or part in IGNORED_NAMES for part in path.parts):
        raise WorkspaceAccessError('Gizli veya dışlanan yollar okunamaz.')
    root = Path(workspace.path).resolve(strict=True)
    try:
        target = (root / path).resolve(strict=True)
        target.relative_to(root)
    except (FileNotFoundError, RuntimeError, ValueError):
        raise WorkspaceAccessError('Yol çalışma alanının dışında veya bulunamadı.') from None
    return workspace, root, target


def inspect_file_size(store, agent_id: str, workspace_id: str, relative: str):
    _, _, target = _target(store, agent_id, workspace_id, relative)
    if not target.is_file() or target.suffix.lower() not in TEXT_SUFFIXES:
        raise WorkspaceAccessError('Bu dosya türü metin bağlamına alınamaz.')
    size = target.stat().st_size
    if size > MAX_FILE_BYTES:
        raise WorkspaceAccessError('Dosya 128 KiB okuma sınırını aşıyor.')
    return size


def list_directory(store, agent_id: str, workspace_id: str, relative: str):
    workspace, root, target = _target(store, agent_id, workspace_id, relative)
    if not target.is_dir():
        raise WorkspaceAccessError('İstenen yol bir klasör değil.')
    entries = []
    for child in sorted(target.iterdir(), key=lambda item: (not item.is_dir(), item.name.casefold())):
        if child.name.startswith('.') or child.name in IGNORED_NAMES:
            continue
        try:
            resolved = child.resolve(strict=True)
            resolved.relative_to(root)
        except (FileNotFoundError, RuntimeError, ValueError):
            continue
        kind = 'directory' if resolved.is_dir() else 'file' if resolved.is_file() else None
        if kind is None:
            continue
        entries.append(WorkspaceEntry(path=resolved.relative_to(root).as_posix(), name=child.name,
                                      kind=kind, size=0 if kind == 'directory' else resolved.stat().st_size))
        if len(entries) >= MAX_ENTRIES:
            break
    return WorkspaceListing(workspace_id=workspace.id, path=target.relative_to(root).as_posix(), entries=entries)


def read_file(store, agent_id: str, workspace_id: str, relative: str):
    workspace, root, target = _target(store, agent_id, workspace_id, relative)
    if not target.is_file():
        raise WorkspaceAccessError('İstenen yol bir dosya değil.')
    if target.suffix.lower() not in TEXT_SUFFIXES:
        raise WorkspaceAccessError('Bu dosya türü metin bağlamına alınamaz.')
    size = target.stat().st_size
    if size > MAX_FILE_BYTES:
        raise WorkspaceAccessError('Dosya 128 KiB okuma sınırını aşıyor.')
    try:
        content = target.read_text(encoding='utf-8')
    except UnicodeDecodeError:
        raise WorkspaceAccessError('Dosya UTF-8 metin değil.') from None
    if '\0' in content:
        raise WorkspaceAccessError('İkili dosya içeriği reddedildi.')
    return WorkspaceFile(workspace_id=workspace.id, path=target.relative_to(root).as_posix(),
                         content=content, size=size)
