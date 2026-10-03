# Maintaining Craft

Craft keeps its standards and the skills that distribute them in one repository. This guide applies to work on Craft itself. It does not add requirements to projects using the standards.

## Edit the source

| Change | Edit here |
| --- | --- |
| Scope or philosophy | `README.md`, `CHARTER.md`, `ADOPTION.md`, or `principles/` |
| Reusable project document | `templates/` |
| Task routing and workflow | `skills/<name>/SKILL.md` |
| Which sources a skill carries and when to read them | `tooling/skills-manifest.json` |
| Distribution and validation | `tooling/build-skills.ts` and its tests |

Never edit a generated reference or template as its source. Change the canonical document, then rebuild all affected bundles. Keep the whole change in one commit so the entry points and distributed copies agree.

Policy revisions follow [ADOPTION.md](ADOPTION.md#4-versions-and-effective-dates). Keep its newest version at the top of the version table, retaining earlier rows. The policy version is read from that record; package tooling and individual skills do not maintain a second policy version. Git records changes to task adapters and distribution tooling. Those changes must preserve the meaning of the canonical standards.

Keep the existing numbered principle paths stable when practical. Use a decision record for a substantial change to repository structure or distribution; [the initial structure decision](docs/decisions/0001-craft-structure.md) explains the current boundaries.

## Build and check

Use Node.js 24 or later. There are no third-party dependencies or install step. Run from the repository root:

```sh
npm run build:skills
npm run check:skills
npm test
git diff --check
```

The underlying commands are:

```sh
node tooling/build-skills.ts
node tooling/build-skills.ts --check
node --test tooling/build-skills.test.ts
```

Commit generated files so people can copy a skill without installing a build tool. CI runs the tests and checks that committed output matches the maintained sources. The check command does not write files.

The generator uses the explicit manifest instead of following every link and bundling the entire repository. It preserves each source's text, adds attribution to Markdown copies, and rewrites navigation: included sources link within the skill; other repository documents link to their canonical GitHub paths. Fenced code examples, including target-project placeholder links, remain examples.

Each skill contains a generated reference index and a source ledger with content hashes. No build timestamps or current Git commit IDs are embedded: committing the outputs must not itself change the next build. `ADOPTION.md` supplies the declared policy version; hashes identify the actual source snapshot, including any not-yet-published edits. A local build does not publish a new policy revision.

## Add or change a skill

Use a `plystra-` name that describes a real task. Write a concise `SKILL.md` with YAML `name` and `description`, preserving the task's scope and existing authorization. An entry point routes work to canonical requirements; it must not invent new policy, claim to override its host's permissions, or require unrelated project changes.

List the sources and their reading conditions in the manifest. Bundle enough material for the skill's advertised task, with shared scope, adoption rules, and the documentation license. Keep conditional sources conditional: a small writing edit should not load every engineering chapter. A skill's source subset does not exempt a project from other applicable requirements or prove full compliance.

Generated principles go under `references/`; copyable templates go under `assets/templates/`. When adapting a template into another project, replace the template instructions, placeholders, and links with appropriate project content and canonical source URLs. Preserve license attribution where required.

Validate that each skill works when copied alone. Local navigation must stay within its own directory. Links to unbundled canonical sources may require network access; if unavailable, report what was not reviewed rather than inventing the missing standard. Use a matching repository revision when exact historical consistency is needed.

The generator owns only its recorded outputs. It reports unknown files, modified outputs that would be removed, and symbolic links instead of silently discarding them. Resolve those findings before rebuilding. `SKILL.md` and other authored entry-point files are never generated. To retire a whole skill, review and remove its directory explicitly along with its manifest entry.

For substantive adapter changes, try a realistic task using the copied skill and inspect the outcome. Automated checks establish distribution integrity, not good judgment or compliance of a consuming project.

## Licenses

Documentation, templates, skill instructions, the manifest, and generated documentation use [CC BY 4.0](LICENSE). Executable tooling and tests use [Apache-2.0](LICENSE-CODE). Retain attribution and source notices when redistributing generated bundles. The brand-use limits in [README.md](README.md#attribution-and-brand-use) still apply.
