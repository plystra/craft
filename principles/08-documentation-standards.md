# Documentation Standards

Documentation should fit the work: software may need API and deployment guides, while an object, publication, or research project may need care instructions, edition records, methods, or source notes.

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

## 3. Document set

### Repository files

Every public repository for a Plystra project should include:

```text
README.md
LICENSE
SECURITY.md
CONTRIBUTING.md, when contributions are accepted
CHANGELOG.md or release notes, when versions are published
PROJECT_PRINCIPLES.md
docs/, when setup or operation is non-trivial
```

`LICENSE` is required by [Governance and Legal](11-governance-and-legal.md#3-licenses) and `PROJECT_PRINCIPLES.md` by [project principles](../ADOPTION.md#4-project-principles). Every private repository should still include enough documentation for future maintainers.

### README

The public entry point. Start from the [project README template](../templates/project-readme.md). A README should explain, as applicable:

- what the project is;
- current maturity;
- who it is for;
- what problem it solves;
- what it does not do;
- quick start;
- architecture overview;
- configuration;
- development workflow;
- testing;
- deployment or release process;
- license;
- security reporting;
- links to deeper documentation.

Avoid README files that are only installation commands.

### Other document types

A serious Plystra project should include the following when applicable:

- **Architecture overview** — a concise explanation of components, boundaries, data flow, and important tradeoffs.
- **Development guide** — how to run, test, lint, build, and debug locally. For code projects, include the exact public commands contributors should use; avoid relying on private maintainer habits.
- **Deployment guide** — how the project is deployed, configured, backed up, upgraded, and rolled back.
- **Security policy** — how to report vulnerabilities and what practices the project follows.
- **Data model or domain guide** — for projects with meaningful persistent data, the major entities and lifecycle.
- **Decision records** — for meaningful choices that future contributors would otherwise have to rediscover, such as product direction, architecture, privacy, public API, user experience, or long-term maintenance. Use the [decision record template](../templates/decision-record.md): context, decision, options considered and why they were not chosen, consequences, and a review trigger. Decision records are not bureaucracy; they protect future maintainers from rediscovering old reasoning.

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

Recommended order for a project's documentation as a whole:

1. What this project is.
2. Current maturity and limitations.
3. System architecture.
4. Local development.
5. Configuration.
6. Data and security model.
7. Deployment.
8. Operations.
9. Contribution rules.

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

- follow [secret handling](09-security-and-privacy.md#3-secret-handling) and never include personal data;
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

## 8. Documentation sync

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

Keep `.env.example`, README files, deployment guides, API docs, migration notes, and [release notes](10-release-and-maintenance.md#4-release-notes) synchronized. Remove outdated instructions instead of adding contradictory ones.

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

Guidance read by agents describes the project as it is now. Leave out plans for later rewrites, migrations onto other systems, and pointers to unfinished work elsewhere: an agent treats every mention as a lead, goes to read the unfinished code, and builds premature integration that must be undone later. Keep such plans with the steward, and give agents a workspace that contains only what the task needs.

Document which guidance files apply to which paths, repository boundaries, verification and commit expectations, required review gates, and where project-specific documentation must be updated. Guidance carries authority as described in [trusted project guidance](12-code-project-working-standards.md#2-obligations-authorization-and-trusted-guidance); it must not claim to redefine a tool or platform's instruction priority. Keep private infrastructure details in documentation restricted to the appropriate audience.

## 10. Documentation review checklist

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
