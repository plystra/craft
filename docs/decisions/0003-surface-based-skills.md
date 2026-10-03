# Decision Record: Organize skills by project surface

## Status

Accepted. Supersedes [task-specific skill distribution](0002-task-specific-skills.md).

## Date

2026-10-04

## Context

Skills are installed once per project, for example with `bunx --bun skills add plystra/craft`. The installer asks which skills a project should have. The previous eight skills were divided by kind of task: brand design, product, writing, frontend design, engineering, repository standards, project website, and stewardship.

That division did not answer the installation question:

- A typical project performs most of those tasks. A web application writes copy, makes product decisions, changes code, designs interfaces, maintains its repository, and publishes a site. Installing fewer skills silently dropped obligations that still applied; installing all of them added little over a single package.
- To keep each task self-contained, the same sections were distributed repeatedly. Accessibility appeared in four skills, writing in four, governance in four, and the decision-record template in five. Installed together, the skills duplicated content and told the agent that work covered by another installed skill was "a separate task".
- Every entry point repeated a long paraphrase of the requirement levels, and two skills shipped different excerpts of the project-principles template with warnings not to treat either as complete.
- The README's five words and direction sections, which explain what every project is measured against, were not distributed at all.

`ADOPTION.md` already defines applicability by what a project contains: shared obligations for every project, plus interface, software, and website provisions where those surfaces exist. Installation can use the same rule.

## Decision

Distribute one base skill and four modules:

| Skill | Install when |
| --- | --- |
| `plystra-craft` | Always, in every Plystra project. |
| `plystra-craft-code` | The project contains source code. |
| `plystra-craft-design` | The project has a visual identity or an interface people see or operate. |
| `plystra-craft-website` | The project operates an official website or public web documentation. |
| `plystra-craft-stewardship` | Only in the Plystra steward's workspace. |

- The base skill carries what applies to every project: requirement levels and applicability, scope and relationships, the brand, product, writing, documentation, privacy and data, releases and maintenance, ownership, licensing, and claims, and the full project templates.
- Each canonical section is distributed by exactly one skill. Modules state that they require the base skill and point to it by name rather than by relative link.
- Entry points route by task inside their surface. The base skill lists the install map, so an agent working on a surface whose module is missing names that module instead of guessing.
- Stewardship holds only decisions that belong to Plystra's steward: admission, sponsorship, governance maturity, and brand-use permission. Adoption records stay in the base skill because every project keeps one.
- The README's scope and relationship definitions are distributed with the base skill. Its former five words and direction sections now live in the chapters they describe, so every canonical rule reaches a skill.

Skill names use the `plystra-craft` namespace because they distribute Craft, and so cannot collide with project names; `plystra-core`, for example, is an existing project. A new project never needs its own skill or a change to Craft.

No project had installed the earlier skills, so the old names are removed without aliases.

## Options considered

### One skill for everything

Nothing to choose at install time. It would ship code, website, and stewardship material to projects without those surfaces, and its description would have to cover every kind of work. Surface modules keep the choice small while matching the existing applicability rules.

### Keep task skills and document recommended sets

Documentation alone would not remove the duplicated sections or the "separate task" boundaries that conflict when the skills are installed together.

### Fully independent surface skills

Each module could carry its own copy of the shared standards. That reintroduces the duplication this decision removes. A single required base skill is an explicit, easily satisfied dependency.

## Consequences

Choosing skills becomes three yes-or-no questions after installing the base skill. The installed set also records which surfaces a project has. When a project gains a surface, it adds the matching module.

Modules are not usable without the base skill. Their entry points and descriptions say so, and the tests check it. Links from one skill to material in another use canonical repository URLs.

The base skill is the largest skill. Its references load on demand, so size affects storage rather than the context of ordinary tasks.

## Review trigger

Revisit if a recurring kind of project cannot be described by these surfaces, if a module grows large enough to need its own split, or if skill installers gain dependency resolution.

## Related documents

- [Installing skills](../../README.md#installing-skills)
- [Applicability follows the work](../../ADOPTION.md#3-applicability-follows-the-work)
- [Maintaining Craft](../../CONTRIBUTING.md)
