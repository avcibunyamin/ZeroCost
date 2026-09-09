from abc import ABC, abstractmethod
from typing import AsyncIterator
from pydantic import BaseModel
from typing import Literal


class Message(BaseModel):
    role: Literal["system", "user", "assistant"]
    content: str


class ProviderError(Exception):
    """Safe, user-facing provider failure."""


class ProviderAdapter(ABC):
    @abstractmethod
    def stream_reply(self, messages: list[Message], *, api_key=None,
                     max_tokens: int = 512) -> AsyncIterator[str]:
        """Yield content deltas. Return only on a verified provider end marker."""
        raise NotImplementedError
