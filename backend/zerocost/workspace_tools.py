"""Bounded workspace access with resolved-path containment and atomic writes."""
import difflib
import hashlib
import os
from pathlib import Path
import tempfile
from .models import WorkspaceEntry, WorkspaceFile, WorkspaceListing

MAX_ENTRIES = 200
MAX_FILE_BYTES = 128 * 1024
MAX_WRITE_BYTES = 128 * 1024
MAX_PREVIEW_BYTES = 64 * 1024
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


def _write_target(store, agent_id: str, workspace_id: str, relative: str):
    agent = store.agent(agent_id)
    if agent is None or 'workspace.write' not in agent.permissions:
        raise WorkspaceAccessError('Bu ajana çalışma alanı yazma izni verilmedi.')
    workspace = store.workspace(workspace_id)
    if workspace is None:
        raise WorkspaceAccessError('Çalışma alanı bulunamadı.')
    path = Path(relative)
    if path.is_absolute() or not path.name or any(
            part.startswith('.') or part in IGNORED_NAMES for part in path.parts):
        raise WorkspaceAccessError('Yazma yolu güvenli bir çalışma alanı göreli yolu olmalı.')
    if path.suffix.lower() not in TEXT_SUFFIXES:
        raise WorkspaceAccessError('Bu dosya türüne yazılamaz.')
    root = Path(workspace.path).resolve(strict=True)
    try:
        parent = (root / path.parent).resolve(strict=True)
        parent.relative_to(root)
    except (FileNotFoundError, RuntimeError, ValueError):
        raise WorkspaceAccessError('Hedef klasör çalışma alanının dışında veya bulunamadı.') from None
    target = parent / path.name
    if target.is_symlink():
        raise WorkspaceAccessError('Sembolik bağlantı hedeflerine yazılamaz.')
    if target.exists():
        try:
            target.resolve(strict=True).relative_to(root)
        except (RuntimeError, ValueError):
            raise WorkspaceAccessError('Hedef çalışma alanının dışında.') from None
        if not target.is_file():
            raise WorkspaceAccessError('Yazma hedefi bir dosya olmalı.')
    return workspace, root, target


def prepare_write(store, agent_id: str, workspace_id: str, relative: str, content: str):
    if '\0' in content or len(content.encode('utf-8')) > MAX_WRITE_BYTES:
        raise WorkspaceAccessError('Yazma içeriği UTF-8 olmalı ve 128 KiB sınırını aşmamalı.')
    workspace, root, target = _write_target(store, agent_id, workspace_id, relative)
    old = target.read_text(encoding='utf-8') if target.exists() else ''
    if '\0' in old or len(old.encode('utf-8')) > MAX_FILE_BYTES:
        raise WorkspaceAccessError('Mevcut dosya güvenli metin sınırlarına uymuyor.')
    preview = ''.join(difflib.unified_diff(
        old.splitlines(keepends=True), content.splitlines(keepends=True),
        fromfile=f'a/{relative}', tofile=f'b/{relative}'))
    if not preview:
        raise WorkspaceAccessError('Öneri dosyada değişiklik oluşturmuyor.')
    if len(preview.encode('utf-8')) > MAX_PREVIEW_BYTES:
        raise WorkspaceAccessError('Değişiklik önizlemesi 64 KiB sınırını aşıyor.')
    base_hash = hashlib.sha256(old.encode('utf-8')).hexdigest() if target.exists() else 'missing'
    return {'tool': 'workspace.write', 'path': target.relative_to(root).as_posix(),
            'content': content, 'base_hash': base_hash, 'preview': preview, 'risk': 'medium',
            'workspace_id': workspace.id, 'agent_id': agent_id, 'command': []}


def apply_write(store, proposal: dict):
    _, _, target = _write_target(store, proposal['agent_id'], proposal['workspace_id'], proposal['path'])
    current = target.read_bytes() if target.exists() else None
    current_hash = hashlib.sha256(current).hexdigest() if current is not None else 'missing'
    if current_hash != proposal['base_hash']:
        raise WorkspaceAccessError('Dosya onay beklerken değişti; öneri yeniden hazırlanmalı.')
    encoded = proposal['content'].encode('utf-8')
    mode = target.stat().st_mode if target.exists() else 0o644
    descriptor, temporary = tempfile.mkstemp(prefix='.zerocost-', dir=target.parent)
    try:
        with os.fdopen(descriptor, 'wb') as stream:
            stream.write(encoded)
            stream.flush()
            os.fsync(stream.fileno())
        os.chmod(temporary, mode)
        os.replace(temporary, target)
    finally:
        if os.path.exists(temporary):
            os.unlink(temporary)
    return f'{proposal["path"]} atomik olarak yazıldı ({len(encoded)} bayt).'
