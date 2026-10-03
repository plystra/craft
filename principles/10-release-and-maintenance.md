# Release and Maintenance

## 1. Maintenance is a brand signal

Plystra's brand depends on the impression that projects are cared for.

This does not mean every project must move quickly. A quiet project with clear status is better than a noisy project with uncertain maintenance.

## 2. Release philosophy

Releases should be understandable.

A user or contributor should be able to answer:

- what changed;
- whether upgrading is safe;
- whether data migration is required;
- whether APIs changed;
- whether configuration changed;
- whether behavior changed in a visible way;
- whether rollback is possible.

## 3. Versioning

Use semantic versioning for libraries, CLIs, APIs, and tools where compatibility matters.

For apps or experimental projects, semantic versioning may be less important than clear release notes and migration guidance.

Breaking changes should be named directly.

## 4. Release notes

Release notes should be written for users and maintainers, not only commit history.

Recommended sections:

```md
## Added
## Changed
## Fixed
## Removed
## Security
## Migration notes
## Known issues
```

Do not hide important changes in vague categories such as `misc` or `improvements`.

## 5. Deprecation

Deprecation should be explicit and respectful.

A deprecation notice should explain:

- what is deprecated;
- why it is deprecated;
- what replaces it;
- when removal may happen;
- what users should do;
- whether data migration is needed.

## 6. Backward compatibility

Compatibility should be treated as a user promise.

It may be broken when necessary, especially before stable releases, but the cost should be visible and justified.

For stable projects:

- avoid unnecessary breaking changes;
- provide migration guides;
- support old configuration briefly when reasonable;
- make failure modes clear when old clients connect to new servers or new clients connect to old servers.

## 7. Maintenance states

Each project should publish one of these states:

- `Active` — current development and maintenance.
- `Slow active` — maintained, but feature development is limited.
- `Maintenance` — bug fixes and security updates only.
- `Paused` — temporarily inactive, with stated reason if public.
- `Retired` — no longer maintained.

A project may be small and still active. Activity is not measured only by commit volume.

## 8. Support expectations

Do not imply support capacity that does not exist.

A small project should state:

- where bugs should be reported;
- what kinds of issues are accepted;
- whether feature requests are welcome;
- whether security reports have a separate path;
- expected response style, not guaranteed response time unless it can be honored.

## 9. Operational readiness

For deployed services, releases should consider:

- health checks;
- backup compatibility;
- database migrations;
- rollback plan;
- config changes;
- dependency changes;
- observability updates;
- user-facing downtime or degraded behavior.

Deployments should be deliberate. Before declaring a project deployable, verify:

- build command;
- output directory;
- runtime type;
- required environment variables;
- platform configuration;
- migration and rollback behavior;
- whether production secrets and URLs are provided by the platform rather than hardcoded.

Do not deploy, publish, push, merge, or release from a project workflow unless the maintainer has explicitly asked for it.

Official website releases must also pass the checks in [Websites, Search, and Sharing](13-websites-search-and-sharing.md): verify deployed content and metadata, status codes, indexing policy, sitemap, required `/llms.txt`, structured data, and sharing previews. Update these surfaces when routes, domains, project status, or public relationships change.

## 10. Retirement

Retiring a project is a responsible act when maintenance is no longer possible or aligned.

A retired project should have:

- a visible status banner in the README;
- final release tag if relevant;
- migration guidance if possible;
- archive decision;
- explanation of security support status;
- preserved documentation.

Silent abandonment damages the parent brand more than honest retirement.
