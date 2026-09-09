import json
from pathlib import Path
import os
import sqlite3
import subprocess
import sys
import pytest
import asyncio
from zerocost.models import (AgentInput, ConnectionInput, WorkspaceInput,
                             KnowledgeCollectionInput)
from zerocost.sidecar import ChatService, dispatch
from zerocost.storage import Store
from zerocost.providers.base import Message, ProviderError
from zerocost.pricing import TokenUsage
from zerocost.workspace_tools import apply_write, prepare_write
from zerocost.terminal_tools import execute_command, prepare_command


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
    assert response.result.version == '2026-09-09'
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
    store.db.execute('PRAGMA user_version=4')
    store.db.commit()
    store.close()

    migrated = Store(path)
    run = migrated.orchestration_history().runs[0]
    assert migrated.snapshot().database_version == 8
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
            raise ProviderError(self.failure)


def configured_store(tmp_path):
    store = Store(tmp_path / 'chat.sqlite3')
    store.create_connection(ConnectionInput(name='Local', provider='ollama', model_id='test-model'))
    connection = store.snapshot().connections[0]
    store.create_agent(AgentInput(name='Helper', role='Yardımcı', connection_id=connection.id,
                                  instructions='Kısa yanıt ver.'))
    return store, store.snapshot().agents[0]


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
            'orchestration_chunk', 'orchestration_message_end', 'orchestration_usage',
            'orchestration_chunk', 'orchestration_message_end', 'orchestration_usage',
            'orchestration_chunk', 'orchestration_message_end', 'orchestration_usage',
            'orchestration_end']
        assert [event.sequence for event in events] == list(range(1, 12))
        assert history.used_model_calls == 3
        assert history.max_model_calls == 5
        assert (tmp_path / 'orchestration-checkpoints.sqlite3').exists()
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
