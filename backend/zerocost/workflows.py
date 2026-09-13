"""Compilation of fixed-topology workflow recipes into orchestration input."""
from __future__ import annotations

from .models import OrchestrationStartInput, Snapshot, WorkflowTemplate


def validate_workflow_bindings(store, workflow_id: str | None,
                               workflow_version: str | None,
                               agent_ids: list[str], snapshot: Snapshot,
                               *, require_active: bool) -> WorkflowTemplate | None:
    """Revalidate the immutable recipe and its ordered skill bindings.

    Resumed runs may continue after their recipe is archived, but an archive can
    never authorize a new run. Both paths re-check the exact skill assignments so
    approval cannot be used to bypass a change made while the run was paused.
    """
    if workflow_id is None:
        return None
    workflow = store.workflow(workflow_id)
    if workflow is None:
        raise ValueError("Workflow bulunamadı.")
    if workflow.version != workflow_version:
        raise ValueError("Workflow sürümü değişti; tarifi yenileyip tekrar deneyin.")
    if require_active and workflow.archived:
        raise ValueError("Arşivlenmiş workflow yeni görev başlatamaz.")
    if len(agent_ids) != len(workflow.agent_slots):
        raise ValueError("Her workflow yuvasına tam olarak bir ajan bağlayın.")

    agents = {agent.id: agent for agent in snapshot.agents}
    for slot, agent_id in zip(workflow.agent_slots, agent_ids, strict=True):
        agent = agents.get(agent_id)
        if agent is None:
            raise ValueError(f"{slot.name} yuvası için seçilen ajan bulunamadı.")
        missing = [skill_id for skill_id in slot.required_skill_ids
                   if skill_id not in agent.skill_ids]
        if missing:
            skill_names = []
            for skill_id in missing:
                skill = store.skill(skill_id)
                skill_names.append(f"{skill.name} v{skill.version}" if skill else skill_id)
            raise ValueError(
                f"{slot.name} yuvasındaki {agent.name} ajanına şu skill paketlerini atayın: "
                f"{', '.join(skill_names)}.")
    return workflow


def compile_workflow(store, params: OrchestrationStartInput,
                     snapshot: Snapshot) -> OrchestrationStartInput:
    if params.workflow_id is None:
        return params
    workflow = validate_workflow_bindings(
        store, params.workflow_id, params.workflow_version,
        params.agent_ids, snapshot, require_active=True)
    assert workflow is not None

    if "knowledge.search" in workflow.required_tools and not params.knowledge_collection_ids:
        raise ValueError("Bu workflow için en az bir bilgi koleksiyonu seçin.")
    mutation_tools = [tool for tool in workflow.required_tools
                      if tool in ("workspace.write", "terminal.execute")]
    if mutation_tools and not params.workspace_id:
        raise ValueError("Bu workflow araçları için bir çalışma alanı seçin.")

    prefix = workflow.objective_prefix.strip()
    objective = f"{prefix}\n\n{params.objective}" if prefix else params.objective
    if len(objective) > 12000:
        raise ValueError("Workflow öneki ve görev hedefi toplam 12.000 karakter sınırını aşıyor.")
    return OrchestrationStartInput.model_validate({
        **params.model_dump(mode="python"),
        "objective": objective,
        "rounds": workflow.rounds,
        "routing_mode": "manual",
        "max_model_calls": workflow.max_model_calls,
        "max_output_tokens": workflow.max_output_tokens,
        "max_cost_microusd": workflow.max_cost_microusd,
        "enabled_tools": mutation_tools,
    })
