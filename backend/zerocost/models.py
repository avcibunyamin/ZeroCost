"""Single source of truth for the desktop IPC contract."""
from typing import Annotated, Literal, Union
from pydantic import BaseModel, ConfigDict, Field, StringConstraints, field_validator, model_validator

Name = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=100)]
Identifier = Annotated[str, StringConstraints(min_length=1, max_length=128)]
Provider = Literal["ollama", "lmstudio", "anthropic", "gemini", "openai"]
Permission = Literal["workspace.read"]


class Model(BaseModel):
    model_config = ConfigDict(extra="forbid", strict=True, json_schema_serialization_defaults_required=True)


class ConnectionInput(Model):
    name: Name
    provider: Provider
    model_id: Name


class Connection(ConnectionInput):
    id: str
    # Profiles only: credentials and network integration arrive in the next slice.
    status: Literal["unconfigured"] = "unconfigured"


class AgentInput(Model):
    name: Name
    role: Name
    connection_id: Identifier
    instructions: Annotated[str, StringConstraints(max_length=8000)] = ""


class Agent(AgentInput):
    id: str
    permissions: list[Permission] = Field(default_factory=list)


class WorkspaceInput(Model):
    name: Name
    path: Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=4096)]

    @field_validator("path")
    @classmethod
    def no_null_bytes(cls, value: str) -> str:
        if "\0" in value:
            raise ValueError("Invalid path")
        return value


class Workspace(WorkspaceInput):
    id: str


class Snapshot(Model):
    app_version: Literal["0.1.0"] = "0.1.0"
    protocol_version: Literal[1] = 1
    database_version: int
    connections: list[Connection]
    agents: list[Agent]
    workspaces: list[Workspace]


class RequestBase(Model):
    protocol_version: Literal[1]
    request_id: Identifier


class SnapshotRequest(RequestBase):
    method: Literal["snapshot"]


class ConnectionRequest(RequestBase):
    method: Literal["connection.create"]
    params: ConnectionInput


class AgentRequest(RequestBase):
    method: Literal["agent.create"]
    params: AgentInput


class WorkspaceRequest(RequestBase):
    method: Literal["workspace.create"]
    params: WorkspaceInput


class AgentPermissionsInput(Model):
    agent_id: Identifier
    permissions: list[Permission] = Field(max_length=8)

    @field_validator("permissions")
    @classmethod
    def unique_permissions(cls, value: list[Permission]) -> list[Permission]:
        if len(value) != len(set(value)):
            raise ValueError("Duplicate permission")
        return value


class AgentPermissionsRequest(RequestBase):
    method: Literal["agent.permissions.set"]
    params: AgentPermissionsInput


class WorkspaceTarget(Model):
    agent_id: Identifier
    workspace_id: Identifier
    path: Annotated[str, StringConstraints(max_length=4096)] = ""

    @field_validator("path")
    @classmethod
    def safe_relative_path(cls, value: str) -> str:
        if "\0" in value:
            raise ValueError("Invalid path")
        return value


class WorkspaceListRequest(RequestBase):
    method: Literal["workspace.list"]
    params: WorkspaceTarget


class WorkspaceReadRequest(RequestBase):
    method: Literal["workspace.read"]
    params: WorkspaceTarget


class WorkspaceEntry(Model):
    path: str
    name: str
    kind: Literal["file", "directory"]
    size: int


class WorkspaceListing(Model):
    workspace_id: str
    path: str
    entries: list[WorkspaceEntry]


class WorkspaceFile(Model):
    workspace_id: str
    path: str
    content: str
    size: int


class Failure(Model):
    protocol_version: Literal[1] = 1
    request_id: str
    ok: Literal[False] = False
    code: Literal["invalid_request", "conflict", "not_found", "internal_error"]
    message: str


# Streaming extension. Configuration commands retain their v1 wire shape.
class OllamaModel(Model):
    name: str
    size: int
    capabilities: list[str]


class OllamaModels(Model):
    models: list[OllamaModel]


class ModelsRequest(RequestBase):
    method: Literal["ollama.models"]


class ChatStartInput(Model):
    run_id: Identifier
    agent_id: Identifier
    message: Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=12000)]


class ChatStartRequest(RequestBase):
    method: Literal["chat.start"]
    params: ChatStartInput


class RunInput(Model):
    run_id: Identifier


class CancelRequest(RequestBase):
    method: Literal["chat.cancel"]
    params: RunInput


class HistoryInput(Model):
    agent_id: Identifier


class HistoryRequest(RequestBase):
    method: Literal["chat.history"]
    params: HistoryInput


RunStatus = Literal["running", "completed", "cancelled", "failed", "interrupted"]


class ChatTurn(Model):
    run_id: str
    agent_id: str
    prompt: str
    content: str
    status: RunStatus
    error: str


class ChatHistory(Model):
    turns: list[ChatTurn]


class Accepted(Model):
    run_id: str


class StreamChunk(Model):
    protocol_version: Literal[1] = 1
    type: Literal["stream_chunk"] = "stream_chunk"
    run_id: str
    sequence: int
    token: str
    is_final: Literal[False] = False


class StreamEnd(Model):
    protocol_version: Literal[1] = 1
    type: Literal["stream_end"] = "stream_end"
    run_id: str
    sequence: int
    full_content: str
    status: Literal["completed", "cancelled"]
    is_final: Literal[True] = True


class StreamError(Model):
    protocol_version: Literal[1] = 1
    type: Literal["stream_error"] = "stream_error"
    run_id: str
    sequence: int
    full_content: str
    message: str
    is_final: Literal[True] = True


class TransportError(Model):
    protocol_version: Literal[1] = 1
    type: Literal["transport_error"] = "transport_error"
    message: str


StreamEvent = Union[StreamChunk, StreamEnd, StreamError, TransportError]
class VaultInput(Model):
    connection_id: Identifier
    action: Literal['status', 'save', 'delete']
    secret: str = Field(default='', max_length=4096, repr=False)


class VaultRequest(RequestBase):
    method: Literal['vault']
    params: VaultInput


class VaultStatus(Model):
    connection_id: str
    has_key: bool


OrchestrationStatus = Literal["running", "waiting_approval", "completed", "cancelled", "failed", "interrupted"]
OrchestrationPhase = Literal["analysis", "review", "synthesis"]
RoutingMode = Literal["manual", "auto"]


class OrchestrationStartInput(Model):
    run_id: Identifier
    objective: Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=12000)]
    agent_ids: list[Identifier] = Field(min_length=2, max_length=4)
    rounds: int = Field(default=1, ge=1, le=3)
    routing_mode: RoutingMode = "manual"
    max_model_calls: int = Field(default=5, ge=3, le=13)
    max_output_tokens: int = Field(default=512, ge=128, le=4096)
    max_cost_microusd: int = Field(default=5_000_000, ge=0, le=1_000_000_000)
    workspace_id: Identifier | None = None
    context_paths: list[Annotated[str, StringConstraints(min_length=1, max_length=4096)]] = Field(
        default_factory=list, max_length=10
    )

    @field_validator("agent_ids")
    @classmethod
    def unique_agents(cls, value: list[str]) -> list[str]:
        if len(value) != len(set(value)):
            raise ValueError("Duplicate agent")
        return value

    @field_validator("context_paths")
    @classmethod
    def unique_context_paths(cls, value: list[str]) -> list[str]:
        if len(value) != len(set(value)) or any("\0" in path for path in value):
            raise ValueError("Invalid context paths")
        return value

    @model_validator(mode="after")
    def budget_covers_minimum_team(self):
        if self.max_model_calls < self.rounds * 2 + 1:
            raise ValueError("Model çağrısı bütçesi iki ajan ve sentez için yetersiz")
        if self.context_paths and not self.workspace_id:
            raise ValueError("Bağlam dosyaları için çalışma alanı gerekli")
        return self


class OrchestrationStartRequest(RequestBase):
    method: Literal["orchestration.start"]
    params: OrchestrationStartInput


class OrchestrationCancelRequest(RequestBase):
    method: Literal["orchestration.cancel"]
    params: RunInput


class OrchestrationApprovalInput(Model):
    run_id: Identifier
    decision: Literal["approve", "reject"]


class OrchestrationApprovalRequest(RequestBase):
    method: Literal["orchestration.approve"]
    params: OrchestrationApprovalInput


class OrchestrationHistoryRequest(RequestBase):
    method: Literal["orchestration.history"]


class PricingCatalogRequest(RequestBase):
    method: Literal["pricing.catalog"]


class PriceEntry(Model):
    provider: Literal["anthropic", "gemini"]
    model_pattern: str
    input_per_million_usd: float
    output_per_million_usd: float


class PricingCatalog(Model):
    version: str
    currency: Literal["USD"] = "USD"
    sources: dict[str, str]
    entries: list[PriceEntry]


class OrchestrationMessage(Model):
    sequence: int
    agent_id: str
    phase: OrchestrationPhase
    content: str


class OrchestrationRun(Model):
    run_id: str
    objective: str
    agent_ids: list[str]
    rounds: int
    routing_mode: RoutingMode
    route_reason: str
    max_model_calls: int
    max_output_tokens: int
    used_model_calls: int
    max_cost_microusd: int
    estimated_max_cost_microusd: int
    actual_cost_microusd: int
    input_tokens: int
    output_tokens: int
    price_catalog_version: str
    workspace_id: str | None
    context_paths: list[str]
    status: OrchestrationStatus
    error: str
    messages: list[OrchestrationMessage]


class OrchestrationHistory(Model):
    runs: list[OrchestrationRun]


class OrchestrationChunk(Model):
    protocol_version: Literal[1] = 1
    type: Literal["orchestration_chunk"] = "orchestration_chunk"
    run_id: str
    sequence: int
    agent_id: str
    phase: OrchestrationPhase
    token: str
    is_final: Literal[False] = False


class OrchestrationMessageEnd(Model):
    protocol_version: Literal[1] = 1
    type: Literal["orchestration_message_end"] = "orchestration_message_end"
    run_id: str
    sequence: int
    agent_id: str
    phase: OrchestrationPhase
    full_content: str
    is_final: Literal[False] = False


class OrchestrationEnd(Model):
    protocol_version: Literal[1] = 1
    type: Literal["orchestration_end"] = "orchestration_end"
    run_id: str
    sequence: int
    status: Literal["completed", "cancelled"]
    is_final: Literal[True] = True


class OrchestrationError(Model):
    protocol_version: Literal[1] = 1
    type: Literal["orchestration_error"] = "orchestration_error"
    run_id: str
    sequence: int
    message: str
    is_final: Literal[True] = True


class OrchestrationRoute(Model):
    protocol_version: Literal[1] = 1
    type: Literal["orchestration_route"] = "orchestration_route"
    run_id: str
    sequence: int
    agent_ids: list[str]
    reason: str
    planned_model_calls: int
    max_model_calls: int
    max_output_tokens: int
    estimated_max_cost_microusd: int
    max_cost_microusd: int
    price_catalog_version: str
    is_final: Literal[False] = False


class OrchestrationApprovalRequired(Model):
    protocol_version: Literal[1] = 1
    type: Literal["orchestration_approval_required"] = "orchestration_approval_required"
    run_id: str
    sequence: int
    permission: Literal["workspace.read"] = "workspace.read"
    workspace_id: str
    paths: list[str]
    is_final: Literal[False] = False


class OrchestrationUsage(Model):
    protocol_version: Literal[1] = 1
    type: Literal["orchestration_usage"] = "orchestration_usage"
    run_id: str
    sequence: int
    input_tokens: int
    output_tokens: int
    actual_cost_microusd: int
    is_final: Literal[False] = False


Request = Annotated[Union[SnapshotRequest, ConnectionRequest, AgentRequest, WorkspaceRequest,
                         AgentPermissionsRequest, WorkspaceListRequest, WorkspaceReadRequest,
                         ModelsRequest, ChatStartRequest, CancelRequest, HistoryRequest, VaultRequest,
                         OrchestrationStartRequest, OrchestrationCancelRequest,
                         OrchestrationApprovalRequest, OrchestrationHistoryRequest,
                         PricingCatalogRequest], Field(discriminator="method")]


class Success(Model):
    protocol_version: Literal[1] = 1
    request_id: str
    ok: Literal[True] = True
    result: Union[Snapshot, OllamaModels, ChatHistory, Accepted, VaultStatus,
                  WorkspaceListing, WorkspaceFile, OrchestrationHistory,
                  PricingCatalog]


Response = Union[Success, Failure]


class Contract(Model):
    request: Request
    response: Response
    event: Union[StreamEvent, OrchestrationChunk, OrchestrationMessageEnd,
                 OrchestrationEnd, OrchestrationError, OrchestrationRoute,
                 OrchestrationApprovalRequired, OrchestrationUsage]
