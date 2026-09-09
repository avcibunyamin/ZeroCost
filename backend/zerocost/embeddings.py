"""Local embedding adapters with bounded, validated vector responses."""
from __future__ import annotations
import math
import httpx
from .providers.base import ProviderError
from .providers.ollama import OLLAMA_URL

MAX_EMBED_INPUTS = 32
MAX_EMBED_CHARS = 128_000
MAX_EMBED_RESPONSE = 16 * 1024 * 1024


class OllamaEmbeddings:
    def __init__(self, model: str = '', transport=None):
        self.model = model
        self.transport = transport

    def client(self):
        return httpx.AsyncClient(base_url=OLLAMA_URL, transport=self.transport,
            timeout=httpx.Timeout(90, connect=3), trust_env=False, follow_redirects=False)

    async def list_models(self):
        try:
            async with self.client() as client:
                response = await client.get('/api/tags', timeout=5)
                response.raise_for_status()
                models = []
                for item in response.json()['models'][:100]:
                    capabilities = item.get('capabilities')
                    if capabilities is None:
                        detail = await client.post('/api/show', json={'model': item['name']}, timeout=5)
                        detail.raise_for_status()
                        capabilities = detail.json().get('capabilities', [])
                    if 'embedding' in capabilities:
                        models.append({'name': item['name'], 'size': int(item['size'])})
                return sorted(models, key=lambda item: item['name'].casefold())
        except (httpx.HTTPError, ValueError, KeyError, TypeError) as exc:
            raise ProviderError('Ollama embedding modelleri okunamadı.') from exc

    async def embed(self, texts: list[str]):
        if not texts or len(texts) > MAX_EMBED_INPUTS or any(not isinstance(text, str) or not text for text in texts):
            raise ProviderError('Embedding girdisi 1–32 dolu metin içermeli.')
        if sum(len(text) for text in texts) > MAX_EMBED_CHARS:
            raise ProviderError('Embedding girdisi toplam 128.000 karakter sınırını aşıyor.')
        try:
            async with self.client() as client:
                response = await client.post('/api/embed', json={
                    'model': self.model, 'input': texts, 'truncate': False,
                })
                if response.status_code == 404:
                    raise ProviderError('Embedding modeli bulunamadı.')
                response.raise_for_status()
                if len(response.content) > MAX_EMBED_RESPONSE:
                    raise ProviderError('Embedding yanıtı boyut sınırını aştı.')
                vectors = response.json()['embeddings']
            if len(vectors) != len(texts) or not vectors:
                raise ValueError
            dimension = len(vectors[0])
            if not 1 <= dimension <= 8192 or any(len(vector) != dimension for vector in vectors):
                raise ValueError
            normalized = []
            for vector in vectors:
                values = [float(value) for value in vector]
                if any(not math.isfinite(value) for value in values):
                    raise ValueError
                norm = math.sqrt(sum(value * value for value in values))
                if norm == 0:
                    raise ValueError
                normalized.append([value / norm for value in values])
            return normalized
        except ProviderError:
            raise
        except (httpx.HTTPError, ValueError, KeyError, TypeError):
            raise ProviderError('Ollama geçerli embedding yanıtı vermedi.') from None
