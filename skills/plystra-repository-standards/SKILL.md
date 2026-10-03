---
name: plystra-repository-standards
description: "Create or review a project repository under Plystra Craft: structure, README, license, security contact, configuration examples, contributor and agent guidance, development commands, and adoption records. Use for repository standards and maintainability entry points; feature implementation and website SEO are separate tasks."
---

# Plystra repository standards

Make a repository understandable and usable by its next maintainer, with accurate entry documents and working conventions.

## Scope

Apply this workflow to Plystra work or an explicitly adopted Craft scope: owned projects, sub-brands, and every project under them follow all requirements applicable to their actual media, surfaces, and activities; sponsored projects choose their adoption scope while separate sponsorship admission and affiliation rules still apply. Preserve requirement levels: `must`, `required`, unqualified `never`, and unqualified procedural instructions are requirements; `should`, `recommended`, `prefer`, `avoid`, and `suggested` are recommendations, with reasons recorded for material alternatives; `may`, `optional`, and `can` expressing a choice are options. Lists inherit their introducing statement, while an explicit `must` still creates a requirement. `Should never` is a recommendation; examples and suggested scales add no independent requirements, and recommendations cannot weaken requirements. This focused workflow neither grants affiliation nor establishes full Craft compliance. Stay within the request and existing authorization, respect trusted project guidance and platform instructions, and do not treat this skill as permission to publish or make unrelated changes.

## Establish the repository's actual shape

Inspect tracked files, worktree state, project type, public or private status, owner, contribution policy, package manager, and existing commands. Preserve working conventions and unrelated changes. Read [repository essentials](references/repository-essentials.md) for the document set, README, configuration examples, dependencies, and verification expectations; do not create files for surfaces the project does not have.

Use the task-specific material for the records being changed:

- [Contributor entrypoints](references/contributor-entrypoints.md) for document roles, safe examples, developer instructions, and synchronization.
- [Repository workflow](references/repository-workflow.md) for trusted guidance, repository boundaries, configuration, review, and completion rules.
- [Repository rights](references/repository-rights.md) for ownership, licensing, contributions, and consequential decisions. Open source is not mandatory; match the license to actual rights and intent.
- [Secrets and reporting](references/secrets-and-reporting.md) for safe repository examples and an actionable security reporting path.
- [Adoption record](references/adoption-record.md) when creating or updating the reviewed revision, evidence, gaps, and next review date.

## Produce usable entry points

Create or repair the requested structure and maintained documents using real commands and verified facts. Link contributor and agent guidance to a clear trusted entry point; state path scope and applicable review gates without claiming to redefine platform instruction priority. Keep public constants separate from credentials and environment-specific operational configuration.

Adapt the [README](assets/templates/project-readme.md) and [project record](assets/templates/project-principles.md) only when those deliverables apply. The project-record template is an excerpt covering this repository task's records, not a complete project-principles template: preserve every other applicable section in an existing `PROJECT_PRINCIPLES.md`, and identify the remaining applicable information when starting a new record. Do not replace a complete record with the excerpt or present the excerpt as complete project principles. Sponsorship alone does not require `PROJECT_PRINCIPLES.md`. Use a [decision record](assets/templates/decision-record.md) for a consequential repository choice when appropriate. Replace template placeholders and relative links with actual project facts and destinations.

Verify documented commands where practical, links and file paths, license consistency, configuration examples, and contributor instructions against the repository. Record unknown evidence honestly; do not claim a full Craft review merely because its record exists. Deliver the changed entry points, verification performed, and remaining gaps. API implementation, database changes, comprehensive security auditing, and official-site delivery are outside this workflow.

The task references are bundled excerpts, sufficient for this workflow without the Craft checkout or another installed skill. Their links to other Craft material provide provenance or context for a different task, not prerequisite loading steps. The [source ledger](references/sources.json) records the snapshot; preserve the [documentation license](references/LICENSE) when reusing it. A current-policy or full-adoption claim needs evidence for that revision and scope; ordinary completion of this task makes neither claim.
