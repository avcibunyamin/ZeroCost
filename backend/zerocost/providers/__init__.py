from .ollama import OllamaProvider


def get_provider(provider: str, model: str, base_url: str = ""):
    if provider in ('anthropic', 'gemini'):
        from .cloud import AnthropicProvider, GeminiProvider
        return (AnthropicProvider if provider == 'anthropic' else GeminiProvider)(model)
    if provider in ("openai", "lmstudio"):
        from .openai_compatible import OpenAIProvider
        return OpenAIProvider(model, profile=provider, base_url=base_url)
    if provider != "ollama":
        raise ValueError("Bu sağlayıcı için sohbet adaptörü henüz hazır değil.")
    return OllamaProvider(model)
