from abc import ABC, abstractmethod
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from typing import AsyncIterator, Any
from dataclasses import dataclass
from pydantic import BaseModel
from typing import Literal
from ..pricing import TokenUsage


class Message(BaseModel):
    role: Literal["system", "user", "assistant"]
    content: str


@dataclass(frozen=True)
class TextChunk:
    text: str


@dataclass(frozen=True)
class ToolCallChunk:
    """Provider-neutral fragment; orchestration owns the durable call identity."""
    index: int
    provider_call_id: str = ""
    name_delta: str = ""
    arguments_delta: str = ""
    is_final: bool = False


@dataclass(frozen=True)
class ProviderToolExchange:
    """The completed tool turn that a provider must continue."""
    internal_call_id: str
    provider_call_id: str
    tool_name: str
    arguments: dict[str, Any]
    result: str
    assistant_text: str = ""


class ProviderError(Exception):
    """Safe, user-facing provider failure."""


class RetryableProviderError(ProviderError):
    """A transient failure for which repeating an LLM call is safe."""

    def __init__(self, message: str, retry_after_seconds: float | None = None):
        super().__init__(message)
        self.retry_after_seconds = retry_after_seconds


class PermanentProviderError(ProviderError):
    """A request/configuration failure that must not be retried."""


def provider_exception(message: str, exc: Exception) -> ProviderError:
    status = getattr(exc, "status_code", None)
    if status is None:
        status = getattr(exc, "code", None)
    if status is None:
        response = getattr(exc, "response", None)
        status = getattr(response, "status_code", None)
    transient = status in (408, 409, 425, 429) or isinstance(status, int) and status >= 500
    name = type(exc).__name__.casefold()
    transient = transient or any(token in name for token in (
        "timeout", "connection", "network", "serviceunavailable", "ratelimit"))
    if not transient:
        return PermanentProviderError(message)
    response = getattr(exc, "response", None)
    headers = getattr(response, "headers", {}) or {}
    raw_retry_after = headers.get("retry-after") or headers.get("Retry-After")
    retry_after = None
    if raw_retry_after is not None:
        try:
            retry_after = max(0.0, float(raw_retry_after))
        except (TypeError, ValueError):
            try:
                retry_after = max(0.0, (parsedate_to_datetime(str(raw_retry_after)) -
                                  datetime.now(timezone.utc)).total_seconds())
            except (TypeError, ValueError, OverflowError):
                pass
    return RetryableProviderError(message, retry_after)


class ProviderAdapter(ABC):
    usage = TokenUsage()
    @abstractmethod
    def stream_reply(self, messages: list[Message], *, api_key=None,
                     max_tokens: int = 512,
                     tools: list[dict] | None = None,
                     tool_exchange: ProviderToolExchange | None = None,
                     disable_tools: bool = False) -> AsyncIterator[TextChunk | ToolCallChunk]:
        """Yield typed text/tool deltas and require a verified provider end marker."""
        raise NotImplementedError
