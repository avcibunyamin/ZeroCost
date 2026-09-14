# ADR-0005: Persistent orchestration task queue

- Status: Accepted
- Date: 2026-09-14

## Context

The single active orchestration guard prevented independent jobs from making progress and made approval waits occupy the whole execution surface. Queue metadata must survive a desktop restart, while cloud credentials must remain confined to the OS vault and process memory. A crash may happen after a worker is assigned but before LangGraph writes its first checkpoint. Streaming every provider token also creates avoidable IPC pressure.

## Decision

Orchestration runs enter a SQLite-backed FIFO queue. V1 uses two fixed worker slots and a process-wide capacity-one semaphore for each frozen `connection_id`. Waiting for a connection slot does not increment model-call or cost budgets.

Each run stores an immutable `queue_sequence` plus worker and lifecycle timestamps. Approval waits release their worker without changing queue sequence. Approval or explicit resume writes `resumed_at`; selection orders resumed queued runs first and ordinary queued runs by sequence. This is a continuation rule rather than user-configurable priority.

Credentials are attached only to the in-memory queue job. Startup recovery changes queued and running rows to `paused`. Rust resolves the run's frozen fallback chains from history and reinjects OS-vault credentials only after an explicit `orchestration.queue.resume` request. Continuation uses a persistent checkpoint only when the checkpoint database contains the run thread; otherwise the run starts from its initial state. New run families use separate SHA-256-named SQLite checkpoint files so two workers do not contend on independent LangGraph savers. Existing threads in the legacy shared checkpoint database remain readable.

The sidecar batches orchestration chunks for at most 25 ms or 256 characters. An async `flush_before` boundary empties pending output on every provider-attempt exit, which covers completion, error, timeout, cancellation, retry and fallback. Approval and worker release occur only after generation returns, so they also follow a flushed boundary.

Schema v15 retains the SQL status constraint. Because SQLite cannot alter that constraint directly, migration uses the established safe pattern: disable FK rewriting, rename the v14 table, create the complete v15 table, copy all columns, drop the backup, recreate indexes, then run foreign-key verification.

## Consequences

Two independent orchestrations can progress while account-specific limits remain serialized. A waiting approval does not consume a worker, and its continuation is not stranded behind new work. A queued cancellation has zero model calls. Restarted jobs never execute unexpectedly and no API key is persisted in SQLite or LangGraph.

V1 has no editable worker count, arbitrary priority, distributed queue, drag-and-drop ordering or cross-process scheduler. Single-chat execution remains exclusive with orchestration workers. Queue metrics and broader backpressure telemetry are separate work.
