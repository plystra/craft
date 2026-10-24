# Plystra Craft

Craft is Plystra's shared philosophy and working standards. This repository was previously named `plystra/philosophy`; the rename preserves its history and existing principle paths.

Plystra is an independent practice for thoughtful, durable work, described in its [Charter](https://github.com/plystra/handbook/blob/main/charter.md). Craft defines what good Plystra work is: brand, product, writing, design, engineering, documentation, privacy, and release standards. Everything about Plystra as an organization, including its relationships with projects and people, its stewardship, and permission to use its name, is in the [Plystra Handbook](https://github.com/plystra/handbook).

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

How much of Craft a project must follow depends on its relationship to Plystra. The relationships themselves, their public wording, and how a project enters or leaves one are defined in the [Plystra Handbook](https://github.com/plystra/handbook/blob/main/relationships/README.md).

| Relationship | Craft obligations |
| --- | --- |
| **Plystra project** | Must follow the full philosophy. |
| **Partner project** | Must meet the Craft provisions named in its partnership agreement, and is reviewed against them before Plystra's participation is stated. |
| **Sponsored project** | Not bound. It may adopt any part of the philosophy. |

Throughout this repository, **Plystra projects** means projects owned by Plystra LLC, whatever their name. Partner and sponsored projects are named explicitly when a rule applies to them; otherwise a provision does not bind them unless they adopted it. A voluntary adoption claim must identify its actual scope and the revision reviewed. Adopting the philosophy does not establish a relationship with Plystra or permission to use the Plystra name.

The full philosophy is this README, [Applying and Updating the Philosophy](ADOPTION.md), and every document in `principles/`. It covers new and existing projects. A distinct name, domain, technical stack, business model, or maturity level does not exempt a Plystra project. [ADOPTION.md](ADOPTION.md) defines requirement levels and which provisions apply to which kinds of work.

## Repository structure

```text
plystra/craft
├── README.md
├── LICENSE
├── LICENSE-CODE
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
│   └── plystra-craft-website/        # projects with an official website
│       ├── SKILL.md                # maintained entry point
│       ├── references/             # generated excerpts of the canonical sources
│       └── assets/templates/       # generated templates, when the skill uses them
├── tooling/
│   ├── skills-manifest.json
│   ├── build-skills.ts
│   ├── build-skills.test.ts
│   └── skill-packages.test.ts
```

The root scope, adoption process, and `principles/` are the authoritative standards. Each rule has one canonical home; other documents link to it rather than restating it. `templates/` contains copyable forms that help projects apply the standards. The 01–13 prefixes retain existing citations and provide a reading order; they do not rank the authority of chapters.

Skills distribute these standards to the projects that follow them. The generator selects canonical sections into flat, purpose-named reference files, and each canonical section is distributed by exactly one skill. Skills do not define additional policy. `CONTRIBUTING.md` and `tooling/` describe how Craft itself is maintained and add no obligations to projects. Craft keeps no material that projects cannot use, such as its own decision records.

## Installing skills

Skills follow [what the project contains](ADOPTION.md#3-applicability-follows-the-work), not the kind of task. Install `plystra-craft` in every Plystra project, then answer three questions:

| Skill | Install when | Adds |
| --- | --- | --- |
| [`plystra-craft`](skills/plystra-craft/SKILL.md) | Always, in every Plystra project. | Requirement levels and applicability, brand and relationship wording, product, writing, documentation, privacy notices, releases and maintenance, licensing and claims, and the `PROJECT_PRINCIPLES.md` record. |
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

Plystra is stewarded by Plystra LLC. The steward confirms changes to Craft, as described in [versions](ADOPTION.md#5-versions). Plystra's stewardship and governance are defined in the handbook's [Stewardship](https://github.com/plystra/handbook/blob/main/stewardship.md).

## Attribution and brand use

The Plystra name, wordmark, visual identity, and other brand-identifying materials are not a general-purpose public brand asset library. Do not use them in a way that suggests official affiliation, endorsement, ownership, or representation without permission from Plystra LLC.

Plystra is not currently represented here as a registered trademark. This section is a practical brand-use notice, not a claim of trademark registration. Who may use the Plystra name, and on what basis, is defined in the handbook's [Brand Use](https://github.com/plystra/handbook/blob/main/brand-use.md).

## License

Unless otherwise noted, the documentation and non-code content in this repository, including the principles, templates, skill instructions, the JSON manifest, and generated documentation, are licensed under the Creative Commons Attribution 4.0 International License. Generated copies retain their attribution and source information. See [LICENSE](./LICENSE).

The executable tooling and tests in `tooling/` are licensed under Apache License 2.0; see [LICENSE-CODE](LICENSE-CODE). Neither license grants permission to imply Plystra affiliation or endorsement.

© 2026 Plystra LLC
