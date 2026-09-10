/* Generated from Pydantic. Do not edit. Run npm run schema:generate. */

export type Request =
  | SnapshotRequest
  | ConnectionRequest
  | AgentRequest
  | WorkspaceRequest
  | AgentPermissionsRequest
  | WorkspaceListRequest
  | WorkspaceReadRequest
  | ModelsRequest
  | ChatStartRequest
  | CancelRequest
  | HistoryRequest
  | VaultRequest
  | OrchestrationStartRequest
  | OrchestrationCancelRequest
  | OrchestrationApprovalRequest
  | OrchestrationHistoryRequest
  | PricingCatalogRequest
  | KnowledgeSnapshotRequest
  | KnowledgeCollectionCreateRequest
  | KnowledgeSourceIngestRequest;
export type ProtocolVersion = 1;
export type RequestId = string;
export type Method = "snapshot";
export type ProtocolVersion1 = 1;
export type RequestId1 = string;
export type Method1 = "connection.create";
export type Name = string;
export type Provider = "ollama" | "lmstudio" | "anthropic" | "gemini" | "openai";
export type ModelId = string;
export type ProtocolVersion2 = 1;
export type RequestId2 = string;
export type Method2 = "agent.create";
export type Name1 = string;
export type Role = string;
export type ConnectionId = string;
export type Instructions = string;
export type ProtocolVersion3 = 1;
export type RequestId3 = string;
export type Method3 = "workspace.create";
export type Name2 = string;
export type Path = string;
export type ProtocolVersion4 = 1;
export type RequestId4 = string;
export type Method4 = "agent.permissions.set";
export type AgentId = string;
/**
 * @maxItems 8
 */
export type Permissions =
  | []
  | ["workspace.read" | "workspace.write" | "terminal.execute"]
  | [
      "workspace.read" | "workspace.write" | "terminal.execute",
      "workspace.read" | "workspace.write" | "terminal.execute"
    ]
  | [
      "workspace.read" | "workspace.write" | "terminal.execute",
      "workspace.read" | "workspace.write" | "terminal.execute",
      "workspace.read" | "workspace.write" | "terminal.execute"
    ]
  | [
      "workspace.read" | "workspace.write" | "terminal.execute",
      "workspace.read" | "workspace.write" | "terminal.execute",
      "workspace.read" | "workspace.write" | "terminal.execute",
      "workspace.read" | "workspace.write" | "terminal.execute"
    ]
  | [
      "workspace.read" | "workspace.write" | "terminal.execute",
      "workspace.read" | "workspace.write" | "terminal.execute",
      "workspace.read" | "workspace.write" | "terminal.execute",
      "workspace.read" | "workspace.write" | "terminal.execute",
      "workspace.read" | "workspace.write" | "terminal.execute"
    ]
  | [
      "workspace.read" | "workspace.write" | "terminal.execute",
      "workspace.read" | "workspace.write" | "terminal.execute",
      "workspace.read" | "workspace.write" | "terminal.execute",
      "workspace.read" | "workspace.write" | "terminal.execute",
      "workspace.read" | "workspace.write" | "terminal.execute",
      "workspace.read" | "workspace.write" | "terminal.execute"
    ]
  | [
      "workspace.read" | "workspace.write" | "terminal.execute",
      "workspace.read" | "workspace.write" | "terminal.execute",
      "workspace.read" | "workspace.write" | "terminal.execute",
      "workspace.read" | "workspace.write" | "terminal.execute",
      "workspace.read" | "workspace.write" | "terminal.execute",
      "workspace.read" | "workspace.write" | "terminal.execute",
      "workspace.read" | "workspace.write" | "terminal.execute"
    ]
  | [
      "workspace.read" | "workspace.write" | "terminal.execute",
      "workspace.read" | "workspace.write" | "terminal.execute",
      "workspace.read" | "workspace.write" | "terminal.execute",
      "workspace.read" | "workspace.write" | "terminal.execute",
      "workspace.read" | "workspace.write" | "terminal.execute",
      "workspace.read" | "workspace.write" | "terminal.execute",
      "workspace.read" | "workspace.write" | "terminal.execute",
      "workspace.read" | "workspace.write" | "terminal.execute"
    ];
export type ProtocolVersion5 = 1;
export type RequestId5 = string;
export type Method5 = "workspace.list";
export type AgentId1 = string;
export type WorkspaceId = string;
export type Path1 = string;
export type ProtocolVersion6 = 1;
export type RequestId6 = string;
export type Method6 = "workspace.read";
export type ProtocolVersion7 = 1;
export type RequestId7 = string;
export type Method7 = "ollama.models";
export type ProtocolVersion8 = 1;
export type RequestId8 = string;
export type Method8 = "chat.start";
export type RunId = string;
export type AgentId2 = string;
export type Message = string;
export type ProtocolVersion9 = 1;
export type RequestId9 = string;
export type Method9 = "chat.cancel";
export type RunId1 = string;
export type ProtocolVersion10 = 1;
export type RequestId10 = string;
export type Method10 = "chat.history";
export type AgentId3 = string;
export type ProtocolVersion11 = 1;
export type RequestId11 = string;
export type Method11 = "vault";
export type ConnectionId1 = string;
export type Action = "status" | "save" | "delete";
export type Secret = string;
export type ProtocolVersion12 = 1;
export type RequestId12 = string;
export type Method12 = "orchestration.start";
export type RunId2 = string;
export type Objective = string;
/**
 * @minItems 2
 * @maxItems 4
 */
export type AgentIds = [string, string] | [string, string, string] | [string, string, string, string];
export type Rounds = number;
export type RoutingMode = "manual" | "auto";
export type MaxModelCalls = number;
export type MaxOutputTokens = number;
export type MaxCostMicrousd = number;
export type WorkspaceId1 = string | null;
/**
 * @maxItems 10
 */
export type ContextPaths =
  | []
  | [string]
  | [string, string]
  | [string, string, string]
  | [string, string, string, string]
  | [string, string, string, string, string]
  | [string, string, string, string, string, string]
  | [string, string, string, string, string, string, string]
  | [string, string, string, string, string, string, string, string]
  | [string, string, string, string, string, string, string, string, string]
  | [string, string, string, string, string, string, string, string, string, string];
/**
 * @maxItems 2
 */
export type EnabledTools =
  | []
  | ["workspace.write" | "terminal.execute"]
  | ["workspace.write" | "terminal.execute", "workspace.write" | "terminal.execute"];
export type ProtocolVersion13 = 1;
export type RequestId13 = string;
export type Method13 = "orchestration.cancel";
export type ProtocolVersion14 = 1;
export type RequestId14 = string;
export type Method14 = "orchestration.approve";
export type RunId3 = string;
export type Decision = "approve" | "reject";
export type ProtocolVersion15 = 1;
export type RequestId15 = string;
export type Method15 = "orchestration.history";
export type ProtocolVersion16 = 1;
export type RequestId16 = string;
export type Method16 = "pricing.catalog";
export type ProtocolVersion17 = 1;
export type RequestId17 = string;
export type Method17 = "knowledge.snapshot";
export type ProtocolVersion18 = 1;
export type RequestId18 = string;
export type Method18 = "knowledge.collection.create";
export type Name3 = string;
export type EmbeddingProvider = "ollama";
export type EmbeddingModel = string;
export type ProtocolVersion19 = 1;
export type RequestId19 = string;
export type Method19 = "knowledge.source.ingest";
export type CollectionId = string;
export type WorkspaceId2 = string;
export type Path2 = string;
export type Response = Success | Failure;
export type ProtocolVersion20 = 1;
export type RequestId20 = string;
export type Ok = true;
export type Result =
  | Snapshot
  | OllamaModels
  | ChatHistory
  | Accepted
  | VaultStatus
  | WorkspaceListing
  | WorkspaceFile
  | OrchestrationHistory
  | PricingCatalog
  | KnowledgeSnapshot
  | KnowledgeIngestionResult;
export type AppVersion = "0.1.0";
export type ProtocolVersion21 = 1;
export type DatabaseVersion = number;
export type Name4 = string;
export type Provider1 = "ollama" | "lmstudio" | "anthropic" | "gemini" | "openai";
export type ModelId1 = string;
export type Id = string;
export type Status = "unconfigured";
export type Connections = Connection[];
export type Name5 = string;
export type Role1 = string;
export type ConnectionId2 = string;
export type Instructions1 = string;
export type Id1 = string;
export type Permissions1 = ("workspace.read" | "workspace.write" | "terminal.execute")[];
export type Agents = Agent[];
export type Name6 = string;
export type Path3 = string;
export type Id2 = string;
export type Workspaces = Workspace[];
export type Name7 = string;
export type Size = number;
export type Capabilities = string[];
export type Models = OllamaModel[];
export type RunId4 = string;
export type AgentId4 = string;
export type Prompt = string;
export type Content = string;
export type Status1 = "running" | "completed" | "cancelled" | "failed" | "interrupted";
export type Error = string;
export type Turns = ChatTurn[];
export type RunId5 = string;
export type ConnectionId3 = string;
export type HasKey = boolean;
export type WorkspaceId3 = string;
export type Path4 = string;
export type Path5 = string;
export type Name8 = string;
export type Kind = "file" | "directory";
export type Size1 = number;
export type Entries = WorkspaceEntry[];
export type WorkspaceId4 = string;
export type Path6 = string;
export type Content1 = string;
export type Size2 = number;
export type RunId6 = string;
export type Objective1 = string;
export type AgentIds1 = string[];
export type Rounds1 = number;
export type RoutingMode1 = "manual" | "auto";
export type RouteReason = string;
export type MaxModelCalls1 = number;
export type MaxOutputTokens1 = number;
export type UsedModelCalls = number;
export type MaxCostMicrousd1 = number;
export type EstimatedMaxCostMicrousd = number;
export type ActualCostMicrousd = number;
export type InputTokens = number;
export type OutputTokens = number;
export type PriceCatalogVersion = string;
export type WorkspaceId5 = string | null;
export type ContextPaths1 = string[];
export type EnabledTools1 = ("workspace.write" | "terminal.execute")[];
export type Tool = "workspace.write" | "terminal.execute";
export type Path7 = string;
export type Command = string[];
export type Preview = string;
export type Risk = "medium" | "high";
export type Status2 = "waiting" | "approved" | "rejected" | "completed" | "failed";
export type Result1 = string;
export type Status3 = "running" | "waiting_approval" | "completed" | "cancelled" | "failed" | "interrupted";
export type Error1 = string;
export type Sequence = number;
export type AgentId5 = string;
export type Phase = "analysis" | "review" | "synthesis";
export type Content2 = string;
export type Messages = OrchestrationMessage[];
export type Runs = OrchestrationRun[];
export type Version = string;
export type Currency = "USD";
export type Provider2 = "anthropic" | "gemini";
export type ModelPattern = string;
export type InputPerMillionUsd = number;
export type OutputPerMillionUsd = number;
export type Entries1 = PriceEntry[];
export type Name9 = string;
export type EmbeddingProvider1 = "ollama";
export type EmbeddingModel1 = string;
export type Id3 = string;
export type Dimensions = number;
export type SourceCount = number;
export type ChunkCount = number;
export type Collections = KnowledgeCollection[];
export type Name10 = string;
export type Size3 = number;
export type EmbeddingModels = EmbeddingModel2[];
export type EmbeddingError = string;
export type CollectionId1 = string;
export type WorkspaceId6 = string;
export type Path8 = string;
export type Status4 = "indexed" | "unchanged";
export type ChunkCount1 = number;
export type EmbeddedCount = number;
export type ReusedCount = number;
export type ProtocolVersion22 = 1;
export type RequestId21 = string;
export type Ok1 = false;
export type Code = "invalid_request" | "conflict" | "not_found" | "internal_error";
export type Message1 = string;
export type Event =
  | StreamChunk
  | StreamEnd
  | StreamError
  | TransportError
  | OrchestrationChunk
  | OrchestrationMessageEnd
  | OrchestrationEnd
  | OrchestrationError
  | OrchestrationRoute
  | OrchestrationApprovalRequired
  | OrchestrationUsage
  | OrchestrationToolResult
  | KnowledgeIngestionProgress;
export type ProtocolVersion23 = 1;
export type Type = "stream_chunk";
export type RunId7 = string;
export type Sequence1 = number;
export type Token = string;
export type IsFinal = false;
export type ProtocolVersion24 = 1;
export type Type1 = "stream_end";
export type RunId8 = string;
export type Sequence2 = number;
export type FullContent = string;
export type Status5 = "completed" | "cancelled";
export type IsFinal1 = true;
export type ProtocolVersion25 = 1;
export type Type2 = "stream_error";
export type RunId9 = string;
export type Sequence3 = number;
export type FullContent1 = string;
export type Message2 = string;
export type IsFinal2 = true;
export type ProtocolVersion26 = 1;
export type Type3 = "transport_error";
export type Message3 = string;
export type ProtocolVersion27 = 1;
export type Type4 = "orchestration_chunk";
export type RunId10 = string;
export type Sequence4 = number;
export type AgentId6 = string;
export type Phase1 = "analysis" | "review" | "synthesis";
export type Token1 = string;
export type IsFinal3 = false;
export type ProtocolVersion28 = 1;
export type Type5 = "orchestration_message_end";
export type RunId11 = string;
export type Sequence5 = number;
export type AgentId7 = string;
export type Phase2 = "analysis" | "review" | "synthesis";
export type FullContent2 = string;
export type IsFinal4 = false;
export type ProtocolVersion29 = 1;
export type Type6 = "orchestration_end";
export type RunId12 = string;
export type Sequence6 = number;
export type Status6 = "completed" | "cancelled";
export type IsFinal5 = true;
export type ProtocolVersion30 = 1;
export type Type7 = "orchestration_error";
export type RunId13 = string;
export type Sequence7 = number;
export type Message4 = string;
export type IsFinal6 = true;
export type ProtocolVersion31 = 1;
export type Type8 = "orchestration_route";
export type RunId14 = string;
export type Sequence8 = number;
export type AgentIds2 = string[];
export type Reason = string;
export type PlannedModelCalls = number;
export type MaxModelCalls2 = number;
export type MaxOutputTokens2 = number;
export type EstimatedMaxCostMicrousd1 = number;
export type MaxCostMicrousd2 = number;
export type PriceCatalogVersion1 = string;
export type IsFinal7 = false;
export type ProtocolVersion32 = 1;
export type Type9 = "orchestration_approval_required";
export type RunId15 = string;
export type Sequence9 = number;
export type Permission = "workspace.read" | "workspace.write" | "terminal.execute";
export type WorkspaceId7 = string;
export type Paths = string[];
export type Tool1 = ("workspace.write" | "terminal.execute") | null;
export type Path9 = string;
export type Command1 = string[];
export type Preview1 = string;
export type Risk1 = ("medium" | "high") | null;
export type IsFinal8 = false;
export type ProtocolVersion33 = 1;
export type Type10 = "orchestration_usage";
export type RunId16 = string;
export type Sequence10 = number;
export type InputTokens1 = number;
export type OutputTokens1 = number;
export type ActualCostMicrousd1 = number;
export type IsFinal9 = false;
export type ProtocolVersion34 = 1;
export type Type11 = "orchestration_tool_result";
export type RunId17 = string;
export type Sequence11 = number;
export type Tool2 = "workspace.write" | "terminal.execute";
export type Status7 = "completed" | "failed";
export type Result2 = string;
export type IsFinal10 = false;
export type ProtocolVersion35 = 1;
export type Type12 = "knowledge_ingestion_progress";
export type RequestId22 = string;
export type Sequence12 = number;
export type CollectionId2 = string;
export type WorkspaceId8 = string;
export type Path10 = string;
export type Stage = "reading" | "parsing" | "chunking" | "embedding" | "committing" | "completed";
export type CompletedUnits = number;
export type TotalUnits = number;
export type ProgressPercent = number;
export type Message5 = string;
export type IsFinal11 = boolean;

export interface Contract {
  request: Request;
  response: Response;
  event: Event;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "SnapshotRequest".
 */
export interface SnapshotRequest {
  protocol_version: ProtocolVersion;
  request_id: RequestId;
  method: Method;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "ConnectionRequest".
 */
export interface ConnectionRequest {
  protocol_version: ProtocolVersion1;
  request_id: RequestId1;
  method: Method1;
  params: ConnectionInput;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "ConnectionInput".
 */
export interface ConnectionInput {
  name: Name;
  provider: Provider;
  model_id: ModelId;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "AgentRequest".
 */
export interface AgentRequest {
  protocol_version: ProtocolVersion2;
  request_id: RequestId2;
  method: Method2;
  params: AgentInput;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "AgentInput".
 */
export interface AgentInput {
  name: Name1;
  role: Role;
  connection_id: ConnectionId;
  instructions: Instructions;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "WorkspaceRequest".
 */
export interface WorkspaceRequest {
  protocol_version: ProtocolVersion3;
  request_id: RequestId3;
  method: Method3;
  params: WorkspaceInput;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "WorkspaceInput".
 */
export interface WorkspaceInput {
  name: Name2;
  path: Path;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "AgentPermissionsRequest".
 */
export interface AgentPermissionsRequest {
  protocol_version: ProtocolVersion4;
  request_id: RequestId4;
  method: Method4;
  params: AgentPermissionsInput;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "AgentPermissionsInput".
 */
export interface AgentPermissionsInput {
  agent_id: AgentId;
  permissions: Permissions;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "WorkspaceListRequest".
 */
export interface WorkspaceListRequest {
  protocol_version: ProtocolVersion5;
  request_id: RequestId5;
  method: Method5;
  params: WorkspaceTarget;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "WorkspaceTarget".
 */
export interface WorkspaceTarget {
  agent_id: AgentId1;
  workspace_id: WorkspaceId;
  path: Path1;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "WorkspaceReadRequest".
 */
export interface WorkspaceReadRequest {
  protocol_version: ProtocolVersion6;
  request_id: RequestId6;
  method: Method6;
  params: WorkspaceTarget;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "ModelsRequest".
 */
export interface ModelsRequest {
  protocol_version: ProtocolVersion7;
  request_id: RequestId7;
  method: Method7;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "ChatStartRequest".
 */
export interface ChatStartRequest {
  protocol_version: ProtocolVersion8;
  request_id: RequestId8;
  method: Method8;
  params: ChatStartInput;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "ChatStartInput".
 */
export interface ChatStartInput {
  run_id: RunId;
  agent_id: AgentId2;
  message: Message;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "CancelRequest".
 */
export interface CancelRequest {
  protocol_version: ProtocolVersion9;
  request_id: RequestId9;
  method: Method9;
  params: RunInput;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "RunInput".
 */
export interface RunInput {
  run_id: RunId1;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "HistoryRequest".
 */
export interface HistoryRequest {
  protocol_version: ProtocolVersion10;
  request_id: RequestId10;
  method: Method10;
  params: HistoryInput;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "HistoryInput".
 */
export interface HistoryInput {
  agent_id: AgentId3;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "VaultRequest".
 */
export interface VaultRequest {
  protocol_version: ProtocolVersion11;
  request_id: RequestId11;
  method: Method11;
  params: VaultInput;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "VaultInput".
 */
export interface VaultInput {
  connection_id: ConnectionId1;
  action: Action;
  secret: Secret;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "OrchestrationStartRequest".
 */
export interface OrchestrationStartRequest {
  protocol_version: ProtocolVersion12;
  request_id: RequestId12;
  method: Method12;
  params: OrchestrationStartInput;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "OrchestrationStartInput".
 */
export interface OrchestrationStartInput {
  run_id: RunId2;
  objective: Objective;
  agent_ids: AgentIds;
  rounds: Rounds;
  routing_mode: RoutingMode;
  max_model_calls: MaxModelCalls;
  max_output_tokens: MaxOutputTokens;
  max_cost_microusd: MaxCostMicrousd;
  workspace_id: WorkspaceId1;
  context_paths: ContextPaths;
  enabled_tools: EnabledTools;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "OrchestrationCancelRequest".
 */
export interface OrchestrationCancelRequest {
  protocol_version: ProtocolVersion13;
  request_id: RequestId13;
  method: Method13;
  params: RunInput;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "OrchestrationApprovalRequest".
 */
export interface OrchestrationApprovalRequest {
  protocol_version: ProtocolVersion14;
  request_id: RequestId14;
  method: Method14;
  params: OrchestrationApprovalInput;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "OrchestrationApprovalInput".
 */
export interface OrchestrationApprovalInput {
  run_id: RunId3;
  decision: Decision;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "OrchestrationHistoryRequest".
 */
export interface OrchestrationHistoryRequest {
  protocol_version: ProtocolVersion15;
  request_id: RequestId15;
  method: Method15;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "PricingCatalogRequest".
 */
export interface PricingCatalogRequest {
  protocol_version: ProtocolVersion16;
  request_id: RequestId16;
  method: Method16;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "KnowledgeSnapshotRequest".
 */
export interface KnowledgeSnapshotRequest {
  protocol_version: ProtocolVersion17;
  request_id: RequestId17;
  method: Method17;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "KnowledgeCollectionCreateRequest".
 */
export interface KnowledgeCollectionCreateRequest {
  protocol_version: ProtocolVersion18;
  request_id: RequestId18;
  method: Method18;
  params: KnowledgeCollectionInput;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "KnowledgeCollectionInput".
 */
export interface KnowledgeCollectionInput {
  name: Name3;
  embedding_provider: EmbeddingProvider;
  embedding_model: EmbeddingModel;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "KnowledgeSourceIngestRequest".
 */
export interface KnowledgeSourceIngestRequest {
  protocol_version: ProtocolVersion19;
  request_id: RequestId19;
  method: Method19;
  params: KnowledgeSourceIngestInput;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "KnowledgeSourceIngestInput".
 */
export interface KnowledgeSourceIngestInput {
  collection_id: CollectionId;
  workspace_id: WorkspaceId2;
  path: Path2;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "Success".
 */
export interface Success {
  protocol_version: ProtocolVersion20;
  request_id: RequestId20;
  ok: Ok;
  result: Result;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "Snapshot".
 */
export interface Snapshot {
  app_version: AppVersion;
  protocol_version: ProtocolVersion21;
  database_version: DatabaseVersion;
  connections: Connections;
  agents: Agents;
  workspaces: Workspaces;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "Connection".
 */
export interface Connection {
  name: Name4;
  provider: Provider1;
  model_id: ModelId1;
  id: Id;
  status: Status;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "Agent".
 */
export interface Agent {
  name: Name5;
  role: Role1;
  connection_id: ConnectionId2;
  instructions: Instructions1;
  id: Id1;
  permissions: Permissions1;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "Workspace".
 */
export interface Workspace {
  name: Name6;
  path: Path3;
  id: Id2;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "OllamaModels".
 */
export interface OllamaModels {
  models: Models;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "OllamaModel".
 */
export interface OllamaModel {
  name: Name7;
  size: Size;
  capabilities: Capabilities;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "ChatHistory".
 */
export interface ChatHistory {
  turns: Turns;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "ChatTurn".
 */
export interface ChatTurn {
  run_id: RunId4;
  agent_id: AgentId4;
  prompt: Prompt;
  content: Content;
  status: Status1;
  error: Error;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "Accepted".
 */
export interface Accepted {
  run_id: RunId5;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "VaultStatus".
 */
export interface VaultStatus {
  connection_id: ConnectionId3;
  has_key: HasKey;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "WorkspaceListing".
 */
export interface WorkspaceListing {
  workspace_id: WorkspaceId3;
  path: Path4;
  entries: Entries;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "WorkspaceEntry".
 */
export interface WorkspaceEntry {
  path: Path5;
  name: Name8;
  kind: Kind;
  size: Size1;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "WorkspaceFile".
 */
export interface WorkspaceFile {
  workspace_id: WorkspaceId4;
  path: Path6;
  content: Content1;
  size: Size2;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "OrchestrationHistory".
 */
export interface OrchestrationHistory {
  runs: Runs;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "OrchestrationRun".
 */
export interface OrchestrationRun {
  run_id: RunId6;
  objective: Objective1;
  agent_ids: AgentIds1;
  rounds: Rounds1;
  routing_mode: RoutingMode1;
  route_reason: RouteReason;
  max_model_calls: MaxModelCalls1;
  max_output_tokens: MaxOutputTokens1;
  used_model_calls: UsedModelCalls;
  max_cost_microusd: MaxCostMicrousd1;
  estimated_max_cost_microusd: EstimatedMaxCostMicrousd;
  actual_cost_microusd: ActualCostMicrousd;
  input_tokens: InputTokens;
  output_tokens: OutputTokens;
  price_catalog_version: PriceCatalogVersion;
  workspace_id: WorkspaceId5;
  context_paths: ContextPaths1;
  enabled_tools: EnabledTools1;
  tool_action: ToolAction | null;
  status: Status3;
  error: Error1;
  messages: Messages;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "ToolAction".
 */
export interface ToolAction {
  tool: Tool;
  path: Path7;
  command: Command;
  preview: Preview;
  risk: Risk;
  status: Status2;
  result: Result1;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "OrchestrationMessage".
 */
export interface OrchestrationMessage {
  sequence: Sequence;
  agent_id: AgentId5;
  phase: Phase;
  content: Content2;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "PricingCatalog".
 */
export interface PricingCatalog {
  version: Version;
  currency: Currency;
  sources: Sources;
  entries: Entries1;
}
export interface Sources {
  [k: string]: string;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "PriceEntry".
 */
export interface PriceEntry {
  provider: Provider2;
  model_pattern: ModelPattern;
  input_per_million_usd: InputPerMillionUsd;
  output_per_million_usd: OutputPerMillionUsd;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "KnowledgeSnapshot".
 */
export interface KnowledgeSnapshot {
  collections: Collections;
  embedding_models: EmbeddingModels;
  embedding_error: EmbeddingError;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "KnowledgeCollection".
 */
export interface KnowledgeCollection {
  name: Name9;
  embedding_provider: EmbeddingProvider1;
  embedding_model: EmbeddingModel1;
  id: Id3;
  dimensions: Dimensions;
  source_count: SourceCount;
  chunk_count: ChunkCount;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "EmbeddingModel".
 */
export interface EmbeddingModel2 {
  name: Name10;
  size: Size3;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "KnowledgeIngestionResult".
 */
export interface KnowledgeIngestionResult {
  collection_id: CollectionId1;
  workspace_id: WorkspaceId6;
  path: Path8;
  status: Status4;
  chunk_count: ChunkCount1;
  embedded_count: EmbeddedCount;
  reused_count: ReusedCount;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "Failure".
 */
export interface Failure {
  protocol_version: ProtocolVersion22;
  request_id: RequestId21;
  ok: Ok1;
  code: Code;
  message: Message1;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "StreamChunk".
 */
export interface StreamChunk {
  protocol_version: ProtocolVersion23;
  type: Type;
  run_id: RunId7;
  sequence: Sequence1;
  token: Token;
  is_final: IsFinal;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "StreamEnd".
 */
export interface StreamEnd {
  protocol_version: ProtocolVersion24;
  type: Type1;
  run_id: RunId8;
  sequence: Sequence2;
  full_content: FullContent;
  status: Status5;
  is_final: IsFinal1;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "StreamError".
 */
export interface StreamError {
  protocol_version: ProtocolVersion25;
  type: Type2;
  run_id: RunId9;
  sequence: Sequence3;
  full_content: FullContent1;
  message: Message2;
  is_final: IsFinal2;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "TransportError".
 */
export interface TransportError {
  protocol_version: ProtocolVersion26;
  type: Type3;
  message: Message3;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "OrchestrationChunk".
 */
export interface OrchestrationChunk {
  protocol_version: ProtocolVersion27;
  type: Type4;
  run_id: RunId10;
  sequence: Sequence4;
  agent_id: AgentId6;
  phase: Phase1;
  token: Token1;
  is_final: IsFinal3;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "OrchestrationMessageEnd".
 */
export interface OrchestrationMessageEnd {
  protocol_version: ProtocolVersion28;
  type: Type5;
  run_id: RunId11;
  sequence: Sequence5;
  agent_id: AgentId7;
  phase: Phase2;
  full_content: FullContent2;
  is_final: IsFinal4;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "OrchestrationEnd".
 */
export interface OrchestrationEnd {
  protocol_version: ProtocolVersion29;
  type: Type6;
  run_id: RunId12;
  sequence: Sequence6;
  status: Status6;
  is_final: IsFinal5;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "OrchestrationError".
 */
export interface OrchestrationError {
  protocol_version: ProtocolVersion30;
  type: Type7;
  run_id: RunId13;
  sequence: Sequence7;
  message: Message4;
  is_final: IsFinal6;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "OrchestrationRoute".
 */
export interface OrchestrationRoute {
  protocol_version: ProtocolVersion31;
  type: Type8;
  run_id: RunId14;
  sequence: Sequence8;
  agent_ids: AgentIds2;
  reason: Reason;
  planned_model_calls: PlannedModelCalls;
  max_model_calls: MaxModelCalls2;
  max_output_tokens: MaxOutputTokens2;
  estimated_max_cost_microusd: EstimatedMaxCostMicrousd1;
  max_cost_microusd: MaxCostMicrousd2;
  price_catalog_version: PriceCatalogVersion1;
  is_final: IsFinal7;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "OrchestrationApprovalRequired".
 */
export interface OrchestrationApprovalRequired {
  protocol_version: ProtocolVersion32;
  type: Type9;
  run_id: RunId15;
  sequence: Sequence9;
  permission: Permission;
  workspace_id: WorkspaceId7;
  paths: Paths;
  tool: Tool1;
  path: Path9;
  command: Command1;
  preview: Preview1;
  risk: Risk1;
  is_final: IsFinal8;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "OrchestrationUsage".
 */
export interface OrchestrationUsage {
  protocol_version: ProtocolVersion33;
  type: Type10;
  run_id: RunId16;
  sequence: Sequence10;
  input_tokens: InputTokens1;
  output_tokens: OutputTokens1;
  actual_cost_microusd: ActualCostMicrousd1;
  is_final: IsFinal9;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "OrchestrationToolResult".
 */
export interface OrchestrationToolResult {
  protocol_version: ProtocolVersion34;
  type: Type11;
  run_id: RunId17;
  sequence: Sequence11;
  tool: Tool2;
  status: Status7;
  result: Result2;
  is_final: IsFinal10;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "KnowledgeIngestionProgress".
 */
export interface KnowledgeIngestionProgress {
  protocol_version: ProtocolVersion35;
  type: Type12;
  request_id: RequestId22;
  sequence: Sequence12;
  collection_id: CollectionId2;
  workspace_id: WorkspaceId8;
  path: Path10;
  stage: Stage;
  completed_units: CompletedUnits;
  total_units: TotalUnits;
  progress_percent: ProgressPercent;
  message: Message5;
  is_final: IsFinal11;
}
