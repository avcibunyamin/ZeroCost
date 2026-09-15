"""Provider-neutral tool declarations and bounded streamed call assembly."""
from __future__ import annotations
import json
from .providers.base import PermanentProviderError, ToolCallChunk

MAX_TOOL_ARGUMENT_BYTES = 160 * 1024
PROVIDER_TOOL_NAMES = {
    'workspace.write': 'workspace_write',
    'terminal.execute': 'terminal_execute',
    'knowledge.search': 'knowledge_search',
}
INTERNAL_TOOL_NAMES = {external: internal for internal, external in PROVIDER_TOOL_NAMES.items()}
MAX_MODEL_TOOL_RESULT_CHARS = 24_000
MAX_MODEL_TOOL_RESULT_LINES = 200


def provider_tool_name(name: str) -> str:
    return PROVIDER_TOOL_NAMES.get(name, name)


def tool_result_for_model(tool_name: str, result: str, arguments: dict) -> str:
    """Keep the durable full result while bounding the copy sent to a model."""
    if tool_name == 'workspace.write':
        content = arguments.get('content', '')
        path = arguments.get('path', '')
        return f'File written: {path} ({len(str(content).encode("utf-8"))} bytes).'
    lines = result.splitlines()
    truncated = len(lines) > MAX_MODEL_TOOL_RESULT_LINES or len(result) > MAX_MODEL_TOOL_RESULT_CHARS
    if truncated:
        tail = '\n'.join(lines[-MAX_MODEL_TOOL_RESULT_LINES:])
        tail = tail[-MAX_MODEL_TOOL_RESULT_CHARS:]
        return '[output truncated, showing last 200 lines]\n' + tail
    return result


def tool_declarations(enabled_tools: list[str], collection_ids: list[str]):
    declarations = []
    if 'workspace.write' in enabled_tools:
        declarations.append({
            'name': PROVIDER_TOOL_NAMES['workspace.write'],
            'description': 'Çalışma alanındaki bir metin dosyasının tam içeriğini değiştirir; kullanıcı onayı gerekir.',
            'parameters': {'type': 'object', 'additionalProperties': False,
                           'properties': {
                               'path': {'type': 'string', 'minLength': 1, 'maxLength': 4096},
                               'content': {'type': 'string', 'maxLength': 131072}},
                           'required': ['path', 'content']},
        })
    if 'terminal.execute' in enabled_tools:
        declarations.append({
            'name': PROVIDER_TOOL_NAMES['terminal.execute'],
            'description': 'İzin listesindeki bir programı shell olmadan çalıştırır; kullanıcı onayı gerekir.',
            'parameters': {'type': 'object', 'additionalProperties': False,
                           'properties': {
                               'command': {'type': 'array', 'minItems': 1, 'maxItems': 64,
                                           'items': {'type': 'string', 'maxLength': 4096}},
                               'cwd': {'type': 'string', 'maxLength': 4096}},
                           'required': ['command']},
        })
    if collection_ids:
        declarations.append({
            'name': PROVIDER_TOOL_NAMES['knowledge.search'],
            'description': 'Yalnız seçilmiş yerel bilgi koleksiyonlarından kanıt arar.',
            'parameters': {'type': 'object', 'additionalProperties': False,
                           'properties': {
                               'collection_id': {'type': 'string', 'enum': collection_ids},
                               'query': {'type': 'string', 'minLength': 1, 'maxLength': 2000},
                               'limit': {'type': 'integer', 'minimum': 1, 'maximum': 10}},
                           'required': ['collection_id', 'query']},
        })
    return declarations


class ToolCallAssembler:
    def __init__(self):
        self.calls: dict[int, dict[str, str | bool]] = {}

    def add(self, chunk: ToolCallChunk):
        call = self.calls.setdefault(chunk.index, {
            'provider_call_id': '', 'name': '', 'arguments': '', 'final': False})
        if chunk.provider_call_id:
            existing = str(call['provider_call_id'])
            if existing and existing != chunk.provider_call_id:
                raise PermanentProviderError(
                    'Sağlayıcı araç çağrısı kimliğini akış sırasında değiştirdi.')
            call['provider_call_id'] = chunk.provider_call_id
        call['name'] = str(call['name']) + chunk.name_delta
        call['arguments'] = str(call['arguments']) + chunk.arguments_delta
        call['final'] = bool(call['final']) or chunk.is_final
        if len(str(call['name'])) > 100 or len(str(call['arguments']).encode('utf-8')) > MAX_TOOL_ARGUMENT_BYTES:
            raise PermanentProviderError('Araç çağrısı boyut sınırını aştı.')

    def finish(self):
        values = []
        for index in sorted(self.calls):
            call = self.calls[index]
            name = str(call['name'])
            raw = str(call['arguments']) or '{}'
            try:
                arguments = json.loads(raw)
            except json.JSONDecodeError:
                raise PermanentProviderError(
                    'Sağlayıcı araç argümanları geçerli JSON değil.') from None
            if not name or not isinstance(arguments, dict):
                raise PermanentProviderError('Sağlayıcı araç çağrısı eksik veya geçersiz.')
            if {'tool', 'provider_call_id'} & arguments.keys():
                raise PermanentProviderError('Araç argümanları ayrılmış protokol alanı içeriyor.')
            values.append({**arguments,
                           'provider_call_id': str(call['provider_call_id']),
                           'tool': INTERNAL_TOOL_NAMES.get(name, name)})
        return values
