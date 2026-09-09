"""Durable multi-agent graph with routing, budgets, and approval interrupts."""
from __future__ import annotations
import asyncio
import json
from pathlib import Path
import re
from typing import TypedDict
from pydantic import SecretStr
from langgraph.graph import END, START, StateGraph
from langgraph.checkpoint.sqlite.aio import AsyncSqliteSaver
from langgraph.types import Command, interrupt
from .models import (OrchestrationApprovalRequired, OrchestrationChunk,
                     OrchestrationEnd, OrchestrationError, OrchestrationMessageEnd,
                     OrchestrationToolResult, OrchestrationUsage)
from .providers import get_provider
from .providers.base import Message, ProviderError
from .workspace_tools import apply_write, prepare_write, read_file
from .terminal_tools import execute_command, prepare_command
from .pricing import TokenUsage, cost_microusd


class GraphState(TypedDict):
    objective: str
    agent_ids: list[str]
    rounds: int
    max_output_tokens: int
    max_cost_microusd: int
    current_round: int
    current_index: int
    event_sequence: int
    transcript: list[dict[str, str]]
    workspace_id: str | None
    context_paths: list[str]
    enabled_tools: list[str]
    context_approved: bool | None
    pending_tool: dict | None
    tool_approved: bool | None


class OrchestrationEngine:
    def __init__(self, store, output, provider_factory=get_provider):
        self.store = store
        self.output = output
        self.provider_factory = provider_factory
        self.event_sequences: dict[str, int] = {}

    def _agent_connection(self, agent_id: str):
        snapshot = self.store.snapshot()
        agent = next((item for item in snapshot.agents if item.id == agent_id), None)
        if agent is None:
            raise ValueError('Ajan bulunamadı.')
        connection = next((item for item in snapshot.connections if item.id == agent.connection_id), None)
        if connection is None:
            raise ValueError('Ajanın model bağlantısı bulunamadı.')
        return agent, connection

    @staticmethod
    def route(params, snapshot):
        """Deterministic, auditable routing over user-approved candidate agents."""
        agents = [next(a for a in snapshot.agents if a.id == agent_id)
                  for agent_id in params.agent_ids]
        required = len(agents) * params.rounds + 1
        if params.routing_mode == 'manual':
            if required > params.max_model_calls:
                raise ValueError(f'Bu plan {required} model çağrısı gerektiriyor; bütçe {params.max_model_calls}.')
            return params.agent_ids, 'Manuel sıra korundu.', required

        complex_words = ('kod', 'mimari', 'hata', 'analiz', 'güvenlik', 'tasarla',
                         'code', 'debug', 'architecture', 'reason')
        complex_task = len(params.objective) > 500 or any(
            word in params.objective.casefold() for word in complex_words)
        connections = {c.id: c for c in snapshot.connections}

        def score(agent):
            connection = connections[agent.connection_id]
            model = connection.model_id.casefold()
            capacity = sum(token in model for token in ('pro', 'opus', 'sonnet', '70b', '32b', '14b'))
            cloud = connection.provider in ('anthropic', 'gemini', 'openai')
            return (capacity + (2 if cloud else 0)) if complex_task else (-2 if cloud else 2) + capacity

        ordered = sorted(agents, key=score, reverse=True)
        maximum_agents = min(len(ordered), (params.max_model_calls - 1) // params.rounds)
        if maximum_agents < 2:
            raise ValueError('Bütçe en az iki ajanı çalıştırmaya yetmiyor.')
        selected = ordered[:maximum_agents]
        required = len(selected) * params.rounds + 1
        kind = 'karmaşık' if complex_task else 'hafif'
        reason = (f'Otomatik router görevi {kind} olarak sınıflandırdı; '
                  f'{len(selected)} adayı sağlayıcı ve model kapasitesine göre sıraladı.')
        return [agent.id for agent in selected], reason, required

    def _workspace_context(self, state: GraphState) -> str:
        if not state['context_paths']:
            return ''
        sections = []
        for path in state['context_paths']:
            item = read_file(self.store, state['agent_ids'][0], state['workspace_id'], path)
            sections.append(f'--- {item.path} ---\n{item.content}')
        context = '\n\n'.join(sections)
        if len(context) > 128000:
            raise ValueError('Seçilen bağlam toplam 128.000 karakter sınırını aşıyor.')
        return context

    async def _generate(self, run_id: str, state: GraphState, agent_id: str, phase: str,
                        credentials: dict[str, str], prompt: str):
        agent, connection = self._agent_connection(agent_id)
        provider = self.provider_factory(connection.provider, connection.model_id)
        messages = [Message(role='system', content=f'Rol: {agent.role}\n{agent.instructions}'),
                    Message(role='user', content=prompt)]
        content = ''
        sequence = max(state['event_sequence'], self.event_sequences.get(run_id, 0))
        self.store.increment_model_calls(run_id)

        async def consume():
            nonlocal content, sequence
            key = credentials.get(connection.id)
            stream = provider.stream_reply(
                messages, api_key=SecretStr(key) if key else None,
                max_tokens=state['max_output_tokens'])
            async for token in stream:
                if len(content) + len(token) > 128000:
                    raise ProviderError('Ajan yanıtı uzunluk sınırına ulaştı.')
                content += token
                sequence += 1
                self.event_sequences[run_id] = sequence
                self.output(OrchestrationChunk(run_id=run_id, sequence=sequence,
                                               agent_id=agent_id, phase=phase, token=token))
        await asyncio.wait_for(consume(), timeout=180)
        sequence += 1
        self.event_sequences[run_id] = sequence
        message_sequence = len(state['transcript']) + 1
        self.store.append_orchestration_message(run_id, message_sequence, agent_id, phase, content)
        self.output(OrchestrationMessageEnd(run_id=run_id, sequence=sequence, agent_id=agent_id,
                                            phase=phase, full_content=content))
        usage = getattr(provider, 'usage', TokenUsage())
        cost = cost_microusd(connection.provider, connection.model_id, usage)
        totals = self.store.record_usage(run_id, usage.input_tokens, usage.output_tokens, cost)
        sequence += 1
        self.event_sequences[run_id] = sequence
        self.output(OrchestrationUsage(run_id=run_id, sequence=sequence, **totals))
        if totals['actual_cost_microusd'] > state['max_cost_microusd']:
            raise ProviderError('Gerçek kullanım görev maliyet bütçesini aştı; kalan çağrılar durduruldu.')
        return content, sequence

    @staticmethod
    def _transcript(state: GraphState) -> str:
        parts = [f"[{item['agent_name']} · {item['phase']}]\n{item['content']}"
                 for item in state['transcript']]
        return '\n\n'.join(parts)[-48000:] or '(Henüz başka ajan görüşü yok.)'

    def _tool_proposal(self, state: GraphState):
        if not state['enabled_tools']:
            return None
        content = state['transcript'][-1]['content']
        matches = re.findall(r'```zerocost-tool\s*(\{.*?\})\s*```', content, re.DOTALL)
        if not matches:
            return None
        if len(matches) != 1:
            raise ValueError('Model birden fazla araç önerdi; görev güvenli biçimde durduruldu.')
        try:
            value = json.loads(matches[0])
        except json.JSONDecodeError:
            raise ValueError('Model araç önerisi geçerli JSON değil.') from None
        if not isinstance(value, dict) or value.get('tool') not in state['enabled_tools']:
            raise ValueError('Model izin verilmeyen bir araç önerdi.')
        agent_id = state['agent_ids'][0]
        if value['tool'] == 'workspace.write':
            if set(value) != {'tool', 'path', 'content'} or not all(
                    isinstance(value.get(key), str) for key in ('path', 'content')):
                raise ValueError('workspace.write önerisi beklenen şemaya uymuyor.')
            return prepare_write(self.store, agent_id, state['workspace_id'],
                                 value['path'], value['content'])
        if set(value) - {'tool', 'command', 'cwd'} or set(value) < {'tool', 'command'}:
            raise ValueError('terminal.execute önerisi beklenen şemaya uymuyor.')
        return prepare_command(self.store, agent_id, state['workspace_id'],
                               value['command'], value.get('cwd', ''))

    async def run(self, params, credentials: dict[str, str], *, resume: str | None = None,
                  initial_sequence: int = 0):
        run_id = params.run_id
        self.event_sequences[run_id] = initial_sequence
        try:
            def approve_workspace(state: GraphState):
                if not state['context_paths']:
                    return {'context_approved': True}
                answer = interrupt({'permission': 'workspace.read',
                                    'workspace_id': state['workspace_id'],
                                    'paths': state['context_paths']})
                return {'context_approved': answer.get('decision') == 'approve'}

            async def deliberate(state: GraphState):
                agent_id = state['agent_ids'][state['current_index']]
                agent, _ = self._agent_connection(agent_id)
                phase = 'analysis' if state['current_round'] == 0 else 'review'
                context = self._workspace_context(state)
                prompt = (f"Ortak görev:\n{state['objective']}\n\n"
                          f"Kullanıcının onayladığı çalışma alanı bağlamı:\n{context or '(Yok)'}\n\n"
                          f"Tamamlanmış ekip görüşleri:\n{self._transcript(state)}\n\n"
                          "Kendi uzmanlık rolünle bağımsız, somut bir değerlendirme yap. "
                          "Önceki görüşlerde hata veya eksik varsa açıkça belirt.")
                content, sequence = await self._generate(run_id, state, agent_id, phase,
                                                         credentials, prompt)
                index = state['current_index'] + 1
                round_index = state['current_round']
                if index >= len(state['agent_ids']):
                    index = 0
                    round_index += 1
                return {'transcript': state['transcript'] + [{
                            'agent_id': agent_id, 'agent_name': agent.name,
                            'phase': phase, 'content': content}],
                        'event_sequence': sequence, 'current_index': index,
                        'current_round': round_index}

            async def synthesize(state: GraphState):
                agent_id = state['agent_ids'][0]
                agent, _ = self._agent_connection(agent_id)
                context = self._workspace_context(state)
                prompt = (f"Ortak görev:\n{state['objective']}\n\n"
                          f"Kullanıcının onayladığı çalışma alanı bağlamı:\n{context or '(Yok)'}\n\n"
                          f"Ekip görüşleri:\n{self._transcript(state)}\n\n"
                          "Ekip koordinatörü olarak çelişkileri çöz, uygulanabilir ortak sonucu üret. "
                          "Belirsizlikleri saklama ve nihai yanıtı tek başına anlaşılır yaz.")
                if state['enabled_tools']:
                    prompt += ("\n\nBir yerel işlem gerçekten gerekiyorsa yalnız bir öneriyi yanıtın sonunda "
                               "```zerocost-tool JSON ``` bloğuyla ekle. workspace.write şeması: "
                               '{"tool":"workspace.write","path":"göreli/dosya.md","content":"tam yeni içerik"}. '
                               "terminal.execute şeması: "
                               '{"tool":"terminal.execute","command":["git","status"],"cwd":""}. '
                               f"Bu görevde izinli araçlar: {state['enabled_tools']}. "
                               "İşlemin yapıldığını iddia etme; kullanıcı onayı beklenecek.")
                content, sequence = await self._generate(run_id, state, agent_id, 'synthesis',
                                                         credentials, prompt)
                return {'transcript': state['transcript'] + [{
                            'agent_id': agent_id, 'agent_name': agent.name,
                            'phase': 'synthesis', 'content': content}],
                        'event_sequence': sequence}

            async def propose_tool(state: GraphState):
                return {'pending_tool': self._tool_proposal(state)}

            def approve_tool(state: GraphState):
                proposal = state['pending_tool']
                if proposal is None:
                    return {'tool_approved': None}
                answer = interrupt({key: proposal.get(key) for key in
                    ('tool', 'path', 'command', 'preview', 'risk', 'workspace_id')}
                    | {'permission': proposal['tool']})
                return {'tool_approved': answer.get('decision') == 'approve'}

            async def execute_tool(state: GraphState):
                proposal = state['pending_tool']
                if not state['tool_approved'] or proposal is None:
                    return {}
                try:
                    result = (apply_write(self.store, proposal) if proposal['tool'] == 'workspace.write'
                              else await execute_command(self.store, proposal))
                    self.store.update_tool_action(run_id, 'completed', result)
                    status = 'completed'
                except ValueError as exc:
                    result, status = str(exc), 'failed'
                    self.store.update_tool_action(run_id, status, result)
                sequence = max(state['event_sequence'], self.event_sequences.get(run_id, 0)) + 1
                self.event_sequences[run_id] = sequence
                self.output(OrchestrationToolResult(run_id=run_id, sequence=sequence,
                    tool=proposal['tool'], status=status, result=result))
                return {'event_sequence': sequence}

            def after_approval(state: GraphState):
                return 'deliberate' if state['context_approved'] else END

            def after_tool_approval(state: GraphState):
                return 'execute_tool' if state['tool_approved'] else END

            def next_node(state: GraphState):
                return 'synthesize' if state['current_round'] >= state['rounds'] else 'deliberate'

            builder = StateGraph(GraphState)
            builder.add_node('approve_workspace', approve_workspace)
            builder.add_node('deliberate', deliberate)
            builder.add_node('synthesize', synthesize)
            builder.add_node('propose_tool', propose_tool)
            builder.add_node('approve_tool', approve_tool)
            builder.add_node('execute_tool', execute_tool)
            builder.add_edge(START, 'approve_workspace')
            builder.add_conditional_edges('approve_workspace', after_approval,
                                          {'deliberate': 'deliberate', END: END})
            builder.add_conditional_edges('deliberate', next_node,
                                          {'deliberate': 'deliberate', 'synthesize': 'synthesize'})
            builder.add_edge('synthesize', 'propose_tool')
            builder.add_edge('propose_tool', 'approve_tool')
            builder.add_conditional_edges('approve_tool', after_tool_approval,
                                          {'execute_tool': 'execute_tool', END: END})
            builder.add_edge('execute_tool', END)
            checkpoint_path = Path(self.store.path).with_name(Path(self.store.path).stem + '-checkpoints.sqlite3')
            async with AsyncSqliteSaver.from_conn_string(str(checkpoint_path)) as saver:
                await saver.setup()
                graph = builder.compile(checkpointer=saver)
                config = {'configurable': {'thread_id': run_id}}
                invocation = Command(resume={'decision': resume}) if resume else {
                    'objective': params.objective, 'agent_ids': params.agent_ids,
                    'rounds': params.rounds, 'max_output_tokens': params.max_output_tokens,
                    'max_cost_microusd': params.max_cost_microusd,
                    'current_round': 0, 'current_index': 0, 'event_sequence': 0,
                    'transcript': [], 'workspace_id': params.workspace_id,
                    'context_paths': params.context_paths, 'enabled_tools': params.enabled_tools,
                    'context_approved': None, 'pending_tool': None, 'tool_approved': None}
                final = await graph.ainvoke(invocation, config)

            if '__interrupt__' in final:
                value = final['__interrupt__'][0].value
                sequence = self.event_sequences.get(run_id, 0) + 1
                self.event_sequences[run_id] = sequence
                self.store.set_event_sequence(run_id, sequence)
                self.store.set_orchestration_status(run_id, 'waiting_approval')
                if value['permission'] in ('workspace.write', 'terminal.execute'):
                    proposal = final.get('pending_tool') or value
                    self.store.set_tool_action(run_id, proposal)
                self.output(OrchestrationApprovalRequired(run_id=run_id, sequence=sequence,
                    workspace_id=value['workspace_id'], permission=value['permission'],
                    paths=value.get('paths', []), tool=value.get('tool'), path=value.get('path', ''),
                    command=value.get('command', []), preview=value.get('preview', ''),
                    risk=value.get('risk')))
            elif final.get('context_approved') is False:
                self.store.finish_orchestration(run_id, 'cancelled', 'Dosya okuma isteği reddedildi.')
                self.output(OrchestrationEnd(run_id=run_id,
                    sequence=max(final['event_sequence'], self.event_sequences.get(run_id, 0)) + 1,
                    status='cancelled'))
            else:
                if final.get('pending_tool') and final.get('tool_approved') is False:
                    self.store.update_tool_action(run_id, 'rejected', 'Kullanıcı araç önerisini reddetti.')
                self.store.finish_orchestration(run_id, 'completed')
                self.output(OrchestrationEnd(run_id=run_id,
                                             sequence=max(final['event_sequence'], self.event_sequences.get(run_id, 0)) + 1,
                                             status='completed'))
        except asyncio.CancelledError:
            self.store.finish_orchestration(run_id, 'cancelled')
            sequence = self.event_sequences.get(run_id, 0) + 1
            self.output(OrchestrationEnd(run_id=run_id, sequence=sequence, status='cancelled'))
        except Exception as exc:
            message = str(exc) if isinstance(exc, (ProviderError, ValueError)) else 'Çoklu ajan görevi tamamlanamadı.'
            self.store.finish_orchestration(run_id, 'failed', message)
            self.output(OrchestrationError(run_id=run_id,
                                           sequence=self.event_sequences.get(run_id, 0) + 1,
                                           message=message))
        finally:
            self.event_sequences.pop(run_id, None)
