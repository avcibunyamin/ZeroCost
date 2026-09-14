"""One bounded OpenAI-compatible adapter with trusted provider profiles."""
import json
import re
from typing import AsyncIterator
import httpx
from .base import (Message, PermanentProviderError, ProviderAdapter, ProviderError,
                   RetryableProviderError)
from ..models import OllamaModel, OllamaModels
from ..pricing import TokenUsage

OPENAI_URL = "https://api.openai.com/v1"
LM_STUDIO_URL = "http://127.0.0.1:1234/v1"


class OpenAIProvider(ProviderAdapter):
    def __init__(self, model: str, *, profile: str = "openai", base_url: str = "",
                 transport=None):
        if profile not in ("openai", "lmstudio"):
            raise ValueError("OpenAI-compatible profile is invalid")
        self.model = model
        self.profile = profile
        self.base_url = OPENAI_URL if profile == "openai" else (base_url or LM_STUDIO_URL)
        self.transport = transport
        self.usage = TokenUsage()

    def client(self, api_key=None):
        headers = {}
        if api_key:
            headers["Authorization"] = f"Bearer {api_key.get_secret_value()}"
        return httpx.AsyncClient(
            base_url=self.base_url, headers=headers, transport=self.transport,
            timeout=httpx.Timeout(90, connect=3), trust_env=False, follow_redirects=False)

    def _key(self, api_key):
        if self.profile == "openai" and not api_key:
            raise PermanentProviderError(
                "Bu bağlantıya Model bağlantıları ekranından API anahtarı ekleyin.")
        return api_key

    @staticmethod
    def _http_error(status: int, retry_after: str | None = None):
        message = f"OpenAI uyumlu sağlayıcı isteği reddetti (HTTP {status})."
        if status == 429 or status >= 500 or status in (408, 409, 425):
            delay = None
            if retry_after is not None:
                try:
                    delay = max(0.0, float(retry_after))
                except ValueError:
                    pass
            return RetryableProviderError(message, delay)
        return PermanentProviderError(message)

    async def list_models(self, *, api_key=None) -> OllamaModels:
        self._key(api_key)
        try:
            async with self.client(api_key) as client:
                response = await client.get("/models", timeout=3)
                if response.status_code >= 300:
                    raise self._http_error(response.status_code,
                                           response.headers.get("retry-after"))
                payload = response.json()
                items = payload.get("data") if isinstance(payload, dict) else None
                if not isinstance(items, list):
                    raise PermanentProviderError("Model listesi biçimi geçersiz.")
                names = sorted({item.get("id") for item in items[:500]
                                if isinstance(item, dict) and isinstance(item.get("id"), str)
                                and 0 < len(item["id"]) <= 200}, key=str.casefold)
                return OllamaModels(models=[OllamaModel(
                    name=name, size=0, capabilities=["completion"]) for name in names])
        except ProviderError:
            raise
        except httpx.TimeoutException as exc:
            raise RetryableProviderError("Model keşfi 3 saniyede tamamlanamadı.") from exc
        except httpx.HTTPError as exc:
            raise RetryableProviderError("Model keşfi bağlantısı kurulamadı.") from exc
        except (ValueError, TypeError, KeyError) as exc:
            raise PermanentProviderError("Model listesi geçersiz JSON içeriyor.") from exc

    async def stream_reply(self, messages: list[Message], *, api_key=None,
                           max_tokens: int = 512) -> AsyncIterator[str]:
        self.usage = TokenUsage()
        self._key(api_key)
        request = {
            "model": self.model,
            "messages": [message.model_dump() for message in messages],
            "stream": True,
            "stream_options": {"include_usage": True},
        }
        # OpenAI's reasoning models renamed this Chat Completions parameter.
        token_parameter = ("max_completion_tokens"
                           if self.profile == "openai" and
                           re.match(r"^o[134](?:-|$)", self.model.casefold())
                           else "max_tokens")
        request[token_parameter] = max_tokens
        try:
            async with self.client(api_key) as client:
                async with client.stream("POST", "/chat/completions",
                                         json=request) as response:
                    if response.status_code >= 300:
                        raise self._http_error(response.status_code,
                                               response.headers.get("retry-after"))
                    buffer = b""
                    done = False
                    finished = False
                    async for raw in response.aiter_bytes():
                        buffer = (buffer + raw).replace(b"\r\n", b"\n")
                        if len(buffer) > 1024 * 1024:
                            raise PermanentProviderError("SSE olay boyutu sınırı aşıldı.")
                        while b"\n\n" in buffer:
                            frame, buffer = buffer.split(b"\n\n", 1)
                            data_lines = [line[5:].strip() for line in frame.split(b"\n")
                                          if line.startswith(b"data:")]
                            if not data_lines:
                                continue
                            encoded = b"\n".join(data_lines)
                            if encoded == b"[DONE]":
                                done = True
                                break
                            payload = json.loads(encoded)
                            if not isinstance(payload, dict) or payload.get("error"):
                                raise PermanentProviderError("Sağlayıcı akış hatası bildirdi.")
                            usage = payload.get("usage")
                            if isinstance(usage, dict):
                                self.usage = TokenUsage(
                                    int(usage.get("prompt_tokens") or 0),
                                    int(usage.get("completion_tokens") or 0))
                            choices = payload.get("choices", [])
                            if not isinstance(choices, list):
                                raise PermanentProviderError("SSE seçim listesi geçersiz.")
                            for choice in choices:
                                if not isinstance(choice, dict):
                                    raise PermanentProviderError("SSE seçim biçimi geçersiz.")
                                delta = choice.get("delta") or {}
                                token = delta.get("content") if isinstance(delta, dict) else None
                                if token is not None and not isinstance(token, str):
                                    raise PermanentProviderError("SSE metin biçimi geçersiz.")
                                if token:
                                    yield token
                                reason = choice.get("finish_reason")
                                if reason is not None:
                                    if reason != "stop":
                                        raise PermanentProviderError(
                                            "Model yanıtı sınır veya sağlayıcı kararı nedeniyle tamamlanamadı.")
                                    finished = True
                        if done:
                            break
                    if not done:
                        raise RetryableProviderError(
                            "OpenAI uyumlu akış [DONE] işareti olmadan kapandı.")
                    if not finished:
                        raise PermanentProviderError(
                            "OpenAI uyumlu akış bitiş nedeni bildirmedi.")
        except ProviderError:
            raise
        except httpx.TimeoutException as exc:
            raise RetryableProviderError("OpenAI uyumlu model yanıtı zaman aşımına uğradı.") from exc
        except httpx.HTTPError as exc:
            raise RetryableProviderError("OpenAI uyumlu bağlantı kurulamadı veya kesildi.") from exc
        except (ValueError, TypeError, KeyError) as exc:
            raise PermanentProviderError("OpenAI uyumlu sağlayıcı geçersiz SSE gönderdi.") from exc
