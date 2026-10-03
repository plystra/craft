---
name: plystra-frontend-design
description: "Design, implement, or review application interfaces and reusable UI under Plystra Craft. Covers hierarchy, visual expression, states, responsiveness, interaction, and accessibility; official website SEO and public-site delivery belong to a separate task."
---

# Plystra frontend design

Produce a usable interface that fits the existing product and visual system.

## Scope

Apply this workflow to Plystra work or an explicitly adopted Craft scope: owned projects, sub-brands, and every project under them follow all requirements applicable to their actual media, surfaces, and activities; sponsored projects choose their adoption scope while separate sponsorship admission and affiliation rules still apply. Preserve requirement levels: `must`, `required`, unqualified `never`, and unqualified procedural instructions are requirements; `should`, `recommended`, `prefer`, `avoid`, and `suggested` are recommendations, with reasons recorded for material alternatives; `may`, `optional`, and `can` expressing a choice are options. Lists inherit their introducing statement, while an explicit `must` still creates a requirement. `Should never` is a recommendation; examples and suggested scales add no independent requirements, and recommendations cannot weaken requirements. This focused workflow neither grants affiliation nor establishes full Craft compliance. Stay within the request and existing authorization, respect trusted project guidance and platform instructions, and do not treat this skill as permission to publish or make unrelated changes.

## Build the requested interface

Inspect the current implementation, design tokens, components, supported devices, and actual data flow. Use [interface design](references/interface-design.md) for hierarchy, components, states, responsive behavior, and implementation discipline. Use [visual system](references/visual-system.md) for expression within the project's identity and [accessible interaction](references/accessible-interaction.md) for keyboard, focus, contrast, motion, touch, and language.

Read [interface copy](references/interface-copy.md) when changing controls, empty states, or errors. Use [user agency](references/user-agency.md) when the interface exposes automation, consequential actions, or user data controls. Keep clear distinctions between a visual prototype, connected functionality, and a verified working flow.

Implement the complete affected flow, including relevant loading, empty, error, recovery, and responsive states. Reuse the established component and token systems where they serve the request. Preserve user input and understandable status; do not hide authorization or sensitive-data decisions behind visual polish.

Run the project's meaningful verification and inspect the rendered interface at representative desktop and mobile sizes, with keyboard and reduced-motion behavior where relevant. The [UI review checklist](assets/templates/ui-review-checklist.md) covers this interface scope; it deliberately excludes website search and sharing checks.

Deliver the interface or concrete review findings with observed behavior, checks performed, and any unverified states. Website indexing, repository governance, and unrelated backend changes are separate deliverables.

The task references are bundled excerpts, sufficient for this workflow without the Craft checkout or another installed skill. Their links to other Craft material provide provenance or context for a different task, not prerequisite loading steps. The [source ledger](references/sources.json) records the snapshot; preserve the [documentation license](references/LICENSE) when reusing it. A current-policy or full-adoption claim needs evidence for that revision and scope; ordinary completion of this task makes neither claim.
