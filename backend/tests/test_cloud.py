import asyncio
import json
import httpx
import pytest
from pydantic import SecretStr
from google import genai
from zerocost.providers.cloud import AnthropicProvider, GeminiProvider
from zerocost.providers.base import Message, ProviderError

MESSAGES = [Message(role='system', content='instructions'), Message(role='user', content='hello')]


@pytest.mark.parametrize('complete', [True, False])
def test_anthropic_sdk_stream_system_and_auth(complete):
    def handler(request):
        assert request.headers['x-api-key'] == 'synthetic-key'
        body = json.loads(request.content)
        assert body['system'] == 'instructions'
        assert body['messages'] == [{'role': 'user', 'content': 'hello'}]
        frames = [
            ('message_start', {'type': 'message_start', 'message': {'id': 'test', 'type': 'message', 'role': 'assistant', 'model': 'test', 'content': [], 'stop_reason': None, 'stop_sequence': None, 'usage': {'input_tokens': 1, 'output_tokens': 0}}}),
            ('content_block_start', {'type': 'content_block_start', 'index': 0, 'content_block': {'type': 'text', 'text': ''}}),
            ('content_block_delta', {'type': 'content_block_delta', 'index': 0, 'delta': {'type': 'text_delta', 'text': 'merhaba'}}),
            ('content_block_stop', {'type': 'content_block_stop', 'index': 0}),
            ('message_delta', {'type': 'message_delta', 'delta': {'stop_reason': 'end_turn', 'stop_sequence': None}, 'usage': {'output_tokens': 1}}),
            ('message_stop', {'type': 'message_stop'})]
        if not complete: frames.pop()
        return httpx.Response(200, headers={'content-type': 'text/event-stream'},
            text=''.join(f'event: {event}\ndata: {json.dumps(data)}\n\n' for event, data in frames))
    async def run():
        provider = AnthropicProvider('test', transport=httpx.MockTransport(handler))
        if complete:
            assert [t async for t in provider.stream_reply(MESSAGES, api_key=SecretStr('synthetic-key'))] == ['merhaba']
            assert (provider.usage.input_tokens, provider.usage.output_tokens) == (1, 1)
        else:
            with pytest.raises(ProviderError):
                _ = [t async for t in provider.stream_reply(MESSAGES, api_key=SecretStr('synthetic-key'))]
    asyncio.run(run())


@pytest.mark.parametrize('finish', ['STOP', 'MAX_TOKENS', None])
def test_gemini_sdk_mapping_safety_and_terminal(finish):
    def handler(request):
        assert request.headers['x-goog-api-key'] == 'synthetic-key'
        body = json.loads(request.content)
        assert body['systemInstruction']['parts'][0]['text'] == 'instructions'
        assert body['contents'][0]['role'] == 'model'
        assert len(body['safetySettings']) == 4
        assert all(s['threshold'] == 'BLOCK_NONE' for s in body['safetySettings'])
        candidate = {'content': {'role': 'model', 'parts': [{'text': 'answer'}]}}
        if finish: candidate['finishReason'] = finish
        return httpx.Response(200, headers={'content-type': 'text/event-stream'},
                              text='data: ' + json.dumps({'candidates': [candidate], 'usageMetadata': {
                                  'promptTokenCount': 3, 'candidatesTokenCount': 4,
                                  'thoughtsTokenCount': 2, 'totalTokenCount': 9}}) + '\n\n')
    def factory(**kwargs):
        kwargs['http_options'].httpx_async_client = httpx.AsyncClient(transport=httpx.MockTransport(handler))
        return genai.Client(**kwargs)
    async def run():
        provider = GeminiProvider('test', client_factory=factory)
        messages = [MESSAGES[0], Message(role='assistant', content='previous'), MESSAGES[1]]
        if finish == 'STOP':
            assert [t async for t in provider.stream_reply(messages, api_key=SecretStr('synthetic-key'))] == ['answer']
            assert (provider.usage.input_tokens, provider.usage.output_tokens) == (3, 6)
        else:
            with pytest.raises(ProviderError):
                _ = [t async for t in provider.stream_reply(messages, api_key=SecretStr('synthetic-key'))]
    asyncio.run(run())


@pytest.mark.parametrize('provider', [AnthropicProvider, GeminiProvider])
def test_missing_key_never_creates_client(provider):
    def forbidden(**kwargs): raise AssertionError('No network client should be created')
    async def run():
        with pytest.raises(ProviderError, match='API anahtarı'):
            _ = [t async for t in provider('test', client_factory=forbidden).stream_reply(MESSAGES)]
    asyncio.run(run())


@pytest.mark.parametrize('provider', [AnthropicProvider, GeminiProvider])
def test_errors_do_not_reflect_secrets(provider):
    def broken(**kwargs): raise RuntimeError(kwargs['api_key'])
    async def run():
        with pytest.raises(ProviderError) as caught:
            _ = [t async for t in provider('test', client_factory=broken).stream_reply(MESSAGES, api_key=SecretStr('never-expose-this'))]
        assert 'never-expose-this' not in str(caught.value)
    asyncio.run(run())


def test_connection_auth_is_bound_and_not_persisted(tmp_path):
    from zerocost.storage import Store
    from zerocost.models import ConnectionInput, AgentInput
    from zerocost.sidecar import ChatService
    async def run():
        store = Store(tmp_path / 'cloud.sqlite3')
        events, seen = [], []
        class Provider:
            async def stream_reply(self, messages, *, api_key):
                seen.append(api_key.get_secret_value())
                yield 'answer'
        service = ChatService(store, events.append, lambda *_: Provider())
        for index in range(2):
            store.create_connection(ConnectionInput(name=f'Account {index}', provider='gemini', model_id='test'))
        for connection in store.snapshot().connections:
            store.create_agent(AgentInput(name=connection.name, role='helper', connection_id=connection.id))
        for index, agent in enumerate(store.snapshot().agents):
            raw = json.dumps({'protocol_version': 1, 'request_id': str(index), 'method': 'chat.start',
                              'params': {'run_id': str(index), 'agent_id': agent.id, 'message': 'hello'}})
            denied = await service.handle(raw, auth={'connection_id': 'wrong', 'secret': 'synthetic-secret'})
            assert not denied.ok and not store.history(agent.id).turns
            accepted = await service.handle(raw, auth={'connection_id': agent.connection_id, 'secret': f'synthetic-secret-{index}'})
            assert accepted.ok
            await service.tasks[str(index)]
            assert 'synthetic-secret' not in store.history(agent.id).model_dump_json()
        assert seen == ['synthetic-secret-0', 'synthetic-secret-1']
        assert all('synthetic-secret' not in e.model_dump_json() for e in events)
        await service.close()
        store.close()
        assert all(b'synthetic-secret' not in path.read_bytes() for path in tmp_path.iterdir() if path.is_file())
    asyncio.run(run())
