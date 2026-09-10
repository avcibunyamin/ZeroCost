"""Versioned standard API price catalog. Rates are USD per million tokens."""
from __future__ import annotations
from dataclasses import dataclass
from decimal import Decimal, ROUND_CEILING

CATALOG_VERSION = '2026-09-09'
CATALOG_SOURCES = {
    'anthropic': 'https://platform.claude.com/docs/en/about-claude/pricing',
    'gemini': 'https://ai.google.dev/gemini-api/docs/pricing',
}


@dataclass(frozen=True)
class Price:
    input_per_million: Decimal
    output_per_million: Decimal


@dataclass(frozen=True)
class TokenUsage:
    input_tokens: int = 0
    output_tokens: int = 0


ANTHROPIC = (
    (('claude-fable-5', 'claude-mythos-5'), Price(Decimal('10'), Decimal('50'))),
    (('claude-opus-5', 'claude-opus-4-8', 'claude-opus-4-7',
      'claude-opus-4-6', 'claude-opus-4-5'), Price(Decimal('5'), Decimal('25'))),
    (('claude-opus-4-1', 'claude-opus-4'), Price(Decimal('15'), Decimal('75'))),
    (('claude-sonnet-5',), Price(Decimal('2'), Decimal('10'))),
    (('claude-sonnet-4-6', 'claude-sonnet-4-5', 'claude-sonnet-4'),
     Price(Decimal('3'), Decimal('15'))),
    (('claude-haiku-4-5',), Price(Decimal('1'), Decimal('5'))),
    (('claude-haiku-3-5',), Price(Decimal('0.8'), Decimal('4'))),
)

GEMINI = (
    (('gemini-2-5-flash-lite',), Price(Decimal('0.10'), Decimal('0.40'))),
    (('gemini-2-5-flash',), Price(Decimal('0.30'), Decimal('2.50'))),
    (('gemini-2-5-pro',), Price(Decimal('1.25'), Decimal('10'))),
)


def catalog():
    """Return the public catalog through the typed IPC contract."""
    from .models import PriceEntry, PricingCatalog

    entries = []
    for provider, groups in (('anthropic', ANTHROPIC), ('gemini', GEMINI)):
        for patterns, price in groups:
            entries.extend(PriceEntry(
                provider=provider,
                model_pattern=pattern,
                input_per_million_usd=float(price.input_per_million),
                output_per_million_usd=float(price.output_per_million),
            ) for pattern in patterns)
    return PricingCatalog(version=CATALOG_VERSION, sources=CATALOG_SOURCES,
                          entries=entries)


def price_for(provider: str, model_id: str, input_tokens: int = 0) -> Price:
    if provider in ('ollama', 'lmstudio'):
        return Price(Decimal(0), Decimal(0))
    groups = ANTHROPIC if provider == 'anthropic' else GEMINI if provider == 'gemini' else ()
    normalized = model_id.casefold().replace('.', '-').replace('_', '-')
    for prefixes, price in groups:
        if any(prefix in normalized for prefix in prefixes):
            if provider == 'gemini' and 'gemini-2-5-pro' in normalized and input_tokens > 200_000:
                return Price(Decimal('2.50'), Decimal('15'))
            return price
    raise ValueError(f'{model_id} için {CATALOG_VERSION} fiyat kataloğunda güvenilir fiyat yok.')


def cost_microusd(provider: str, model_id: str, usage: TokenUsage) -> int:
    price = price_for(provider, model_id, usage.input_tokens)
    # USD/MTok numerically equals micro-USD/token.
    value = (Decimal(usage.input_tokens) * price.input_per_million +
             Decimal(usage.output_tokens) * price.output_per_million)
    return int(value.quantize(Decimal('1'), rounding=ROUND_CEILING))


def estimate_plan(snapshot, agent_ids: list[str], rounds: int, objective: str,
                  context_bytes: int, max_output_tokens: int,
                  extra_synthesis: bool = False) -> int:
    agents = {agent.id: agent for agent in snapshot.agents}
    connections = {connection.id: connection for connection in snapshot.connections}
    sequence = agent_ids * rounds + [agent_ids[0]]
    if extra_synthesis:
        sequence.append(agent_ids[0])
    transcript_tokens = 0
    total = 0
    objective_bytes = len(objective.encode('utf-8'))
    for index, agent_id in enumerate(sequence):
        agent = agents[agent_id]
        connection = connections[agent.connection_id]
        # UTF-8 byte count is deliberately conservative for text tokenization.
        input_bound = (objective_bytes + context_bytes + transcript_tokens +
                       len(agent.role.encode()) + len(agent.instructions.encode()) + 2048)
        if extra_synthesis and index == len(sequence) - 1:
            input_bound += 40_000
        total += cost_microusd(connection.provider, connection.model_id,
                              TokenUsage(input_bound, max_output_tokens))
        transcript_tokens += max_output_tokens
    return total
