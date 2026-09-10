import pytest

from zerocost.knowledge_files import (MAX_KNOWLEDGE_FILE_BYTES,
                                      read_knowledge_source)
from zerocost.models import WorkspaceInput
from zerocost.storage import Store
from zerocost.workspace_tools import WorkspaceAccessError


@pytest.fixture
def workspace_store(tmp_path):
    root = tmp_path / 'project'
    (root / 'docs').mkdir(parents=True)
    store = Store(tmp_path / 'knowledge-files.sqlite3')
    store.create_workspace(WorkspaceInput(name='Project', path=str(root)))
    yield store, store.snapshot().workspaces[0], root
    store.close()


def test_knowledge_source_reader_returns_canonical_utf8(workspace_store):
    store, workspace, root = workspace_store
    (root / 'docs' / 'guide.md').write_text('Başlık\n\nİçerik', encoding='utf-8')
    path, content = read_knowledge_source(store, workspace.id, 'docs/guide.md')
    assert path == 'docs/guide.md'
    assert content == 'Başlık\n\nİçerik'


@pytest.mark.parametrize(('path', 'message'), [
    ('/tmp/outside.md', 'göreli'),
    ('.hidden.md', 'göreli'),
    ('docs/data.json', 'Markdown'),
    ('docs/missing.md', 'bulunamadı'),
])
def test_knowledge_source_reader_rejects_unsafe_paths(
        workspace_store, path, message):
    store, workspace, root = workspace_store
    (root / 'docs' / 'data.json').write_text('{}', encoding='utf-8')
    with pytest.raises(WorkspaceAccessError, match=message):
        read_knowledge_source(store, workspace.id, path)


def test_knowledge_source_reader_rejects_symlink_binary_and_size(workspace_store, tmp_path):
    store, workspace, root = workspace_store
    outside = tmp_path / 'outside.md'
    outside.write_text('gizli', encoding='utf-8')
    (root / 'docs' / 'link.md').symlink_to(outside)
    with pytest.raises(WorkspaceAccessError, match='Sembolik'):
        read_knowledge_source(store, workspace.id, 'docs/link.md')

    (root / 'docs' / 'binary.txt').write_bytes(b'metin\0veri')
    with pytest.raises(WorkspaceAccessError, match='İkili'):
        read_knowledge_source(store, workspace.id, 'docs/binary.txt')

    (root / 'docs' / 'large.txt').write_bytes(b'a' * (MAX_KNOWLEDGE_FILE_BYTES + 1))
    with pytest.raises(WorkspaceAccessError, match='1 MiB'):
        read_knowledge_source(store, workspace.id, 'docs/large.txt')
