"""Single source of truth for the desktop IPC contract."""
from typing import Annotated, Literal, Union
from pydantic import BaseModel, ConfigDict, Field, StringConstraints, field_validator, model_validator

Name = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=100)]
Identifier = Annotated[str, StringConstraints(min_length=1, max_length=128)]
SemVer = Annotated[str, StringConstraints(strip_whitespace=True, min_length=5, max_length=20,
                                           pattern=r'^\d+\.\d+\.\d+$')]
Provider = Literal["ollama", "lmstudio", "anthropic", "gemini", "openai"]
Permission = Literal["workspace.read", "workspace.write", "terminal.execute"]
MutationToolName = Literal["workspace.write", "terminal.execute"]
ToolName = Literal["workspace.write", "terminal.execute", "knowledge.search"]
RoutingMode = Literal["manual", "auto"]


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
    fallback_connection_ids: list[Identifier] = Field(default_factory=list, max_length=3)
    permissions: list[Permission] = Field(default_factory=list)
    skill_ids: list[str] = Field(default_factory=list)


class AgentFallbacksInput(Model):
    agent_id: Identifier
    connection_ids: list[Identifier] = Field(default_factory=list, max_length=3)

    @field_validator("connection_ids")
    @classmethod
    def unique_connections(cls, value: list[str]) -> list[str]:
        if len(value) != len(set(value)):
            raise ValueError("Duplicate fallback connection")
        return value


class SkillPackageInput(Model):
    name: Name
    version: SemVer
    description: Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=500)]
    instructions: Annotated[str, StringConstraints(max_length=8000)] = ""
    required_tools: list[ToolName] = Field(default_factory=list, max_length=3)
    required_permissions: list[Permission] = Field(default_factory=list, max_length=3)
    provider_hint: Provider | None = None

    @field_validator("required_tools")
    @classmethod
    def unique_tools(cls, value: list[str]) -> list[str]:
        if len(value) != len(set(value)):
            raise ValueError("Duplicate tool")
        return value

    @field_validator("required_permissions")
    @classmethod
    def unique_permissions(cls, value: list[str]) -> list[str]:
        if len(value) != len(set(value)):
            raise ValueError("Duplicate permission")
        return value

    @model_validator(mode="after")
    def mutation_tools_require_matching_permissions(self):
        missing = [tool for tool in self.required_tools
                   if tool in ("workspace.write", "terminal.execute")
                   and tool not in self.required_permissions]
        if missing:
            raise ValueError(f"Missing permission declaration for: {', '.join(missing)}")
        return self


class SkillPackage(SkillPackageInput):
    id: str


class SkillAssignInput(Model):
    agent_id: Identifier
    skill_id: Identifier


class WorkflowSlotInput(Model):
    name: Name
    required_skill_ids: list[Identifier] = Field(default_factory=list, max_length=8)

    @field_validator("required_skill_ids")
    @classmethod
    def unique_skills(cls, value: list[str]) -> list[str]:
        if len(value) != len(set(value)):
            raise ValueError("Duplicate required skill")
        return value


class WorkflowTemplateInput(Model):
    name: Name
    version: SemVer
    description: Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=500)]
    objective_prefix: Annotated[str, StringConstraints(max_length=4000)] = ""
    agent_slots: list[WorkflowSlotInput] = Field(min_length=2, max_length=4)
    required_tools: list[ToolName] = Field(default_factory=list, max_length=3)
    rounds: int = Field(default=1, ge=1, le=3)
    max_model_calls: int = Field(default=5, ge=3, le=14)
    max_output_tokens: int = Field(default=512, ge=128, le=4096)
    max_cost_microusd: int = Field(default=5_000_000, ge=0, le=1_000_000_000)

    @field_validator("agent_slots")
    @classmethod
    def unique_slots(cls, value: list[WorkflowSlotInput]) -> list[WorkflowSlotInput]:
        names = [slot.name.casefold() for slot in value]
        if len(names) != len(set(names)):
            raise ValueError("Duplicate workflow slot")
        return value

    @field_validator("required_tools")
    @classmethod
    def unique_tools(cls, value: list[str]) -> list[str]:
        if len(value) != len(set(value)):
            raise ValueError("Duplicate workflow tool")
        return value

    @model_validator(mode="after")
    def budget_covers_team(self):
        minimum_calls = self.rounds * len(self.agent_slots) + 1 + ("knowledge.search" in self.required_tools)
        if self.max_model_calls < minimum_calls:
            raise ValueError("Model call budget does not cover workflow")
        return self


class WorkflowTemplate(WorkflowTemplateInput):
    id: str
    archived: bool = False


class WorkflowArchiveInput(Model):
    workflow_id: Identifier


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
    skills: list[SkillPackage] = Field(default_factory=list)
    workflows: list[WorkflowTemplate] = Field(default_factory=list)


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


class AgentFallbacksRequest(RequestBase):
    method: Literal["agent.fallbacks.set"]
    params: AgentFallbacksInput


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


class OrchestrationStartInput(Model):
    run_id: Identifier
    objective: Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=12000)]
    agent_ids: list[Identifier] = Field(min_length=2, max_length=4)
    rounds: int = Field(default=1, ge=1, le=3)
    routing_mode: RoutingMode = "manual"
    max_model_calls: int = Field(default=5, ge=3, le=14)
    max_output_tokens: int = Field(default=512, ge=128, le=4096)
    max_cost_microusd: int = Field(default=5_000_000, ge=0, le=1_000_000_000)
    workspace_id: Identifier | None = None
    context_paths: list[Annotated[str, StringConstraints(min_length=1, max_length=4096)]] = Field(
        default_factory=list, max_length=10
    )
    enabled_tools: list[MutationToolName] = Field(default_factory=list, max_length=2)
    knowledge_collection_ids: list[Identifier] = Field(default_factory=list, max_length=3)
    workflow_id: Identifier | None = None
    workflow_version: SemVer | None = None

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

    @field_validator("enabled_tools")
    @classmethod
    def unique_tools(cls, value: list[MutationToolName]) -> list[MutationToolName]:
        if len(value) != len(set(value)):
            raise ValueError("Duplicate tool")
        return value

    @field_validator("knowledge_collection_ids")
    @classmethod
    def unique_knowledge_collections(cls, value: list[str]) -> list[str]:
        if len(value) != len(set(value)):
            raise ValueError("Duplicate knowledge collection")
        return value

    @model_validator(mode="after")
    def budget_covers_minimum_team(self):
        minimum_calls = self.rounds * 2 + 1 + bool(self.knowledge_collection_ids)
        if self.max_model_calls < minimum_calls:
            raise ValueError("Model çağrısı bütçesi iki ajan ve sentez için yetersiz")
        if self.context_paths and not self.workspace_id:
            raise ValueError("Bağlam dosyaları için çalışma alanı gerekli")
        if self.enabled_tools and not self.workspace_id:
            raise ValueError("Araç kullanımı için çalışma alanı gerekli")
        if (self.workflow_id is None) != (self.workflow_version is None):
            raise ValueError("Workflow kimliği ve sürümü birlikte gönderilmeli")
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


class OrchestrationRetryInput(Model):
    run_id: Identifier
    new_run_id: Identifier


class OrchestrationRetryRequest(RequestBase):
    method: Literal["orchestration.retry"]
    params: OrchestrationRetryInput


class OrchestrationHistoryRequest(RequestBase):
    method: Literal["orchestration.history"]


class PricingCatalogRequest(RequestBase):
    method: Literal["pricing.catalog"]


class SkillCreateRequest(RequestBase):
    method: Literal["skill.create"]
    params: SkillPackageInput


class SkillAssignRequest(RequestBase):
    method: Literal["skill.assign"]
    params: SkillAssignInput


class SkillUnassignRequest(RequestBase):
    method: Literal["skill.unassign"]
    params: SkillAssignInput


class WorkflowCreateRequest(RequestBase):
    method: Literal["workflow.create"]
    params: WorkflowTemplateInput


class WorkflowArchiveRequest(RequestBase):
    method: Literal["workflow.archive"]
    params: WorkflowArchiveInput


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


class EmbeddingModel(Model):
    name: str
    size: int


class KnowledgeCollectionInput(Model):
    name: Name
    embedding_provider: Literal["ollama"] = "ollama"
    embedding_model: Name


class KnowledgeCollection(KnowledgeCollectionInput):
    id: str
    dimensions: int
    source_count: int
    chunk_count: int


class KnowledgeSnapshot(Model):
    collections: list[KnowledgeCollection]
    embedding_models: list[EmbeddingModel]
    embedding_error: str = ""


class KnowledgeSnapshotRequest(RequestBase):
    method: Literal["knowledge.snapshot"]


class KnowledgeCollectionCreateRequest(RequestBase):
    method: Literal["knowledge.collection.create"]
    params: KnowledgeCollectionInput


class KnowledgeSourceIngestInput(Model):
    collection_id: Identifier
    workspace_id: Identifier
    path: Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=4096)]

    @field_validator("path")
    @classmethod
    def no_null_bytes(cls, value: str) -> str:
        if "\0" in value:
            raise ValueError("Invalid path")
        return value


class KnowledgeSourceIngestRequest(RequestBase):
    method: Literal["knowledge.source.ingest"]
    params: KnowledgeSourceIngestInput


class KnowledgeIngestionResult(Model):
    collection_id: str
    workspace_id: str
    path: str
    status: Literal["indexed", "unchanged"]
    chunk_count: int
    embedded_count: int
    reused_count: int


class KnowledgeIngestionProgress(Model):
    protocol_version: Literal[1] = 1
    type: Literal["knowledge_ingestion_progress"] = "knowledge_ingestion_progress"
    request_id: Identifier
    sequence: int = Field(ge=1)
    collection_id: str
    workspace_id: str
    path: Annotated[str, StringConstraints(max_length=4096)]
    stage: Literal["reading", "parsing", "chunking", "embedding", "committing", "completed"]
    completed_units: int = Field(ge=0)
    total_units: int = Field(ge=0)
    progress_percent: int = Field(ge=0, le=100)
    message: Annotated[str, StringConstraints(min_length=1, max_length=240)]
    is_final: bool = False

    @model_validator(mode="after")
    def consistent_progress(self):
        if self.completed_units > self.total_units:
            raise ValueError("Completed units exceed total units")
        if self.is_final != (self.stage == "completed"):
            raise ValueError("Only the completed stage is final")
        if self.stage == "completed" and self.progress_percent != 100:
            raise ValueError("Completed progress must be 100")
        return self


class KnowledgeSearchInput(Model):
    collection_id: Identifier
    query: Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=2000)]
    limit: int = Field(default=5, ge=1, le=10)


class KnowledgeSearchRequest(RequestBase):
    method: Literal["knowledge.search"]
    params: KnowledgeSearchInput


class KnowledgeSearchHit(Model):
    chunk_id: str
    collection_id: str
    collection_name: str
    workspace_id: str
    source_path: str
    ordinal: int
    start_line: int
    end_line: int
    content: Annotated[str, StringConstraints(max_length=3200)]
    rrf_score: float = Field(ge=0)
    fts_rank: int | None = Field(default=None, ge=1)
    vector_rank: int | None = Field(default=None, ge=1)
    cosine_similarity: float | None = Field(default=None, ge=-1, le=1)


class KnowledgeSearchResult(Model):
    collection_id: str
    query: str
    hits: list[KnowledgeSearchHit] = Field(max_length=10)


class OrchestrationMessage(Model):
    sequence: int
    agent_id: str
    phase: OrchestrationPhase
    content: str


class ToolAction(Model):
    tool: ToolName
    path: str = ""
    command: list[str] = Field(default_factory=list)
    collection_id: str = ""
    query: str = ""
    limit: int = Field(default=5, ge=1, le=10)
    preview: str = ""
    risk: Literal["medium", "high"]
    status: Literal["waiting", "approved", "executing", "uncertain", "rejected", "completed", "failed"]
    args_hash: str = ""
    content_hash: str = ""
    result: str = ""


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
    enabled_tools: list[MutationToolName]
    knowledge_collection_ids: list[str]
    workflow_id: str | None
    workflow_version: str | None
    attempt: int
    parent_run_id: str | None
    resumed_from_node: str
    failed_node: str
    error_class: Literal["", "retryable", "permanent", "uncertain_tool"]
    cumulative_model_calls: int
    cumulative_cost_microusd: int
    fallback_chain: list[list[str]] = Field(default_factory=list)
    model_call_attempts: list["ModelCallAttempt"] = Field(default_factory=list)
    tool_action: ToolAction | None
    status: OrchestrationStatus
    error: str
    messages: list[OrchestrationMessage]


class OrchestrationHistory(Model):
    runs: list[OrchestrationRun]


class ModelCallAttempt(Model):
    id: str
    run_id: str
    node_name: str
    connection_id: str
    attempt: int
    outcome: Literal["success", "retryable", "permanent", "budget_exceeded", "skipped"]
    error_message: str
    input_tokens: int
    output_tokens: int
    cost_microusd: int
    started_at: str
    duration_ms: int


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
    error_class: Literal["retryable", "permanent"] = "permanent"
    failed_node: str = ""
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
    permission: Permission
    workspace_id: str
    paths: list[str] = Field(default_factory=list)
    tool: ToolName | None = None
    path: str = ""
    command: list[str] = Field(default_factory=list)
    preview: str = ""
    risk: Literal["medium", "high"] | None = None
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


class OrchestrationToolResult(Model):
    protocol_version: Literal[1] = 1
    type: Literal["orchestration_tool_result"] = "orchestration_tool_result"
    run_id: str
    sequence: int
    tool: ToolName
    status: Literal["completed", "failed"]
    result: str
    is_final: Literal[False] = False


class OrchestrationRetrying(Model):
    protocol_version: Literal[1] = 1
    type: Literal["orchestration_retrying"] = "orchestration_retrying"
    run_id: str
    sequence: int
    agent_id: str
    phase: OrchestrationPhase
    attempt: int = Field(ge=2, le=3)
    message: str
    is_final: Literal[False] = False


class OrchestrationFallback(Model):
    protocol_version: Literal[1] = 1
    type: Literal["orchestration_fallback"] = "orchestration_fallback"
    run_id: str
    sequence: int
    agent_id: str
    phase: OrchestrationPhase
    from_connection_id: str
    to_connection_id: str
    message: str
    is_final: Literal[False] = False


Request = Annotated[Union[SnapshotRequest, ConnectionRequest, AgentRequest, WorkspaceRequest,
                         AgentPermissionsRequest, AgentFallbacksRequest,
                         WorkspaceListRequest, WorkspaceReadRequest,
                         ModelsRequest, ChatStartRequest, CancelRequest, HistoryRequest, VaultRequest,
                         OrchestrationStartRequest, OrchestrationCancelRequest,
                         OrchestrationApprovalRequest, OrchestrationRetryRequest,
                         OrchestrationHistoryRequest,
                         PricingCatalogRequest, SkillCreateRequest, SkillAssignRequest,
                         SkillUnassignRequest, WorkflowCreateRequest, WorkflowArchiveRequest,
                         KnowledgeSnapshotRequest,
                         KnowledgeCollectionCreateRequest,
                         KnowledgeSourceIngestRequest, KnowledgeSearchRequest],
                        Field(discriminator="method")]


class Success(Model):
    protocol_version: Literal[1] = 1
    request_id: str
    ok: Literal[True] = True
    result: Union[Snapshot, OllamaModels, ChatHistory, Accepted, VaultStatus,
                  WorkspaceListing, WorkspaceFile, OrchestrationHistory,
                  PricingCatalog, KnowledgeSnapshot, KnowledgeIngestionResult,
                  KnowledgeSearchResult]


Response = Union[Success, Failure]


class Contract(Model):
    request: Request
    response: Response
    event: Union[StreamEvent, OrchestrationChunk, OrchestrationMessageEnd,
                 OrchestrationEnd, OrchestrationError, OrchestrationRoute,
                 OrchestrationApprovalRequired, OrchestrationUsage,
                 OrchestrationToolResult, OrchestrationRetrying, OrchestrationFallback,
                 KnowledgeIngestionProgress]
