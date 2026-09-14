import json
from typing import AsyncIterator
import httpx
from .base import (Message, PermanentProviderError, ProviderAdapter, ProviderError,
                   RetryableProviderError)
from ..models import OllamaModel, OllamaModels
from ..pricing import TokenUsage

OLLAMA_URL = "http://127.0.0.1:11434"


class OllamaProvider(ProviderAdapter):
    def __init__(self, model: str, transport=None):
        self.model = model
        self.transport = transport
        self.usage = TokenUsage()

    def client(self):
        return httpx.AsyncClient(base_url=OLLAMA_URL, transport=self.transport,
                                 timeout=httpx.Timeout(90, connect=3), trust_env=False,
                                 follow_redirects=False)

    async def list_models(self) -> OllamaModels:
        try:
            async with self.client() as client:
                response = await client.get('/api/tags', timeout=5)
                response.raise_for_status()
                models = []
                for item in response.json()['models'][:100]:
                    capabilities = item.get('capabilities')
                    if capabilities is None:
                        details = await client.post('/api/show', json={'model': item['name']}, timeout=5)
                        details.raise_for_status()
                        capabilities = details.json().get('capabilities', [])
                    # Only completion-capable installed models are offered for chat.
                    if 'completion' in capabilities:
                        models.append(OllamaModel(name=item['name'], size=item['size'], capabilities=capabilities))
                # Native tool-capable models are generally better chat defaults.
                models.sort(key=lambda item: ('tools' in item.capabilities, item.size), reverse=True)
                return OllamaModels(models=models)
        except (httpx.HTTPError, ValueError, KeyError, TypeError) as exc:
            raise ProviderError('Ollama modelleri okunamadı. Ollama uygulamasının açık olduğunu kontrol edin.') from exc

    async def stream_reply(self, messages: list[Message], *, api_key=None,
                           max_tokens: int = 512) -> AsyncIterator[str]:
        self.usage = TokenUsage()
        try:
            async with self.client() as client:
                async with client.stream('POST', '/api/chat', json={
                    'model': self.model, 'messages': [m.model_dump() for m in messages],
                    'stream': True, 'options': {'num_predict': max_tokens},
                }) as response:
                    if response.status_code == 404:
                        raise PermanentProviderError('Model bulunamadı. Kurulu bir Ollama modeli seçin.')
                    if response.status_code >= 300:
                        error = (RetryableProviderError if response.status_code == 429 or
                                 response.status_code >= 500 else PermanentProviderError)
                        raise error(f'Ollama isteği reddetti (HTTP {response.status_code}).')
                    # Bound each NDJSON frame, including a server that never emits a newline.
                    buffer = b''
                    async for chunk in response.aiter_bytes():
                        buffer += chunk
                        if len(buffer) > 1024 * 1024:
                            raise ProviderError('Ollama yanıt satırı boyut sınırını aştı.')
                        while b'\n' in buffer:
                            line, buffer = buffer.split(b'\n', 1)
                            if not line.strip():
                                continue
                            data = json.loads(line)
                            if not isinstance(data, dict) or data.get('error'):
                                raise ProviderError('Ollama üretim sırasında hata bildirdi.')
                            message = data.get('message', {})
                            if not isinstance(message, dict):
                                raise ProviderError('Ollama mesaj biçimi geçersiz.')
                            token = message.get('content', '')
                            if not isinstance(token, str):
                                raise ProviderError('Ollama metin biçimi geçersiz.')
                            if token:
                                yield token
                            if data.get('done') is True:
                                self.usage = TokenUsage(int(data.get('prompt_eval_count', 0)),
                                                        int(data.get('eval_count', 0)))
                                return
                    # Ollama NDJSON normally ends with a newline; accept a final un-delimited frame too.
                    if buffer.strip():
                        data = json.loads(buffer)
                        if isinstance(data, dict) and data.get('done') is True and not data.get('error'):
                            token = data.get('message', {}).get('content', '')
                            if not isinstance(token, str):
                                raise ProviderError('Ollama metin biçimi geçersiz.')
                            if token:
                                yield token
                            self.usage = TokenUsage(int(data.get('prompt_eval_count', 0)),
                                                    int(data.get('eval_count', 0)))
                            return
                    raise RetryableProviderError('Ollama akışı tamamlanma işareti olmadan kapandı.')
        except httpx.TimeoutException as exc:
            raise RetryableProviderError('Ollama yanıtı zaman aşımına uğradı.') from exc
        except httpx.HTTPError as exc:
            raise RetryableProviderError('Ollama bağlantısı kurulamadı veya kesildi.') from exc
        except (ValueError, TypeError, AttributeError) as exc:
            raise PermanentProviderError('Ollama geçersiz JSON yanıtı gönderdi.') from exc
