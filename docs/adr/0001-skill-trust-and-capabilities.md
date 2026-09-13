# ADR-0001: Skill trust and capability boundaries

- Status: Accepted
- Date: 2026-09-13

## Context

ZeroCost currently supports local, user-authored skill packages. A skill is a declarative prompt package with instructions and required capability declarations; it does not execute code. Future phases may add reusable workflows, a third-party registry, and executable plugins. Those package types have different trust and isolation requirements.

The design must prevent package instructions from expanding an agent's authority. It must also keep runtime behavior deterministic: a skill either has every capability it declares or the run fails before provider or tool execution.

## Decision

### Keep one required capability set

Skill manifests retain `required_tools` and `required_permissions`. We will not add `optional_tools`. A capability-dependent variant is represented as a separate, composable skill, for example `code-review` and `code-review-with-search`. This avoids degraded but ambiguous execution modes and warning-only permission checks.

### Separate package kinds

- A **skill** contains trusted prompt instructions and capability declarations. It cannot execute code.
- A **workflow** defines a versioned, multi-step task graph composed from skills and tools.
- A **plugin** contains executable code and is installed and run under a separate sandbox and trust policy.

A workflow or plugin will not be represented by adding executable fields to the current skill record.

### Preserve internal and canonical identities

Phase 1 retains the UUID `id` as the SQLite primary/foreign-key identity and `(name, version)` as the local uniqueness boundary.

When registry packages arrive in Phase 2, manifests gain an immutable reverse-domain `package_id`, such as `com.zerocost.code-review`. The database uniqueness boundary becomes `(package_id, version)` while the UUID remains the internal reference. Upgrade and signature decisions bind to the canonical `package_id` plus version, never to the display name.

### Authority never comes from instructions

Skill instructions cannot grant permissions, enable tools, widen workspace paths, or bypass an approval checkpoint. A declared requirement is a ceiling and a prerequisite, not a grant.

For third-party packages, an effective capability requires every applicable grant:

1. The package declared the capability at install time.
2. The user explicitly approved that capability for that package and version.
3. The assigned agent has the capability.
4. The current task enabled the tool or selected the required knowledge scope.
5. A side-effecting action passed its existing per-action human approval.

Missing any grant fails closed before model/tool execution. Assignment to an agent does not imply package approval, and an agent's existing permission does not automatically approve a package's request. A package cannot request an undeclared capability at runtime.

Phase 1 packages are locally authored by the user. Creating and assigning one is therefore sufficient for the current trust boundary; no new approval table is introduced in this phase.

### Add trust controls when distribution changes

If Phase 2 introduces a third-party skill/workflow registry, installation requires:

- canonical `package_id` and immutable version;
- a canonical manifest hash covering instructions and security-relevant metadata;
- publisher identity;
- an installation screen showing the instruction summary and declared capabilities;
- explicit, persisted user approval scoped to the package version.

The controlled registry is the distribution trust root in this phase. A cryptographic publisher signature is not required while all distributed packages come through that controlled channel.

Phase 3 executable plugins additionally require:

- Ed25519 publisher signatures and a verifiable publisher certificate;
- a sandbox capability manifest for filesystem, process, network, and platform access;
- install-time capability ceilings and separately persisted runtime grants;
- a hard prohibition on runtime permission escalation;
- update handling that requires renewed approval whenever code, publisher, or requested capabilities change.

## Consequences

The current Phase 1 schema and runtime remain small and deterministic. Variants may create more skill records, but each record has one auditable execution contract. Registry support will require a migration for `package_id`, manifest hashes, publisher identity, installation state, and package-scoped approvals before importing any third-party package. Executable plugins require a separate threat model and sandbox implementation before their manifests are accepted.
