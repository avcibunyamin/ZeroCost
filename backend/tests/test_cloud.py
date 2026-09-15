import asyncio
import json
import httpx
import pytest
from pydantic import SecretStr
from google import genai
from zerocost.providers.cloud import AnthropicProvider, GeminiProvider
from zerocost.providers.openai_compatible import OpenAIProvider
from zerocost.providers.base import (Message, TextChunk, ToolCallChunk, PermanentProviderError, ProviderError, RetryableProviderError,
                                     provider_exception)
from zerocost.pricing import TokenUsage
from zerocost.models import ConnectionInput, OllamaModel, OllamaModels
from zerocost.sidecar import ChatService
from zerocost.storage import Store

MESSAGES = [Message(role='system', content='instructions'), Message(role='user', content='hello')]
TOOLS = [{'name': 'workspace_write', 'description': 'write', 'parameters': {
    'type': 'object', 'properties': {'path': {'type': 'string'}}, 'required': ['path']}}]


def test_openai_streams_fragmented_native_tool_call():
    def handler(request):
        body = json.loads(request.content)
        assert body['tools'] == [{'type': 'function', 'function': TOOLS[0]}]
        frames = [
            {'choices': [{'delta': {'tool_calls': [{'index': 0, 'id': 'call-provider',
                'function': {'name': 'workspace_', 'arguments': '{"path":'}}]},
                'finish_reason': None}]},
            {'choices': [{'delta': {'tool_calls': [{'index': 0,
                'function': {'name': 'write', 'arguments': '"README.md"}'}}]},
                'finish_reason': 'tool_calls'}]},
            {'choices': [], 'usage': {'prompt_tokens': 4, 'completion_tokens': 3}},
        ]
        return httpx.Response(200, headers={'content-type': 'text/event-stream'},
            text=''.join(f'data: {json.dumps(frame)}\n\n' for frame in frames) +
                 'data: [DONE]\n\n')

    async def run():
        provider = OpenAIProvider('gpt-4o-mini', transport=httpx.MockTransport(handler))
        events = [event async for event in provider.stream_reply(
            MESSAGES, api_key=SecretStr('synthetic-key'), tools=TOOLS)]
        assert events == [
            ToolCallChunk(0, 'call-provider', 'workspace_', '{"path":'),
            ToolCallChunk(0, '', 'write', '"README.md"}'),
        ]
        assert provider.usage == TokenUsage(4, 3)
    asyncio.run(run())


def test_anthropic_streams_native_tool_use_blocks():
    def handler(request):
        body = json.loads(request.content)
        assert body['tools'] == [{'name': 'workspace_write', 'description': 'write',
                                  'input_schema': TOOLS[0]['parameters']}]
        frames = [
            ('message_start', {'type': 'message_start', 'message': {'id': 'msg', 'type': 'message',
                'role': 'assistant', 'model': 'test', 'content': [], 'stop_reason': None,
                'stop_sequence': None, 'usage': {'input_tokens': 2, 'output_tokens': 0}}}),
            ('content_block_start', {'type': 'content_block_start', 'index': 0,
                'content_block': {'type': 'tool_use', 'id': 'toolu-provider',
                                  'name': 'workspace_write', 'input': {}}}),
            ('content_block_delta', {'type': 'content_block_delta', 'index': 0,
                'delta': {'type': 'input_json_delta', 'partial_json': '{"path":"README.md"}'}}),
            ('content_block_stop', {'type': 'content_block_stop', 'index': 0}),
            ('message_delta', {'type': 'message_delta', 'delta': {'stop_reason': 'tool_use',
                'stop_sequence': None}, 'usage': {'output_tokens': 3}}),
            ('message_stop', {'type': 'message_stop'}),
        ]
        return httpx.Response(200, headers={'content-type': 'text/event-stream'},
            text=''.join(f'event: {kind}\ndata: {json.dumps(data)}\n\n' for kind, data in frames))

    async def run():
        provider = AnthropicProvider('test', transport=httpx.MockTransport(handler))
        events = [event async for event in provider.stream_reply(
            MESSAGES, api_key=SecretStr('synthetic-key'), tools=TOOLS)]
        assert events == [
            ToolCallChunk(0, 'toolu-provider', 'workspace_write', ''),
            ToolCallChunk(0, '', '', '{"path":"README.md"}'),
            ToolCallChunk(0, '', '', '', True),
        ]
        assert provider.usage == TokenUsage(2, 3)
    asyncio.run(run())


def test_gemini_streams_native_function_call():
    def handler(request):
        body = json.loads(request.content)
        declarations = body['tools'][0]['functionDeclarations']
        assert declarations[0]['name'] == 'workspace_write'
        candidate = {'content': {'role': 'model', 'parts': [{'functionCall': {
            'id': 'gemini-provider', 'name': 'workspace_write',
            'args': {'path': 'README.md'}}}]}, 'finishReason': 'STOP'}
        return httpx.Response(200, headers={'content-type': 'text/event-stream'},
            text='data: ' + json.dumps({'candidates': [candidate], 'usageMetadata': {
                'promptTokenCount': 2, 'candidatesTokenCount': 1, 'totalTokenCount': 3}}) + '\n\n')

    def factory(**kwargs):
        kwargs['http_options'].httpx_async_client = httpx.AsyncClient(
            transport=httpx.MockTransport(handler))
        return genai.Client(**kwargs)

    async def run():
        provider = GeminiProvider('test', client_factory=factory)
        events = [event async for event in provider.stream_reply(
            MESSAGES, api_key=SecretStr('synthetic-key'), tools=TOOLS)]
        assert events == [ToolCallChunk(0, 'gemini-provider', 'workspace_write',
                                        '{"path":"README.md"}', True)]
        assert provider.usage == TokenUsage(2, 1)
    asyncio.run(run())


def test_retry_after_is_extracted_without_exposing_provider_response():
    response = httpx.Response(429, headers={'Retry-After': '12'})
    error = provider_exception('Sağlayıcı geçici olarak sınırladı.',
                               httpx.HTTPStatusError('secret upstream body',
                                                     request=httpx.Request('GET', 'https://example.test'),
                                                     response=response))
    assert isinstance(error, RetryableProviderError)
    assert error.retry_after_seconds == 12
    assert 'secret upstream body' not in str(error)


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
            assert [t async for t in provider.stream_reply(MESSAGES, api_key=SecretStr('synthetic-key'))] == [TextChunk('merhaba')]
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
            assert [t async for t in provider.stream_reply(messages, api_key=SecretStr('synthetic-key'))] == [TextChunk('answer')]
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


def test_openai_compatible_stream_auth_done_and_usage():
    def handler(request):
        assert request.url == httpx.URL('https://api.openai.com/v1/chat/completions')
        assert request.headers['authorization'] == 'Bearer synthetic-key'
        body = json.loads(request.content)
        assert body['messages'] == [message.model_dump() for message in MESSAGES]
        assert body['stream_options'] == {'include_usage': True}
        assert body['max_tokens'] == 512
        assert 'max_completion_tokens' not in body
        frames = [
            {'choices': [{'delta': {'content': 'mer'}, 'finish_reason': None}]},
            {'choices': [{'delta': {'content': 'haba'}, 'finish_reason': 'stop'}]},
            {'choices': [], 'usage': {'prompt_tokens': 3, 'completion_tokens': 2}},
        ]
        text = ''.join(f'data: {json.dumps(frame)}\r\n\r\n' for frame in frames)
        return httpx.Response(200, headers={'content-type': 'text/event-stream'},
                              text=text + 'data: [DONE]\r\n\r\n')

    async def run():
        provider = OpenAIProvider('gpt-4o-mini', transport=httpx.MockTransport(handler))
        tokens = [token async for token in provider.stream_reply(
            MESSAGES, api_key=SecretStr('synthetic-key'))]
        assert tokens == [TextChunk('mer'), TextChunk('haba')]
        assert provider.usage == TokenUsage(3, 2)
    asyncio.run(run())


def test_openai_reasoning_model_uses_completion_token_parameter():
    def handler(request):
        body = json.loads(request.content)
        assert body['max_completion_tokens'] == 321
        assert 'max_tokens' not in body
        return httpx.Response(200, headers={'content-type': 'text/event-stream'},
                              text=('data: {"choices":[{"delta":{"content":"ok"},'
                                    '"finish_reason":"stop"}]}\n\n'
                                    'data: [DONE]\n\n'))

    async def run():
        provider = OpenAIProvider('o4-mini', transport=httpx.MockTransport(handler))
        assert [token async for token in provider.stream_reply(
            MESSAGES, api_key=SecretStr('synthetic-key'), max_tokens=321)] == [TextChunk('ok')]
    asyncio.run(run())


def test_lmstudio_uses_same_adapter_without_api_key_and_requires_done():
    def handler(request):
        assert request.url == httpx.URL('http://127.0.0.1:1234/v1/chat/completions')
        assert 'authorization' not in request.headers
        return httpx.Response(200, headers={'content-type': 'text/event-stream'},
                              text='data: {"choices":[{"delta":{"content":"partial"},"finish_reason":"stop"}]}\n\n')

    async def run():
        provider = OpenAIProvider('local', profile='lmstudio',
                                  transport=httpx.MockTransport(handler))
        with pytest.raises(RetryableProviderError, match=r'\[DONE\]'):
            _ = [token async for token in provider.stream_reply(MESSAGES)]
    asyncio.run(run())


@pytest.mark.parametrize(('status', 'error_type'), [
    (401, PermanentProviderError), (429, RetryableProviderError),
    (500, RetryableProviderError),
])
def test_openai_http_status_classification(status, error_type):
    def handler(_request):
        return httpx.Response(status, headers={'retry-after': '12'})

    async def run():
        provider = OpenAIProvider('gpt-4o-mini', transport=httpx.MockTransport(handler))
        with pytest.raises(error_type) as caught:
            _ = [token async for token in provider.stream_reply(
                MESSAGES, api_key=SecretStr('synthetic-key'))]
        if status == 429:
            assert caught.value.retry_after_seconds == 12
    asyncio.run(run())


def test_openai_compatible_model_discovery_is_bounded_and_typed():
    def handler(request):
        assert request.url.path == '/v1/models'
        return httpx.Response(200, json={'data': [
            {'id': 'gpt-4o-mini'}, {'id': 'gpt-4o'}, {'id': 'gpt-4o-mini'}]})

    async def run():
        provider = OpenAIProvider('gpt-4o-mini', transport=httpx.MockTransport(handler))
        result = await provider.list_models(api_key=SecretStr('synthetic-key'))
        assert [model.name for model in result.models] == ['gpt-4o', 'gpt-4o-mini']
        assert all(model.capabilities == ['completion'] for model in result.models)
    asyncio.run(run())


def test_connection_model_discovery_requires_openai_key_but_not_lmstudio(tmp_path):
    async def run():
        store = Store(tmp_path / 'discovery.sqlite3')
        store.create_connection(ConnectionInput(
            name='OpenAI', provider='openai', model_id='gpt-4o-mini'))
        store.create_connection(ConnectionInput(
            name='LM Studio', provider='lmstudio', model_id='local'))
        connections = {item.provider: item for item in store.snapshot().connections}
        seen = []

        class DiscoveryProvider:
            async def list_models(self, *, api_key=None):
                seen.append(api_key.get_secret_value() if api_key else None)
                return OllamaModels(models=[OllamaModel(
                    name='available', size=0, capabilities=['completion'])])

        def factory(provider, model, base_url):
            seen.append((provider, model, base_url))
            return DiscoveryProvider()

        service = ChatService(store, lambda _: None, factory)
        raw = lambda connection_id: json.dumps({
            'protocol_version': 1, 'request_id': connection_id,
            'method': 'connection.models', 'params': {'connection_id': connection_id}})
        denied = await service.handle(raw(connections['openai'].id))
        assert not denied.ok and 'API anahtarını' in denied.message
        openai = await service.handle(raw(connections['openai'].id), auth={
            'connection_id': connections['openai'].id, 'secret': 'synthetic-key'})
        local = await service.handle(raw(connections['lmstudio'].id))
        assert openai.ok and local.ok
        assert ('openai', 'gpt-4o-mini', 'https://api.openai.com/v1') in seen
        assert ('lmstudio', 'local', 'http://127.0.0.1:1234/v1') in seen
        assert 'synthetic-key' in seen and None in seen
        await service.close()
        store.close()
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
