"""Explicitly approved, argv-only terminal execution inside a workspace."""
import asyncio
import os
from pathlib import Path
import json
import shutil

from .workspace_tools import IGNORED_NAMES, WorkspaceAccessError

ALLOWED_EXECUTABLES = {'git', 'npm', 'pnpm', 'yarn', 'cargo', 'python', 'python3',
                       'pytest', 'rg', 'ls', 'pwd'}
MAX_OUTPUT_BYTES = 64 * 1024


def prepare_command(store, agent_id: str, workspace_id: str, command: list[str], cwd: str = ''):
    agent = store.agent(agent_id)
    if agent is None or 'terminal.execute' not in agent.permissions:
        raise WorkspaceAccessError('Bu ajana terminal çalıştırma izni verilmedi.')
    workspace = store.workspace(workspace_id)
    if workspace is None:
        raise WorkspaceAccessError('Çalışma alanı bulunamadı.')
    if not command or len(command) > 32 or any(
            not isinstance(item, str) or not item or len(item) > 512 or
            any(ord(character) < 32 for character in item) for item in command):
        raise WorkspaceAccessError('Terminal komutu geçersiz veya sınırı aşıyor.')
    if command[0] not in ALLOWED_EXECUTABLES or '/' in command[0]:
        raise WorkspaceAccessError('Çalıştırılabilir dosya izin listesinde değil.')
    executable = shutil.which(command[0])
    if executable is None:
        raise WorkspaceAccessError('Çalıştırılabilir dosya sistemde bulunamadı.')
    relative = Path(cwd)
    if relative.is_absolute() or any(part.startswith('.') or part in IGNORED_NAMES for part in relative.parts):
        raise WorkspaceAccessError('Terminal çalışma klasörü güvenli değil.')
    root = Path(workspace.path).resolve(strict=True)
    try:
        target = (root / relative).resolve(strict=True)
        target.relative_to(root)
    except (FileNotFoundError, RuntimeError, ValueError):
        raise WorkspaceAccessError('Terminal çalışma klasörü alanın dışında veya bulunamadı.') from None
    if not target.is_dir():
        raise WorkspaceAccessError('Terminal çalışma yolu klasör değil.')
    return {'tool': 'terminal.execute', 'command': command, 'cwd': target.relative_to(root).as_posix(),
            'path': '', 'preview': f'argv: {json.dumps(command, ensure_ascii=False)}\nbinary: {executable}',
            'executable': executable, 'risk': 'high',
            'workspace_id': workspace.id, 'agent_id': agent_id}


async def execute_command(store, proposal: dict):
    checked = prepare_command(store, proposal['agent_id'], proposal['workspace_id'],
                              proposal['command'], proposal.get('cwd', ''))
    workspace = store.workspace(proposal['workspace_id'])
    cwd = Path(workspace.path) / checked['cwd']
    env = {'PATH': os.environ.get('PATH', ''), 'LANG': 'C.UTF-8', 'NO_COLOR': '1',
           'HOME': str(Path(workspace.path).resolve())}
    process = await asyncio.create_subprocess_exec(checked['executable'], *checked['command'][1:], cwd=cwd, env=env,
        stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.PIPE)
    truncated = False

    async def drain(stream):
        nonlocal truncated
        collected = bytearray()
        while True:
            chunk = await stream.read(4096)
            if not chunk:
                return bytes(collected)
            remaining = MAX_OUTPUT_BYTES - len(collected)
            collected.extend(chunk[:remaining])
            if len(chunk) > remaining or len(collected) >= MAX_OUTPUT_BYTES:
                truncated = True
                process.kill()
                return bytes(collected)
    try:
        stdout, stderr = await asyncio.wait_for(asyncio.gather(
            drain(process.stdout), drain(process.stderr)), timeout=60)
        await process.wait()
    except TimeoutError:
        if process.returncode is None:
            process.kill()
        await process.wait()
        raise WorkspaceAccessError('Terminal komutu 60 saniye sınırını aştı.') from None
    combined = (stdout + stderr)[:MAX_OUTPUT_BYTES]
    suffix = '\n[çıktı 64 KiB sınırında kesildi]' if truncated or len(stdout) + len(stderr) > MAX_OUTPUT_BYTES else ''
    result = combined.decode('utf-8', errors='replace') + suffix
    if process.returncode != 0:
        raise WorkspaceAccessError(f'Komut {process.returncode} koduyla başarısız oldu.\n{result}')
    return result or f'Komut başarıyla tamamlandı (çıkış kodu {process.returncode}).'
