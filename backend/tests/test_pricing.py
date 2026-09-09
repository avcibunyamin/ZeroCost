import pytest
from zerocost.pricing import CATALOG_VERSION, TokenUsage, cost_microusd, price_for


def test_versioned_catalog_prices_known_models_and_local_is_zero():
    assert CATALOG_VERSION == '2026-09-09'
    assert cost_microusd('gemini', 'gemini-2.5-flash', TokenUsage(1_000_000, 1_000_000)) == 2_800_000
    assert cost_microusd('anthropic', 'claude-sonnet-4-5-20250929', TokenUsage(1000, 1000)) == 18_000
    assert cost_microusd('ollama', 'anything', TokenUsage(999_999, 999_999)) == 0


def test_unknown_cloud_model_fails_closed_and_long_gemini_uses_high_tier():
    with pytest.raises(ValueError, match='güvenilir fiyat yok'):
        price_for('gemini', 'future-unknown')
    price = price_for('gemini', 'gemini-2.5-pro', 200_001)
    assert (str(price.input_per_million), str(price.output_per_million)) == ('2.50', '15')
