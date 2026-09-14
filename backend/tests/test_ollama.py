import asyncio
import json

import httpx

from zerocost.providers.base import (Message, PermanentProviderError, ProviderError,
                                     RetryableProviderError)
from zerocost.providers.ollama import OllamaProvider


def test_model_discovery_filters_embeddings_and_prefers_tool_models():
    async def handler(request):
        assert request.url.path == "/api/tags"
        return httpx.Response(200, json={"models": [
            {"name": "embed", "size": 10, "capabilities": ["embedding"]},
            {"name": "small-chat", "size": 20, "capabilities": ["completion"]},
            {"name": "tool-chat", "size": 30, "capabilities": ["completion", "tools"]},
        ]})

    async def scenario():
        result = await OllamaProvider("", httpx.MockTransport(handler)).list_models()
        assert [model.name for model in result.models] == ["tool-chat", "small-chat"]

    asyncio.run(scenario())


def test_ndjson_stream_yields_only_content_and_requires_done():
    lines = [
        {"message": {"role": "assistant", "content": "mer"}, "done": False},
        {"message": {"role": "assistant", "content": "haba"}, "done": False},
        {"message": {"role": "assistant", "content": ""}, "done": True,
         "prompt_eval_count": 3, "eval_count": 2},
    ]

    async def handler(request):
        assert request.url.path == "/api/chat"
        body = json.loads(request.content)
        assert body["stream"] is True
        return httpx.Response(200, content="\n".join(json.dumps(line) for line in lines) + "\n")

    async def scenario():
        provider = OllamaProvider("model", httpx.MockTransport(handler))
        chunks = [chunk async for chunk in provider.stream_reply([Message(role="user", content="hi")])]
        assert chunks == ["mer", "haba"]
        assert (provider.usage.input_tokens, provider.usage.output_tokens) == (3, 2)

    asyncio.run(scenario())


def test_truncated_stream_is_not_reported_as_complete():
    async def handler(_request):
        return httpx.Response(200, content='{"message":{"content":"partial"},"done":false}\n')

    async def scenario():
        provider = OllamaProvider("model", httpx.MockTransport(handler))
        try:
            _ = [chunk async for chunk in provider.stream_reply([Message(role="user", content="hi")])]
        except ProviderError as error:
            assert "tamamlanma işareti" in str(error)
        else:
            raise AssertionError("Truncated stream was accepted")

    asyncio.run(scenario())


def test_http_status_is_classified_for_retry_safety():
    async def collect(status):
        async def handler(_request):
            return httpx.Response(status)
        provider = OllamaProvider("model", httpx.MockTransport(handler))
        return [chunk async for chunk in provider.stream_reply([Message(role="user", content="hi")])]

    async def scenario():
        try:
            await collect(503)
        except RetryableProviderError:
            pass
        else:
            raise AssertionError("503 was not classified as retryable")
        try:
            await collect(404)
        except PermanentProviderError:
            pass
        else:
            raise AssertionError("404 was not classified as permanent")

    asyncio.run(scenario())
