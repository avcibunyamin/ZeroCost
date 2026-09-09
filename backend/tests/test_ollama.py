import asyncio
import json

import httpx

from zerocost.providers.base import Message, ProviderError
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
        {"message": {"role": "assistant", "content": ""}, "done": True},
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
