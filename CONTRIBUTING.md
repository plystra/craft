# Maintaining Craft

Craft keeps its standards and the skills that distribute them in one repository. This guide applies to work on Craft itself. It does not add requirements to projects using the standards.

## Edit the source

| Change | Edit here |
| --- | --- |
| Scope or philosophy | `README.md`, `CHARTER.md`, `ADOPTION.md`, or `principles/` |
| Reusable project document | `templates/` |
| Task routing and workflow | `skills/<name>/SKILL.md` |
| Which source sections a skill carries, task-specific filenames, and reading conditions | `tooling/skills-manifest.json` |
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
node --test tooling/*.test.ts
```

Commit generated files so people can copy a skill without installing a build tool. CI runs the tests and checks that committed output matches the maintained sources. The check command does not write files.

The generator uses the explicit manifest instead of following links and bundling the entire repository. Each source declares a task-specific output path and may select exact Markdown headings. It preserves the selected sections' text and examples, adds attribution and an excerpt notice, and rewrites navigation. Links to included sections stay within the skill; links to omitted material or a complete source represented only by excerpts use the canonical GitHub URL. Source URLs are provenance and additional context, not a reason to fetch the whole repository during ordinary skill use.

Each skill contains a generated reference index and a source ledger with content hashes. No build timestamps or current Git commit IDs are embedded: committing the outputs must not itself change the next build. `ADOPTION.md` supplies the declared policy version; hashes identify the actual source snapshot, including any not-yet-published edits. A local build does not publish a new policy revision.

## Add or change a skill

Use a `plystra-` name that describes a real task. Write a concise `SKILL.md` with YAML `name` and `description`, preserving the task's scope and existing authorization. An entry point routes work to canonical requirements; it must not invent new policy, claim to override its host's permissions, or require unrelated project changes.

Start from the concrete task and its deliverable. List only the material needed to complete that task; do not copy `principles/`, root README, Charter, or ADOPTION wholesale into skill directories. Put brief scope and interpretation guidance in the entry point. Include a whole source document only if all of it belongs to the task. Licensing and source records remain part of each independent distribution. A skill's scope does not exempt a project from other applicable requirements or prove full compliance.

Manifest schema 2 sources use `path`, `when`, explicit `output`, and optional `sections`. `sections` contains exact heading text without Markdown `#` prefixes. A selection includes that heading and its subsections through the next peer or ancestor heading; headings inside code examples are not selectors. Keep each source path and output path unique within a skill. Rename or removed headings require an intentional mapping update rather than silently changing the excerpt.

Use flat task-oriented filenames under `references/`, such as `website-delivery.md` or `repository-essentials.md`, without a nested `principles/` directory. Copyable templates go under `assets/templates/` only when the task uses them; templates can also select relevant sections. When adapting one into another project, replace instructions, placeholders, and links with appropriate project content and canonical source URLs. Preserve license attribution where required.

Validate that each skill works when copied alone, without a sibling skill or the Craft source checkout. Its declared task must have all necessary guidance locally, and local navigation must stay within the directory. Canonical source links may need network access for provenance, broader context, or current-policy confirmation; lack of access does not prevent the normal bounded task. State the snapshot used and distinguish unverified current-policy claims. Use a matching repository revision when exact historical consistency is needed.

The generator owns only its recorded outputs. It reports unknown files, modified outputs that would be removed, and symbolic links instead of silently discarding them. Resolve those findings before rebuilding. `SKILL.md` and other authored entry-point files are never generated. To retire a whole skill, review and remove its directory explicitly along with its manifest entry.

For substantive adapter changes, try a realistic task using the copied skill and inspect the outcome. Automated checks establish distribution integrity, not good judgment or compliance of a consuming project.

## Licenses

Documentation, templates, skill instructions, the manifest, and generated documentation use [CC BY 4.0](LICENSE). Executable tooling and tests use [Apache-2.0](LICENSE-CODE). Retain attribution and source notices when redistributing generated bundles. The brand-use limits in [README.md](README.md#attribution-and-brand-use) still apply.
