import pytest
from zerocost.pricing import (CATALOG_VERSION, TokenUsage, cost_microusd,
                              price_for, pricing_warning)


def test_versioned_catalog_prices_known_models_and_local_is_zero():
    assert CATALOG_VERSION == '2026-09-14'
    assert cost_microusd('gemini', 'gemini-2.5-flash', TokenUsage(1_000_000, 1_000_000)) == 2_800_000
    assert cost_microusd('anthropic', 'claude-sonnet-4-5-20250929', TokenUsage(1000, 1000)) == 18_000
    assert cost_microusd('ollama', 'anything', TokenUsage(999_999, 999_999)) == 0
    assert cost_microusd('lmstudio', 'anything', TokenUsage(999_999, 999_999)) == 0
    assert cost_microusd('openai', 'gpt-4o-mini', TokenUsage(1_000_000, 1_000_000)) == 750_000
    assert cost_microusd('openai', 'gpt-4o', TokenUsage(1_000_000, 1_000_000)) == 12_500_000
    assert cost_microusd('openai', 'o3', TokenUsage(1_000_000, 1_000_000)) == 10_000_000
    assert cost_microusd('openai', 'o4-mini', TokenUsage(1_000_000, 1_000_000)) == 5_500_000


def test_unknown_cloud_model_fails_closed_and_long_gemini_uses_high_tier():
    with pytest.raises(ValueError, match='güvenilir fiyat yok'):
        price_for('gemini', 'future-unknown')
    price = price_for('gemini', 'gemini-2.5-pro', 200_001)
    assert (str(price.input_per_million), str(price.output_per_million)) == ('2.50', '15')


def test_unknown_openai_model_has_zero_known_cost_and_explicit_warning():
    from types import SimpleNamespace
    connection = SimpleNamespace(id='c', provider='openai', model_id='future-model')
    agent = SimpleNamespace(id='a', connection_id='c', fallback_connection_ids=[])
    snapshot = SimpleNamespace(connections=[connection], agents=[agent])
    with pytest.raises(ValueError, match='güvenilir fiyat yok'):
        price_for('openai', 'future-model')
    with pytest.raises(ValueError, match='güvenilir fiyat yok'):
        price_for('openai', 'third-party-gpt-4o')
    assert cost_microusd('openai', 'future-model', TokenUsage(10, 20)) == 0
    assert 'sağlayıcı faturası oluşabilir' in pricing_warning(snapshot, ['a'])
