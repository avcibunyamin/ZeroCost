"""Request-scoped clients. SDK exceptions never cross the IPC boundary."""
import httpx
import logging
from anthropic import AsyncAnthropic
from google import genai
from google.genai import types
from .base import (PermanentProviderError, ProviderAdapter, ProviderError,
                   RetryableProviderError, provider_exception)
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

    async def stream_reply(self, messages, *, api_key=None, max_tokens=512):
        self.usage = TokenUsage()
        key = require_key(api_key)
        system, conversation = split_messages(messages)
        try:
            async with httpx.AsyncClient(trust_env=False, follow_redirects=False, timeout=90, transport=self.transport) as http:
                async with self.client_factory(api_key=key, base_url='https://api.anthropic.com',
                                               max_retries=0, http_client=http) as client:
                    async with client.messages.stream(model=self.model, system=system, max_tokens=max_tokens,
                            messages=[m.model_dump() for m in conversation]) as stream:
                        ended = False
                        async for event in stream:
                            if event.type == 'content_block_delta' and event.delta.type == 'text_delta':
                                yield event.delta.text
                            if event.type == 'message_stop':
                                ended = True
                        final = await stream.get_final_message()
                        self.usage = TokenUsage(final.usage.input_tokens,
                                                final.usage.output_tokens)
                        if not ended or final.stop_reason != 'end_turn':
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

    async def stream_reply(self, messages, *, api_key=None, max_tokens=512):
        self.usage = TokenUsage()
        key = require_key(api_key)
        system, conversation = split_messages(messages)
        config = types.GenerateContentConfig(system_instruction=system, max_output_tokens=max_tokens,
            safety_settings=[types.SafetySetting(category='HARM_CATEGORY_' + category, threshold='BLOCK_NONE')
                             for category in ('HARASSMENT', 'HATE_SPEECH', 'SEXUALLY_EXPLICIT', 'DANGEROUS_CONTENT')])
        contents = [types.Content(role='model' if m.role == 'assistant' else 'user',
                    parts=[types.Part.from_text(text=m.content)]) for m in conversation]
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
                                    yield part.text
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
