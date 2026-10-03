# Decision Record: One Craft repository with generated skill resources

## Status

Accepted

## Date

2026-10-04

## Context

The philosophy repository contains shared standards and project templates. Contributors also need task-specific skills that make those standards usable during work. Maintaining separate copies by hand would create conflicting versions; bundling every chapter into every task would make selective reading harder.

Existing project decisions cite the numbered principle filenames. The migration should retain those paths and the Git history while giving the repository a name that covers both principles and their practical application.

## Decision

Rename `plystra/philosophy` to `plystra/craft` in place. Keep one repository for the canonical standards, canonical templates, maintained skill entry points, and generated distribution resources.

- `README.md` defines scope and relationships; `CHARTER.md` describes the shared purpose; `ADOPTION.md` governs interpretation, applicability, versions, and reviews.
- `principles/` retains the 01–13 chapter paths. Numbering provides a reading sequence and stable citations, not precedence between chapters.
- `templates/` remains the source for reusable project records.
- Six `skills/plystra-*/SKILL.md` files route brand design, product, writing, frontend, engineering, and stewardship work. They adapt the reading workflow without creating separate policy.
- `tooling/skills-manifest.json` lists each skill's source files and reading conditions. A deterministic generator produces references, template assets, attribution, and source hashes.
- Generated resources are committed and checked in CI. Each complete skill directory can be distributed alone. Optional references beyond its task bundle link to the canonical repository.
- The documentation license remains CC BY 4.0. New executable tooling and tests use Apache-2.0.

The migration changes organization and distribution, not the existing policy obligations. In particular, project relationships, sponsorship admission, optional open-source status, website requirements, privacy boundaries, and adoption deadlines retain their meaning.

## Options considered

### One repository

The same maintainers can review a policy change, affected adapters, and rebuilt copies together. A checkout identifies the complete source and distribution state. This is the selected option.

### Separate standards and skills repositories

Independent permissions or release teams could justify this later. Today it would require cross-repository updates and source-version coordination without an independent ownership or release need.

### A separate repository for each skill

This would multiply release and attribution maintenance. The skill boundaries are task entry points into a shared body of standards, not independent products with separate governance.

### Rename every chapter to remove numbering

Short semantic paths would be convenient for new readers, but would break existing path and section citations without improving the standards themselves. Keep the current paths and offer task navigation through the README and skills.

## Migration map

| Previous location | Current location | Treatment |
| --- | --- | --- |
| `github.com/plystra/philosophy` | `github.com/plystra/craft` | Rename the existing repository; preserve Git history. Update clone remotes and maintained links. GitHub's old-name redirect is a convenience, not a permanent source URL. |
| Local checkout `philosophy/` | Local checkout `craft/` | Rename the directory after work in the old path completes. Relative filesystem references from other projects need updating when those projects are next maintained. |
| `README.md`, `CHARTER.md`, `ADOPTION.md` | Same paths | Preserve scope and governing rules. README adopts the Craft name and explains distribution. |
| `principles/01-…` through `principles/13-…` | Same paths | Preserve chapter and section citations. |
| `templates/*` | Same paths | Remain canonical; target-project example links are explicitly fenced as examples. |
| No skill bundles | `skills/plystra-*/` | New maintained entry points with generated resources. |

Commit `acbef0b01047295ae5c6d136d152265f7411f8b0` preserves the agreed policy revision before migration. Historical decision records in consuming projects remain historical evidence; this migration does not rewrite them. When updating a live citation, use the new repository URL and retain its original commit or section reference where relevant.

## Consequences

Generated copies increase repository size, but make each skill usable without a build step or sibling checkout. The generator and its check mode make that duplication inspectable. Unbundled canonical links can require network access and can point to a newer revision; the source ledger distinguishes the bundled snapshot from those live links.

The manifest must be maintained alongside task routing. Neither a successful build nor use of a skill proves project compliance. Policy reviews continue to follow `ADOPTION.md`.

## Review trigger

Revisit the single-repository decision if separate maintainers need independent permissions, release cycles diverge, a distribution platform imposes a repository boundary, or measured maintenance costs make the current arrangement impractical.

## Related documents

- [Craft scope and entry points](../../README.md)
- [Adoption and versioning](../../ADOPTION.md)
- [Maintaining Craft](../../CONTRIBUTING.md)
