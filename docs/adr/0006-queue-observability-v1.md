# ADR-0006: Queue observability V1

- Status: Accepted
- Date: 2026-09-14

## Context

The persistent task queue exposes lifecycle state, but a status label alone does not explain why work is waiting. Two workers, per-connection serialization, approval pauses, fallback and retry make a reliable ETA impossible without representative historical data. A separate operations dashboard would also expand a UI-focused slice before its data model has proved useful.

## Decision

Schema v16 adds an append-only `orchestration_status_events` table. Every lifecycle transition records the run, previous and next status, a bounded human-readable reason and timestamp. Existing runs receive one migration baseline event. Events are deleted through the run foreign-key cascade and are returned in sequence as part of orchestration history.

The history response also carries an in-memory runtime snapshot: two worker assignments plus each currently contended connection's holder, holder worker and waiting run IDs. Credentials, prompts, tool arguments and model output never enter this snapshot.

The existing Ajan masası page polls this snapshot only while live runs exist. Queue cards show elapsed time in their current state and a concrete reason such as worker saturation, approval wait or connection ownership. Run detail displays the durable status timeline. The existing history area gains status and preset date-range filters.

## Consequences

Users can distinguish worker congestion from provider-connection contention and can audit restart, approval and completion transitions without a new operations page. The status-event table also creates a trustworthy source for later metrics.

V1 does not calculate ETA, aggregate percentiles, visualize retry families or add a separate observability dashboard. ETA may be introduced only after enough completed-run data exists to validate its error bounds.
