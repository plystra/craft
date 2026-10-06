# Plystra Craft

Craft is Plystra's shared philosophy and working standards. This repository was previously named `plystra/philosophy`; the rename preserves its history and existing principle paths.

Plystra is an independent practice for thoughtful, durable work, described in the [Charter](CHARTER.md). Craft defines what its projects share: brand, product, writing, design, engineering, documentation, privacy, release, and stewardship standards, and the separate rules for projects Plystra sponsors.

## Purpose

The purpose of this repository is to make Plystra's taste explicit, so that contributors and agents can make the same judgments the steward would make without asking.

Every Plystra project may choose its own medium, methods, roadmap, business model, and release pace. These documents should help contributors answer questions such as:

* Does this product decision fit Plystra?
* Does this interface feel calm, precise, and trustworthy?
* Will someone be able to understand, care for, or preserve this work five years from now?
* Is this feature useful because it is necessary, or only impressive because it is loud?
* Would a serious user trust this project with their time, data, or workflow?

The goal is not to make every project look identical. The goal is to make every project feel like it comes from the same underlying craft.

## Scope and project relationships

| Relationship | Meaning | Philosophy obligations |
| --- | --- | --- |
| **Plystra-owned project** | A project owned and stewarded directly under Plystra. | Must follow the full philosophy. |
| **Plystra sub-brand** | A brand within Plystra with its own name and identity. | The sub-brand and every project under it must follow the full philosophy. |
| **Plystra-sponsored project** | An independently owned and governed project receiving agreed support from Plystra. | May adopt none, part, or all of the philosophy. Must meet the [sponsorship requirements](principles/11-governance-and-legal.md#7-sponsorship-admission-and-continuation). |

Throughout this repository, **Plystra projects** means Plystra-owned projects and all projects under Plystra sub-brands. Sponsored projects are named explicitly when a rule applies to them; otherwise a provision does not bind them unless they adopted it. A voluntary adoption claim must identify its actual scope and the revision reviewed.

The full philosophy is this README, the [Charter](CHARTER.md), [Applying and Updating the Philosophy](ADOPTION.md), and every document in `principles/`. It covers new and existing projects. A distinct name, domain, technical stack, business model, or maturity level does not exempt an owned project or a sub-brand project, and a sub-brand cannot exempt the projects under it. [ADOPTION.md](ADOPTION.md) defines requirement levels and which provisions apply to which kinds of work.

Sponsorship, a shared author, or voluntary adoption of the philosophy does not by itself establish ownership, a sub-brand relationship, or permission to use the Plystra brand. Association must be confirmed by Plystra's steward.

## Repository structure

```text
plystra/craft
├── README.md
├── LICENSE
├── LICENSE-CODE
├── CHARTER.md
├── ADOPTION.md
├── CONTRIBUTING.md
├── principles/                     # canonical, maintained by hand
│   ├── 01-brand-philosophy.md
│   ├── 02-product-principles.md
│   ├── 03-language-and-writing.md
│   ├── 04-visual-identity.md
│   ├── 05-frontend-ui-design.md
│   ├── 06-accessibility-and-interaction.md
│   ├── 07-engineering-standards.md
│   ├── 08-documentation-standards.md
│   ├── 09-security-and-privacy.md
│   ├── 10-release-and-maintenance.md
│   ├── 11-governance-and-legal.md
│   ├── 12-code-project-working-standards.md
│   └── 13-websites-search-and-sharing.md
├── templates/                      # canonical, maintained by hand
│   ├── decision-record.md
│   ├── project-principles.md
│   ├── project-readme.md
│   ├── release-notes.md
│   └── ui-review-checklist.md
├── skills/                         # what projects install; see "Installing skills"
│   ├── plystra-craft/                # every project
│   ├── plystra-craft-code/           # projects with code
│   ├── plystra-craft-design/         # projects with a visual identity or interface
│   ├── plystra-craft-website/        # projects with an official website
│   └── plystra-craft-stewardship/    # the Plystra steward's workspace only
│       ├── SKILL.md                # maintained entry point
│       ├── references/             # generated excerpts of the canonical sources
│       └── assets/templates/       # generated templates, when the skill uses them
├── tooling/
│   ├── skills-manifest.json
│   ├── build-skills.ts
│   ├── build-skills.test.ts
│   └── skill-packages.test.ts
```

The root scope, Charter, adoption process, and `principles/` are the authoritative standards. Each rule has one canonical home; other documents link to it rather than restating it. `templates/` contains copyable forms that help projects apply the standards. The 01–13 prefixes retain existing citations and provide a reading order; they do not rank the authority of chapters.

Skills distribute these standards to the projects that follow them. The generator selects canonical sections into flat, purpose-named reference files, and each canonical section is distributed by exactly one skill. Skills do not define additional policy. `CONTRIBUTING.md` and `tooling/` describe how Craft itself is maintained and add no obligations to projects. Craft keeps no material that projects cannot use, such as its own decision records.

## Installing skills

Skills follow [what the project contains](ADOPTION.md#3-applicability-follows-the-work), not the kind of task. Install `plystra-craft` in every Plystra project, then answer three questions:

| Skill | Install when | Adds |
| --- | --- | --- |
| [`plystra-craft`](skills/plystra-craft/SKILL.md) | Always, in every Plystra-owned project, sub-brand, and project under a sub-brand. | Requirement levels and applicability, brand and relationship wording, product, writing, documentation, privacy notices, releases and maintenance, licensing and claims, and the `PROJECT_PRINCIPLES.md` record. |
| [`plystra-craft-code`](skills/plystra-craft-code/SKILL.md) | The project contains source code: an app, service, library, CLI, script, or firmware. | Code working standards, engineering, security, and operational readiness. |
| [`plystra-craft-design`](skills/plystra-craft-design/SKILL.md) | The project has a visual identity or an interface people see or operate: app UI, website, print, or physical design. | Visual identity, interface design, accessibility, and the UI review checklist. |
| [`plystra-craft-website`](skills/plystra-craft-website/SKILL.md) | The project operates an official website or public web documentation. | Search, sharing, `robots.txt`, `sitemap.xml`, `/llms.txt`, and release verification. |

Common combinations, where `-code` stands for `plystra-craft-code` and so on:

| Project | Skills |
| --- | --- |
| Web application with its own public site | `plystra-craft`, `-code`, `-design`, `-website` |
| Website or documentation site only | `plystra-craft`, `-code`, `-design`, `-website` |
| Desktop, mobile, or device app without an official site | `plystra-craft`, `-code`, `-design` |
| Library, CLI, service, or infrastructure | `plystra-craft`, `-code` |
| Writing, research, or publication with a website | `plystra-craft`, `-design`, `-website` |
| Writing or research without a website | `plystra-craft` |
| Physical object or tool | `plystra-craft`, `-design` |

For example, a web application with a public site:

```sh
bunx --bun skills add plystra/craft --skill plystra-craft plystra-craft-code plystra-craft-design plystra-craft-website
```

A library:

```sh
bunx --bun skills add plystra/craft --skill plystra-craft plystra-craft-code
```

Every module requires `plystra-craft` and does not repeat its content. When a project later gains a surface, such as a first website, add that module. If an agent is asked to work on a surface whose module is missing, `plystra-craft` tells it to name the module instead of guessing.

Each skill is a snapshot of the standards at the version recorded in its `references/sources.json`; it does not update itself. Run `bunx --bun skills update` after a new Craft version.

See [Contributing](CONTRIBUTING.md) to change Craft itself.

## Stewardship

Plystra is currently stewarded by [immoses (Moses Qiu)](https://www.immoses.com) ([@immoses648](https://github.com/immoses648)). The steward is responsible for the direction, naming, public standards, and project association of Plystra. This may evolve as described in [governance maturity](principles/11-governance-and-legal.md#6-governance-maturity).

## Attribution and brand use

The Plystra name, wordmark, visual identity, and other brand-identifying materials are not a general-purpose public brand asset library. Do not use them in a way that suggests official affiliation, endorsement, ownership, or representation without permission from immoses.

Plystra is not currently represented here as a registered trademark. This section is a practical brand-use notice, not a claim of trademark registration.

## License

Unless otherwise noted, the documentation and non-code content in this repository, including the principles, templates, skill instructions, the JSON manifest, and generated documentation, are licensed under the Creative Commons Attribution 4.0 International License. Generated copies retain their attribution and source information. See [LICENSE](./LICENSE).

The executable tooling and tests in `tooling/` are licensed under Apache License 2.0; see [LICENSE-CODE](LICENSE-CODE). Neither license grants permission to imply Plystra affiliation or endorsement.

© 2026 immoses (Moses Qiu)
