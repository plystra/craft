# Engineering Standards

## 1. Engineering philosophy

Plystra engineering should favor systems that can be understood, operated, and repaired.

The goal is not to use the most impressive architecture. The goal is to build software that remains legible under change.

A Plystra codebase should make contributors feel that someone cared about future maintenance.

For day-to-day implementation practice, code projects should also follow [`12-code-project-working-standards.md`](12-code-project-working-standards.md).

## 2. General principles

### Prefer boring foundations

Use mature, well-understood infrastructure unless a project has a clear reason to do otherwise.

Novelty is acceptable when it serves the product. Novelty is not acceptable when it only serves developer excitement.

### Keep boundaries explicit

Define clear boundaries between:

- frontend and backend;
- API and worker;
- application code and infrastructure;
- domain model and persistence;
- public interface and internal implementation;
- user-confirmed data and generated candidates.

### Make side effects visible

Writes, migrations, external calls, file operations, AI actions, billing actions, notifications, and destructive operations should be easy to identify in code review.

### Design for local comprehension

A contributor should be able to understand a feature by reading a small set of files. Avoid architectures that require global knowledge for small changes.

## 3. Repository standards

Every public Plystra repository should include:

```text
README.md
LICENSE
SECURITY.md
CONTRIBUTING.md, when contributions are accepted
CHANGELOG.md or release notes, when versions are published
PROJECT_PRINCIPLES.md, when publicly associated with Plystra
docs/, when setup or operation is non-trivial
```

Every private repository should still include enough documentation for future maintainers.

## 4. README requirements

A README should explain:

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
- security reporting.

Avoid README files that are only installation commands.

## 5. Configuration

Configuration should be explicit and documented.

Rules:

- never commit real secrets;
- provide `.env.example` where environment variables are used;
- document required and optional variables;
- use safe development defaults;
- fail clearly when required configuration is missing;
- avoid silent fallback to production services;
- separate build-time and runtime configuration when relevant.

## 6. Data and migrations

Data deserves special care.

Rules:

- schema changes must be reviewed as product changes, not only technical changes;
- migrations should be deterministic;
- destructive migrations require explicit notes;
- user data deletion semantics must be documented;
- imports should be idempotent where possible;
- generated or AI-derived data should be distinguishable from user-confirmed data;
- audit trails should be used for important state transitions.

## 7. API design

APIs should be stable, named clearly, and documented.

Rules:

- use consistent resource names;
- use explicit status codes;
- return structured errors;
- version public APIs when breaking changes are expected;
- avoid leaking internal implementation details;
- document authentication and rate limits;
- distinguish validation errors from system errors;
- include request IDs or trace IDs in operational contexts.

## 8. Error handling

Errors should preserve context.

A good error path records enough information for debugging without leaking secrets or private data.

Rules:

- never swallow errors silently;
- do not expose stack traces to users in production;
- include actionable messages in logs;
- classify expected failures separately from unexpected failures;
- make retry behavior explicit;
- avoid logging raw secrets, tokens, private messages, or full user documents.

## 9. Dependencies

Dependencies should be treated as long-term commitments.

Use the package manager established by the lockfile or project configuration. Install dependencies before importing them. Avoid new dependencies when the platform, standard library, or existing project utilities are enough.

Before adding a dependency, ask:

1. Does it solve a real problem?
2. Is it maintained?
3. Is the license acceptable?
4. Is the API stable enough?
5. Can it be replaced if needed?
6. Does it increase bundle size, attack surface, or operational complexity?

Small utilities can create large maintenance risk when used everywhere.

## 10. Testing

Testing should protect the product's promises.

Verification is part of implementation, not a separate polish step.

Minimum expectations vary by project, but serious Plystra projects should include:

- unit tests for domain logic;
- integration tests for persistence and API boundaries;
- smoke tests for deployment paths;
- UI tests for critical flows when practical;
- regression tests for important bugs;
- migration tests when data integrity matters.

Do not chase coverage percentages at the expense of meaningful tests.

Test through public surfaces when possible: browser for visible frontend behavior, real requests for APIs, public commands for CLIs, and public exports for libraries.

For visible interface changes, inspect the actual rendered UI at desktop and mobile viewport sizes when practical.

## 11. Observability

Operational systems should explain themselves.

Use structured logs where practical. Track important state transitions. Provide health checks for services. Document how to inspect failures.

Observability should help answer:

- Is the system running?
- Is it accepting work?
- Is it processing work?
- Is it failing in a known way?
- Is user data at risk?
- What changed recently?

## 12. AI-related engineering

When a Plystra project uses AI:

- model output should be treated as untrusted until confirmed or validated;
- prompts that define product behavior should be versioned or documented;
- AI calls should have timeouts and failure handling;
- external provider usage should be disclosed in relevant documentation;
- generated candidates should be distinguishable from verified records;
- users should be able to review meaningful AI-generated changes;
- logs should not expose private prompt content unless explicitly configured for development.

## 13. Code review standard

A change is ready when reviewers can understand:

- why it exists;
- what user behavior changes;
- what data changes;
- what risks are introduced;
- how it is tested;
- how it can be reverted;
- whether documentation must change.

If a change cannot be explained simply, it may be too large.

Reviews should lead with concrete findings: bugs, regressions, security risks, data loss, broken contracts, missing tests, and deployment hazards. Preferences should not crowd out real failure scenarios.
