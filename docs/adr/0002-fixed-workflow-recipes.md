# ADR-0002: Fixed-topology workflow recipes

- Status: Accepted
- Date: 2026-09-13

## Context

ZeroCost already has a deterministic 2–4 agent LangGraph orchestration path, immutable skill package versions, task-scoped tools, budget checks, persistent approvals, and run history. Repeated tasks need reusable recipes, but a graph editor would introduce a second execution model, topology validation, cycle handling, and a larger security surface before those needs are proven.

String templates also create an avoidable interpolation boundary between trusted recipe text and runtime user input. A slot can need several exact skill versions, while a coordinator property would imply a topology that the current engine does not implement.

## Decision

Workflow V1 is a local, user-authored, immutable recipe compiled into the existing orchestration input.

- A recipe has 2–4 ordered agent slots. Each slot declares `required_skill_ids`, which may contain several immutable skill record IDs.
- The topology remains the existing ordered discussion, review rounds, and first-agent synthesis. V1 has no coordinator field and no editable graph.
- `objective_prefix` is literal fixed text. The backend appends the separate runtime objective once; it evaluates no placeholders or interpolation syntax.
- A recipe owns its required tools, rounds, model-call limit, output-token limit, and fiat cost ceiling. It grants no permission. Agent permissions, workspace scope, knowledge collections, and human approvals remain separate runtime checks.
- Creating another version with the same name archives earlier versions in the same transaction. Historical versions remain immutable and cannot start new runs.
- Runs store nullable `workflow_id` and `workflow_version`. Existing free-form runs remain valid.
- A paused run may resume after its recipe is archived, because its provenance and graph state already exist. Its ordered slot and skill bindings are revalidated before approval resumes execution.

## Consequences

Recipes are inspectable, reproducible, and compatible with existing free-form orchestration. Exact skill IDs pin a workflow slot to a specific local skill version. Users must create a new workflow version to change instructions, slots, or budgets.

Graph editing, branching, coordinator selection, retry edges, registry package IDs, publisher trust, signatures, and executable plugins remain separate future changes. They must not be added by widening the V1 workflow record with executable fields.
