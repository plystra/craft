# Decision Record: Distribute skills around bounded tasks

## Status

Accepted

## Date

2026-10-04

## Context

Skills are distributed one directory at a time. The first implementation copied root documentation and many complete principle chapters into each skill. That duplicated material outside the task and made stewardship resemble a copy of the complete standards. Official website work and repository standards also lacked their own entry points.

A shared source repository remains useful for maintenance. It does not imply that a distributed skill should resemble that repository.

## Decision

Keep the canonical sources in their current locations and distribute eight independent task packages:

| Task | Package responsibility |
| --- | --- |
| Brand design | Positioning, identity assets, brand expression, and affiliation wording. |
| Product | Product behavior, tradeoffs, user agency, and lifecycle choices. |
| Writing | Copy and document content, truthful claims, examples, and release writing. |
| Frontend design | Interface composition, components, states, interaction, and accessibility. |
| Engineering | Software construction, contracts, security, verification, and technical releases. |
| Repository standards | Repository layout and maintained entry documents, licensing, configuration, contributor guidance, and working conventions. |
| Project website | Public website content, discovery, SEO, sharing, machine-readable summaries, and publication verification. |
| Stewardship | Relationships and admission, adoption records and evidence, maintenance responsibility, and retirement. |

Each directory contains its own `SKILL.md`, flat task-specific references, any templates that task uses, and license/provenance metadata. Do not distribute a nested `principles/` tree, the Craft README, a generic common standards package, or references to sibling skill directories.

The manifest selects exact source sections and gives them purpose-specific output filenames. Excerpts retain the selected text and code examples without weakening or paraphrasing obligations; provenance records the source hash and selection. A complete source is appropriate only when its entire subject belongs to the task. Scope and interpretation guidance in each entry point is brief.

The declared task must be possible with the package's local guidance. Source links provide provenance and further context. A request beyond the package boundary calls for identifying the additional work; it does not justify shipping every other discipline in advance or making another skill an undeclared dependency.

Some material belongs to more than one task, such as privacy notices for both product behavior and official website collection. This is deliberate overlap in the relevant sections, not a reason to bundle the entire security chapter in every skill.

Stewardship records adoption evidence and coordinates reviews. It does not claim to execute every domain's technical assessment from its own resources. Repository standards establishes maintainable repository conventions; engineering applies the relevant conventions while changing software. Frontend handles interface design; project website handles the official public web surface. Writing improves content; repository standards determines the required repository document set.

## Verification

Check that generated resources match the declared sections, no task package contains a copied principle tree or root documentation, and ordinary local links resolve when that directory is copied alone. Test stale selection detection, links to omitted sections, migration from old generated inventories, and protection of files outside the generator's recorded ownership.

The policy sources and their obligations remain unchanged by this packaging revision.

## Related documents

- [Repository structure decision](0001-craft-structure.md)
- [Skill catalog](../../README.md#task-skills)
- [Contribution workflow](../../CONTRIBUTING.md)
