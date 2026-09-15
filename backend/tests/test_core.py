import json
from pathlib import Path
import os
import sqlite3
import subprocess
import sys
import pytest
import asyncio
from zerocost.models import (AgentInput, ConnectionInput, WorkspaceInput,
                             KnowledgeCollectionInput, KnowledgeIngestionProgress,
                             SkillPackageInput, WorkflowSlotInput,
                             WorkflowTemplateInput)
from zerocost.sidecar import ChatService, dispatch
from zerocost.storage import Store
from zerocost.providers.base import (Message, TextChunk, ToolCallChunk, PermanentProviderError, ProviderError,
                                     RetryableProviderError)
from zerocost.pricing import TokenUsage
from zerocost.workspace_tools import apply_write, prepare_write
from zerocost.terminal_tools import execute_command, prepare_command
from zerocost.checkpoints import checkpoint_path


@pytest.fixture
def store(tmp_path):
    instance = Store(tmp_path / 'app.sqlite3')
    yield instance
    instance.close()


def request(method, **params):
    value = {'protocol_version': 1, 'request_id': 'test-1', 'method': method}
    if params:
        value['params'] = params
    return json.dumps(value)


def test_multiple_accounts_and_agents_persist(tmp_path):
    path = tmp_path / 'app.sqlite3'
    store = Store(path)
    for name in ['Gemini A', 'Gemini B']:
        store.create_connection(ConnectionInput(name=name, provider='gemini', model_id='test-model'))
    connections = store.snapshot().connections
    for index, connection in enumerate(connections):
        store.create_agent(AgentInput(name=f'Agent {index}', role='review', connection_id=connection.id))
    store.close()
    reopened = Store(path)
    snapshot = reopened.snapshot()
    assert len(snapshot.connections) == len(snapshot.agents) == 2
    assert snapshot.agents[0].connection_id != snapshot.agents[1].connection_id
    assert all(agent.permissions == [] for agent in snapshot.agents)
    reopened.close()


def test_openai_and_lmstudio_connection_profiles_normalize_safe_endpoints(store):
    store.create_connection(ConnectionInput(
        name='OpenAI', provider='openai', model_id='gpt-4o-mini'))
    store.create_connection(ConnectionInput(
        name='LM Studio', provider='lmstudio', model_id='local-model',
        base_url='http://localhost:1234/v1/'))
    connections = {connection.provider: connection for connection in store.snapshot().connections}
    assert connections['openai'].base_url == 'https://api.openai.com/v1'
    assert connections['lmstudio'].base_url == 'http://localhost:1234/v1'


def test_connection_tool_capability_is_explicit_and_validated(store):
    store.create_connection(ConnectionInput(name='Local', provider='ollama', model_id='qwen'))
    connection = store.snapshot().connections[0]
    assert connection.supports_tools == 'unknown'
    changed = dispatch(store, request(
        'connection.tools.set', connection_id=connection.id, supports_tools='true'))
    assert changed.ok and changed.result.connections[0].supports_tools == 'true'
    rejected = dispatch(store, request(
        'connection.tools.set', connection_id=connection.id, supports_tools='maybe'))
    assert not rejected.ok


@pytest.mark.parametrize('endpoint', [
    'https://localhost:1234/v1',
    'http://192.168.1.5:1234/v1',
    'http://127.0.0.1:1234/v1?token=secret',
    'http://user:pass@localhost:1234/v1',
    'http://localhost:1234/admin',
])
def test_lmstudio_rejects_non_loopback_or_ambiguous_endpoints(endpoint):
    with pytest.raises(ValueError, match='loopback'):
        ConnectionInput(name='Unsafe', provider='lmstudio', model_id='local', base_url=endpoint)


def test_openai_rejects_custom_endpoint():
    with pytest.raises(ValueError, match='endpoint'):
        ConnectionInput(name='Unsafe', provider='openai', model_id='gpt-4o',
                        base_url='https://example.test/v1')


def test_foreign_key_and_unique_constraints(store):
    with pytest.raises(sqlite3.IntegrityError):
        store.create_agent(AgentInput(name='orphan', role='review', connection_id='missing'))
    data = ConnectionInput(name='Local', provider='ollama', model_id='test')
    store.create_connection(data)
    with pytest.raises(sqlite3.IntegrityError):
        store.create_connection(data)
    assert len(store.snapshot().connections) == 1


@pytest.mark.parametrize('raw', [
    '{bad',
    request('shell.execute', command='pwd'),
    '{"protocol_version":2,"request_id":"test-1","method":"snapshot"}',
    '{"protocol_version":1,"request_id":"test-1","method":"snapshot","extra":"secret"}',
    request('connection.create', name='  ', provider='ollama', model_id='model'),
    request('connection.create', name='A', provider='unknown', model_id='model'),
])
def test_invalid_requests_are_rejected_without_mutation(store, raw):
    response = dispatch(store, raw)
    assert response.ok is False
    assert response.code == 'invalid_request'
    assert store.snapshot().connections == []


def test_pricing_catalog_is_available_over_ipc(store):
    response = dispatch(store, request('pricing.catalog'))
    assert response.ok
    assert response.result.version == '2026-09-14'
    assert response.result.currency == 'USD'
    assert any(entry.model_pattern == 'gemini-2-5-flash'
               for entry in response.result.entries)


def test_workspace_resolves_symlink_and_rejects_missing(store, tmp_path):
    actual = tmp_path / 'project'
    actual.mkdir()
    alias = tmp_path / 'alias'
    alias.symlink_to(actual, target_is_directory=True)
    store.create_workspace(WorkspaceInput(name='project', path=str(alias)))
    assert store.snapshot().workspaces[0].path == str(actual.resolve())
    assert list(actual.iterdir()) == []
    with pytest.raises(sqlite3.IntegrityError):
        store.create_workspace(WorkspaceInput(name='duplicate', path=str(actual)))
    assert dispatch(store, request('workspace.create', name='bad', path=str(tmp_path / 'missing'))).code == 'not_found'
    assert dispatch(store, request('workspace.create', name='bad', path='.')).code == 'invalid_request'


def test_workspace_read_requires_permission_and_stays_inside_root(store, tmp_path):
    root = tmp_path / 'project'
    root.mkdir()
    (root / 'notes.md').write_text('güvenli içerik', encoding='utf-8')
    (root / '.secret').write_text('hidden', encoding='utf-8')
    (root / '.secret.md').write_text('hidden markdown', encoding='utf-8')
    (root / 'binary.txt').write_bytes(b'bad\x00value')
    (root / 'large.txt').write_text('x' * (128 * 1024 + 1), encoding='utf-8')
    outside = tmp_path / 'outside.md'
    outside.write_text('outside', encoding='utf-8')
    (root / 'escape.md').symlink_to(outside)
    store.create_connection(ConnectionInput(name='Local', provider='ollama', model_id='test'))
    connection = store.snapshot().connections[0]
    store.create_agent(AgentInput(name='Reader', role='review', connection_id=connection.id))
    agent = store.snapshot().agents[0]
    store.create_workspace(WorkspaceInput(name='Project', path=str(root)))
    workspace = store.snapshot().workspaces[0]

    denied = dispatch(store, request('workspace.read', agent_id=agent.id,
                                     workspace_id=workspace.id, path='notes.md'))
    assert not denied.ok and 'okuma' in denied.message
    granted = dispatch(store, request('agent.permissions.set', agent_id=agent.id,
                                      permissions=['workspace.read']))
    assert granted.ok and granted.result.agents[0].permissions == ['workspace.read']
    listing = dispatch(store, request('workspace.list', agent_id=agent.id,
                                      workspace_id=workspace.id, path=''))
    assert [entry.name for entry in listing.result.entries] == ['binary.txt', 'large.txt', 'notes.md']
    read = dispatch(store, request('workspace.read', agent_id=agent.id,
                                   workspace_id=workspace.id, path='notes.md'))
    assert (read.result.content, read.result.size) == ('güvenli içerik', len('güvenli içerik'.encode()))
    for path in ['../outside.md', str(outside), 'escape.md', 'large.txt', 'binary.txt', '.secret.md']:
        rejected = dispatch(store, request('workspace.read', agent_id=agent.id,
                                           workspace_id=workspace.id, path=path))
        assert not rejected.ok


def test_permissions_survive_schema_migration(tmp_path):
    path = tmp_path / 'migration.sqlite3'
    original = Store(path)
    original.create_connection(ConnectionInput(name='Local', provider='ollama', model_id='test'))
    connection = original.snapshot().connections[0]
    original.create_agent(AgentInput(name='Reader', role='review', connection_id=connection.id))
    agent_id = original.snapshot().agents[0].id
    original.close()
    reopened = Store(path)
    reopened.set_agent_permissions(agent_id, ['workspace.read'])
    reopened.close()
    assert Store(path).agent(agent_id).permissions == ['workspace.read']


def test_v4_orchestration_migrates_with_budget_defaults(tmp_path):
    path = tmp_path / 'v4.sqlite3'
    store = Store(path)
    store.create_connection(ConnectionInput(name='Local', provider='ollama', model_id='test'))
    connection = store.snapshot().connections[0]
    for name in ('A', 'B'):
        store.create_agent(AgentInput(name=name, role='review', connection_id=connection.id))
    agents = store.snapshot().agents
    store.start_orchestration('old-run', 'Eski görev', 1, [a.id for a in agents])
    store.finish_orchestration('old-run', 'completed')
    store.db.execute('PRAGMA foreign_keys=OFF')
    store.db.execute('PRAGMA legacy_alter_table=ON')
    store.db.execute('DROP INDEX orchestration_created')
    store.db.execute('ALTER TABLE orchestration_runs RENAME TO orchestration_runs_v5_backup')
    store.db.execute("""CREATE TABLE orchestration_runs (
        run_id TEXT PRIMARY KEY, objective TEXT NOT NULL,
        rounds INTEGER NOT NULL CHECK(rounds BETWEEN 1 AND 3),
        status TEXT NOT NULL CHECK(status IN ('running','completed','cancelled','failed','interrupted')),
        error TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)""")
    store.db.execute("""INSERT INTO orchestration_runs
        SELECT run_id,objective,rounds,status,error,created_at FROM orchestration_runs_v5_backup""")
    store.db.execute('DROP TABLE orchestration_runs_v5_backup')
    store.db.execute('CREATE INDEX orchestration_created ON orchestration_runs(created_at)')
    store.db.execute('DROP TABLE knowledge_chunks_fts')
    store.db.execute('DROP TABLE knowledge_chunks')
    store.db.execute('DROP TABLE knowledge_sources')
    store.db.execute('DROP TABLE knowledge_collections')
    store.db.execute('DROP TABLE skill_assignments')
    store.db.execute('DROP TABLE skills')
    store.db.execute('DROP TABLE workflows')
    store.db.execute('PRAGMA user_version=4')
    store.db.commit()
    store.close()

    migrated = Store(path)
    run = migrated.orchestration_history().runs[0]
    assert migrated.snapshot().database_version == 18
    assert run.routing_mode == 'manual' and run.max_model_calls == 5
    assert run.agent_ids == [a.id for a in agents]
    assert migrated.db.execute('PRAGMA foreign_key_check').fetchall() == []
    migrated.close()


def test_knowledge_storage_is_replaceable_searchable_and_dimension_safe(tmp_path):
    root = tmp_path / 'project'
    root.mkdir()
    store = Store(tmp_path / 'knowledge.sqlite3')
    store.create_workspace(WorkspaceInput(name='Project', path=str(root)))
    workspace = store.snapshot().workspaces[0]
    collection_id = store.create_knowledge_collection(KnowledgeCollectionInput(
        name='Belgeler', embedding_model='nomic-embed-text:latest'), 3)
    store.replace_knowledge_source(collection_id, workspace.id, 'notes.md', 'hash-1', [
        {'start_line': 1, 'end_line': 2, 'content': 'Python güvenli dosya işlemleri',
         'embedding': [1.0, 0.0, 0.0]},
        {'start_line': 3, 'end_line': 4, 'content': 'Rust masaüstü köprüsü',
         'embedding': [0.0, 1.0, 0.0]},
    ])
    snapshot = store.knowledge_snapshot()
    assert (snapshot.collections[0].source_count, snapshot.collections[0].chunk_count) == (1, 2)
    assert store.search_knowledge_fts(collection_id, 'Python')[0]['source_path'] == 'notes.md'
    store.replace_knowledge_source(collection_id, workspace.id, 'notes.md', 'hash-2', [
        {'start_line': 1, 'end_line': 1, 'content': 'Güncel Python notları',
         'embedding': [0.5, 0.5, 0.0]},
    ])
    snapshot = store.knowledge_snapshot()
    assert (snapshot.collections[0].source_count, snapshot.collections[0].chunk_count) == (1, 1)
    with pytest.raises(ValueError, match='boyutu'):
        store.replace_knowledge_source(collection_id, workspace.id, 'bad.md', 'hash', [
            {'start_line': 1, 'end_line': 1, 'content': 'bad', 'embedding': [1.0, 0.0]},
        ])
    assert store.db.execute('PRAGMA foreign_key_check').fetchall() == []
    store.close()


def test_knowledge_collection_ipc_probes_embedding_dimensions(tmp_path):
    class FakeEmbeddings:
        def __init__(self, model=''):
            self.model = model

        async def list_models(self):
            return [{'name': 'embed-local', 'size': 42}]

        async def embed(self, texts):
            assert self.model == 'embed-local'
            assert len(texts) == 1
            return [[0.0, 0.6, 0.8]]

    async def scenario():
        store = Store(tmp_path / 'ipc-knowledge.sqlite3')
        service = ChatService(store, embedding_factory=FakeEmbeddings)
        response = await service.handle(request('knowledge.collection.create',
            name='Projeler', embedding_provider='ollama', embedding_model='embed-local'))
        assert response.ok
        collection = response.result.collections[0]
        assert collection.dimensions == 3 and collection.embedding_model == 'embed-local'
        snapshot = await service.handle(request('knowledge.snapshot'))
        assert snapshot.result.embedding_models[0].name == 'embed-local'
        await service.close()
        store.close()

    asyncio.run(scenario())


def test_knowledge_source_ipc_reads_chunks_and_indexes_idempotently(tmp_path):
    class FakeEmbeddings:
        calls = []

        def __init__(self, model=''):
            assert model == 'embed-local'

        async def embed(self, texts):
            self.calls.append(list(texts))
            return [[1.0, 0.0, 0.0] for _ in texts]

    async def scenario():
        root = tmp_path / 'project'
        (root / 'docs').mkdir(parents=True)
        content = '# Güvenlik\n\n' + 'Bağlamı koruyan bir cümle. ' * 180
        (root / 'docs' / 'guide.md').write_text(content, encoding='utf-8')
        store = Store(tmp_path / 'source-ipc.sqlite3')
        store.create_workspace(WorkspaceInput(name='Project', path=str(root)))
        workspace = store.snapshot().workspaces[0]
        collection_id = store.create_knowledge_collection(KnowledgeCollectionInput(
            name='Docs', embedding_model='embed-local'), 3)
        FakeEmbeddings.calls = []
        events = []
        service = ChatService(store, events.append, embedding_factory=FakeEmbeddings)
        raw = request('knowledge.source.ingest', collection_id=collection_id,
                      workspace_id=workspace.id, path='docs/guide.md')
        response = await service.handle(raw)
        assert response.ok and response.result.status == 'indexed'
        assert response.result.path == 'docs/guide.md'
        assert response.result.chunk_count > 1
        assert response.result.embedded_count == response.result.chunk_count
        assert any('Önceki metin bağlamı' in text
                   for batch in FakeEmbeddings.calls for text in batch)
        progress = [event for event in events
                    if event.type == 'knowledge_ingestion_progress']
        assert [event.sequence for event in progress] == list(range(1, len(progress) + 1))
        assert {event.stage for event in progress} >= {
            'reading', 'parsing', 'chunking', 'embedding', 'committing', 'completed'}
        assert progress[-1].is_final and progress[-1].progress_percent == 100
        assert progress[-1].request_id == 'test-1'

        events.clear()
        unchanged = await service.handle(raw)
        assert unchanged.ok and unchanged.result.status == 'unchanged'
        assert unchanged.result.embedded_count == 0
        assert events[-1].stage == 'completed' and events[-1].progress_percent == 100
        assert store.knowledge_snapshot().collections[0].source_count == 1
        await service.close()
        store.close()

    asyncio.run(scenario())


def test_knowledge_progress_rejects_inconsistent_terminal_state():
    with pytest.raises(ValueError, match='completed stage'):
        KnowledgeIngestionProgress(
            request_id='ingest', sequence=1, collection_id='c', workspace_id='w',
            path='guide.md', stage='embedding', completed_units=1, total_units=1,
            progress_percent=100, message='Bitti.', is_final=True)


def test_v8_knowledge_data_migrates_to_versioned_hash_cache(tmp_path):
    root = tmp_path / 'project'
    root.mkdir()
    path = tmp_path / 'v8.sqlite3'
    store = Store(path)
    store.create_workspace(WorkspaceInput(name='Project', path=str(root)))
    workspace = store.snapshot().workspaces[0]
    collection_id = store.create_knowledge_collection(KnowledgeCollectionInput(
        name='Legacy docs', embedding_model='embed-local'), 3)
    store.replace_knowledge_source(collection_id, workspace.id, 'legacy.md', 'old-hash', [{
        'start_line': 1, 'end_line': 1, 'content': 'korunan içerik',
        'embedding': [1.0, 0.0, 0.0],
    }])
    store.db.execute('DROP INDEX knowledge_chunks_content_hash')
    store.db.execute('ALTER TABLE knowledge_chunks DROP COLUMN content_hash')
    store.db.execute('ALTER TABLE knowledge_sources DROP COLUMN index_version')
    store.db.execute('DROP TABLE skill_assignments')
    store.db.execute('DROP TABLE skills')
    store.db.execute('DROP TABLE workflows')
    store.db.execute('DROP INDEX orchestration_workflow')
    store.db.execute('DROP INDEX orchestration_parent')
    for column in ('attempt', 'parent_run_id', 'resumed_from_node', 'failed_node',
                   'error_class', 'tool_args_hash', 'tool_content_hash'):
        store.db.execute(f'ALTER TABLE orchestration_runs DROP COLUMN {column}')
    store.db.execute('ALTER TABLE orchestration_runs DROP COLUMN workflow_id')
    store.db.execute('ALTER TABLE orchestration_runs DROP COLUMN workflow_version')
    store.db.execute('PRAGMA user_version=8')
    store.db.commit()
    store.close()

    migrated = Store(path)
    source = migrated.knowledge_source_hash(collection_id, workspace.id, 'legacy.md')
    assert migrated.snapshot().database_version == 18
    assert source == {'content_hash': 'old-hash', 'status': 'ready', 'index_version': 'legacy-v8'}
    assert migrated.search_knowledge_fts(collection_id, 'korunan')[0]['content'] == 'korunan içerik'
    assert migrated.db.execute('PRAGMA integrity_check').fetchone()[0] == 'ok'
    migrated.close()


def test_atomic_workspace_write_rechecks_hash_and_rejects_symlink(tmp_path):
    root = tmp_path / 'project'
    root.mkdir()
    target = root / 'notes.md'
    target.write_text('eski\n', encoding='utf-8')
    store, agent = configured_store(tmp_path)
    store.create_workspace(WorkspaceInput(name='Project', path=str(root)))
    workspace = store.snapshot().workspaces[0]
    store.set_agent_permissions(agent.id, ['workspace.write'])
    proposal = prepare_write(store, agent.id, workspace.id, 'notes.md', 'yeni\n')
    assert '-eski' in proposal['preview'] and '+yeni' in proposal['preview']
    target.write_text('arada değişti\n', encoding='utf-8')
    with pytest.raises(ValueError, match='onay beklerken değişti'):
        apply_write(store, proposal)
    target.write_text('eski\n', encoding='utf-8')
    outside = tmp_path / 'outside.md'
    outside.write_text('dışarı', encoding='utf-8')
    target.unlink()
    target.symlink_to(outside)
    with pytest.raises(ValueError, match='Sembolik'):
        prepare_write(store, agent.id, workspace.id, 'notes.md', 'kaçış')
    store.close()


def test_terminal_is_argv_only_workspace_bounded_and_allowlisted(tmp_path):
    async def scenario():
        root = tmp_path / 'project'
        root.mkdir()
        store, agent = configured_store(tmp_path)
        store.create_workspace(WorkspaceInput(name='Project', path=str(root)))
        workspace = store.snapshot().workspaces[0]
        store.set_agent_permissions(agent.id, ['terminal.execute'])
        proposal = prepare_command(store, agent.id, workspace.id, ['pwd'])
        assert str(root.resolve()) in await execute_command(store, proposal)
        with pytest.raises(ValueError, match='izin listesinde'):
            prepare_command(store, agent.id, workspace.id, ['sh', '-c', 'touch escaped'])
        store.close()
    asyncio.run(scenario())


def test_future_schema_is_not_overwritten(tmp_path):
    path = tmp_path / 'future.sqlite3'
    db = sqlite3.connect(path)
    db.execute('PRAGMA user_version=999')
    db.close()
    with pytest.raises(RuntimeError):
        Store(path)
    db = sqlite3.connect(path)
    assert db.execute('PRAGMA user_version').fetchone()[0] == 999
    db.close()


def test_real_stdio_multiple_frames_and_restart(tmp_path):
    path = tmp_path / 'ipc.sqlite3'
    command = [sys.executable, '-m', 'zerocost.sidecar', '--database', str(path)]
    env = {**os.environ, 'PYTHONPATH': str(Path(__file__).resolve().parents[1])}
    frames = ['{invalid', request('connection.create', name='Local', provider='ollama', model_id='test'), request('snapshot')]
    result = subprocess.run(command, input='\n'.join(frames)+'\n', text=True, capture_output=True, env=env, timeout=10)
    assert result.returncode == 0
    responses = [json.loads(line) for line in result.stdout.splitlines()]
    assert len(responses) == 3
    assert responses[0]['ok'] is False
    assert responses[1]['ok'] is True
    assert responses[2]['result']['connections'][0]['name'] == 'Local'
    restarted = subprocess.run(command, input=request('snapshot')+'\n', text=True, capture_output=True, env=env, timeout=10)
    assert json.loads(restarted.stdout)['result']['connections'][0]['name'] == 'Local'


def test_oversize_frame_closes_protocol(tmp_path):
    result = subprocess.run([sys.executable, '-m', 'zerocost.sidecar', '--database', str(tmp_path / 'ipc.sqlite3')],
        input='x' * (64 * 1024 + 1) + '\n' + request('snapshot') + '\n', text=True, capture_output=True,
        env={**os.environ, 'PYTHONPATH': str(Path(__file__).resolve().parents[1])}, timeout=10)
    assert len(result.stdout.splitlines()) == 1
    assert json.loads(result.stdout)['ok'] is False


class FakeProvider:
    def __init__(self, tokens=('mer', 'haba'), failure=None, gate=None,
                 usage=TokenUsage()):
        self.tokens = tokens
        self.failure = failure
        self.gate = gate
        self.messages = []
        self.usage = usage

    async def stream_reply(self, messages: list[Message], *, api_key=None, max_tokens=512):
        self.messages = messages
        for token in self.tokens:
            if self.gate:
                await self.gate.wait()
            yield token
        if self.failure:
            if isinstance(self.failure, Exception):
                raise self.failure
            raise ProviderError(self.failure)


def configured_store(tmp_path):
    store = Store(tmp_path / 'chat.sqlite3')
    store.create_connection(ConnectionInput(name='Local', provider='ollama', model_id='test-model'))
    connection = store.snapshot().connections[0]
    store.create_agent(AgentInput(name='Helper', role='Yardımcı', connection_id=connection.id,
                                  instructions='Kısa yanıt ver.'))
    return store, store.snapshot().agents[0]


def test_agent_fallback_order_is_validated_and_persisted(tmp_path):
    store, agent = configured_store(tmp_path)
    for name in ('Backup 1', 'Backup 2'):
        store.create_connection(ConnectionInput(name=name, provider='ollama', model_id=name.lower()))
    backups = [item.id for item in store.snapshot().connections if item.id != agent.connection_id]
    result = dispatch(store, request(
        'agent.fallbacks.set', agent_id=agent.id, connection_ids=list(reversed(backups))))
    assert result.ok
    saved = next(item for item in result.result.agents if item.id == agent.id)
    assert saved.fallback_connection_ids == list(reversed(backups))
    duplicate = dispatch(store, request(
        'agent.fallbacks.set', agent_id=agent.id, connection_ids=[backups[0], backups[0]]))
    primary = dispatch(store, request(
        'agent.fallbacks.set', agent_id=agent.id, connection_ids=[agent.connection_id]))
    assert not duplicate.ok and not primary.ok
    store.close()


def test_skill_manifest_versions_assignment_and_contract_validation(tmp_path):
    store, agent = configured_store(tmp_path)
    invalid = dispatch(store, request(
        'skill.create', name='Writer', version='1.0.0', description='Writes files',
        instructions='Write carefully.', required_tools=['workspace.write'],
        required_permissions=[], provider_hint='ollama'))
    assert not invalid.ok and invalid.code == 'invalid_request'

    identifiers = []
    for version in ('1.0.0', '2.0.0'):
        created = dispatch(store, request(
            'skill.create', name='Reviewer', version=version, description='Reviews code',
            instructions=f'Review policy {version}', required_tools=[],
            required_permissions=[], provider_hint='ollama'))
        assert created.ok
        identifiers.append(next(skill.id for skill in created.result.skills
                                if skill.name == 'Reviewer' and skill.version == version))
    duplicate = dispatch(store, request(
        'skill.create', name='Reviewer', version='2.0.0', description='Duplicate',
        instructions='', required_tools=[], required_permissions=[], provider_hint=None))
    assert not duplicate.ok and duplicate.code == 'conflict'

    assert dispatch(store, request('skill.assign', agent_id=agent.id,
                                   skill_id=identifiers[0])).ok
    upgraded = dispatch(store, request('skill.assign', agent_id=agent.id,
                                       skill_id=identifiers[1]))
    assert upgraded.ok
    assert upgraded.result.agents[0].skill_ids == [identifiers[1]]
    assert dispatch(store, request('skill.unassign', agent_id=agent.id,
                                   skill_id=identifiers[1])).ok
    assert store.snapshot().agents[0].skill_ids == []
    store.close()


def test_skill_assignment_bounds_total_prompt_size(tmp_path):
    store, agent = configured_store(tmp_path)
    for index in range(3):
        skill_id = store.create_skill(SkillPackageInput(
            name=f'Large {index}', version='1.0.0', description='Large prompt',
            instructions='x' * 8000))
        store.assign_skill(agent.id, skill_id)
    fourth = store.create_skill(SkillPackageInput(
        name='Too large', version='1.0.0', description='Too large', instructions='x'))
    with pytest.raises(ValueError, match='24.000'):
        store.assign_skill(agent.id, fourth)
    assert len(store.snapshot().agents[0].skill_ids) == 3
    store.close()


def test_chat_injects_tool_free_skill_and_rejects_tool_skill(tmp_path):
    async def scenario():
        store, agent = configured_store(tmp_path)
        skill_id = store.create_skill(SkillPackageInput(
            name='Concise', version='1.0.0', description='Short answers',
            instructions='Use at most three sentences.', provider_hint='ollama'))
        store.assign_skill(agent.id, skill_id)
        provider = FakeProvider(tokens=('ok',))
        service = ChatService(store, lambda _: None, lambda *_: provider)
        started = await service.handle(request(
            'chat.start', run_id='skill-chat', agent_id=agent.id, message='Explain'))
        assert started.ok
        await service.tasks['skill-chat']
        assert '<skill name=' in provider.messages[0].content
        assert 'Use at most three sentences.' in provider.messages[0].content

        tool_skill = store.create_skill(SkillPackageInput(
            name='Terminal helper', version='1.0.0', description='Uses terminal',
            instructions='Inspect with terminal.', required_tools=['terminal.execute'],
            required_permissions=['terminal.execute']))
        store.set_agent_permissions(agent.id, ['terminal.execute'])
        store.assign_skill(agent.id, tool_skill)
        denied = await service.handle(request(
            'chat.start', run_id='skill-chat-2', agent_id=agent.id, message='Inspect'))
        assert not denied.ok and 'Ajan masasında' in denied.message
        assert store.history(agent.id).turns[-1].run_id == 'skill-chat'
        store.close()
    asyncio.run(scenario())


def test_orchestration_enforces_skill_required_tools_before_start(tmp_path):
    async def scenario():
        root = tmp_path / 'project'
        root.mkdir()
        store = Store(tmp_path / 'skill-tools.sqlite3')
        store.create_connection(ConnectionInput(name='Local', provider='ollama', model_id='test'))
        connection = store.snapshot().connections[0]
        for name in ('Operator', 'Reviewer'):
            store.create_agent(AgentInput(name=name, role='review', connection_id=connection.id))
        agents = store.snapshot().agents
        store.set_agent_permissions(agents[0].id, ['terminal.execute'])
        skill_id = store.create_skill(SkillPackageInput(
            name='Terminal audit', version='1.0.0', description='Runs diagnostics',
            instructions='Use a read-only diagnostic.', required_tools=['terminal.execute'],
            required_permissions=['terminal.execute']))
        store.assign_skill(agents[0].id, skill_id)
        service = ChatService(store, lambda _: None, lambda *_: FakeProvider(tokens=('done',)))
        denied = await service.handle(request(
            'orchestration.start', run_id='skill-denied', objective='Inspect',
            agent_ids=[agent.id for agent in agents], rounds=1))
        assert not denied.ok and 'terminal.execute aracını' in denied.message
        assert store.orchestration_history().runs == []
        store.close()
    asyncio.run(scenario())


def test_workflow_versions_archive_without_breaking_old_records(tmp_path):
    store, agent = configured_store(tmp_path)
    skill_id = store.create_skill(SkillPackageInput(
        name='Review', version='1.0.0', description='Review', instructions='Review carefully.'))
    first = store.create_workflow(WorkflowTemplateInput(
        name='Code review', version='1.0.0', description='First version',
        objective_prefix='Review this change.',
        agent_slots=[WorkflowSlotInput(name='Reviewer', required_skill_ids=[skill_id]),
                     WorkflowSlotInput(name='Challenger')],
        rounds=1, max_model_calls=3))
    second = store.create_workflow(WorkflowTemplateInput(
        name='Code review', version='2.0.0', description='Second version',
        objective_prefix='Review correctness and security.',
        agent_slots=[WorkflowSlotInput(name='Reviewer', required_skill_ids=[skill_id]),
                     WorkflowSlotInput(name='Challenger')],
        rounds=1, max_model_calls=3))
    workflows = store.snapshot().workflows
    assert [(item.id, item.archived) for item in workflows] == [(second, False), (first, True)]
    duplicate = dispatch(store, request(
        'workflow.create', name='Code review', version='2.0.0', description='Duplicate',
        objective_prefix='', agent_slots=[
            {'name': 'One', 'required_skill_ids': []},
            {'name': 'Two', 'required_skill_ids': []}],
        required_tools=[], rounds=1, max_model_calls=3,
        max_output_tokens=512, max_cost_microusd=5_000_000))
    assert not duplicate.ok and duplicate.code == 'conflict'
    assert store.workflow(second).archived is False
    assert dispatch(store, request('workflow.archive', workflow_id=second)).ok
    assert all(item.archived for item in store.snapshot().workflows)
    store.close()


def test_workflow_compiles_fixed_topology_and_persists_provenance(tmp_path):
    async def scenario():
        store = Store(tmp_path / 'workflow.sqlite3')
        store.create_connection(ConnectionInput(name='Local', provider='ollama', model_id='test'))
        connection = store.snapshot().connections[0]
        for name in ('Reviewer', 'Challenger'):
            store.create_agent(AgentInput(name=name, role='review', connection_id=connection.id))
        agents = store.snapshot().agents
        skill_id = store.create_skill(SkillPackageInput(
            name='Review', version='1.0.0', description='Review', instructions='Check evidence.'))
        workflow_id = store.create_workflow(WorkflowTemplateInput(
            name='Review flow', version='1.0.0', description='Fixed review flow',
            objective_prefix='Apply the review policy.',
            agent_slots=[WorkflowSlotInput(name='Primary', required_skill_ids=[skill_id]),
                         WorkflowSlotInput(name='Counterpoint')],
            rounds=1, max_model_calls=3, max_output_tokens=256,
            max_cost_microusd=1_000_000))
        providers = []
        def factory(*_):
            provider = FakeProvider(tokens=('done',))
            providers.append(provider)
            return provider
        service = ChatService(store, lambda _: None, factory)
        raw = request('orchestration.start', run_id='workflow-missing', objective='Inspect change',
                      agent_ids=[agent.id for agent in agents], rounds=1,
                      max_model_calls=3, workflow_id=workflow_id, workflow_version='1.0.0')
        denied = await service.handle(raw)
        assert not denied.ok and 'Review v1.0.0' in denied.message
        assert providers == [] and store.orchestration_history().runs == []

        store.assign_skill(agents[0].id, skill_id)
        started = await service.handle(request(
            'orchestration.start', run_id='workflow-run', objective='Inspect change',
            agent_ids=[agent.id for agent in agents], rounds=1,
            max_model_calls=3, max_output_tokens=512, max_cost_microusd=5_000_000,
            workflow_id=workflow_id, workflow_version='1.0.0'))
        assert started.ok
        await service.tasks['workflow-run']
        run = store.orchestration_history().runs[0]
        assert run.status == 'completed'
        assert run.objective == 'Apply the review policy.\n\nInspect change'
        assert (run.workflow_id, run.workflow_version) == (workflow_id, '1.0.0')
        assert (run.routing_mode, run.rounds, run.max_model_calls, run.max_output_tokens) == (
            'manual', 1, 3, 256)
        assert 'Check evidence.' in providers[0].messages[0].content
        assert store.db.execute('PRAGMA foreign_key_check').fetchall() == []
        store.close()
    asyncio.run(scenario())


def test_workflow_knowledge_requirement_fails_without_collection(tmp_path):
    async def scenario():
        store = Store(tmp_path / 'workflow-knowledge.sqlite3')
        store.create_connection(ConnectionInput(name='Local', provider='ollama', model_id='test'))
        connection = store.snapshot().connections[0]
        for name in ('A', 'B'):
            store.create_agent(AgentInput(name=name, role='review', connection_id=connection.id))
        workflow_id = store.create_workflow(WorkflowTemplateInput(
            name='Research', version='1.0.0', description='Searches knowledge',
            agent_slots=[WorkflowSlotInput(name='A'), WorkflowSlotInput(name='B')],
            required_tools=['knowledge.search'], rounds=1, max_model_calls=4))
        service = ChatService(store, lambda _: None, lambda *_: FakeProvider())
        denied = await service.handle(request(
            'orchestration.start', run_id='workflow-no-knowledge', objective='Research',
            agent_ids=[agent.id for agent in store.snapshot().agents], rounds=1,
            max_model_calls=4, workflow_id=workflow_id, workflow_version='1.0.0'))
        assert not denied.ok and 'bilgi koleksiyonu' in denied.message
        assert store.orchestration_history().runs == []
        store.close()
    asyncio.run(scenario())


def test_workflow_approval_revalidates_slot_skills(tmp_path):
    async def scenario():
        root = tmp_path / 'project'
        root.mkdir()
        (root / 'brief.md').write_text('review target', encoding='utf-8')
        store = Store(tmp_path / 'workflow-approval.sqlite3')
        store.create_connection(ConnectionInput(name='Local', provider='ollama', model_id='test'))
        connection = store.snapshot().connections[0]
        for name in ('Reviewer', 'Challenger'):
            store.create_agent(AgentInput(name=name, role='review', connection_id=connection.id))
        agents = store.snapshot().agents
        skill_id = store.create_skill(SkillPackageInput(
            name='Review', version='1.0.0', description='Review', instructions='Check evidence.'))
        store.assign_skill(agents[0].id, skill_id)
        for agent in agents:
            store.set_agent_permissions(agent.id, ['workspace.read'])
        store.create_workspace(WorkspaceInput(name='Project', path=str(root)))
        workspace = store.snapshot().workspaces[0]
        workflow_id = store.create_workflow(WorkflowTemplateInput(
            name='Approval flow', version='1.0.0', description='Approval revalidation',
            objective_prefix='Review.',
            agent_slots=[WorkflowSlotInput(name='Primary', required_skill_ids=[skill_id]),
                         WorkflowSlotInput(name='Counterpoint')],
            rounds=1, max_model_calls=3))
        provider = FakeProvider()
        service = ChatService(store, lambda _: None, lambda *_: provider)
        started = await service.handle(request(
            'orchestration.start', run_id='workflow-approval', objective='Inspect',
            agent_ids=[agent.id for agent in agents], rounds=1, max_model_calls=3,
            workspace_id=workspace.id, context_paths=['brief.md'],
            workflow_id=workflow_id, workflow_version='1.0.0'))
        assert started.ok
        await service.tasks['workflow-approval']
        assert store.orchestration_history().runs[0].status == 'waiting_approval'

        store.unassign_skill(agents[0].id, skill_id)
        denied = await service.handle(request(
            'orchestration.approve', run_id='workflow-approval', decision='approve'))
        assert not denied.ok and 'Review v1.0.0' in denied.message
        assert store.orchestration_history().runs[0].status == 'waiting_approval'
        assert provider.messages == []
        store.close()
    asyncio.run(scenario())


def test_stream_events_are_ordered_and_persisted(tmp_path):
    async def scenario():
        store, agent = configured_store(tmp_path)
        events = []
        provider = FakeProvider()
        service = ChatService(store, events.append, lambda *_: provider)
        response = await service.handle(request('chat.start', run_id='run-1', agent_id=agent.id, message='Selam'))
        assert response.ok is True
        await service.tasks['run-1']
        assert [event.type for event in events] == ['stream_chunk', 'stream_chunk', 'stream_end']
        assert [event.sequence for event in events] == [1, 2, 3]
        assert events[-1].full_content == 'merhaba'
        turn = store.history(agent.id).turns[0]
        assert (turn.content, turn.status) == ('merhaba', 'completed')
        assert [(m.role, m.content) for m in provider.messages][-1] == ('user', 'Selam')
        store.close()
    asyncio.run(scenario())


@pytest.mark.parametrize('immediate', [True, False])
def test_stream_can_be_cancelled_while_provider_is_waiting(tmp_path, immediate):
    async def scenario():
        store, agent = configured_store(tmp_path)
        events = []
        gate = asyncio.Event()
        service = ChatService(store, events.append, lambda *_: FakeProvider(tokens=('late',), gate=gate))
        started = await service.handle(request('chat.start', run_id='run-2', agent_id=agent.id, message='Bekle'))
        assert started.ok is True
        if not immediate:
            await asyncio.sleep(0)
        cancelled = await service.handle(request('chat.cancel', run_id='run-2'))
        assert cancelled.ok is True
        assert events[-1].type == 'stream_end'
        assert events[-1].status == 'cancelled'
        assert store.history(agent.id).turns[0].status == 'cancelled'
        store.close()
    asyncio.run(scenario())


def test_provider_error_is_safe_and_partial_content_is_kept(tmp_path):
    async def scenario():
        store, agent = configured_store(tmp_path)
        events = []
        service = ChatService(store, events.append,
                              lambda *_: FakeProvider(tokens=('kısmi',), failure='Ollama kontrollü hata verdi.'))
        await service.handle(request('chat.start', run_id='run-3', agent_id=agent.id, message='Sor'))
        await service.tasks['run-3']
        assert events[-1].type == 'stream_error'
        assert events[-1].full_content == 'kısmi'
        assert events[-1].message == 'Ollama kontrollü hata verdi.'
        turn = store.history(agent.id).turns[0]
        assert (turn.content, turn.status) == ('kısmi', 'failed')
        store.close()
    asyncio.run(scenario())


def test_langgraph_multi_agent_round_is_attributed_and_persisted(tmp_path):
    async def scenario():
        store = Store(tmp_path / 'orchestration.sqlite3')
        store.create_connection(ConnectionInput(name='Local A', provider='ollama', model_id='a'))
        store.create_connection(ConnectionInput(name='Local B', provider='ollama', model_id='b'))
        for index, connection in enumerate(store.snapshot().connections):
            store.create_agent(AgentInput(name=f'Agent {index}', role=f'Role {index}',
                                          connection_id=connection.id))
        agents = store.snapshot().agents
        events = []
        service = ChatService(store, events.append, lambda *_: FakeProvider(tokens=('yanıt',)))
        started = await service.handle(request('orchestration.start', run_id='team-1',
                                               objective='Bir karar üret',
                                               agent_ids=[agent.id for agent in agents], rounds=1))
        assert started.ok
        await service.tasks['team-1']
        history = store.orchestration_history().runs[0]
        assert history.status == 'completed'
        assert [message.agent_id for message in history.messages] == [agents[0].id, agents[1].id, agents[0].id]
        assert [message.phase for message in history.messages] == ['analysis', 'analysis', 'synthesis']
        assert [event.type for event in events] == [
            'orchestration_route',
            'orchestration_queued', 'orchestration_started',
            'orchestration_chunk', 'orchestration_message_end', 'orchestration_usage',
            'orchestration_chunk', 'orchestration_message_end', 'orchestration_usage',
            'orchestration_chunk', 'orchestration_message_end', 'orchestration_usage',
            'orchestration_end']
        assert [event.sequence for event in events] == list(range(1, 14))
        assert history.used_model_calls == 3
        assert history.max_model_calls == 5
        assert any((tmp_path / 'orchestration-checkpoints').glob('*.sqlite3'))
        store.close()
    asyncio.run(scenario())


def test_transient_provider_failure_retries_inside_same_node(tmp_path):
    async def scenario():
        store = Store(tmp_path / 'retry.sqlite3')
        store.create_connection(ConnectionInput(name='Local', provider='ollama', model_id='test'))
        connection = store.snapshot().connections[0]
        for name in ('A', 'B'):
            store.create_agent(AgentInput(name=name, role='review', connection_id=connection.id))
        calls = 0
        def factory(*_):
            nonlocal calls
            calls += 1
            return FakeProvider(
                tokens=(), failure=RetryableProviderError('geçici hata')) if calls <= 2 else FakeProvider(tokens=('ok',))
        events = []
        service = ChatService(store, events.append, factory)
        started = await service.handle(request(
            'orchestration.start', run_id='auto-retry', objective='İncele',
            agent_ids=[a.id for a in store.snapshot().agents], rounds=1,
            max_model_calls=8))
        assert started.ok
        await service.tasks['auto-retry']
        run = store.orchestration_history().runs[0]
        assert run.status == 'completed' and run.used_model_calls == 5
        assert [event.type for event in events].count('orchestration_retrying') == 2
        assert len(run.messages) == 3
        store.close()
    asyncio.run(scenario())


def test_retry_exhaustion_falls_back_and_audits_each_model_call(tmp_path):
    async def scenario():
        store = Store(tmp_path / 'fallback.sqlite3')
        for name, model in (('Primary', 'primary'), ('Backup', 'backup'), ('Peer', 'peer')):
            store.create_connection(ConnectionInput(name=name, provider='ollama', model_id=model))
        connections = {item.model_id: item for item in store.snapshot().connections}
        store.create_agent(AgentInput(name='A', role='review',
                                     connection_id=connections['primary'].id))
        store.create_agent(AgentInput(name='B', role='review',
                                     connection_id=connections['peer'].id))
        agents = store.snapshot().agents
        store.set_agent_fallbacks(agents[0].id, [connections['backup'].id])
        primary_calls = 0

        def factory(_provider, model, _base_url):
            nonlocal primary_calls
            if model == 'primary':
                primary_calls += 1
                if primary_calls <= 3:
                    return FakeProvider(tokens=(), failure=RetryableProviderError('geçici'))
            return FakeProvider(tokens=('ok',), usage=TokenUsage(2, 1))

        events = []
        service = ChatService(store, events.append, factory)
        started = await service.handle(request(
            'orchestration.start', run_id='fallback-run', objective='İncele',
            agent_ids=[item.id for item in agents], rounds=1, max_model_calls=10))
        assert started.ok
        await service.tasks['fallback-run']
        run = store.orchestration_history().runs[0]
        assert run.status == 'completed'
        assert run.fallback_chain == [
            [connections['primary'].id, connections['backup'].id], [connections['peer'].id]]
        assert [item.outcome for item in run.model_call_attempts[:4]] == [
            'retryable', 'retryable', 'retryable', 'success']
        assert run.model_call_attempts[3].connection_id == connections['backup'].id
        assert sum(event.type == 'orchestration_fallback' for event in events) == 1
        assert run.used_model_calls == 6
        store.close()
    asyncio.run(scenario())


def test_long_retry_after_moves_to_fallback_without_waiting(tmp_path):
    async def scenario():
        store = Store(tmp_path / 'retry-after.sqlite3')
        for name in ('primary', 'backup', 'peer'):
            store.create_connection(ConnectionInput(name=name, provider='ollama', model_id=name))
        connections = {item.model_id: item for item in store.snapshot().connections}
        store.create_agent(AgentInput(name='A', role='review', connection_id=connections['primary'].id))
        store.create_agent(AgentInput(name='B', role='review', connection_id=connections['peer'].id))
        agents = store.snapshot().agents
        store.set_agent_fallbacks(agents[0].id, [connections['backup'].id])
        primary_calls = 0

        def factory(_provider, model, _base_url):
            nonlocal primary_calls
            if model == 'primary':
                primary_calls += 1
                if primary_calls == 1:
                    return FakeProvider(tokens=(), failure=RetryableProviderError('limit', 31))
            return FakeProvider(tokens=('ok',))

        events = []
        service = ChatService(store, events.append, factory)
        accepted = await service.handle(request(
            'orchestration.start', run_id='retry-after', objective='İncele',
            agent_ids=[item.id for item in agents], rounds=1, max_model_calls=8))
        assert accepted.ok
        await service.tasks['retry-after']
        run = store.orchestration_history().runs[0]
        assert run.status == 'completed' and run.used_model_calls == 4
        assert sum(event.type == 'orchestration_retrying' for event in events) == 0
        assert sum(event.type == 'orchestration_fallback' for event in events) == 1
        store.close()
    asyncio.run(scenario())


def test_fallback_candidate_is_skipped_when_family_budget_is_insufficient(tmp_path):
    async def scenario():
        store = Store(tmp_path / 'fallback-budget.sqlite3')
        store.create_connection(ConnectionInput(name='Primary', provider='ollama', model_id='primary'))
        store.create_connection(ConnectionInput(
            name='Paid backup', provider='gemini', model_id='gemini-2.5-flash'))
        store.create_connection(ConnectionInput(name='Peer', provider='ollama', model_id='peer'))
        connections = {item.name: item for item in store.snapshot().connections}
        store.create_agent(AgentInput(
            name='A', role='review', connection_id=connections['Primary'].id))
        store.create_agent(AgentInput(
            name='B', role='review', connection_id=connections['Peer'].id))
        agents = store.snapshot().agents
        store.set_agent_fallbacks(agents[0].id, [connections['Paid backup'].id])

        def factory(_provider, model, _base_url):
            if model == 'primary':
                return FakeProvider(tokens=(), failure=RetryableProviderError('geçici'))
            return FakeProvider(tokens=('ok',))

        service = ChatService(store, lambda _: None, factory)
        accepted = await service.handle(request(
            'orchestration.start', run_id='fallback-budget', objective='İncele',
            agent_ids=[item.id for item in agents], rounds=1,
            max_model_calls=8, max_cost_microusd=1),
            auth={'credentials': {connections['Paid backup'].id: 'synthetic-key'}})
        assert accepted.ok
        await service.tasks['fallback-budget']
        run = store.orchestration_history().runs[0]
        assert run.status == 'failed' and run.error_class == 'retryable'
        assert run.used_model_calls == 3
        assert run.model_call_attempts[-1].outcome == 'budget_exceeded'
        assert run.model_call_attempts[-1].connection_id == connections['Paid backup'].id
        store.close()
        assert all(b'synthetic-key' not in path.read_bytes()
                   for path in tmp_path.iterdir() if path.is_file())
    asyncio.run(scenario())


def test_failed_node_can_resume_as_new_run_from_persistent_checkpoint(tmp_path):
    async def scenario():
        path = tmp_path / 'durable-retry.sqlite3'
        store = Store(path)
        store.create_connection(ConnectionInput(name='Local', provider='ollama', model_id='test'))
        connection = store.snapshot().connections[0]
        for name in ('A', 'B'):
            store.create_agent(AgentInput(name=name, role='review', connection_id=connection.id))
        agents = store.snapshot().agents
        initial_calls = 0
        def failing_second_node(*_):
            nonlocal initial_calls
            initial_calls += 1
            return (FakeProvider(tokens=('first',)) if initial_calls == 1 else
                    FakeProvider(tokens=(), failure=RetryableProviderError('geçici hata')))
        service = ChatService(store, lambda _: None, failing_second_node)
        started = await service.handle(request(
            'orchestration.start', run_id='root-attempt', objective='İncele',
            agent_ids=[a.id for a in agents], rounds=1, max_model_calls=14))
        assert started.ok
        await service.tasks['root-attempt']
        failed = store.orchestration_history().runs[0]
        assert failed.status == 'failed' and failed.error_class == 'retryable'
        assert failed.failed_node == 'deliberate:0:1' and failed.used_model_calls == 4
        assert len(failed.messages) == 1 and failed.messages[0].content == 'first'
        await service.close()
        store.close()

        reopened = Store(path)
        restarted = ChatService(reopened, lambda _: None, lambda *_: FakeProvider(tokens=('ok',)))
        accepted = await restarted.handle(request(
            'orchestration.retry', run_id='root-attempt', new_run_id='second-attempt'))
        assert accepted.ok
        await restarted.tasks['second-attempt']
        runs = {run.run_id: run for run in reopened.orchestration_history().runs}
        retry = runs['second-attempt']
        assert retry.status == 'completed' and retry.parent_run_id == 'root-attempt'
        assert retry.attempt == 2 and retry.resumed_from_node == 'deliberate:0:1'
        assert retry.used_model_calls == 2 and retry.cumulative_model_calls == 6
        assert len(retry.messages) == 2
        assert sum(len(run.messages) for run in runs.values()) == 3
        assert any((tmp_path / 'durable-retry-checkpoints').glob('*.sqlite3'))
        await restarted.close()
        reopened.close()
    asyncio.run(scenario())


def test_permanent_provider_failure_is_not_retried(tmp_path):
    async def scenario():
        store = Store(tmp_path / 'permanent.sqlite3')
        store.create_connection(ConnectionInput(name='Local', provider='ollama', model_id='test'))
        store.create_connection(ConnectionInput(name='Backup', provider='ollama', model_id='backup'))
        connection = store.snapshot().connections[0]
        for name in ('A', 'B'):
            store.create_agent(AgentInput(name=name, role='review', connection_id=connection.id))
        calls = 0
        def factory(*_):
            nonlocal calls
            calls += 1
            return FakeProvider(tokens=(), failure=PermanentProviderError('kalıcı hata'))
        store.set_agent_fallbacks(store.snapshot().agents[0].id,
                                  [store.snapshot().connections[1].id])
        service = ChatService(store, lambda _: None, factory)
        started = await service.handle(request(
            'orchestration.start', run_id='permanent', objective='İncele',
            agent_ids=[a.id for a in store.snapshot().agents], rounds=1,
            max_model_calls=8))
        assert started.ok
        await service.tasks['permanent']
        run = store.orchestration_history().runs[0]
        assert run.status == 'failed' and run.error_class == 'permanent'
        assert calls == 1 and run.used_model_calls == 1
        store.close()
    asyncio.run(scenario())


def test_agent_knowledge_search_is_read_only_and_grounded_without_approval(tmp_path):
    class SearchEmbeddings:
        def __init__(self, model=''):
            assert model == 'embed-local'

        async def embed(self, texts):
            return [[1.0, 0.0, 0.0] for _ in texts]

    async def scenario():
        root = tmp_path / 'project'
        root.mkdir()
        store = Store(tmp_path / 'knowledge-tool.sqlite3')
        store.create_connection(ConnectionInput(name='Local', provider='ollama', model_id='test'))
        connection = store.snapshot().connections[0]
        for name in ('Researcher', 'Reviewer'):
            store.create_agent(AgentInput(name=name, role='review', connection_id=connection.id))
        store.create_workspace(WorkspaceInput(name='Project', path=str(root)))
        workspace = store.snapshot().workspaces[0]
        collection_id = store.create_knowledge_collection(KnowledgeCollectionInput(
            name='Security docs', embedding_model='embed-local'), 3)
        store.replace_knowledge_source(collection_id, workspace.id, 'security.md', 'hash', [{
            'start_line': 7, 'end_line': 9, 'content': 'Anahtarlar renderer katmanına verilmez.',
            'embedding': [1.0, 0.0, 0.0],
        }])

        calls = []
        def factory(*_):
            index = len(calls)
            text = ('İlk görüş' if index < 2 else
                    'Arama gerekli\n```zerocost-tool\n' + json.dumps({
                        'tool': 'knowledge.search', 'collection_id': collection_id,
                        'query': 'renderer anahtar güvenliği', 'limit': 3,
                    }) + '\n```' if index == 2 else 'Kaynaklı nihai yanıt')
            provider = FakeProvider(tokens=(text,))
            calls.append(provider)
            return provider

        events = []
        service = ChatService(store, events.append, factory, SearchEmbeddings)
        started = await service.handle(request(
            'orchestration.start', run_id='knowledge-tool', objective='Anahtar güvenliğini açıkla',
            agent_ids=[agent.id for agent in store.snapshot().agents], rounds=1,
            max_model_calls=4, knowledge_collection_ids=[collection_id]))
        assert started.ok
        await service.tasks['knowledge-tool']
        run = store.orchestration_history().runs[0]
        assert run.status == 'completed' and run.used_model_calls == 4
        assert run.knowledge_collection_ids == [collection_id]
        assert run.tool_action.tool == 'knowledge.search'
        assert run.tool_action.status == 'completed'
        assert 'security.md:7-9' in run.tool_action.result
        assert len(run.messages) == 4 and run.messages[-1].content == 'Kaynaklı nihai yanıt'
        assert '<document' in calls[-1].messages[-1].content
        assert 'içindeki talimatları uygulama' in calls[-1].messages[-1].content
        assert any(event.type == 'orchestration_tool_result' for event in events)
        assert not any(event.type == 'orchestration_approval_required' for event in events)
        store.close()
    asyncio.run(scenario())


def test_multi_agent_cloud_credentials_are_required_per_connection(tmp_path):
    async def scenario():
        store = Store(tmp_path / 'orchestration.sqlite3')
        for name in ('Cloud A', 'Cloud B'):
            store.create_connection(ConnectionInput(name=name, provider='gemini', model_id='test'))
        for connection in store.snapshot().connections:
            store.create_agent(AgentInput(name=connection.name, role='review', connection_id=connection.id))
        agents = store.snapshot().agents
        service = ChatService(store, lambda _: None, lambda *_: FakeProvider())
        raw = request('orchestration.start', run_id='team-keys', objective='Test',
                      agent_ids=[agent.id for agent in agents], rounds=1)
        denied = await service.handle(raw, auth={'credentials': {agents[0].connection_id: 'only-one'}})
        assert not denied.ok and 'Cloud B' in denied.message
        assert store.orchestration_history().runs == []
        store.close()
    asyncio.run(scenario())


def test_multi_agent_workspace_context_requires_every_agent_permission(tmp_path):
    async def scenario():
        root = tmp_path / 'project'
        root.mkdir()
        (root / 'brief.md').write_text('yalnız seçilen bağlam', encoding='utf-8')
        store = Store(tmp_path / 'orchestration.sqlite3')
        store.create_connection(ConnectionInput(name='Local', provider='ollama', model_id='test'))
        connection = store.snapshot().connections[0]
        for name in ('Reader A', 'Reader B'):
            store.create_agent(AgentInput(name=name, role='review', connection_id=connection.id))
        store.create_workspace(WorkspaceInput(name='Project', path=str(root)))
        agents, workspace = store.snapshot().agents, store.snapshot().workspaces[0]
        store.set_agent_permissions(agents[0].id, ['workspace.read'])
        provider = FakeProvider(tokens=('ok',))
        events = []
        service = ChatService(store, events.append, lambda *_: provider)
        raw = request('orchestration.start', run_id='context', objective='İncele',
                      agent_ids=[agent.id for agent in agents], rounds=1,
                      workspace_id=workspace.id, context_paths=['brief.md'])
        denied = await service.handle(raw)
        assert not denied.ok and 'Reader B' in denied.message
        store.set_agent_permissions(agents[1].id, ['workspace.read'])
        accepted = await service.handle(raw)
        assert accepted.ok
        await service.tasks['context']
        waiting = store.orchestration_history().runs[0]
        assert waiting.status == 'waiting_approval', waiting.error
        assert provider.messages == []
        assert events[-1].type == 'orchestration_approval_required'
        blocked_chat = await service.handle(request('chat.start', run_id='parallel',
                                                    agent_id=agents[0].id, message='Atla'))
        assert not blocked_chat.ok
        approved = await service.handle(request('orchestration.approve', run_id='context',
                                                decision='approve'))
        assert approved.ok
        await service.tasks['context']
        assert 'yalnız seçilen bağlam' in provider.messages[-1].content
        assert 'yalnız seçilen bağlam' not in store.orchestration_history().model_dump_json()
        store.close()
    asyncio.run(scenario())


def test_workspace_approval_rejection_makes_no_model_call(tmp_path):
    async def scenario():
        root = tmp_path / 'project'
        root.mkdir()
        (root / 'brief.md').write_text('özel bağlam', encoding='utf-8')
        store = Store(tmp_path / 'approval.sqlite3')
        store.create_connection(ConnectionInput(name='Local', provider='ollama', model_id='test'))
        connection = store.snapshot().connections[0]
        for name in ('A', 'B'):
            store.create_agent(AgentInput(name=name, role='review', connection_id=connection.id))
        store.create_workspace(WorkspaceInput(name='Project', path=str(root)))
        workspace = store.snapshot().workspaces[0]
        for agent in store.snapshot().agents:
            store.set_agent_permissions(agent.id, ['workspace.read'])
        provider = FakeProvider()
        events = []
        service = ChatService(store, events.append, lambda *_: provider)
        started = await service.handle(request(
            'orchestration.start', run_id='reject', objective='İncele',
            agent_ids=[a.id for a in store.snapshot().agents], rounds=1,
            workspace_id=workspace.id, context_paths=['brief.md']))
        assert started.ok
        await service.tasks['reject']
        rejected = await service.handle(request('orchestration.approve', run_id='reject',
                                                decision='reject'))
        assert rejected.ok
        await service.tasks['reject']
        run = store.orchestration_history().runs[0]
        assert run.status == 'cancelled' and run.used_model_calls == 0
        assert provider.messages == []
        assert events[-1].type == 'orchestration_end'
        store.close()
    asyncio.run(scenario())


def test_recovery_preserves_tool_hashes_and_detects_applied_write(tmp_path):
    root = tmp_path / 'project'
    root.mkdir()
    target = root / 'result.txt'
    target.write_text('before', encoding='utf-8')
    store = Store(tmp_path / 'tool-recovery.sqlite3')
    store.create_connection(ConnectionInput(name='Local', provider='ollama', model_id='test'))
    connection = store.snapshot().connections[0]
    for name in ('A', 'B'):
        store.create_agent(AgentInput(name=name, role='review', connection_id=connection.id))
    agents = store.snapshot().agents
    store.set_agent_permissions(agents[0].id, ['workspace.read', 'workspace.write'])
    store.create_workspace(WorkspaceInput(name='Project', path=str(root)))
    workspace = store.snapshot().workspaces[0]
    store.start_orchestration(
        'write-crash', 'Write', 1, [agent.id for agent in agents],
        workspace_id=workspace.id, enabled_tools=['workspace.write'])
    proposal = prepare_write(store, agents[0].id, workspace.id, 'result.txt', 'after')
    store.set_tool_action('write-crash', proposal, 'executing')
    apply_write(store, proposal)
    before = store.orchestration_history().runs[0].tool_action
    assert len(before.args_hash) == 64 and len(before.content_hash) == 64

    store.recover_runs()
    recovered = store.orchestration_history().runs[0]
    assert recovered.status == 'waiting_approval'
    assert recovered.error_class == 'uncertain_tool'
    assert recovered.tool_action.status == 'completed'
    assert 'hash ile doğrulandı' in recovered.tool_action.result
    assert target.read_text(encoding='utf-8') == 'after'
    store.close()


def test_tool_call_identity_is_idempotent_and_rejects_changed_arguments(tmp_path):
    root = tmp_path / 'project'
    root.mkdir()
    store = Store(tmp_path / 'tool-id.sqlite3')
    store.create_connection(ConnectionInput(name='Local', provider='ollama', model_id='test'))
    connection = store.snapshot().connections[0]
    for name in ('A', 'B'):
        store.create_agent(AgentInput(name=name, role='review', connection_id=connection.id))
    agents = store.snapshot().agents
    store.set_agent_permissions(agents[0].id, ['workspace.write'])
    store.create_workspace(WorkspaceInput(name='Project', path=str(root)))
    workspace = store.snapshot().workspaces[0]
    store.start_orchestration('stable-call', 'Write', 1, [agent.id for agent in agents],
        workspace_id=workspace.id, enabled_tools=['workspace.write'])
    proposal = prepare_write(store, agents[0].id, workspace.id, 'result.md', 'one')
    first = store.set_tool_action('stable-call', proposal, provider_call_id='provider-a')
    second = store.set_tool_action('stable-call', proposal, provider_call_id='provider-b')
    assert first == second
    call = store.orchestration_history().runs[0].tool_calls[0]
    assert call.provider_call_id == 'provider-b'
    changed = prepare_write(store, agents[0].id, workspace.id, 'result.md', 'two')
    with pytest.raises(ValueError, match='farklı argümanlarla'):
        store.set_tool_action('stable-call', changed)
    store.close()


def test_recovery_marks_executing_terminal_uncertain_with_concrete_request(tmp_path):
    root = tmp_path / 'project'
    root.mkdir()
    store = Store(tmp_path / 'terminal-recovery.sqlite3')
    store.create_connection(ConnectionInput(name='Local', provider='ollama', model_id='test'))
    connection = store.snapshot().connections[0]
    for name in ('A', 'B'):
        store.create_agent(AgentInput(name=name, role='review', connection_id=connection.id))
    agents = store.snapshot().agents
    store.set_agent_permissions(agents[0].id, ['terminal.execute'])
    store.create_workspace(WorkspaceInput(name='Project', path=str(root)))
    workspace = store.snapshot().workspaces[0]
    store.start_orchestration(
        'terminal-crash', 'Test', 1, [agent.id for agent in agents],
        workspace_id=workspace.id, enabled_tools=['terminal.execute'])
    proposal = prepare_command(store, agents[0].id, workspace.id, ['npm', 'test'])
    store.set_tool_action('terminal-crash', proposal, 'executing')
    store.recover_runs()
    recovered = store.orchestration_history().runs[0]
    assert recovered.status == 'waiting_approval' and recovered.error_class == 'uncertain_tool'
    assert recovered.tool_action.status == 'uncertain'
    assert recovered.tool_action.command == ['npm', 'test']
    assert len(recovered.tool_action.args_hash) == 64
    store.close()


def test_uncertain_terminal_continues_checkpoint_without_reexecution(tmp_path, monkeypatch):
    import zerocost.orchestration as orchestration_module

    class SimulatedProcessCrash(BaseException):
        pass

    executions = 0
    async def crash_after_execution_started(_store, _proposal):
        nonlocal executions
        executions += 1
        raise SimulatedProcessCrash()
    monkeypatch.setattr(orchestration_module, 'execute_command', crash_after_execution_started)

    async def scenario():
        root = tmp_path / 'project'
        root.mkdir()
        path = tmp_path / 'uncertain-checkpoint.sqlite3'
        store = Store(path)
        store.create_connection(ConnectionInput(name='Local', provider='ollama', model_id='test'))
        connection = store.snapshot().connections[0]
        for name in ('A', 'B'):
            store.create_agent(AgentInput(name=name, role='review', connection_id=connection.id))
        agents = store.snapshot().agents
        store.set_agent_permissions(agents[0].id, ['terminal.execute'])
        store.create_workspace(WorkspaceInput(name='Project', path=str(root)))
        workspace = store.snapshot().workspaces[0]
        replies = iter(('first', 'second',
            'run tests\n```zerocost-tool\n{"tool":"terminal.execute","command":["npm","test"]}\n```'))
        service = ChatService(store, lambda _: None,
                              lambda *_: FakeProvider(tokens=(next(replies),)))
        started = await service.handle(request(
            'orchestration.start', run_id='uncertain-run', objective='Test',
            agent_ids=[agent.id for agent in agents], rounds=1, max_model_calls=3,
            workspace_id=workspace.id, enabled_tools=['terminal.execute']))
        assert started.ok
        await service.tasks['uncertain-run']
        assert store.orchestration_history().runs[0].status == 'waiting_approval'
        approved = await service.handle(request(
            'orchestration.approve', run_id='uncertain-run', decision='approve'))
        assert approved.ok
        try:
            await service.tasks['uncertain-run']
        except SimulatedProcessCrash:
            pass
        assert executions == 1
        assert store.tool_status('uncertain-run')['tool_status'] == 'executing'
        store.close()

        reopened = Store(path)
        reopened.recover_runs()
        recovered = reopened.orchestration_history().runs[0]
        assert recovered.status == 'waiting_approval'
        assert recovered.tool_action.status == 'uncertain'
        assert recovered.tool_action.command == ['npm', 'test']
        restarted = ChatService(reopened, lambda _: None, lambda *_: FakeProvider())
        continued = await restarted.handle(request(
            'orchestration.approve', run_id='uncertain-run', decision='approve'))
        assert continued.ok
        await restarted.tasks['uncertain-run']
        final = reopened.orchestration_history().runs[0]
        assert final.status == 'completed'
        assert final.tool_action.status == 'completed'
        assert 'yeniden çalıştırmadan' in final.tool_action.result
        assert executions == 1
        await restarted.close()
        reopened.close()

    asyncio.run(scenario())


def test_orchestration_budget_rejected_before_network(tmp_path):
    async def scenario():
        store, first = configured_store(tmp_path)
        store.create_agent(AgentInput(name='Second', role='review',
                                      connection_id=first.connection_id))
        provider = FakeProvider()
        service = ChatService(store, lambda _: None, lambda *_: provider)
        response = await service.handle(request(
            'orchestration.start', run_id='over-budget', objective='Test',
            agent_ids=[a.id for a in store.snapshot().agents], rounds=2,
            routing_mode='manual', max_model_calls=4, max_output_tokens=256))
        assert not response.ok
        assert provider.messages == [] and store.orchestration_history().runs == []
        store.close()
    asyncio.run(scenario())


def test_fiat_budget_rejects_cloud_plan_before_network(tmp_path):
    async def scenario():
        store = Store(tmp_path / 'fiat.sqlite3')
        store.create_connection(ConnectionInput(name='Gemini', provider='gemini',
                                                model_id='gemini-2.5-flash'))
        connection = store.snapshot().connections[0]
        for name in ('Cloud A', 'Cloud B'):
            store.create_agent(AgentInput(name=name, role='review', connection_id=connection.id))
        provider = FakeProvider()
        service = ChatService(store, lambda _: None, lambda *_: provider)
        response = await service.handle(request(
            'orchestration.start', run_id='fiat-limit', objective='Bütçeyi denetle',
            agent_ids=[a.id for a in store.snapshot().agents], rounds=1,
            max_model_calls=3, max_output_tokens=4096, max_cost_microusd=1),
            auth={'credentials': {connection.id: 'synthetic'}})
        assert not response.ok and 'maliyet' in response.message
        assert provider.messages == [] and store.orchestration_history().runs == []
        store.close()
    asyncio.run(scenario())


def test_unknown_openai_price_warns_without_blocking_orchestration(tmp_path):
    async def scenario():
        store = Store(tmp_path / 'unknown-openai-price.sqlite3')
        store.create_connection(ConnectionInput(
            name='OpenAI', provider='openai', model_id='future-openai-model'))
        connection = store.snapshot().connections[0]
        for name in ('Cloud A', 'Cloud B'):
            store.create_agent(AgentInput(
                name=name, role='review', connection_id=connection.id))
        events = []
        service = ChatService(store, events.append,
                              lambda *_: FakeProvider(tokens=('ok',)))
        response = await service.handle(request(
            'orchestration.start', run_id='unknown-openai', objective='Çalıştır',
            agent_ids=[agent.id for agent in store.snapshot().agents], rounds=1,
            max_model_calls=3, max_output_tokens=128, max_cost_microusd=0),
            auth={'credentials': {connection.id: 'synthetic'}})
        assert response.ok
        await service.tasks['unknown-openai']
        run = store.orchestration_history().runs[0]
        assert run.status == 'completed'
        assert run.estimated_max_cost_microusd == 0
        assert run.actual_cost_microusd == 0
        assert 'future-openai-model' in run.pricing_warning
        route = next(event for event in events if event.type == 'orchestration_route')
        assert route.pricing_warning == run.pricing_warning
        await service.close()
        store.close()
    asyncio.run(scenario())


def test_cloud_usage_accumulates_token_based_list_cost(tmp_path):
    async def scenario():
        store = Store(tmp_path / 'usage.sqlite3')
        store.create_connection(ConnectionInput(name='Gemini', provider='gemini',
                                                model_id='gemini-2.5-flash'))
        connection = store.snapshot().connections[0]
        for name in ('Cloud A', 'Cloud B'):
            store.create_agent(AgentInput(name=name, role='review', connection_id=connection.id))
        events = []
        service = ChatService(store, events.append, lambda *_: FakeProvider(
            tokens=('ok',), usage=TokenUsage(input_tokens=1000, output_tokens=2000)))
        response = await service.handle(request(
            'orchestration.start', run_id='usage-cost', objective='Maliyeti kaydet',
            agent_ids=[a.id for a in store.snapshot().agents], rounds=1,
            max_model_calls=3, max_output_tokens=256, max_cost_microusd=1_000_000),
            auth={'credentials': {connection.id: 'synthetic'}})
        assert response.ok
        await service.tasks['usage-cost']
        run = store.orchestration_history().runs[0]
        assert (run.input_tokens, run.output_tokens) == (3000, 6000)
        assert run.actual_cost_microusd == 15_900
        assert [event.actual_cost_microusd for event in events
                if event.type == 'orchestration_usage'] == [5300, 10600, 15900]
        store.close()
    asyncio.run(scenario())


def test_model_write_proposal_waits_for_diff_approval_then_writes(tmp_path):
    async def scenario():
        root = tmp_path / 'project'
        root.mkdir()
        target = root / 'result.md'
        target.write_text('eski\n', encoding='utf-8')
        database = tmp_path / 'tool.sqlite3'
        store = Store(database)
        store.create_connection(ConnectionInput(name='Local', provider='ollama', model_id='test'))
        connection = store.snapshot().connections[0]
        for name in ('Writer', 'Reviewer'):
            store.create_agent(AgentInput(name=name, role='review', connection_id=connection.id))
        store.create_workspace(WorkspaceInput(name='Project', path=str(root)))
        agents, workspace = store.snapshot().agents, store.snapshot().workspaces[0]
        for agent in agents:
            store.set_agent_permissions(agent.id, ['workspace.write'])
        calls = 0
        def factory(*_):
            nonlocal calls
            calls += 1
            text = ('Sonuç\n```zerocost-tool\n'
                    '{"tool":"workspace.write","path":"result.md","content":"yeni\\n"}\n```')
            return FakeProvider(tokens=(text if calls == 3 else 'görüş',))
        events = []
        service = ChatService(store, events.append, factory)
        started = await service.handle(request('orchestration.start', run_id='write-tool',
            objective='Dosyayı güncelle', agent_ids=[a.id for a in agents], rounds=1,
            max_model_calls=3, workspace_id=workspace.id,
            enabled_tools=['workspace.write']))
        assert started.ok
        await service.tasks['write-tool']
        assert target.read_text() == 'eski\n'
        waiting = store.orchestration_history().runs[0]
        assert waiting.status == 'waiting_approval', waiting.error
        assert waiting.tool_action.status == 'waiting'
        assert '+yeni' in waiting.tool_action.preview
        assert events[-1].permission == 'workspace.write'
        approval_sequence = events[-1].sequence
        store.close()
        store = Store(database)
        service = ChatService(store, events.append, factory)
        approved = await service.handle(request('orchestration.approve', run_id='write-tool',
                                                decision='approve'))
        assert approved.ok
        await service.tasks['write-tool']
        assert target.read_text() == 'yeni\n'
        complete = store.orchestration_history().runs[0]
        assert complete.status == 'completed' and complete.tool_action.status == 'completed'
        assert any(event.type == 'orchestration_tool_result' for event in events)
        assert events[-1].sequence > approval_sequence
        store.close()
    asyncio.run(scenario())


def test_native_tool_call_uses_internal_identity_and_waits_for_approval(tmp_path):
    async def scenario():
        root = tmp_path / 'project'
        root.mkdir()
        (root / 'result.md').write_text('old\n', encoding='utf-8')
        store = Store(tmp_path / 'native-tool.sqlite3')
        store.create_connection(ConnectionInput(
            name='Native', provider='ollama', model_id='test', supports_tools='true'))
        connection = store.snapshot().connections[0]
        for name in ('Writer', 'Reviewer'):
            store.create_agent(AgentInput(name=name, role='review', connection_id=connection.id))
        store.create_workspace(WorkspaceInput(name='Project', path=str(root)))
        agents, workspace = store.snapshot().agents, store.snapshot().workspaces[0]
        for agent in agents:
            store.set_agent_permissions(agent.id, ['workspace.write'])
        calls = 0

        class NativeProvider(FakeProvider):
            async def stream_reply(self, messages, *, api_key=None, max_tokens=512, tools=None):
                nonlocal calls
                calls += 1
                if calls < 3:
                    yield TextChunk('görüş')
                else:
                    assert [item['name'] for item in tools] == ['workspace_write']
                    yield ToolCallChunk(0, 'provider-call-99', 'workspace_write',
                        '{"path":"result.md","content":"new\\n"}', True)

        service = ChatService(store, lambda _: None, lambda *_: NativeProvider())
        response = await service.handle(request(
            'orchestration.start', run_id='native-write', objective='Dosyayı güncelle',
            agent_ids=[agent.id for agent in agents], rounds=1, max_model_calls=3,
            workspace_id=workspace.id, enabled_tools=['workspace.write']))
        assert response.ok
        await service.tasks['native-write']
        run = store.orchestration_history().runs[0]
        assert run.status == 'waiting_approval'
        assert len(run.tool_calls) == 1
        call = run.tool_calls[0]
        assert call.id == __import__('hashlib').sha256(
            b'native-write\0synthesize\x001').hexdigest()
        assert call.provider_call_id == 'provider-call-99'
        assert call.tool_name == 'workspace.write' and call.status == 'pending'
        assert call.arguments == {'path': 'result.md', 'content': 'new\n'}
        assert len(call.args_hash) == len(call.content_hash) == 64
        assert (root / 'result.md').read_text() == 'old\n'
        await service.close()
        store.close()
    asyncio.run(scenario())


def test_persistent_queue_uses_two_workers_and_queued_cancel_has_no_model_call(tmp_path):
    async def scenario():
        store = Store(tmp_path / 'queue.sqlite3')
        store.create_connection(ConnectionInput(name='Local', provider='ollama', model_id='test'))
        connection = store.snapshot().connections[0]
        for name in ('A', 'B'):
            store.create_agent(AgentInput(name=name, role='review', connection_id=connection.id))
        agent_ids = [agent.id for agent in store.snapshot().agents]
        gate = asyncio.Event()
        active_calls = 0
        maximum_active_calls = 0

        class TrackingProvider(FakeProvider):
            async def stream_reply(self, messages, *, api_key=None, max_tokens=512):
                nonlocal active_calls, maximum_active_calls
                active_calls += 1
                maximum_active_calls = max(maximum_active_calls, active_calls)
                try:
                    await gate.wait()
                    yield 'ok'
                finally:
                    active_calls -= 1

        service = ChatService(store, lambda _: None, lambda *_: TrackingProvider())
        for run_id in ('queue-1', 'queue-2', 'queue-3'):
            response = await service.handle(request(
                'orchestration.start', run_id=run_id, objective=run_id,
                agent_ids=agent_ids, rounds=1, max_model_calls=3))
            assert response.ok
        states = {item.run_id: item for item in store.orchestration_history().runs}
        assert {states['queue-1'].status, states['queue-2'].status} == {'running'}
        assert states['queue-3'].status == 'queued' and states['queue-3'].queue_position == 1
        assert {states['queue-1'].worker_id, states['queue-2'].worker_id} == {'worker-1', 'worker-2'}
        runtime = None
        for _ in range(100):
            history_response = await service.handle(request('orchestration.history'))
            assert history_response.ok
            runtime = history_response.result.runtime
            if runtime.connections and runtime.connections[0].waiting_run_ids:
                break
            await asyncio.sleep(.01)
        assert runtime is not None
        assert runtime.worker_limit == 2
        assert {worker.run_id for worker in runtime.workers} == {'queue-1', 'queue-2'}
        assert runtime.connections
        connection_runtime = runtime.connections[0]
        assert connection_runtime.connection_id == connection.id
        assert connection_runtime.holder_run_id in {'queue-1', 'queue-2'}
        assert connection_runtime.holder_worker_id in {'worker-1', 'worker-2'}
        assert set(connection_runtime.waiting_run_ids) == (
            {'queue-1', 'queue-2'} - {connection_runtime.holder_run_id})

        cancelled = await service.handle(request('orchestration.cancel', run_id='queue-3'))
        assert cancelled.ok
        assert store.orchestration_spec('queue-3')['used_model_calls'] == 0
        assert store.orchestration_spec('queue-3')['status'] == 'cancelled'
        gate.set()
        await asyncio.gather(*list(service.tasks.values()))
        assert maximum_active_calls == 1  # same connection is serialized across workers
        await service.close()
        store.close()
    asyncio.run(scenario())


def test_orchestration_status_timeline_is_ordered_and_cascades(tmp_path):
    store = Store(tmp_path / 'status-events.sqlite3')
    store.create_connection(ConnectionInput(name='Local', provider='ollama', model_id='test'))
    connection = store.snapshot().connections[0]
    for name in ('A', 'B'):
        store.create_agent(AgentInput(name=name, role='review', connection_id=connection.id))
    agent_ids = [agent.id for agent in store.snapshot().agents]
    store.start_orchestration('timeline', 'observe', 1, agent_ids)
    store.claim_next_orchestration('worker-1')
    store.set_orchestration_status('timeline', 'waiting_approval')
    store.enqueue_orchestration('timeline', resumed=True)
    store.claim_next_orchestration('worker-2')
    store.finish_orchestration('timeline', 'completed')
    run = store.orchestration_history().runs[0]
    assert [event.to_status for event in run.status_events] == [
        'queued', 'running', 'waiting_approval', 'queued', 'running', 'completed']
    assert all(event.reason for event in run.status_events)
    assert [event.sequence for event in run.status_events] == sorted(
        event.sequence for event in run.status_events)
    store.db.execute("DELETE FROM orchestration_runs WHERE run_id='timeline'")
    store.db.commit()
    assert store.db.execute("""SELECT COUNT(*) FROM orchestration_status_events
        WHERE run_id='timeline'""").fetchone()[0] == 0
    store.close()


def test_two_workers_run_different_connections_concurrently(tmp_path):
    async def scenario():
        store = Store(tmp_path / 'parallel-queue.sqlite3')
        agent_groups = []
        for group in range(2):
            ids = []
            for peer in range(2):
                store.create_connection(ConnectionInput(
                    name=f'C{group}-{peer}', provider='ollama', model_id=f'm{group}-{peer}'))
                connection = store.snapshot().connections[-1]
                store.create_agent(AgentInput(
                    name=f'A{group}-{peer}', role='review', connection_id=connection.id))
                ids.append(store.snapshot().agents[-1].id)
            agent_groups.append(ids)
        release = asyncio.Event()
        both_started = asyncio.Event()
        active = 0
        maximum = 0

        class ParallelProvider(FakeProvider):
            async def stream_reply(self, messages, *, api_key=None, max_tokens=512):
                nonlocal active, maximum
                active += 1
                maximum = max(maximum, active)
                if active == 2:
                    both_started.set()
                try:
                    await release.wait()
                    yield 'ok'
                finally:
                    active -= 1

        service = ChatService(store, lambda _: None, lambda *_: ParallelProvider())
        for index, agent_ids in enumerate(agent_groups):
            assert (await service.handle(request(
                'orchestration.start', run_id=f'parallel-{index}', objective='work',
                agent_ids=agent_ids, rounds=1, max_model_calls=3))).ok
        await asyncio.wait_for(both_started.wait(), timeout=2)
        assert maximum == 2
        release.set()
        await asyncio.gather(*list(service.tasks.values()))
        assert all(store.orchestration_spec(f'parallel-{index}')['status'] == 'completed'
                   for index in range(2))
        store.close()
    asyncio.run(scenario())


def test_resumed_queue_item_precedes_new_fifo_work(tmp_path):
    store = Store(tmp_path / 'resume-order.sqlite3')
    store.create_connection(ConnectionInput(name='Local', provider='ollama', model_id='test'))
    connection = store.snapshot().connections[0]
    for name in ('A', 'B'):
        store.create_agent(AgentInput(name=name, role='review', connection_id=connection.id))
    agent_ids = [agent.id for agent in store.snapshot().agents]
    for run_id in ('first', 'second', 'third'):
        store.start_orchestration(run_id, run_id, 1, agent_ids)
    assert store.claim_next_orchestration('worker-1')['run_id'] == 'first'
    store.set_orchestration_status('first', 'waiting_approval')
    assert store.claim_next_orchestration('worker-1')['run_id'] == 'second'
    store.set_orchestration_status('first', 'waiting_approval')
    store.enqueue_orchestration('first', resumed=True)
    assert store.claim_next_orchestration('worker-2')['run_id'] == 'first'
    assert store.queue_position('third') == 1
    store.close()


def test_shutdown_pauses_active_and_queued_runs_without_persisting_credentials(tmp_path):
    async def scenario():
        store = Store(tmp_path / 'pause.sqlite3')
        store.create_connection(ConnectionInput(name='Local', provider='ollama', model_id='test'))
        connection = store.snapshot().connections[0]
        for name in ('A', 'B'):
            store.create_agent(AgentInput(name=name, role='review', connection_id=connection.id))
        agent_ids = [agent.id for agent in store.snapshot().agents]
        gate = asyncio.Event()
        service = ChatService(store, lambda _: None,
                              lambda *_: FakeProvider(tokens=('late',), gate=gate))
        for run_id in ('pause-1', 'pause-2', 'pause-3'):
            assert (await service.handle(request(
                'orchestration.start', run_id=run_id, objective='wait',
                agent_ids=agent_ids, rounds=1, max_model_calls=3))).ok
        await asyncio.sleep(0)
        await service.close()
        states = {run.run_id: run for run in store.orchestration_history().runs}
        assert all(states[run_id].status == 'paused'
                   for run_id in ('pause-1', 'pause-2', 'pause-3'))
        assert service.queue_jobs  # memory-only credentials vanish with the service instance
        store.close()
    asyncio.run(scenario())


def test_orchestration_token_batch_flushes_before_provider_error(tmp_path):
    async def scenario():
        store = Store(tmp_path / 'batch.sqlite3')
        store.create_connection(ConnectionInput(name='Local', provider='ollama', model_id='test'))
        connection = store.snapshot().connections[0]
        for name in ('A', 'B'):
            store.create_agent(AgentInput(name=name, role='review', connection_id=connection.id))
        events = []
        service = ChatService(store, events.append, lambda *_: FakeProvider(
            tokens=('a', 'b', 'c'), failure=PermanentProviderError('stop')))
        response = await service.handle(request(
            'orchestration.start', run_id='batch-error', objective='test',
            agent_ids=[agent.id for agent in store.snapshot().agents], rounds=1,
            max_model_calls=3))
        assert response.ok
        await service.tasks['batch-error']
        chunks = [event.token for event in events if event.type == 'orchestration_chunk']
        assert chunks == ['abc']
        assert events[-1].type == 'orchestration_error'
        store.close()
    asyncio.run(scenario())


def test_paused_run_without_checkpoint_restarts_from_initial_state(tmp_path):
    async def scenario():
        store = Store(tmp_path / 'pre-checkpoint.sqlite3')
        store.create_connection(ConnectionInput(name='Local', provider='ollama', model_id='test'))
        connection = store.snapshot().connections[0]
        for name in ('A', 'B'):
            store.create_agent(AgentInput(name=name, role='review', connection_id=connection.id))
        agent_ids = [agent.id for agent in store.snapshot().agents]
        store.start_orchestration('early-pause', 'resume safely', 1, agent_ids,
                                  fallback_chain=[[connection.id], [connection.id]])
        store.claim_next_orchestration('worker-1')
        store.pause_orchestrations(['early-pause'])
        service = ChatService(store, lambda _: None, lambda *_: FakeProvider(tokens=('ok',)))
        resumed = await service.handle(request(
            'orchestration.queue.resume', run_id='early-pause'))
        assert resumed.ok
        await service.tasks['early-pause']
        run = store.orchestration_history().runs[0]
        assert run.status == 'completed' and len(run.messages) == 3
        store.close()
    asyncio.run(scenario())


def test_existing_shared_checkpoint_database_remains_addressable(tmp_path):
    database = tmp_path / 'legacy.sqlite3'
    legacy = tmp_path / 'legacy-checkpoints.sqlite3'
    connection = sqlite3.connect(legacy)
    connection.execute('CREATE TABLE checkpoints(thread_id TEXT)')
    connection.execute('INSERT INTO checkpoints VALUES (?)', ('existing-run',))
    connection.commit()
    connection.close()
    assert checkpoint_path(database, 'existing-run') == legacy
    assert checkpoint_path(database, 'new-run').parent == tmp_path / 'legacy-checkpoints'
