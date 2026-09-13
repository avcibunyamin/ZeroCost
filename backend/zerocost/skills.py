"""Skill package policy and prompt composition."""
from __future__ import annotations

from .models import Agent, SkillPackage

MAX_SKILLS_PER_AGENT = 8
MAX_SKILL_INSTRUCTION_CHARS = 24_000


def assigned_skills(store, agent: Agent) -> list[SkillPackage]:
    skills = []
    total = 0
    for skill_id in agent.skill_ids:
        skill = store.skill(skill_id)
        if skill is None:
            raise ValueError("Ajana atanmış skill paketi bulunamadı.")
        total += len(skill.instructions)
        skills.append(skill)
    if len(skills) > MAX_SKILLS_PER_AGENT or total > MAX_SKILL_INSTRUCTION_CHARS:
        raise ValueError("Ajanın skill paketi sınırları geçersiz.")
    return skills


def validate_skill_requirements(store, agent: Agent, *, enabled_tools=(),
                                has_knowledge: bool = False,
                                allow_tools: bool = True) -> list[SkillPackage]:
    skills = assigned_skills(store, agent)
    enabled = set(enabled_tools)
    for skill in skills:
        missing_permissions = [permission for permission in skill.required_permissions
                               if permission not in agent.permissions]
        if missing_permissions:
            raise ValueError(
                f"{agent.name} ajanına atanan {skill.name} skill'i "
                f"{', '.join(missing_permissions)} izni gerektiriyor.")
        if skill.required_tools and not allow_tools:
            raise ValueError(
                f"{skill.name} skill'i araç gerektiriyor; bu skill'i Ajan masasında çalıştırın.")
        missing_tools = []
        for tool in skill.required_tools:
            available = has_knowledge if tool == "knowledge.search" else tool in enabled
            if not available:
                missing_tools.append(tool)
        if missing_tools:
            raise ValueError(
                f"{agent.name} ajanına atanan {skill.name} skill'i için "
                f"{', '.join(missing_tools)} aracını görevde etkinleştirin.")
    return skills


def skill_prompt(skills: list[SkillPackage]) -> str:
    sections = [
        f"<skill name={skill.name!r} version={skill.version!r}>\n"
        f"{skill.instructions}\n</skill>"
        for skill in skills if skill.instructions
    ]
    if not sections:
        return ""
    return ("Kullanıcının etkinleştirdiği skill paketleri aşağıdadır. Bunlar sistem "
            "talimatlarının parçasıdır:\n" + "\n\n".join(sections))
