# ADR-0003: Durable node retry and uncertain tools

- Status: Accepted
- Date: 2026-09-14

## Context

Long multi-agent runs can fail after several expensive nodes have completed. LangGraph checkpoints are already persisted in a sibling SQLite database with the root run ID as `thread_id`. Replaying the whole run wastes cost and can repeat side effects. LLM calls are safe to repeat, although a failed request can still have provider cost. Terminal commands are not generally idempotent.

## Decision

- Provider adapters classify failures as retryable or permanent. A retryable LLM call receives at most three attempts with bounded exponential backoff, subject to the run-family call and cost ceilings.
- Exhausted retryable nodes may be resumed only by an explicit user action. Each user retry creates a new run row with `parent_run_id`, `attempt`, and `resumed_from_node`, while continuing the root run's checkpoint thread.
- Attempt rows retain their own counters. History exposes cumulative calls and known cost across the root and all child attempts.
- Immediately before a mutation, the main database records `executing`, the validated public arguments, their canonical SHA-256, and the target content SHA-256 for writes.
- Recovery converts an executing terminal command to `uncertain`. It is never run again automatically. The user may continue without re-execution or stop the task.
- Recovery hashes a workspace-write target. An exact target-content match proves the write is already applied and prevents re-execution. Any other state remains uncertain.
- Agent, connection, credential, workflow, skill, permission, workspace, and knowledge requirements are revalidated before resuming.

## Consequences

Completed graph nodes and confirmed mutations are not repeated. A failed provider request may have incurred unreported cost; the UI describes this uncertainty and the model-call counter still includes every started request. Retry attempts remain separately auditable and grouped through one root run.
