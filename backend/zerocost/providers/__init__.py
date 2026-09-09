from .ollama import OllamaProvider


def get_provider(provider: str, model: str):
    if provider in ('anthropic', 'gemini'):
        from .cloud import AnthropicProvider, GeminiProvider
        return (AnthropicProvider if provider == 'anthropic' else GeminiProvider)(model)
    if provider != "ollama":
        raise ValueError("Bu sağlayıcı için sohbet adaptörü henüz hazır değil.")
    return OllamaProvider(model)
