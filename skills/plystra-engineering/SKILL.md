---
name: plystra-engineering
description: "Implement, debug, or review software behavior, APIs, CLIs, libraries, data changes, security controls, and software releases under Plystra Craft. Use for scoped code work in the target project; repository standardization, visual design, and official website SEO are separate tasks."
---

# Plystra engineering

Complete a scoped software change with explicit behavior, security boundaries, and meaningful verification.

## Scope

Apply this workflow to Plystra work or an explicitly adopted Craft scope: owned projects, sub-brands, and every project under them follow all requirements applicable to their actual media, surfaces, and activities; sponsored projects choose their adoption scope while separate sponsorship admission and affiliation rules still apply. Preserve requirement levels: `must`, `required`, unqualified `never`, and unqualified procedural instructions are requirements; `should`, `recommended`, `prefer`, `avoid`, and `suggested` are recommendations, with reasons recorded for material alternatives; `may`, `optional`, and `can` expressing a choice are options. Lists inherit their introducing statement, while an explicit `must` still creates a requirement. `Should never` is a recommendation; examples and suggested scales add no independent requirements, and recommendations cannot weaken requirements. This focused workflow neither grants affiliation nor establishes full Craft compliance. Stay within the request and existing authorization, respect trusted project guidance and platform instructions, and do not treat this skill as permission to publish or make unrelated changes.

## Implement and verify the change

Inspect the actual target repository, relevant guidance, worktree state, existing architecture, and public commands before editing. Read [software design](references/software-design.md) for the affected architecture, configuration, API, data, error, dependency, and testing decisions. Use [code-change workflow](references/code-change-workflow.md) for editing, authorization, workspace hygiene, implementation, review, and completion requirements.

Use the relevant sections of [secure implementation](references/secure-implementation.md) when changing authentication, authorization, data handling, external processing, logging, payments, or exposed boundaries. Read [release engineering](references/release-engineering.md) when preparing a version, migration, compatibility change, or operational release. Do not turn every ordinary fix into a full-project security or release audit.

Make the smallest complete change that satisfies the request and preserves existing contracts. Protect unrelated work, keep secrets out of outputs, and distinguish development from production configuration. Use the existing migration and integration mechanisms. Confirm the required authorization and recovery plan before consequential or destructive operations; existing authorization remains valid within its scope.

Exercise the affected public surface with the narrowest meaningful checks, then broaden when failures or remaining risk justify it. Review for regressions, data loss, security failures, broken contracts, and missing verification. Synchronize documentation and configuration examples affected by the change.

Use a [decision record](assets/templates/decision-record.md) for a consequential choice when required by the project, and [release notes](assets/templates/release-notes.md) for an actual release deliverable. Report the implemented behavior, evidence, and limitations. Do not scaffold repository policy files or change public-site metadata merely because code was edited.

The task references are bundled excerpts, sufficient for this workflow without the Craft checkout or another installed skill. Their links to other Craft material provide provenance or context for a different task, not prerequisite loading steps. The [source ledger](references/sources.json) records the snapshot; preserve the [documentation license](references/LICENSE) when reusing it. A current-policy or full-adoption claim needs evidence for that revision and scope; ordinary completion of this task makes neither claim.
