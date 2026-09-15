import pytest

from zerocost.providers.base import PermanentProviderError, ToolCallChunk
from zerocost.tool_protocol import ToolCallAssembler, tool_declarations


def test_streamed_tool_call_fragments_converge_to_provider_neutral_shape():
    assembler = ToolCallAssembler()
    assembler.add(ToolCallChunk(0, 'provider-7', 'workspace_', '{"path":"a.md",'))
    assembler.add(ToolCallChunk(0, '', 'write', '"content":"hello"}', True))
    assert assembler.finish() == [{
        'provider_call_id': 'provider-7', 'tool': 'workspace.write',
        'path': 'a.md', 'content': 'hello'}]


def test_streamed_tool_call_rejects_invalid_json_and_identity_changes():
    assembler = ToolCallAssembler()
    assembler.add(ToolCallChunk(0, 'first', 'knowledge.search', '{bad'))
    with pytest.raises(PermanentProviderError, match='geçerli JSON'):
        assembler.finish()
    with pytest.raises(PermanentProviderError, match='kimliğini'):
        assembler.add(ToolCallChunk(0, 'second'))

    reserved = ToolCallAssembler()
    reserved.add(ToolCallChunk(0, '', 'knowledge_search',
                               '{"query":"x","tool":"workspace.write"}', True))
    with pytest.raises(PermanentProviderError, match='ayrılmış'):
        reserved.finish()


def test_tool_declarations_only_expose_enabled_capabilities():
    declarations = tool_declarations(['workspace.write'], ['collection-a'])
    assert [item['name'] for item in declarations] == ['workspace_write', 'knowledge_search']
    assert declarations[1]['parameters']['properties']['collection_id']['enum'] == ['collection-a']
