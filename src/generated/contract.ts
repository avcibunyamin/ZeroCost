/* Generated from Pydantic. Do not edit. Run npm run schema:generate. */

export type Request =
  | SnapshotRequest
  | ConnectionRequest
  | AgentRequest
  | WorkspaceRequest
  | AgentPermissionsRequest
  | AgentFallbacksRequest
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
  | OrchestrationRetryRequest
  | OrchestrationQueueResumeRequest
  | OrchestrationHistoryRequest
  | PricingCatalogRequest
  | SkillCreateRequest
  | SkillAssignRequest
  | SkillUnassignRequest
  | WorkflowCreateRequest
  | WorkflowArchiveRequest
  | KnowledgeSnapshotRequest
  | KnowledgeCollectionCreateRequest
  | KnowledgeSourceIngestRequest
  | KnowledgeSearchRequest;
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
export type Method5 = "agent.fallbacks.set";
export type AgentId1 = string;
/**
 * @maxItems 3
 */
export type ConnectionIds = [] | [string] | [string, string] | [string, string, string];
export type ProtocolVersion6 = 1;
export type RequestId6 = string;
export type Method6 = "workspace.list";
export type AgentId2 = string;
export type WorkspaceId = string;
export type Path1 = string;
export type ProtocolVersion7 = 1;
export type RequestId7 = string;
export type Method7 = "workspace.read";
export type ProtocolVersion8 = 1;
export type RequestId8 = string;
export type Method8 = "ollama.models";
export type ProtocolVersion9 = 1;
export type RequestId9 = string;
export type Method9 = "chat.start";
export type RunId = string;
export type AgentId3 = string;
export type Message = string;
export type ProtocolVersion10 = 1;
export type RequestId10 = string;
export type Method10 = "chat.cancel";
export type RunId1 = string;
export type ProtocolVersion11 = 1;
export type RequestId11 = string;
export type Method11 = "chat.history";
export type AgentId4 = string;
export type ProtocolVersion12 = 1;
export type RequestId12 = string;
export type Method12 = "vault";
export type ConnectionId1 = string;
export type Action = "status" | "save" | "delete";
export type Secret = string;
export type ProtocolVersion13 = 1;
export type RequestId13 = string;
export type Method13 = "orchestration.start";
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
/**
 * @maxItems 3
 */
export type KnowledgeCollectionIds = [] | [string] | [string, string] | [string, string, string];
export type WorkflowId = string | null;
export type WorkflowVersion = string | null;
export type ProtocolVersion14 = 1;
export type RequestId14 = string;
export type Method14 = "orchestration.cancel";
export type ProtocolVersion15 = 1;
export type RequestId15 = string;
export type Method15 = "orchestration.approve";
export type RunId3 = string;
export type Decision = "approve" | "reject";
export type ProtocolVersion16 = 1;
export type RequestId16 = string;
export type Method16 = "orchestration.retry";
export type RunId4 = string;
export type NewRunId = string;
export type ProtocolVersion17 = 1;
export type RequestId17 = string;
export type Method17 = "orchestration.queue.resume";
export type ProtocolVersion18 = 1;
export type RequestId18 = string;
export type Method18 = "orchestration.history";
export type ProtocolVersion19 = 1;
export type RequestId19 = string;
export type Method19 = "pricing.catalog";
export type ProtocolVersion20 = 1;
export type RequestId20 = string;
export type Method20 = "skill.create";
export type Name3 = string;
export type Version = string;
export type Description = string;
export type Instructions1 = string;
/**
 * @maxItems 3
 */
export type RequiredTools =
  | []
  | ["workspace.write" | "terminal.execute" | "knowledge.search"]
  | [
      "workspace.write" | "terminal.execute" | "knowledge.search",
      "workspace.write" | "terminal.execute" | "knowledge.search"
    ]
  | [
      "workspace.write" | "terminal.execute" | "knowledge.search",
      "workspace.write" | "terminal.execute" | "knowledge.search",
      "workspace.write" | "terminal.execute" | "knowledge.search"
    ];
/**
 * @maxItems 3
 */
export type RequiredPermissions =
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
    ];
export type ProviderHint = ("ollama" | "lmstudio" | "anthropic" | "gemini" | "openai") | null;
export type ProtocolVersion21 = 1;
export type RequestId21 = string;
export type Method21 = "skill.assign";
export type AgentId5 = string;
export type SkillId = string;
export type ProtocolVersion22 = 1;
export type RequestId22 = string;
export type Method22 = "skill.unassign";
export type ProtocolVersion23 = 1;
export type RequestId23 = string;
export type Method23 = "workflow.create";
export type Name4 = string;
export type Version1 = string;
export type Description1 = string;
export type ObjectivePrefix = string;
/**
 * @minItems 2
 * @maxItems 4
 */
export type AgentSlots =
  | [WorkflowSlotInput, WorkflowSlotInput]
  | [WorkflowSlotInput, WorkflowSlotInput, WorkflowSlotInput]
  | [WorkflowSlotInput, WorkflowSlotInput, WorkflowSlotInput, WorkflowSlotInput];
export type Name5 = string;
/**
 * @maxItems 8
 */
export type RequiredSkillIds =
  | []
  | [string]
  | [string, string]
  | [string, string, string]
  | [string, string, string, string]
  | [string, string, string, string, string]
  | [string, string, string, string, string, string]
  | [string, string, string, string, string, string, string]
  | [string, string, string, string, string, string, string, string];
/**
 * @maxItems 3
 */
export type RequiredTools1 =
  | []
  | ["workspace.write" | "terminal.execute" | "knowledge.search"]
  | [
      "workspace.write" | "terminal.execute" | "knowledge.search",
      "workspace.write" | "terminal.execute" | "knowledge.search"
    ]
  | [
      "workspace.write" | "terminal.execute" | "knowledge.search",
      "workspace.write" | "terminal.execute" | "knowledge.search",
      "workspace.write" | "terminal.execute" | "knowledge.search"
    ];
export type Rounds1 = number;
export type MaxModelCalls1 = number;
export type MaxOutputTokens1 = number;
export type MaxCostMicrousd1 = number;
export type ProtocolVersion24 = 1;
export type RequestId24 = string;
export type Method24 = "workflow.archive";
export type WorkflowId1 = string;
export type ProtocolVersion25 = 1;
export type RequestId25 = string;
export type Method25 = "knowledge.snapshot";
export type ProtocolVersion26 = 1;
export type RequestId26 = string;
export type Method26 = "knowledge.collection.create";
export type Name6 = string;
export type EmbeddingProvider = "ollama";
export type EmbeddingModel = string;
export type ProtocolVersion27 = 1;
export type RequestId27 = string;
export type Method27 = "knowledge.source.ingest";
export type CollectionId = string;
export type WorkspaceId2 = string;
export type Path2 = string;
export type ProtocolVersion28 = 1;
export type RequestId28 = string;
export type Method28 = "knowledge.search";
export type CollectionId1 = string;
export type Query = string;
export type Limit = number;
export type Response = Success | Failure;
export type ProtocolVersion29 = 1;
export type RequestId29 = string;
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
  | KnowledgeIngestionResult
  | KnowledgeSearchResult;
export type AppVersion = "0.1.0";
export type ProtocolVersion30 = 1;
export type DatabaseVersion = number;
export type Name7 = string;
export type Provider1 = "ollama" | "lmstudio" | "anthropic" | "gemini" | "openai";
export type ModelId1 = string;
export type Id = string;
export type Status = "unconfigured";
export type Connections = Connection[];
export type Name8 = string;
export type Role1 = string;
export type ConnectionId2 = string;
export type Instructions2 = string;
export type Id1 = string;
/**
 * @maxItems 3
 */
export type FallbackConnectionIds = [] | [string] | [string, string] | [string, string, string];
export type Permissions1 = ("workspace.read" | "workspace.write" | "terminal.execute")[];
export type SkillIds = string[];
export type Agents = Agent[];
export type Name9 = string;
export type Path3 = string;
export type Id2 = string;
export type Workspaces = Workspace[];
export type Name10 = string;
export type Version2 = string;
export type Description2 = string;
export type Instructions3 = string;
/**
 * @maxItems 3
 */
export type RequiredTools2 =
  | []
  | ["workspace.write" | "terminal.execute" | "knowledge.search"]
  | [
      "workspace.write" | "terminal.execute" | "knowledge.search",
      "workspace.write" | "terminal.execute" | "knowledge.search"
    ]
  | [
      "workspace.write" | "terminal.execute" | "knowledge.search",
      "workspace.write" | "terminal.execute" | "knowledge.search",
      "workspace.write" | "terminal.execute" | "knowledge.search"
    ];
/**
 * @maxItems 3
 */
export type RequiredPermissions1 =
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
    ];
export type ProviderHint1 = ("ollama" | "lmstudio" | "anthropic" | "gemini" | "openai") | null;
export type Id3 = string;
export type Skills = SkillPackage[];
export type Name11 = string;
export type Version3 = string;
export type Description3 = string;
export type ObjectivePrefix1 = string;
/**
 * @minItems 2
 * @maxItems 4
 */
export type AgentSlots1 =
  | [WorkflowSlotInput, WorkflowSlotInput]
  | [WorkflowSlotInput, WorkflowSlotInput, WorkflowSlotInput]
  | [WorkflowSlotInput, WorkflowSlotInput, WorkflowSlotInput, WorkflowSlotInput];
/**
 * @maxItems 3
 */
export type RequiredTools3 =
  | []
  | ["workspace.write" | "terminal.execute" | "knowledge.search"]
  | [
      "workspace.write" | "terminal.execute" | "knowledge.search",
      "workspace.write" | "terminal.execute" | "knowledge.search"
    ]
  | [
      "workspace.write" | "terminal.execute" | "knowledge.search",
      "workspace.write" | "terminal.execute" | "knowledge.search",
      "workspace.write" | "terminal.execute" | "knowledge.search"
    ];
export type Rounds2 = number;
export type MaxModelCalls2 = number;
export type MaxOutputTokens2 = number;
export type MaxCostMicrousd2 = number;
export type Id4 = string;
export type Archived = boolean;
export type Workflows = WorkflowTemplate[];
export type Name12 = string;
export type Size = number;
export type Capabilities = string[];
export type Models = OllamaModel[];
export type RunId5 = string;
export type AgentId6 = string;
export type Prompt = string;
export type Content = string;
export type Status1 = "running" | "completed" | "cancelled" | "failed" | "interrupted";
export type Error = string;
export type Turns = ChatTurn[];
export type RunId6 = string;
export type ConnectionId3 = string;
export type HasKey = boolean;
export type WorkspaceId3 = string;
export type Path4 = string;
export type Path5 = string;
export type Name13 = string;
export type Kind = "file" | "directory";
export type Size1 = number;
export type Entries = WorkspaceEntry[];
export type WorkspaceId4 = string;
export type Path6 = string;
export type Content1 = string;
export type Size2 = number;
export type RunId7 = string;
export type Objective1 = string;
export type AgentIds1 = string[];
export type Rounds3 = number;
export type RoutingMode1 = "manual" | "auto";
export type RouteReason = string;
export type MaxModelCalls3 = number;
export type MaxOutputTokens3 = number;
export type UsedModelCalls = number;
export type MaxCostMicrousd3 = number;
export type EstimatedMaxCostMicrousd = number;
export type ActualCostMicrousd = number;
export type InputTokens = number;
export type OutputTokens = number;
export type PriceCatalogVersion = string;
export type WorkspaceId5 = string | null;
export type ContextPaths1 = string[];
export type EnabledTools1 = ("workspace.write" | "terminal.execute")[];
export type KnowledgeCollectionIds1 = string[];
export type WorkflowId2 = string | null;
export type WorkflowVersion1 = string | null;
export type Attempt = number;
export type ParentRunId = string | null;
export type ResumedFromNode = string;
export type FailedNode = string;
export type ErrorClass = "" | "retryable" | "permanent" | "uncertain_tool";
export type CumulativeModelCalls = number;
export type CumulativeCostMicrousd = number;
export type FallbackChain = string[][];
export type Id5 = string;
export type RunId8 = string;
export type NodeName = string;
export type ConnectionId4 = string;
export type Attempt1 = number;
export type Outcome = "success" | "retryable" | "permanent" | "budget_exceeded" | "skipped";
export type ErrorMessage = string;
export type InputTokens1 = number;
export type OutputTokens1 = number;
export type CostMicrousd = number;
export type StartedAt = string;
export type DurationMs = number;
export type ModelCallAttempts = ModelCallAttempt[];
export type QueueSequence = number;
export type QueuePosition = number | null;
export type WorkerId = string;
export type QueuedAt = string;
export type StartedAt1 = string | null;
export type ResumedAt = string | null;
export type FinishedAt = string | null;
export type Sequence = number;
export type FromStatus =
  "" | "queued" | "running" | "paused" | "waiting_approval" | "completed" | "cancelled" | "failed" | "interrupted";
export type ToStatus =
  "queued" | "running" | "paused" | "waiting_approval" | "completed" | "cancelled" | "failed" | "interrupted";
export type Reason = string;
export type Timestamp = string;
export type StatusEvents = OrchestrationStatusEvent[];
export type Tool = "workspace.write" | "terminal.execute" | "knowledge.search";
export type Path7 = string;
export type Command = string[];
export type CollectionId2 = string;
export type Query1 = string;
export type Limit1 = number;
export type Preview = string;
export type Risk = "medium" | "high";
export type Status2 = "waiting" | "approved" | "executing" | "uncertain" | "rejected" | "completed" | "failed";
export type ArgsHash = string;
export type ContentHash = string;
export type Result1 = string;
export type Status3 =
  "queued" | "running" | "paused" | "waiting_approval" | "completed" | "cancelled" | "failed" | "interrupted";
export type Error1 = string;
export type Sequence1 = number;
export type AgentId7 = string;
export type Phase = "analysis" | "review" | "synthesis";
export type Content2 = string;
export type Messages = OrchestrationMessage[];
export type Runs = OrchestrationRun[];
export type WorkerLimit = number;
export type WorkerId1 = string;
export type RunId9 = string | null;
export type Workers = WorkerSlot[];
export type ConnectionId5 = string;
export type HolderRunId = string | null;
export type HolderWorkerId = string;
export type WaitingRunIds = string[];
export type Connections1 = ConnectionRuntime[];
export type Version4 = string;
export type Currency = "USD";
export type Provider2 = "anthropic" | "gemini";
export type ModelPattern = string;
export type InputPerMillionUsd = number;
export type OutputPerMillionUsd = number;
export type Entries1 = PriceEntry[];
export type Name14 = string;
export type EmbeddingProvider1 = "ollama";
export type EmbeddingModel1 = string;
export type Id6 = string;
export type Dimensions = number;
export type SourceCount = number;
export type ChunkCount = number;
export type Collections = KnowledgeCollection[];
export type Name15 = string;
export type Size3 = number;
export type EmbeddingModels = EmbeddingModel2[];
export type EmbeddingError = string;
export type CollectionId3 = string;
export type WorkspaceId6 = string;
export type Path8 = string;
export type Status4 = "indexed" | "unchanged";
export type ChunkCount1 = number;
export type EmbeddedCount = number;
export type ReusedCount = number;
export type CollectionId4 = string;
export type Query2 = string;
/**
 * @maxItems 10
 */
export type Hits =
  | []
  | [KnowledgeSearchHit]
  | [KnowledgeSearchHit, KnowledgeSearchHit]
  | [KnowledgeSearchHit, KnowledgeSearchHit, KnowledgeSearchHit]
  | [KnowledgeSearchHit, KnowledgeSearchHit, KnowledgeSearchHit, KnowledgeSearchHit]
  | [KnowledgeSearchHit, KnowledgeSearchHit, KnowledgeSearchHit, KnowledgeSearchHit, KnowledgeSearchHit]
  | [
      KnowledgeSearchHit,
      KnowledgeSearchHit,
      KnowledgeSearchHit,
      KnowledgeSearchHit,
      KnowledgeSearchHit,
      KnowledgeSearchHit
    ]
  | [
      KnowledgeSearchHit,
      KnowledgeSearchHit,
      KnowledgeSearchHit,
      KnowledgeSearchHit,
      KnowledgeSearchHit,
      KnowledgeSearchHit,
      KnowledgeSearchHit
    ]
  | [
      KnowledgeSearchHit,
      KnowledgeSearchHit,
      KnowledgeSearchHit,
      KnowledgeSearchHit,
      KnowledgeSearchHit,
      KnowledgeSearchHit,
      KnowledgeSearchHit,
      KnowledgeSearchHit
    ]
  | [
      KnowledgeSearchHit,
      KnowledgeSearchHit,
      KnowledgeSearchHit,
      KnowledgeSearchHit,
      KnowledgeSearchHit,
      KnowledgeSearchHit,
      KnowledgeSearchHit,
      KnowledgeSearchHit,
      KnowledgeSearchHit
    ]
  | [
      KnowledgeSearchHit,
      KnowledgeSearchHit,
      KnowledgeSearchHit,
      KnowledgeSearchHit,
      KnowledgeSearchHit,
      KnowledgeSearchHit,
      KnowledgeSearchHit,
      KnowledgeSearchHit,
      KnowledgeSearchHit,
      KnowledgeSearchHit
    ];
export type ChunkId = string;
export type CollectionId5 = string;
export type CollectionName = string;
export type WorkspaceId7 = string;
export type SourcePath = string;
export type Ordinal = number;
export type StartLine = number;
export type EndLine = number;
export type Content3 = string;
export type RrfScore = number;
export type FtsRank = number | null;
export type VectorRank = number | null;
export type CosineSimilarity = number | null;
export type ProtocolVersion31 = 1;
export type RequestId30 = string;
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
  | OrchestrationRetrying
  | OrchestrationFallback
  | OrchestrationQueued
  | OrchestrationStarted
  | OrchestrationPaused
  | KnowledgeIngestionProgress;
export type ProtocolVersion32 = 1;
export type Type = "stream_chunk";
export type RunId10 = string;
export type Sequence2 = number;
export type Token = string;
export type IsFinal = false;
export type ProtocolVersion33 = 1;
export type Type1 = "stream_end";
export type RunId11 = string;
export type Sequence3 = number;
export type FullContent = string;
export type Status5 = "completed" | "cancelled";
export type IsFinal1 = true;
export type ProtocolVersion34 = 1;
export type Type2 = "stream_error";
export type RunId12 = string;
export type Sequence4 = number;
export type FullContent1 = string;
export type Message2 = string;
export type IsFinal2 = true;
export type ProtocolVersion35 = 1;
export type Type3 = "transport_error";
export type Message3 = string;
export type ProtocolVersion36 = 1;
export type Type4 = "orchestration_chunk";
export type RunId13 = string;
export type Sequence5 = number;
export type AgentId8 = string;
export type Phase1 = "analysis" | "review" | "synthesis";
export type Token1 = string;
export type IsFinal3 = false;
export type ProtocolVersion37 = 1;
export type Type5 = "orchestration_message_end";
export type RunId14 = string;
export type Sequence6 = number;
export type AgentId9 = string;
export type Phase2 = "analysis" | "review" | "synthesis";
export type FullContent2 = string;
export type IsFinal4 = false;
export type ProtocolVersion38 = 1;
export type Type6 = "orchestration_end";
export type RunId15 = string;
export type Sequence7 = number;
export type Status6 = "completed" | "cancelled";
export type IsFinal5 = true;
export type ProtocolVersion39 = 1;
export type Type7 = "orchestration_error";
export type RunId16 = string;
export type Sequence8 = number;
export type Message4 = string;
export type ErrorClass1 = "retryable" | "permanent";
export type FailedNode1 = string;
export type IsFinal6 = true;
export type ProtocolVersion40 = 1;
export type Type8 = "orchestration_route";
export type RunId17 = string;
export type Sequence9 = number;
export type AgentIds2 = string[];
export type Reason1 = string;
export type PlannedModelCalls = number;
export type MaxModelCalls4 = number;
export type MaxOutputTokens4 = number;
export type EstimatedMaxCostMicrousd1 = number;
export type MaxCostMicrousd4 = number;
export type PriceCatalogVersion1 = string;
export type IsFinal7 = false;
export type ProtocolVersion41 = 1;
export type Type9 = "orchestration_approval_required";
export type RunId18 = string;
export type Sequence10 = number;
export type Permission = "workspace.read" | "workspace.write" | "terminal.execute";
export type WorkspaceId8 = string;
export type Paths = string[];
export type Tool1 = ("workspace.write" | "terminal.execute" | "knowledge.search") | null;
export type Path9 = string;
export type Command1 = string[];
export type Preview1 = string;
export type Risk1 = ("medium" | "high") | null;
export type IsFinal8 = false;
export type ProtocolVersion42 = 1;
export type Type10 = "orchestration_usage";
export type RunId19 = string;
export type Sequence11 = number;
export type InputTokens2 = number;
export type OutputTokens2 = number;
export type ActualCostMicrousd1 = number;
export type IsFinal9 = false;
export type ProtocolVersion43 = 1;
export type Type11 = "orchestration_tool_result";
export type RunId20 = string;
export type Sequence12 = number;
export type Tool2 = "workspace.write" | "terminal.execute" | "knowledge.search";
export type Status7 = "completed" | "failed";
export type Result2 = string;
export type IsFinal10 = false;
export type ProtocolVersion44 = 1;
export type Type12 = "orchestration_retrying";
export type RunId21 = string;
export type Sequence13 = number;
export type AgentId10 = string;
export type Phase3 = "analysis" | "review" | "synthesis";
export type Attempt2 = number;
export type Message5 = string;
export type IsFinal11 = false;
export type ProtocolVersion45 = 1;
export type Type13 = "orchestration_fallback";
export type RunId22 = string;
export type Sequence14 = number;
export type AgentId11 = string;
export type Phase4 = "analysis" | "review" | "synthesis";
export type FromConnectionId = string;
export type ToConnectionId = string;
export type Message6 = string;
export type IsFinal12 = false;
export type ProtocolVersion46 = 1;
export type Type14 = "orchestration_queued";
export type RunId23 = string;
export type Sequence15 = number;
export type QueuePosition1 = number;
export type Resumed = boolean;
export type IsFinal13 = false;
export type ProtocolVersion47 = 1;
export type Type15 = "orchestration_started";
export type RunId24 = string;
export type Sequence16 = number;
export type WorkerId2 = string;
export type IsFinal14 = false;
export type ProtocolVersion48 = 1;
export type Type16 = "orchestration_paused";
export type RunId25 = string;
export type Sequence17 = number;
export type Message7 = string;
export type IsFinal15 = false;
export type ProtocolVersion49 = 1;
export type Type17 = "knowledge_ingestion_progress";
export type RequestId31 = string;
export type Sequence18 = number;
export type CollectionId6 = string;
export type WorkspaceId9 = string;
export type Path10 = string;
export type Stage = "reading" | "parsing" | "chunking" | "embedding" | "committing" | "completed";
export type CompletedUnits = number;
export type TotalUnits = number;
export type ProgressPercent = number;
export type Message8 = string;
export type IsFinal16 = boolean;

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
 * via the `definition` "AgentFallbacksRequest".
 */
export interface AgentFallbacksRequest {
  protocol_version: ProtocolVersion5;
  request_id: RequestId5;
  method: Method5;
  params: AgentFallbacksInput;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "AgentFallbacksInput".
 */
export interface AgentFallbacksInput {
  agent_id: AgentId1;
  connection_ids: ConnectionIds;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "WorkspaceListRequest".
 */
export interface WorkspaceListRequest {
  protocol_version: ProtocolVersion6;
  request_id: RequestId6;
  method: Method6;
  params: WorkspaceTarget;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "WorkspaceTarget".
 */
export interface WorkspaceTarget {
  agent_id: AgentId2;
  workspace_id: WorkspaceId;
  path: Path1;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "WorkspaceReadRequest".
 */
export interface WorkspaceReadRequest {
  protocol_version: ProtocolVersion7;
  request_id: RequestId7;
  method: Method7;
  params: WorkspaceTarget;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "ModelsRequest".
 */
export interface ModelsRequest {
  protocol_version: ProtocolVersion8;
  request_id: RequestId8;
  method: Method8;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "ChatStartRequest".
 */
export interface ChatStartRequest {
  protocol_version: ProtocolVersion9;
  request_id: RequestId9;
  method: Method9;
  params: ChatStartInput;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "ChatStartInput".
 */
export interface ChatStartInput {
  run_id: RunId;
  agent_id: AgentId3;
  message: Message;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "CancelRequest".
 */
export interface CancelRequest {
  protocol_version: ProtocolVersion10;
  request_id: RequestId10;
  method: Method10;
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
  protocol_version: ProtocolVersion11;
  request_id: RequestId11;
  method: Method11;
  params: HistoryInput;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "HistoryInput".
 */
export interface HistoryInput {
  agent_id: AgentId4;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "VaultRequest".
 */
export interface VaultRequest {
  protocol_version: ProtocolVersion12;
  request_id: RequestId12;
  method: Method12;
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
  protocol_version: ProtocolVersion13;
  request_id: RequestId13;
  method: Method13;
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
  knowledge_collection_ids: KnowledgeCollectionIds;
  workflow_id: WorkflowId;
  workflow_version: WorkflowVersion;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "OrchestrationCancelRequest".
 */
export interface OrchestrationCancelRequest {
  protocol_version: ProtocolVersion14;
  request_id: RequestId14;
  method: Method14;
  params: RunInput;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "OrchestrationApprovalRequest".
 */
export interface OrchestrationApprovalRequest {
  protocol_version: ProtocolVersion15;
  request_id: RequestId15;
  method: Method15;
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
 * via the `definition` "OrchestrationRetryRequest".
 */
export interface OrchestrationRetryRequest {
  protocol_version: ProtocolVersion16;
  request_id: RequestId16;
  method: Method16;
  params: OrchestrationRetryInput;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "OrchestrationRetryInput".
 */
export interface OrchestrationRetryInput {
  run_id: RunId4;
  new_run_id: NewRunId;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "OrchestrationQueueResumeRequest".
 */
export interface OrchestrationQueueResumeRequest {
  protocol_version: ProtocolVersion17;
  request_id: RequestId17;
  method: Method17;
  params: RunInput;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "OrchestrationHistoryRequest".
 */
export interface OrchestrationHistoryRequest {
  protocol_version: ProtocolVersion18;
  request_id: RequestId18;
  method: Method18;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "PricingCatalogRequest".
 */
export interface PricingCatalogRequest {
  protocol_version: ProtocolVersion19;
  request_id: RequestId19;
  method: Method19;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "SkillCreateRequest".
 */
export interface SkillCreateRequest {
  protocol_version: ProtocolVersion20;
  request_id: RequestId20;
  method: Method20;
  params: SkillPackageInput;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "SkillPackageInput".
 */
export interface SkillPackageInput {
  name: Name3;
  version: Version;
  description: Description;
  instructions: Instructions1;
  required_tools: RequiredTools;
  required_permissions: RequiredPermissions;
  provider_hint: ProviderHint;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "SkillAssignRequest".
 */
export interface SkillAssignRequest {
  protocol_version: ProtocolVersion21;
  request_id: RequestId21;
  method: Method21;
  params: SkillAssignInput;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "SkillAssignInput".
 */
export interface SkillAssignInput {
  agent_id: AgentId5;
  skill_id: SkillId;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "SkillUnassignRequest".
 */
export interface SkillUnassignRequest {
  protocol_version: ProtocolVersion22;
  request_id: RequestId22;
  method: Method22;
  params: SkillAssignInput;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "WorkflowCreateRequest".
 */
export interface WorkflowCreateRequest {
  protocol_version: ProtocolVersion23;
  request_id: RequestId23;
  method: Method23;
  params: WorkflowTemplateInput;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "WorkflowTemplateInput".
 */
export interface WorkflowTemplateInput {
  name: Name4;
  version: Version1;
  description: Description1;
  objective_prefix: ObjectivePrefix;
  agent_slots: AgentSlots;
  required_tools: RequiredTools1;
  rounds: Rounds1;
  max_model_calls: MaxModelCalls1;
  max_output_tokens: MaxOutputTokens1;
  max_cost_microusd: MaxCostMicrousd1;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "WorkflowSlotInput".
 */
export interface WorkflowSlotInput {
  name: Name5;
  required_skill_ids: RequiredSkillIds;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "WorkflowArchiveRequest".
 */
export interface WorkflowArchiveRequest {
  protocol_version: ProtocolVersion24;
  request_id: RequestId24;
  method: Method24;
  params: WorkflowArchiveInput;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "WorkflowArchiveInput".
 */
export interface WorkflowArchiveInput {
  workflow_id: WorkflowId1;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "KnowledgeSnapshotRequest".
 */
export interface KnowledgeSnapshotRequest {
  protocol_version: ProtocolVersion25;
  request_id: RequestId25;
  method: Method25;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "KnowledgeCollectionCreateRequest".
 */
export interface KnowledgeCollectionCreateRequest {
  protocol_version: ProtocolVersion26;
  request_id: RequestId26;
  method: Method26;
  params: KnowledgeCollectionInput;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "KnowledgeCollectionInput".
 */
export interface KnowledgeCollectionInput {
  name: Name6;
  embedding_provider: EmbeddingProvider;
  embedding_model: EmbeddingModel;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "KnowledgeSourceIngestRequest".
 */
export interface KnowledgeSourceIngestRequest {
  protocol_version: ProtocolVersion27;
  request_id: RequestId27;
  method: Method27;
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
 * via the `definition` "KnowledgeSearchRequest".
 */
export interface KnowledgeSearchRequest {
  protocol_version: ProtocolVersion28;
  request_id: RequestId28;
  method: Method28;
  params: KnowledgeSearchInput;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "KnowledgeSearchInput".
 */
export interface KnowledgeSearchInput {
  collection_id: CollectionId1;
  query: Query;
  limit: Limit;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "Success".
 */
export interface Success {
  protocol_version: ProtocolVersion29;
  request_id: RequestId29;
  ok: Ok;
  result: Result;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "Snapshot".
 */
export interface Snapshot {
  app_version: AppVersion;
  protocol_version: ProtocolVersion30;
  database_version: DatabaseVersion;
  connections: Connections;
  agents: Agents;
  workspaces: Workspaces;
  skills: Skills;
  workflows: Workflows;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "Connection".
 */
export interface Connection {
  name: Name7;
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
  name: Name8;
  role: Role1;
  connection_id: ConnectionId2;
  instructions: Instructions2;
  id: Id1;
  fallback_connection_ids: FallbackConnectionIds;
  permissions: Permissions1;
  skill_ids: SkillIds;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "Workspace".
 */
export interface Workspace {
  name: Name9;
  path: Path3;
  id: Id2;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "SkillPackage".
 */
export interface SkillPackage {
  name: Name10;
  version: Version2;
  description: Description2;
  instructions: Instructions3;
  required_tools: RequiredTools2;
  required_permissions: RequiredPermissions1;
  provider_hint: ProviderHint1;
  id: Id3;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "WorkflowTemplate".
 */
export interface WorkflowTemplate {
  name: Name11;
  version: Version3;
  description: Description3;
  objective_prefix: ObjectivePrefix1;
  agent_slots: AgentSlots1;
  required_tools: RequiredTools3;
  rounds: Rounds2;
  max_model_calls: MaxModelCalls2;
  max_output_tokens: MaxOutputTokens2;
  max_cost_microusd: MaxCostMicrousd2;
  id: Id4;
  archived: Archived;
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
  name: Name12;
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
  run_id: RunId5;
  agent_id: AgentId6;
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
  run_id: RunId6;
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
  name: Name13;
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
  runtime: OrchestrationRuntime;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "OrchestrationRun".
 */
export interface OrchestrationRun {
  run_id: RunId7;
  objective: Objective1;
  agent_ids: AgentIds1;
  rounds: Rounds3;
  routing_mode: RoutingMode1;
  route_reason: RouteReason;
  max_model_calls: MaxModelCalls3;
  max_output_tokens: MaxOutputTokens3;
  used_model_calls: UsedModelCalls;
  max_cost_microusd: MaxCostMicrousd3;
  estimated_max_cost_microusd: EstimatedMaxCostMicrousd;
  actual_cost_microusd: ActualCostMicrousd;
  input_tokens: InputTokens;
  output_tokens: OutputTokens;
  price_catalog_version: PriceCatalogVersion;
  workspace_id: WorkspaceId5;
  context_paths: ContextPaths1;
  enabled_tools: EnabledTools1;
  knowledge_collection_ids: KnowledgeCollectionIds1;
  workflow_id: WorkflowId2;
  workflow_version: WorkflowVersion1;
  attempt: Attempt;
  parent_run_id: ParentRunId;
  resumed_from_node: ResumedFromNode;
  failed_node: FailedNode;
  error_class: ErrorClass;
  cumulative_model_calls: CumulativeModelCalls;
  cumulative_cost_microusd: CumulativeCostMicrousd;
  fallback_chain: FallbackChain;
  model_call_attempts: ModelCallAttempts;
  queue_sequence: QueueSequence;
  queue_position: QueuePosition;
  worker_id: WorkerId;
  queued_at: QueuedAt;
  started_at: StartedAt1;
  resumed_at: ResumedAt;
  finished_at: FinishedAt;
  status_events: StatusEvents;
  tool_action: ToolAction | null;
  status: Status3;
  error: Error1;
  messages: Messages;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "ModelCallAttempt".
 */
export interface ModelCallAttempt {
  id: Id5;
  run_id: RunId8;
  node_name: NodeName;
  connection_id: ConnectionId4;
  attempt: Attempt1;
  outcome: Outcome;
  error_message: ErrorMessage;
  input_tokens: InputTokens1;
  output_tokens: OutputTokens1;
  cost_microusd: CostMicrousd;
  started_at: StartedAt;
  duration_ms: DurationMs;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "OrchestrationStatusEvent".
 */
export interface OrchestrationStatusEvent {
  sequence: Sequence;
  from_status: FromStatus;
  to_status: ToStatus;
  reason: Reason;
  timestamp: Timestamp;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "ToolAction".
 */
export interface ToolAction {
  tool: Tool;
  path: Path7;
  command: Command;
  collection_id: CollectionId2;
  query: Query1;
  limit: Limit1;
  preview: Preview;
  risk: Risk;
  status: Status2;
  args_hash: ArgsHash;
  content_hash: ContentHash;
  result: Result1;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "OrchestrationMessage".
 */
export interface OrchestrationMessage {
  sequence: Sequence1;
  agent_id: AgentId7;
  phase: Phase;
  content: Content2;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "OrchestrationRuntime".
 */
export interface OrchestrationRuntime {
  worker_limit: WorkerLimit;
  workers: Workers;
  connections: Connections1;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "WorkerSlot".
 */
export interface WorkerSlot {
  worker_id: WorkerId1;
  run_id: RunId9;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "ConnectionRuntime".
 */
export interface ConnectionRuntime {
  connection_id: ConnectionId5;
  holder_run_id: HolderRunId;
  holder_worker_id: HolderWorkerId;
  waiting_run_ids: WaitingRunIds;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "PricingCatalog".
 */
export interface PricingCatalog {
  version: Version4;
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
  name: Name14;
  embedding_provider: EmbeddingProvider1;
  embedding_model: EmbeddingModel1;
  id: Id6;
  dimensions: Dimensions;
  source_count: SourceCount;
  chunk_count: ChunkCount;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "EmbeddingModel".
 */
export interface EmbeddingModel2 {
  name: Name15;
  size: Size3;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "KnowledgeIngestionResult".
 */
export interface KnowledgeIngestionResult {
  collection_id: CollectionId3;
  workspace_id: WorkspaceId6;
  path: Path8;
  status: Status4;
  chunk_count: ChunkCount1;
  embedded_count: EmbeddedCount;
  reused_count: ReusedCount;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "KnowledgeSearchResult".
 */
export interface KnowledgeSearchResult {
  collection_id: CollectionId4;
  query: Query2;
  hits: Hits;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "KnowledgeSearchHit".
 */
export interface KnowledgeSearchHit {
  chunk_id: ChunkId;
  collection_id: CollectionId5;
  collection_name: CollectionName;
  workspace_id: WorkspaceId7;
  source_path: SourcePath;
  ordinal: Ordinal;
  start_line: StartLine;
  end_line: EndLine;
  content: Content3;
  rrf_score: RrfScore;
  fts_rank: FtsRank;
  vector_rank: VectorRank;
  cosine_similarity: CosineSimilarity;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "Failure".
 */
export interface Failure {
  protocol_version: ProtocolVersion31;
  request_id: RequestId30;
  ok: Ok1;
  code: Code;
  message: Message1;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "StreamChunk".
 */
export interface StreamChunk {
  protocol_version: ProtocolVersion32;
  type: Type;
  run_id: RunId10;
  sequence: Sequence2;
  token: Token;
  is_final: IsFinal;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "StreamEnd".
 */
export interface StreamEnd {
  protocol_version: ProtocolVersion33;
  type: Type1;
  run_id: RunId11;
  sequence: Sequence3;
  full_content: FullContent;
  status: Status5;
  is_final: IsFinal1;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "StreamError".
 */
export interface StreamError {
  protocol_version: ProtocolVersion34;
  type: Type2;
  run_id: RunId12;
  sequence: Sequence4;
  full_content: FullContent1;
  message: Message2;
  is_final: IsFinal2;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "TransportError".
 */
export interface TransportError {
  protocol_version: ProtocolVersion35;
  type: Type3;
  message: Message3;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "OrchestrationChunk".
 */
export interface OrchestrationChunk {
  protocol_version: ProtocolVersion36;
  type: Type4;
  run_id: RunId13;
  sequence: Sequence5;
  agent_id: AgentId8;
  phase: Phase1;
  token: Token1;
  is_final: IsFinal3;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "OrchestrationMessageEnd".
 */
export interface OrchestrationMessageEnd {
  protocol_version: ProtocolVersion37;
  type: Type5;
  run_id: RunId14;
  sequence: Sequence6;
  agent_id: AgentId9;
  phase: Phase2;
  full_content: FullContent2;
  is_final: IsFinal4;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "OrchestrationEnd".
 */
export interface OrchestrationEnd {
  protocol_version: ProtocolVersion38;
  type: Type6;
  run_id: RunId15;
  sequence: Sequence7;
  status: Status6;
  is_final: IsFinal5;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "OrchestrationError".
 */
export interface OrchestrationError {
  protocol_version: ProtocolVersion39;
  type: Type7;
  run_id: RunId16;
  sequence: Sequence8;
  message: Message4;
  error_class: ErrorClass1;
  failed_node: FailedNode1;
  is_final: IsFinal6;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "OrchestrationRoute".
 */
export interface OrchestrationRoute {
  protocol_version: ProtocolVersion40;
  type: Type8;
  run_id: RunId17;
  sequence: Sequence9;
  agent_ids: AgentIds2;
  reason: Reason1;
  planned_model_calls: PlannedModelCalls;
  max_model_calls: MaxModelCalls4;
  max_output_tokens: MaxOutputTokens4;
  estimated_max_cost_microusd: EstimatedMaxCostMicrousd1;
  max_cost_microusd: MaxCostMicrousd4;
  price_catalog_version: PriceCatalogVersion1;
  is_final: IsFinal7;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "OrchestrationApprovalRequired".
 */
export interface OrchestrationApprovalRequired {
  protocol_version: ProtocolVersion41;
  type: Type9;
  run_id: RunId18;
  sequence: Sequence10;
  permission: Permission;
  workspace_id: WorkspaceId8;
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
  protocol_version: ProtocolVersion42;
  type: Type10;
  run_id: RunId19;
  sequence: Sequence11;
  input_tokens: InputTokens2;
  output_tokens: OutputTokens2;
  actual_cost_microusd: ActualCostMicrousd1;
  is_final: IsFinal9;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "OrchestrationToolResult".
 */
export interface OrchestrationToolResult {
  protocol_version: ProtocolVersion43;
  type: Type11;
  run_id: RunId20;
  sequence: Sequence12;
  tool: Tool2;
  status: Status7;
  result: Result2;
  is_final: IsFinal10;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "OrchestrationRetrying".
 */
export interface OrchestrationRetrying {
  protocol_version: ProtocolVersion44;
  type: Type12;
  run_id: RunId21;
  sequence: Sequence13;
  agent_id: AgentId10;
  phase: Phase3;
  attempt: Attempt2;
  message: Message5;
  is_final: IsFinal11;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "OrchestrationFallback".
 */
export interface OrchestrationFallback {
  protocol_version: ProtocolVersion45;
  type: Type13;
  run_id: RunId22;
  sequence: Sequence14;
  agent_id: AgentId11;
  phase: Phase4;
  from_connection_id: FromConnectionId;
  to_connection_id: ToConnectionId;
  message: Message6;
  is_final: IsFinal12;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "OrchestrationQueued".
 */
export interface OrchestrationQueued {
  protocol_version: ProtocolVersion46;
  type: Type14;
  run_id: RunId23;
  sequence: Sequence15;
  queue_position: QueuePosition1;
  resumed: Resumed;
  is_final: IsFinal13;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "OrchestrationStarted".
 */
export interface OrchestrationStarted {
  protocol_version: ProtocolVersion47;
  type: Type15;
  run_id: RunId24;
  sequence: Sequence16;
  worker_id: WorkerId2;
  is_final: IsFinal14;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "OrchestrationPaused".
 */
export interface OrchestrationPaused {
  protocol_version: ProtocolVersion48;
  type: Type16;
  run_id: RunId25;
  sequence: Sequence17;
  message: Message7;
  is_final: IsFinal15;
}
/**
 * This interface was referenced by `Contract`'s JSON-Schema
 * via the `definition` "KnowledgeIngestionProgress".
 */
export interface KnowledgeIngestionProgress {
  protocol_version: ProtocolVersion49;
  type: Type17;
  request_id: RequestId31;
  sequence: Sequence18;
  collection_id: CollectionId6;
  workspace_id: WorkspaceId9;
  path: Path10;
  stage: Stage;
  completed_units: CompletedUnits;
  total_units: TotalUnits;
  progress_percent: ProgressPercent;
  message: Message8;
  is_final: IsFinal16;
}
