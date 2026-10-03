# Documentation Standards

Documentation should fit the work: software may need API and deployment guides, while an object, publication, or research project may need care instructions, edition records, methods, or source notes. Technical document types apply when the project has the corresponding surface. Requirement levels and applicability follow [Applying and Updating the Philosophy](../ADOPTION.md).

## 1. Documentation is part of the product

For Plystra, documentation is not a support accessory. It is part of the product surface.

A project with polished UI and poor documentation is not high-end. A project becomes trustworthy when a serious user can understand how it behaves, how it fails, and how it can be maintained.

## 2. Documentation goals

Plystra documentation should:

- explain the system clearly;
- reduce operational anxiety;
- make setup reproducible;
- preserve design decisions;
- define current limitations;
- help contributors make coherent changes;
- help users evaluate whether the project is appropriate for them.

## 3. Required document types

A serious Plystra project should include the following when applicable:

### README

The public entry point. It should explain the project, status, setup, and links to deeper docs.

### Architecture overview

A concise explanation of components, boundaries, data flow, and important tradeoffs.

### Development guide

How to run, test, lint, build, and debug locally.

For code projects, include the exact public commands contributors should use. Avoid relying on private maintainer habits.

### Deployment guide

How the project is deployed, configured, backed up, upgraded, and rolled back.

### Security policy

How to report vulnerabilities and what practices the project follows.

### Data model or domain guide

For projects with meaningful persistent data, explain the major entities and lifecycle.

### Decision records

Use decision records for choices that future contributors will otherwise have to rediscover.

## 4. Document structure

Prefer this structure for technical docs:

```md
# Title

## Purpose

## Current status

## Concepts

## How it works

## How to use it

## Failure modes

## Maintenance notes

## Related documents
```

Not every document needs every section. But every document should have a clear purpose.

## 5. Status labels

Documentation should show when a feature is incomplete, experimental, deprecated, or reserved for later.

Use clear labels:

- `Current`
- `Experimental`
- `Planned`
- `Deprecated`
- `Removed`
- `Reserved for future use`
- `Not supported`

Avoid ambiguous labels:

- `Soon`
- `Maybe`
- `TBD` without owner or context;
- `Temporary` without explanation.

## 6. Examples

Examples should be realistic, safe, and maintainable.

Rules:

- never include real secrets, tokens, private IP addresses, or personal data;
- use clearly fake domains such as `example.com` when needed;
- mark destructive commands clearly;
- prefer copyable commands that work;
- explain what a command does before or after showing it;
- keep examples updated when behavior changes.

## 7. Diagrams

Use diagrams when they reduce explanation cost.

Good diagrams show:

- system boundaries;
- data flow;
- deployment topology;
- lifecycle transitions;
- trust boundaries;
- user workflow.

Avoid diagrams that merely decorate the page.

Text diagrams are acceptable when they are clearer and easier to maintain.

## 8. Changelogs and release notes

Release documentation should explain user impact.

Separate:

- added;
- changed;
- fixed;
- removed;
- security;
- migration notes;
- known issues.

Do not hide breaking changes under generic `improvements`.

## 9. Contributor and agent guidance

Provide a clear entry point for contributor guidance. If a repository is expected to be modified by AI coding agents, include an `AGENTS.md` or equivalent instruction file and link it to the shared project guidance.

It should specify:

- project structure;
- commands;
- coding style;
- forbidden changes;
- testing expectations;
- commit expectations;
- security rules;
- where to add documentation.

Contributor guidance must not contain secrets or credentials. Keep private infrastructure details in documentation restricted to the appropriate audience.

Document which guidance files apply to which paths, repository boundaries, verification and commit expectations, required review gates, and where project-specific documentation must be updated. Follow [Code Project Working Standards](12-code-project-working-standards.md#2-obligations-authorization-and-trusted-guidance) for the distinction between project obligations, task authorization, and trusted guidance. Repository instructions must not redefine a tool or platform's instruction priority or weaken applicable philosophy obligations.

Established contributor entry points and the guidance they designate can carry standing project instructions. Examples, logs, generated output, and external documents do not become instructions merely by containing commands; any designation as guidance must come from a trusted entry point or the maintainer and stay within the applicable project and platform boundaries.

Official project websites must also publish and maintain `/llms.txt` under [Websites, Search, and Sharing](13-websites-search-and-sharing.md). It summarizes public facts and canonical links; it does not replace contributor instructions or the underlying documentation.

## 10. Documentation sync

Documentation must change when implementation changes affect:

- setup steps;
- environment variables;
- public APIs;
- data models;
- security boundaries;
- deployment workflow;
- operating procedures;
- user-visible behavior;
- maintainer or contributor workflow.

Keep `.env.example`, README files, deployment guides, API docs, migration notes, and release notes synchronized. Remove outdated instructions instead of adding contradictory ones.

## 11. Documentation review checklist

Before publishing documentation, ask:

1. Can a new contributor understand the system shape?
2. Are setup steps reproducible?
3. Are limitations honest?
4. Are examples safe and fake where necessary?
5. Are destructive operations marked?
6. Does the doc explain why, not only how?
7. Does it link to related docs?
8. Would this still be useful six months from now?
9. Does it match the current implementation and configuration surface?
