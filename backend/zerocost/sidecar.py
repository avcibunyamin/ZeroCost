"""Bounded JSON-lines IPC. stdout is reserved exclusively for responses."""
import argparse
import asyncio
import time
from filelock import FileLock
from .models import Accepted, StreamChunk, StreamEnd, StreamError
from .providers import get_provider
from .providers.ollama import OllamaProvider
from .providers.base import Message, ProviderError
import json
from pathlib import Path
import sqlite3
import sys
from types import SimpleNamespace
from pydantic import TypeAdapter, ValidationError, SecretStr
from .models import Request, Failure, Success
from .storage import Store
from .workspace_tools import inspect_file_size, list_directory, read_file
from .models import (OrchestrationEnd, OrchestrationPaused, OrchestrationQueued,
                     OrchestrationRoute, OrchestrationRuntime, OrchestrationStarted,
                     WorkerSlot)
from .pricing import CATALOG_VERSION, catalog, estimate_plan, pricing_warning
from .embeddings import OllamaEmbeddings
from .chunking import build_semantic_chunks
from .documents import parse_document
from .ingestion import KnowledgeIngestor
from .knowledge_files import read_knowledge_source
from .models import KnowledgeIngestionProgress, KnowledgeIngestionResult
from .knowledge_search import HybridKnowledgeSearch
from .skills import skill_prompt, validate_skill_requirements
from .workflows import compile_workflow, validate_workflow_bindings
from .checkpoints import checkpoint_exists

MAX_FRAME_BYTES = 64 * 1024
request_adapter = TypeAdapter(Request)


def dispatch(store: Store, raw: str):
    request_id = "unknown"
    try:
        decoded = json.loads(raw)
        if isinstance(decoded, dict) and isinstance(decoded.get("request_id"), str):
            request_id = decoded["request_id"][:128]
        request = request_adapter.validate_python(decoded)
        if request.method == "connection.create":
            store.create_connection(request.params)
        elif request.method == "agent.create":
            store.create_agent(request.params)
        elif request.method == "workspace.create":
            store.create_workspace(request.params)
        elif request.method == "agent.permissions.set":
            store.set_agent_permissions(request.params.agent_id, request.params.permissions)
        elif request.method == "agent.fallbacks.set":
            store.set_agent_fallbacks(request.params.agent_id, request.params.connection_ids)
        elif request.method == "workspace.list":
            return Success(request_id=request.request_id, result=list_directory(
                store, request.params.agent_id, request.params.workspace_id, request.params.path))
        elif request.method == "workspace.read":
            return Success(request_id=request.request_id, result=read_file(
                store, request.params.agent_id, request.params.workspace_id, request.params.path))
        elif request.method == "pricing.catalog":
            return Success(request_id=request.request_id, result=catalog())
        elif request.method == "skill.create":
            store.create_skill(request.params)
        elif request.method == "skill.assign":
            store.assign_skill(request.params.agent_id, request.params.skill_id)
        elif request.method == "skill.unassign":
            store.unassign_skill(request.params.agent_id, request.params.skill_id)
        elif request.method == "workflow.create":
            store.create_workflow(request.params)
        elif request.method == "workflow.archive":
            store.archive_workflow(request.params.workflow_id)
        elif request.method != "snapshot":
            raise ValueError("Bu komut asenkron servis gerektirir.")
        return Success(request_id=request.request_id, result=store.snapshot())
    except (ValidationError, json.JSONDecodeError):
        return Failure(request_id=request_id, code="invalid_request", message="İstek iletişim şemasına uymuyor.")
    except sqlite3.IntegrityError:
        return Failure(request_id=request_id, code="conflict", message="Ad veya klasör zaten kayıtlı ya da bağlantı bulunamadı.")
    except (FileNotFoundError, NotADirectoryError):
        return Failure(request_id=request_id, code="not_found", message="Klasör bulunamadı.")
    except ValueError as exc:
        return Failure(request_id=request_id, code="invalid_request", message=str(exc))
    except Exception:
        # Do not reflect raw request contents, secrets, or database details.
        print("Sidecar request failed", file=sys.stderr)
        return Failure(request_id=request_id, code="internal_error", message="Yerel işlem tamamlanamadı.")


def emit(value):
    print(value.model_dump_json(), flush=True)


class ChatService:
    WORKER_IDS = ('worker-1', 'worker-2')
    MAX_QUEUED_ORCHESTRATIONS = 100

    def __init__(self, store: Store, output=emit, provider_factory=get_provider,
                 embedding_factory=OllamaEmbeddings):
        self.store = store
        self.output = output
        self.provider_factory = provider_factory
        self.embedding_factory = embedding_factory
        self.tasks = {}
        self.chat_runs = set()
        self.queue_jobs = {}
        self.active_workers = {}
        self.queue_lock = asyncio.Lock()
        self.closing = False
        self.orchestrator = None

    def _next_event_sequence(self, run_id):
        spec = self.store.orchestration_spec(run_id)
        sequence = (spec['event_sequence'] if spec else 0) + 1
        self.store.set_event_sequence(run_id, sequence)
        return sequence

    def checkpoint_exists(self, thread_id):
        return checkpoint_exists(self.store.path, thread_id)

    async def queue_orchestration(self, spec, credentials, *, resume=None,
                                  checkpoint_thread_id=None, continue_checkpoint=False,
                                  resumed=False):
        run_id = spec['run_id']
        self.queue_jobs[run_id] = {
            'credentials': credentials,
            'resume': resume,
            'checkpoint_thread_id': checkpoint_thread_id,
            'continue_checkpoint': continue_checkpoint,
        }
        position = self.store.queue_position(run_id)
        sequence = self._next_event_sequence(run_id)
        self.output(OrchestrationQueued(
            run_id=run_id, sequence=sequence, queue_position=position or 1,
            resumed=resumed))
        await self.schedule_queue()

    async def schedule_queue(self):
        if self.closing or self.chat_runs:
            return
        async with self.queue_lock:
            free_workers = [worker for worker in self.WORKER_IDS
                            if worker not in self.active_workers.values()]
            for worker_id in free_workers:
                claimed = self.store.claim_next_orchestration(worker_id)
                if claimed is None:
                    break
                run_id = claimed['run_id']
                job = self.queue_jobs.get(run_id)
                if job is None:
                    # Credentials deliberately do not survive a process restart.
                    self.store.set_orchestration_status(
                        run_id, 'paused',
                        'Kimlik bilgileri yeniden yüklenmeden görev sürdürülemez.')
                    self.output(OrchestrationPaused(
                        run_id=run_id, sequence=self._next_event_sequence(run_id),
                        message='Görevi sürdürmek için yeniden başlatın.'))
                    continue
                sequence = self._next_event_sequence(run_id)
                self.output(OrchestrationStarted(
                    run_id=run_id, sequence=sequence, worker_id=worker_id))
                self.active_workers[run_id] = worker_id
                task = asyncio.create_task(self._run_queued_orchestration(
                    SimpleNamespace(**claimed), job, sequence))
                self.tasks[run_id] = task

    async def _run_queued_orchestration(self, params, job, initial_sequence):
        run_id = params.run_id
        try:
            await self.run_orchestration(
                params, job['credentials'], resume=job['resume'],
                initial_sequence=initial_sequence,
                checkpoint_thread_id=job['checkpoint_thread_id'],
                continue_checkpoint=job['continue_checkpoint'])
        finally:
            self.tasks.pop(run_id, None)
            self.active_workers.pop(run_id, None)
            self.queue_jobs.pop(run_id, None)
            if not self.closing:
                await self.schedule_queue()

    async def run_orchestration(self, params, credentials, *, resume=None, initial_sequence=0,
                                checkpoint_thread_id=None, continue_checkpoint=False):
        if self.orchestrator is None:
            # Keep normal startup fast; LangGraph is loaded only for an agent-table run.
            from .orchestration import OrchestrationEngine
            self.orchestrator = OrchestrationEngine(self.store, self.output,
                                                    self.provider_factory,
                                                    self.embedding_factory)
        await self.orchestrator.run(
            params, credentials, resume=resume, initial_sequence=initial_sequence,
            checkpoint_thread_id=checkpoint_thread_id,
            continue_checkpoint=continue_checkpoint)

    def validate_orchestration_agents(self, agent_ids, credentials, connection_chains=None):
        snapshot = self.store.snapshot()
        agents = []
        for index, agent_id in enumerate(agent_ids):
            agent = next((item for item in snapshot.agents if item.id == agent_id), None)
            if agent is None:
                raise ValueError('Ajan bulunamadı.')
            chain_ids = (connection_chains[index] if connection_chains and
                         index < len(connection_chains)
                         else [agent.connection_id, *agent.fallback_connection_ids])
            for connection_id in chain_ids:
                connection = next((item for item in snapshot.connections
                                   if item.id == connection_id), None)
                if connection is None:
                    raise ValueError(f'{agent.name} için fallback bağlantısı bulunamadı.')
                if connection.provider not in ('ollama', 'lmstudio', 'anthropic', 'gemini', 'openai'):
                    raise ValueError(f'{connection.name} için sohbet adaptörü henüz hazır değil.')
                if connection.provider in ('anthropic', 'gemini', 'openai'):
                    key = credentials.get(connection.id)
                    if not isinstance(key, str) or not key:
                        raise ValueError(f'{connection.name} için API anahtarı ekleyin.')
            agents.append(agent)
        return snapshot, agents

    async def reply(self, params, provider, messages, api_key=None):
        content = ''
        sequence = 0
        persisted = time.monotonic()
        try:
            async def generate():
                nonlocal content, sequence, persisted
                stream = provider.stream_reply(messages, api_key=api_key) if api_key else provider.stream_reply(messages)
                async for token in stream:
                    if len(content) + len(token) > 128000:
                        raise ProviderError('Yanıt uzunluk sınırına ulaştı.')
                    content += token
                    sequence += 1
                    self.output(StreamChunk(run_id=params.run_id, sequence=sequence, token=token))
                    if time.monotonic() - persisted >= 0.5:
                        self.store.update_run(params.run_id, content, 'running')
                        persisted = time.monotonic()
            await asyncio.wait_for(generate(), timeout=180)
            self.store.update_run(params.run_id, content, 'completed')
            self.output(StreamEnd(run_id=params.run_id, sequence=sequence+1, full_content=content, status='completed'))
        except asyncio.CancelledError:
            self.store.update_run(params.run_id, content, 'cancelled')
            self.output(StreamEnd(run_id=params.run_id, sequence=sequence+1, full_content=content, status='cancelled'))
        except Exception as exc:
            message = str(exc) if isinstance(exc, ProviderError) else 'Üretim tamamlanamadı veya süre sınırına ulaştı.'
            self.store.update_run(params.run_id, content, 'failed', message)
            self.output(StreamError(run_id=params.run_id, sequence=sequence+1, full_content=content, message=message))
        finally:
            self.tasks.pop(params.run_id, None)
            self.chat_runs.discard(params.run_id)
            if not self.closing:
                asyncio.create_task(self.schedule_queue())

    async def handle(self, raw: str, auth=None):
        try:
            request = request_adapter.validate_json(raw)
        except (ValidationError, ValueError):
            return dispatch(self.store, raw)
        try:
            if request.method == 'knowledge.snapshot':
                try:
                    models = await asyncio.wait_for(
                        self.embedding_factory().list_models(), timeout=8)
                    result = self.store.knowledge_snapshot(models)
                except (ProviderError, asyncio.TimeoutError) as exc:
                    message = (str(exc) if isinstance(exc, ProviderError)
                               else 'Ollama embedding modeli sorgusu zaman aşımına uğradı.')
                    result = self.store.knowledge_snapshot().model_copy(
                        update={'embedding_error': message})
            elif request.method == 'knowledge.collection.create':
                provider = self.embedding_factory(request.params.embedding_model)
                try:
                    models = await asyncio.wait_for(provider.list_models(), timeout=8)
                except asyncio.TimeoutError:
                    raise ValueError('Ollama embedding modeli sorgusu zaman aşımına uğradı.') from None
                if request.params.embedding_model not in {item['name'] for item in models}:
                    raise ValueError('Seçilen Ollama embedding modeli bulunamadı.')
                try:
                    vectors = await asyncio.wait_for(
                        provider.embed(['ZeroCost embedding dimension probe']), timeout=90)
                except asyncio.TimeoutError:
                    raise ValueError('Embedding boyut probu zaman aşımına uğradı.') from None
                self.store.create_knowledge_collection(request.params, len(vectors[0]))
                result = self.store.knowledge_snapshot(models)
            elif request.method == 'knowledge.source.ingest':
                sequence = 0
                event_path = request.params.path

                def progress(stage, completed, total, percent, message, final=False):
                    nonlocal sequence
                    sequence += 1
                    self.output(KnowledgeIngestionProgress(
                        request_id=request.request_id, sequence=sequence,
                        collection_id=request.params.collection_id,
                        workspace_id=request.params.workspace_id,
                        path=event_path, stage=stage,
                        completed_units=completed, total_units=total,
                        progress_percent=percent, message=message, is_final=final))

                progress('reading', 0, 1, 2, 'Belge güvenli çalışma alanından okunuyor.')
                path, content = read_knowledge_source(
                    self.store, request.params.workspace_id, request.params.path)
                event_path = path
                progress('reading', 1, 1, 10, 'Belge güvenle okundu.')
                progress('parsing', 0, 1, 14, 'Belge yapısı ayrıştırılıyor.')
                blocks = parse_document(content, path)
                progress('parsing', 1, 1, 25, f'{len(blocks)} semantik blok ayrıştırıldı.')
                progress('chunking', 0, 1, 30, 'Bağlam duyarlı parçalar hazırlanıyor.')
                chunks = build_semantic_chunks(blocks)
                progress('chunking', 1, 1, 38, f'{len(chunks)} parça hazırlandı.')

                def ingestion_progress(stage, completed, total):
                    if stage == 'embedding':
                        ratio = completed / total if total else 1
                        percent = 40 + round(50 * ratio)
                        message = (f'{completed}/{total} yeni parça embed edildi.' if total
                                   else 'Tüm embeddingler önbellekten yeniden kullanıldı.')
                    else:
                        percent = 94 if completed == 0 else 98
                        message = ('SQLite transaction hazırlanıyor.' if completed == 0
                                   else 'SQLite ve FTS indeksi güncellendi.')
                    progress(stage, completed, total, percent, message)

                try:
                    indexed = await asyncio.wait_for(KnowledgeIngestor(
                        self.store, self.embedding_factory).index_chunks(
                            request.params.collection_id, request.params.workspace_id,
                            path, content, chunks, ingestion_progress), timeout=300)
                except asyncio.TimeoutError:
                    raise ValueError('Belge indeksleme zaman aşımına uğradı.') from None
                progress('completed', 1, 1, 100,
                         ('Belge zaten güncel; yeni embedding gerekmedi.'
                          if indexed.status == 'unchanged'
                          else 'Belge indeksi kullanıma hazır.'), True)
                result = KnowledgeIngestionResult(
                    collection_id=request.params.collection_id,
                    workspace_id=request.params.workspace_id,
                    path=path,
                    status=indexed.status,
                    chunk_count=indexed.chunk_count,
                    embedded_count=indexed.embedded_count,
                    reused_count=indexed.reused_count,
                )
            elif request.method == 'knowledge.search':
                try:
                    result = await asyncio.wait_for(HybridKnowledgeSearch(
                        self.store, self.embedding_factory).search(
                            request.params.collection_id, request.params.query,
                            request.params.limit), timeout=90)
                except asyncio.TimeoutError:
                    raise ValueError('Bilgi araması zaman aşımına uğradı.') from None
            elif request.method == 'ollama.models':
                result = await asyncio.wait_for(OllamaProvider('').list_models(), timeout=8)
            elif request.method == 'connection.models':
                connection = next((item for item in self.store.snapshot().connections
                                   if item.id == request.params.connection_id), None)
                if connection is None or connection.provider not in ('openai', 'lmstudio'):
                    raise ValueError('Model keşfi yalnız OpenAI ve LM Studio bağlantılarında kullanılabilir.')
                secret = None
                if connection.provider == 'openai':
                    if (not auth or auth.get('connection_id') != connection.id or
                            not isinstance(auth.get('secret'), str) or not auth['secret']):
                        raise ValueError('Model keşfi için önce API anahtarını kasaya ekleyin.')
                    secret = SecretStr(auth['secret'])
                provider = self.provider_factory(
                    connection.provider, connection.model_id, connection.base_url)
                try:
                    result = await asyncio.wait_for(
                        provider.list_models(api_key=secret), timeout=3)
                except asyncio.TimeoutError:
                    raise ValueError(
                        'Model keşfi 3 saniyede tamamlanamadı; model kimliğini elle kullanabilirsiniz.') from None
            elif request.method == 'chat.history':
                result = self.store.history(request.params.agent_id)
            elif request.method == 'orchestration.history':
                result = self.store.orchestration_history()
                runtime = (self.orchestrator.runtime_snapshot(self.active_workers)
                           if self.orchestrator else OrchestrationRuntime(
                               workers=[WorkerSlot(worker_id=worker)
                                        for worker in self.WORKER_IDS]))
                result = result.model_copy(update={'runtime': runtime})
            elif request.method == 'orchestration.start':
                if self.store.queue_depth() >= self.MAX_QUEUED_ORCHESTRATIONS:
                    raise ValueError('Görev kuyruğu kapasitesine ulaştı.')
                params = request.params
                credentials = auth.get('credentials', {}) if isinstance(auth, dict) else {}
                if not isinstance(credentials, dict):
                    raise ValueError('Kimlik bilgisi zarfı geçersiz.')
                snapshot = self.store.snapshot()
                params = compile_workflow(self.store, params, snapshot)
                snapshot, agents = self.validate_orchestration_agents(params.agent_ids, credentials)
                if self.orchestrator is None:
                    from .orchestration import OrchestrationEngine
                    self.orchestrator = OrchestrationEngine(self.store, self.output,
                                                            self.provider_factory,
                                                            self.embedding_factory)
                routed_ids, reason, planned = self.orchestrator.route(params, snapshot)
                params = params.model_copy(update={'agent_ids': routed_ids})
                agents = [next(agent for agent in snapshot.agents if agent.id == agent_id)
                          for agent_id in params.agent_ids]
                if params.context_paths:
                    for agent in agents:
                        if 'workspace.read' not in agent.permissions:
                            raise ValueError(f'{agent.name} için workspace okuma izni gerekli.')
                if params.enabled_tools:
                    coordinator = next(agent for agent in snapshot.agents
                                       if agent.id == params.agent_ids[0])
                    missing = [tool for tool in params.enabled_tools if tool not in coordinator.permissions]
                    if missing:
                        raise ValueError(f'{coordinator.name} için {", ".join(missing)} izni gerekli.')
                for collection_id in params.knowledge_collection_ids:
                    if self.store.knowledge_collection(collection_id) is None:
                        raise ValueError('Seçilen bilgi koleksiyonu bulunamadı.')
                for agent in agents:
                    validate_skill_requirements(
                        self.store, agent, enabled_tools=params.enabled_tools,
                        has_knowledge=bool(params.knowledge_collection_ids))
                context_bytes = sum(inspect_file_size(
                    self.store, agents[0].id, params.workspace_id, path)
                    for path in params.context_paths) if params.context_paths else 0
                estimated_cost = estimate_plan(snapshot, params.agent_ids, params.rounds,
                    params.objective, context_bytes, params.max_output_tokens,
                    extra_synthesis=bool(params.knowledge_collection_ids))
                price_warning = pricing_warning(snapshot, params.agent_ids)
                if estimated_cost > params.max_cost_microusd:
                    raise ValueError(
                        f'Tahmini üst maliyet ${estimated_cost / 1_000_000:.4f}; '
                        f'görev bütçesi ${params.max_cost_microusd / 1_000_000:.4f}.')
                fallback_chain = [[agent.connection_id, *agent.fallback_connection_ids]
                                  for agent in agents]
                self.store.start_orchestration(params.run_id, params.objective, params.rounds,
                    params.agent_ids, routing_mode=params.routing_mode, route_reason=reason,
                    max_model_calls=params.max_model_calls, max_output_tokens=params.max_output_tokens,
                    max_cost_microusd=params.max_cost_microusd,
                    estimated_max_cost_microusd=estimated_cost,
                    price_catalog_version=CATALOG_VERSION,
                    pricing_warning=price_warning,
                    workspace_id=params.workspace_id, context_paths=params.context_paths,
                    enabled_tools=params.enabled_tools,
                    knowledge_collection_ids=params.knowledge_collection_ids,
                    workflow_id=params.workflow_id, workflow_version=params.workflow_version,
                    fallback_chain=fallback_chain)
                params = SimpleNamespace(**self.store.orchestration_spec(params.run_id))
                self.output(OrchestrationRoute(run_id=params.run_id, sequence=1,
                    agent_ids=params.agent_ids, reason=reason, planned_model_calls=planned,
                    max_model_calls=params.max_model_calls, max_output_tokens=params.max_output_tokens,
                    estimated_max_cost_microusd=estimated_cost,
                    max_cost_microusd=params.max_cost_microusd,
                    price_catalog_version=CATALOG_VERSION,
                    pricing_warning=price_warning))
                self.store.set_event_sequence(params.run_id, 1)
                await self.queue_orchestration(vars(params), credentials)
                result = Accepted(run_id=params.run_id)
            elif request.method == 'orchestration.approve':
                spec = self.store.orchestration_spec(request.params.run_id)
                if spec is None:
                    raise ValueError('Çoklu ajan görevi bulunamadı.')
                if spec['status'] != 'waiting_approval':
                    raise ValueError('Bu görev onay beklemiyor.')
                credentials = auth.get('credentials', {}) if isinstance(auth, dict) else {}
                if not isinstance(credentials, dict):
                    raise ValueError('Kimlik bilgisi zarfı geçersiz.')
                snapshot, agents = self.validate_orchestration_agents(
                    spec['agent_ids'], credentials, spec['fallback_chain'])
                validate_workflow_bindings(
                    self.store, spec['workflow_id'], spec['workflow_version'],
                    spec['agent_ids'], snapshot, require_active=False)
                for agent in agents:
                    validate_skill_requirements(
                        self.store, agent, enabled_tools=spec['enabled_tools'],
                        has_knowledge=bool(spec['knowledge_collection_ids']))
                params = SimpleNamespace(**spec)
                uncertain = (spec['error_class'] == 'uncertain_tool' and
                             spec['tool_status'] in ('uncertain', 'completed'))
                if uncertain and request.params.decision == 'reject':
                    self.store.finish_orchestration(
                        params.run_id, 'cancelled', 'Belirsiz araç sonucu nedeniyle kullanıcı görevi durdurdu.')
                    result = Accepted(run_id=params.run_id)
                    return Success(request_id=request.request_id, result=result)
                if spec['tool_status'] == 'waiting':
                    self.store.update_tool_action(params.run_id, 'approved')
                self.store.enqueue_orchestration(params.run_id, resumed=True)
                spec = self.store.orchestration_spec(params.run_id)
                await self.queue_orchestration(
                    spec, credentials, resume=None if uncertain else request.params.decision,
                    checkpoint_thread_id=spec['parent_run_id'] or spec['run_id'],
                    continue_checkpoint=uncertain, resumed=True)
                result = Accepted(run_id=params.run_id)
            elif request.method == 'orchestration.retry':
                source = self.store.retry_source(request.params.run_id)
                credentials = auth.get('credentials', {}) if isinstance(auth, dict) else {}
                if not isinstance(credentials, dict):
                    raise ValueError('Kimlik bilgisi zarfı geçersiz.')
                snapshot, agents = self.validate_orchestration_agents(
                    source['agent_ids'], credentials, source['fallback_chain'])
                validate_workflow_bindings(
                    self.store, source['workflow_id'], source['workflow_version'],
                    source['agent_ids'], snapshot, require_active=False)
                for agent in agents:
                    validate_skill_requirements(
                        self.store, agent, enabled_tools=source['enabled_tools'],
                        has_knowledge=bool(source['knowledge_collection_ids']))
                spec, checkpoint_thread_id = self.store.create_retry(
                    request.params.run_id, request.params.new_run_id)
                self.store.enqueue_orchestration(spec['run_id'], resumed=True)
                spec = self.store.orchestration_spec(spec['run_id'])
                await self.queue_orchestration(
                    spec, credentials, checkpoint_thread_id=checkpoint_thread_id,
                    continue_checkpoint=True, resumed=True)
                result = Accepted(run_id=spec['run_id'])
            elif request.method == 'orchestration.queue.resume':
                spec = self.store.orchestration_spec(request.params.run_id)
                if spec is None or spec['status'] != 'paused':
                    raise ValueError('Yalnız duraklatılmış görev sürdürülebilir.')
                credentials = auth.get('credentials', {}) if isinstance(auth, dict) else {}
                if not isinstance(credentials, dict):
                    raise ValueError('Kimlik bilgisi zarfı geçersiz.')
                snapshot, agents = self.validate_orchestration_agents(
                    spec['agent_ids'], credentials, spec['fallback_chain'])
                validate_workflow_bindings(
                    self.store, spec['workflow_id'], spec['workflow_version'],
                    spec['agent_ids'], snapshot, require_active=False)
                for agent in agents:
                    validate_skill_requirements(
                        self.store, agent, enabled_tools=spec['enabled_tools'],
                        has_knowledge=bool(spec['knowledge_collection_ids']))
                self.store.enqueue_orchestration(spec['run_id'], resumed=True)
                spec = self.store.orchestration_spec(spec['run_id'])
                checkpoint_thread_id = spec['parent_run_id'] or spec['run_id']
                await self.queue_orchestration(
                    spec, credentials,
                    checkpoint_thread_id=checkpoint_thread_id,
                    continue_checkpoint=self.checkpoint_exists(checkpoint_thread_id),
                    resumed=True)
                result = Accepted(run_id=spec['run_id'])
            elif request.method == 'orchestration.cancel':
                task = self.tasks.get(request.params.run_id)
                if task:
                    task.cancel()
                    await asyncio.gather(task, return_exceptions=True)
                else:
                    spec = self.store.orchestration_spec(request.params.run_id)
                    if spec and spec['status'] in ('queued', 'paused', 'waiting_approval'):
                        self.queue_jobs.pop(request.params.run_id, None)
                        self.store.finish_orchestration(request.params.run_id, 'cancelled')
                        self.output(OrchestrationEnd(run_id=request.params.run_id,
                            sequence=self._next_event_sequence(request.params.run_id),
                            status='cancelled'))
                result = Accepted(run_id=request.params.run_id)
            elif request.method == 'chat.start':
                if self.tasks or self.store.waiting_orchestration():
                    raise ValueError('Önce devam eden yanıtı durdurun veya tamamlanmasını bekleyin.')
                params = request.params
                snapshot = self.store.snapshot()
                agent = next((a for a in snapshot.agents if a.id == params.agent_id), None)
                if agent is None:
                    raise ValueError('Ajan bulunamadı.')
                skills = validate_skill_requirements(self.store, agent, allow_tools=False)
                connection = next(c for c in snapshot.connections if c.id == agent.connection_id)
                api_key = None
                if connection.provider in ('anthropic', 'gemini', 'openai'):
                    if not auth or auth.get('connection_id') != connection.id or not isinstance(auth.get('secret'), str) or not auth['secret']:
                        raise ValueError('Bu bağlantıya Model bağlantıları ekranından API anahtarı ekleyin.')
                    api_key = SecretStr(auth['secret'])
                provider = self.provider_factory(
                    connection.provider, connection.model_id, connection.base_url)
                # Only complete pairs are sent back to the model, with a bounded context window.
                history = [t for t in self.store.history(agent.id).turns if t.status == 'completed']
                selected = []
                budget = 24000
                for turn in reversed(history[-20:]):
                    budget -= len(turn.prompt) + len(turn.content)
                    if budget < 0:
                        break
                    selected.append(turn)
                system_content = f'Rol: {agent.role}\n{agent.instructions}'
                skill_block = skill_prompt(skills)
                if skill_block:
                    system_content += f'\n\n{skill_block}'
                messages = [Message(role='system', content=system_content)]
                for turn in reversed(selected):
                    messages.extend([Message(role='user', content=turn.prompt), Message(role='assistant', content=turn.content)])
                messages.append(Message(role='user', content=params.message))
                self.store.start_run(params.run_id, agent.id, params.message)
                # No await after task creation: the acknowledgement is flushed before the first event.
                self.tasks[params.run_id] = asyncio.create_task(self.reply(params, provider, messages, api_key))
                self.chat_runs.add(params.run_id)
                def finished(task):
                    # Cancellation before the coroutine's first step never enters reply's try/finally.
                    if task.cancelled():
                        self.store.update_run(params.run_id, '', 'cancelled')
                        self.output(StreamEnd(run_id=params.run_id, sequence=1, full_content='', status='cancelled'))
                        self.tasks.pop(params.run_id, None)
                self.tasks[params.run_id].add_done_callback(finished)
                result = Accepted(run_id=params.run_id)
            elif request.method == 'chat.cancel':
                task = self.tasks.get(request.params.run_id)
                if task:
                    task.cancel()
                    await asyncio.gather(task, return_exceptions=True)
                result = Accepted(run_id=request.params.run_id)
            else:
                return dispatch(self.store, raw)
            return Success(request_id=request.request_id, result=result)
        except sqlite3.IntegrityError:
            return Failure(request_id=request.request_id, code='conflict', message='Bu çalışma kimliği zaten kullanıldı.')
        except (ValueError, ProviderError) as exc:
            return Failure(request_id=request.request_id, code='invalid_request', message=str(exc))
        except Exception:
            return Failure(request_id=request.request_id, code='internal_error', message='Yerel istek tamamlanamadı.')

    async def close(self):
        self.closing = True
        orchestration_ids = [run_id for run_id in self.queue_jobs
                             if run_id not in self.tasks or not self.tasks[run_id].done()]
        tasks = list(self.tasks.values())
        for task in tasks:
            task.cancel()
        await asyncio.gather(*tasks, return_exceptions=True)
        self.store.pause_orchestrations(orchestration_ids, shutdown=True)


async def serve(store):
    store.recover_runs()
    service = ChatService(store)
    try:
        while True:
            line = await asyncio.to_thread(sys.stdin.buffer.readline, MAX_FRAME_BYTES + 1)
            if not line:
                break
            if len(line) > MAX_FRAME_BYTES:
                emit(Failure(request_id='unknown', code='invalid_request', message='İstek çok büyük.'))
                break
            try:
                decoded = json.loads(line.decode('utf-8'))
                auth = decoded.pop('_auth', None) if isinstance(decoded, dict) else None
                emit(await service.handle(json.dumps(decoded), auth=auth))
                del decoded, auth, line
            except UnicodeDecodeError:
                emit(Failure(request_id='unknown', code='invalid_request', message='Geçersiz UTF-8.'))
            except json.JSONDecodeError:
                emit(Failure(request_id='unknown', code='invalid_request', message='Geçersiz JSON.'))
    finally:
        await service.close()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--database', required=True, type=Path)
    args = parser.parse_args()
    args.database.parent.mkdir(parents=True, exist_ok=True)
    # A second application must not mark another sidecar's active runs interrupted.
    with FileLock(str(args.database) + '.lock', timeout=0):
        store = Store(args.database)
        try:
            asyncio.run(serve(store))
        finally:
            store.close()


if __name__ == '__main__':
    main()
