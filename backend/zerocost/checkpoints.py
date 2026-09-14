"""Backward-compatible, per-run LangGraph checkpoint locations."""
import hashlib
from pathlib import Path
import sqlite3


def _contains_thread(path: Path, thread_id: str) -> bool:
    if not path.exists():
        return False
    try:
        connection = sqlite3.connect(path)
        try:
            return connection.execute(
                "SELECT 1 FROM checkpoints WHERE thread_id=? LIMIT 1",
                (thread_id,)).fetchone() is not None
        finally:
            connection.close()
    except sqlite3.Error:
        return False


def checkpoint_path(database, thread_id: str) -> Path:
    database = Path(database)
    legacy = database.with_name(database.stem + '-checkpoints.sqlite3')
    if _contains_thread(legacy, thread_id):
        return legacy
    digest = hashlib.sha256(thread_id.encode('utf-8')).hexdigest()
    return database.with_name(database.stem + '-checkpoints') / f'{digest}.sqlite3'


def checkpoint_exists(database, thread_id: str) -> bool:
    return _contains_thread(checkpoint_path(database, thread_id), thread_id)
