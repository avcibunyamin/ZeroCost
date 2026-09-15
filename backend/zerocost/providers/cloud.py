"""Request-scoped clients. SDK exceptions never cross the IPC boundary."""
import httpx
import json
import logging
from anthropic import AsyncAnthropic
from google import genai
from google.genai import types
from .base import (PermanentProviderError, ProviderAdapter, ProviderError,
                   ProviderToolExchange, RetryableProviderError, TextChunk, ToolCallChunk,
                   provider_exception)
from ..tool_protocol import provider_tool_name
from ..pricing import TokenUsage

# SDK debug logging may include HTTP headers; it must never be enabled in the sidecar.
for name in ('anthropic', 'google.genai', 'google_genai', 'httpx', 'httpcore'):
    logging.getLogger(name).setLevel(logging.CRITICAL)


def split_messages(messages):
    return ('\n\n'.join(m.content for m in messages if m.role == 'system'),
            [m for m in messages if m.role != 'system'])


def require_key(api_key):
    if not api_key:
        raise PermanentProviderError('Bu bağlantıya Model bağlantıları ekranından API anahtarı ekleyin.')
    return api_key.get_secret_value()


class AnthropicProvider(ProviderAdapter):
    def __init__(self, model, client_factory=AsyncAnthropic, transport=None):
        self.model = model
        self.client_factory = client_factory
        self.transport = transport
        self.usage = TokenUsage()

    async def stream_reply(self, messages, *, api_key=None, max_tokens=512,
                           tools=None, tool_exchange: ProviderToolExchange | None = None,
                           disable_tools=False):
        self.usage = TokenUsage()
        key = require_key(api_key)
        system, conversation = split_messages(messages)
        try:
            async with httpx.AsyncClient(trust_env=False, follow_redirects=False, timeout=90, transport=self.transport) as http:
                async with self.client_factory(api_key=key, base_url='https://api.anthropic.com',
                                               max_retries=0, http_client=http) as client:
                    provider_messages = [m.model_dump() for m in conversation]
                    if tool_exchange:
                        blocks = []
                        if tool_exchange.assistant_text:
                            blocks.append({'type': 'text', 'text': tool_exchange.assistant_text})
                        blocks.append({'type': 'tool_use',
                            'id': tool_exchange.provider_call_id or tool_exchange.internal_call_id,
                            'name': provider_tool_name(tool_exchange.tool_name),
                            'input': tool_exchange.arguments})
                        provider_messages.extend([
                            {'role': 'assistant', 'content': blocks},
                            {'role': 'user', 'content': [{'type': 'tool_result',
                                'tool_use_id': tool_exchange.provider_call_id or tool_exchange.internal_call_id,
                                'content': tool_exchange.result}]},
                        ])
                    options = dict(model=self.model, system=system, max_tokens=max_tokens,
                                   messages=provider_messages)
                    if tools:
                        options['tools'] = [{'name': tool['name'],
                                             'description': tool['description'],
                                             'input_schema': tool['parameters']} for tool in tools]
                        if disable_tools:
                            options['tool_choice'] = {'type': 'none'}
                    async with client.messages.stream(**options) as stream:
                        ended = False
                        tool_indexes = set()
                        async for event in stream:
                            if event.type == 'content_block_delta' and event.delta.type == 'text_delta':
                                yield TextChunk(event.delta.text)
                            elif (event.type == 'content_block_start' and
                                  event.content_block.type == 'tool_use'):
                                tool_indexes.add(event.index)
                                initial = event.content_block.input or {}
                                yield ToolCallChunk(index=event.index,
                                    provider_call_id=event.content_block.id,
                                    name_delta=event.content_block.name,
                                    arguments_delta=(json.dumps(initial, ensure_ascii=False,
                                                               sort_keys=True, separators=(',', ':'))
                                                     if initial else ''))
                            elif (event.type == 'content_block_delta' and
                                  event.delta.type == 'input_json_delta'):
                                yield ToolCallChunk(index=event.index,
                                    arguments_delta=event.delta.partial_json)
                            elif event.type == 'content_block_stop' and event.index in tool_indexes:
                                yield ToolCallChunk(index=event.index, is_final=True)
                            if event.type == 'message_stop':
                                ended = True
                        final = await stream.get_final_message()
                        self.usage = TokenUsage(final.usage.input_tokens,
                                                final.usage.output_tokens)
                        valid_reasons = {'end_turn', 'tool_use'} if tools else {'end_turn'}
                        if not ended or final.stop_reason not in valid_reasons:
                            raise PermanentProviderError('Claude yanıtı sınır veya sağlayıcı kararı nedeniyle tamamlanamadı.')
        except ProviderError:
            raise
        except Exception as exc:
            raise provider_exception(
                'Claude isteği başarısız. API anahtarını, model erişimini ve kotayı kontrol edin.',
                exc) from None


class GeminiProvider(ProviderAdapter):
    def __init__(self, model, client_factory=genai.Client):
        self.model = model
        self.client_factory = client_factory
        self.usage = TokenUsage()

    async def stream_reply(self, messages, *, api_key=None, max_tokens=512,
                           tools=None, tool_exchange: ProviderToolExchange | None = None,
                           disable_tools=False):
        self.usage = TokenUsage()
        key = require_key(api_key)
        system, conversation = split_messages(messages)
        config = types.GenerateContentConfig(system_instruction=system, max_output_tokens=max_tokens,
            safety_settings=[types.SafetySetting(category='HARM_CATEGORY_' + category, threshold='BLOCK_NONE')
                             for category in ('HARASSMENT', 'HATE_SPEECH', 'SEXUALLY_EXPLICIT', 'DANGEROUS_CONTENT')])
        if tools:
            config.tools = [types.Tool(function_declarations=[types.FunctionDeclaration(
                name=tool['name'], description=tool['description'],
                parameters_json_schema=tool['parameters']) for tool in tools])]
            if disable_tools:
                config.tool_config = types.ToolConfig(function_calling_config=
                    types.FunctionCallingConfig(mode='NONE'))
        contents = [types.Content(role='model' if m.role == 'assistant' else 'user',
                    parts=[types.Part.from_text(text=m.content)]) for m in conversation]
        if tool_exchange:
            name = provider_tool_name(tool_exchange.tool_name)
            assistant_parts = []
            if tool_exchange.assistant_text:
                assistant_parts.append(types.Part.from_text(text=tool_exchange.assistant_text))
            assistant_parts.append(types.Part(function_call=types.FunctionCall(
                id=tool_exchange.provider_call_id or tool_exchange.internal_call_id,
                name=name, args=tool_exchange.arguments)))
            contents.extend([
                types.Content(role='model', parts=assistant_parts),
                types.Content(role='user', parts=[types.Part(function_response=
                    types.FunctionResponse(
                        id=tool_exchange.provider_call_id or tool_exchange.internal_call_id,
                        name=name, response={'output': tool_exchange.result}))]),
            ])
        client = None
        try:
            client = self.client_factory(api_key=key, vertexai=False, http_options=types.HttpOptions(
                base_url='https://generativelanguage.googleapis.com', timeout=90000,
                retry_options=types.HttpRetryOptions(attempts=1),
                client_args={'trust_env': False, 'follow_redirects': False},
                async_client_args={'trust_env': False, 'follow_redirects': False}))
            finished = False
            async with client.aio as aio:
                async for chunk in await aio.models.generate_content_stream(model=self.model, contents=contents, config=config):
                    if chunk.usage_metadata:
                        meta = chunk.usage_metadata
                        prompt = int(meta.prompt_token_count or 0)
                        visible = int(meta.candidates_token_count or 0)
                        thoughts = int(meta.thoughts_token_count or 0)
                        self.usage = TokenUsage(prompt, visible + thoughts)
                    for candidate in chunk.candidates or []:
                        if candidate.content:
                            for part in candidate.content.parts or []:
                                if part.text and not part.thought:
                                    yield TextChunk(part.text)
                                if part.function_call:
                                    call = part.function_call
                                    yield ToolCallChunk(index=0,
                                        provider_call_id=call.id or '', name_delta=call.name or '',
                                        arguments_delta=json.dumps(dict(call.args or {}),
                                            ensure_ascii=False, sort_keys=True, separators=(',', ':')),
                                        is_final=True)
                        if candidate.finish_reason:
                            if candidate.finish_reason != types.FinishReason.STOP:
                                raise PermanentProviderError('Gemini yanıtı sınır veya sağlayıcı kararı nedeniyle tamamlanamadı.')
                            finished = True
                    if chunk.prompt_feedback and chunk.prompt_feedback.block_reason:
                        raise PermanentProviderError('Gemini isteği sağlayıcı tarafından engellendi.')
            if not finished:
                raise RetryableProviderError('Gemini akışı tamamlanmadan bağlantı kapandı.')
        except ProviderError:
            raise
        except Exception as exc:
            raise provider_exception(
                'Gemini isteği başarısız. API anahtarını, model erişimini ve kotayı kontrol edin.',
                exc) from None
        finally:
            if client is not None:
                client.close()
