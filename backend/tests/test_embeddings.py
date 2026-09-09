import asyncio
import json
import math
import httpx
import pytest

from zerocost.embeddings import OllamaEmbeddings
from zerocost.providers.base import ProviderError


def test_embedding_model_discovery_uses_capabilities():
    async def handler(request):
        if request.url.path == '/api/tags':
            return httpx.Response(200, json={'models': [
                {'name': 'chat', 'size': 20, 'capabilities': ['completion']},
                {'name': 'embed', 'size': 10, 'capabilities': ['embedding']},
            ]})
        raise AssertionError(request.url.path)

    result = asyncio.run(OllamaEmbeddings(transport=httpx.MockTransport(handler)).list_models())
    assert result == [{'name': 'embed', 'size': 10}]


def test_embed_is_bounded_validated_and_normalized():
    async def handler(request):
        assert request.url.path == '/api/embed'
        body = json.loads(request.content)
        assert body == {'model': 'embed', 'input': ['bir', 'iki'], 'truncate': False}
        return httpx.Response(200, json={'embeddings': [[3, 4], [0, 2]]})

    vectors = asyncio.run(OllamaEmbeddings('embed', httpx.MockTransport(handler)).embed(['bir', 'iki']))
    assert vectors[0] == pytest.approx([0.6, 0.8])
    assert math.sqrt(sum(value * value for value in vectors[1])) == pytest.approx(1.0)


def test_embed_rejects_malformed_or_zero_vectors():
    async def handler(_request):
        return httpx.Response(200, json={'embeddings': [[0, 0]]})

    with pytest.raises(ProviderError, match='geçerli embedding'):
        asyncio.run(OllamaEmbeddings('embed', httpx.MockTransport(handler)).embed(['text']))
