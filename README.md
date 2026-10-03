# Plystra Philosophy

This repository defines the shared philosophy, brand standards, product principles, interface rules, documentation conventions, and stewardship expectations for Plystra-owned projects and Plystra sub-brands, including every project under those sub-brands. It also defines the separate admission and affiliation rules for projects sponsored by Plystra.

Plystra is currently an independently operated personal brand and project umbrella by [immoses (Moses Qiu)](https://www.immoses.com).

GitHub: [@immoses648](https://github.com/immoses648)

Plystra is not a category label, a startup slogan, or a loose collection of unrelated experiments. It is a long-term software craft umbrella for durable, human-scale systems.

> For craft that outlasts its makers.

## Purpose

The purpose of this repository is to make Plystra's taste explicit.

Every Plystra project may choose its own architecture, roadmap, business model, and release pace. But every project should feel like it belongs to the same family: quiet, durable, legible, careful, and humane.

These documents should help contributors answer questions such as:

* Does this product decision fit Plystra?
* Does this interface feel calm, precise, and trustworthy?
* Does this repository look maintainable five years from now?
* Is this feature useful because it is necessary, or only impressive because it is loud?
* Would a serious user trust this project with their time, data, or workflow?

The goal is not to make every project look identical. The goal is to make every project feel like it comes from the same underlying craft.

## Scope and project relationships

| Relationship | Meaning | Philosophy obligations |
| --- | --- | --- |
| **Plystra-owned project** | A project owned and stewarded directly under Plystra. | Must follow the full philosophy. |
| **Plystra sub-brand** | A brand within Plystra with its own name and identity. | The sub-brand and every project under it must follow the full philosophy. |
| **Plystra-sponsored project** | An independently owned and governed project receiving agreed support from Plystra. | May choose whether to adopt the philosophy, in full or in part. Must meet the sponsorship admission and affiliation requirements. |

Throughout this repository, **Plystra projects** means Plystra-owned projects and all projects under Plystra sub-brands. Sponsored projects are named explicitly when a rule applies to them. Sponsorship alone does not place a project under Plystra ownership or governance.

The full philosophy includes this README, the [Charter](CHARTER.md), and every document in `principles/`, including the [website, search, and sharing requirements](principles/13-websites-search-and-sharing.md). Existing and new projects are covered. A distinct name, domain, technical stack, business model, or maturity level does not exempt an owned project or a sub-brand project.

Follow each provision as written, including its stated applicability and recommended choices. A project without a website does not need to create one solely to meet website requirements; when it has an official website, those requirements apply. Project documents may explain implementation choices and add stricter rules, but must not waive or weaken the philosophy.

Following the philosophy does not establish ownership, sponsorship, or permission to use the Plystra brand. Association must be confirmed by Plystra's steward. See [Governance and Legal](principles/11-governance-and-legal.md) for admission and relationship records.

**Open source is not mandatory** for any of these categories. Projects may use open-source, source-available, or proprietary terms, provided licensing and public claims are accurate.

## Repository structure

```text
plystra/philosophy
├── README.md
├── LICENSE
├── CHARTER.md
├── principles/
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
└── templates/
    ├── decision-record.md
    ├── project-principles.md
    ├── project-readme.md
    ├── release-notes.md
    └── ui-review-checklist.md
```

## How to use these documents

### For new projects

Before publicly introducing a Plystra-owned project or a project under a Plystra sub-brand, create a `PROJECT_PRINCIPLES.md` file using [`templates/project-principles.md`](templates/project-principles.md). A new sub-brand must also document its relationship to Plystra and how it will uphold the full philosophy across its projects.

The document should explain:

* whether the project is directly owned or belongs to a Plystra sub-brand, and who is responsible for it;
* why the project belongs under Plystra;
* what the project is trying to make easier, calmer, or more durable;
* what the project refuses to do;
* how it will remain maintainable over time;
* how it reflects the standards defined in this repository.

A project should not carry the Plystra name only because it was created by the same person. It should carry the name because it shares the same care, restraint, and long-term direction.

Sponsored projects instead follow the [sponsorship admission process](principles/11-governance-and-legal.md#11-sponsorship-admission-and-continuation). They are not required to create `PROJECT_PRINCIPLES.md` or adopt the full philosophy. If they choose to adopt any part, they should state that scope accurately.

### For existing projects

Existing Plystra-owned projects and all projects under Plystra sub-brands must also follow the full philosophy. Where a project falls short, record the gap, a responsible maintainer, and a correction plan. A plan records unfinished work; it does not exempt the project or establish compliance.

Start with:

1. A clear README.
2. A quiet and consistent visual system.
3. A small set of project-specific principles.
4. A maintenance policy.
5. Documentation that explains decisions rather than only describing commands.

Projects do not need to look identical or share a technical stack. Correct gaps with focused changes that meet the standards and preserve working behavior.

### For code projects

Plystra-owned code projects and all code projects under Plystra sub-brands must also follow [`principles/12-code-project-working-standards.md`](principles/12-code-project-working-standards.md). Sponsored projects choose whether to adopt these standards.

These standards define how implementation work should be scoped, edited, verified, documented, reviewed, and shipped. They are especially important for repositories modified by coding agents or external contributors.

At minimum, a serious code project should make the following clear:

* which local instruction files apply;
* how to run, test, lint, build, and deploy;
* how secrets and environment variables are configured;
* what data integrity and security boundaries exist;
* what must be verified before a change is considered done.

### For design reviews

Use [`templates/ui-review-checklist.md`](templates/ui-review-checklist.md) before shipping visible interface changes.

A Plystra interface should feel calm, deliberate, and usable. It should avoid visual noise, unnecessary motion, vague hierarchy, and decoration that does not support the product's purpose.

### For product decisions

Use [`templates/decision-record.md`](templates/decision-record.md) for meaningful decisions that affect product direction, architecture, privacy, public API, user experience, or long-term maintenance.

A good decision record should explain not only what was chosen, but also why other reasonable options were not chosen.

## The five words

Every Plystra project should be evaluated against five words:

* **Quiet** — it should not beg for attention.
* **Durable** — it should survive maintenance, not only launch.
* **Legible** — users and contributors should be able to understand it.
* **Personal** — it should respect individual context and agency.
* **Crafted** — it should feel intentionally made, not assembled from trends.

If a project violates these words repeatedly, it may still be useful, but it should not carry the Plystra name.

## Design direction

Plystra projects should feel refined without becoming decorative.

A Plystra interface should be:

* minimal, but not empty;
* elegant, but not fragile;
* modern, but not generic;
* functional, but not cold;
* calm, but not boring;
* opinionated, but not restrictive.

Visual design should support trust and clarity. Typography, spacing, motion, color, and layout should all serve the product's purpose rather than compete for attention.

Avoid interfaces that feel like templates. Avoid artificial complexity. Avoid making the user feel like the software is performing sophistication instead of providing it.

## Writing direction

Plystra writing should be precise, restrained, and direct.

Avoid exaggerated marketing language, empty startup phrasing, and claims that sound larger than the project can honestly support. Prefer language that feels calm, grounded, and useful.

Good Plystra writing should:

* say what the product actually does;
* avoid over-explaining obvious behavior;
* respect the user's intelligence;
* use simple language without sounding simplistic;
* feel confident without becoming loud;
* make the product easier to trust.

Plystra should not sound like it is trying to impress everyone. It should sound like it was made carefully for people who care.

## Engineering direction

Plystra projects should be built with long-term maintainability in mind.

Engineering decisions should favor clarity, explicit boundaries, and operational simplicity. A project should be understandable not only when it is created, but also when it is revisited months or years later.

Preferred engineering qualities include:

* clear architecture;
* small, well-defined modules;
* explicit contracts between layers;
* practical defaults;
* minimal unnecessary infrastructure;
* documentation for important decisions;
* respect for deployment and maintenance realities.

Complexity is acceptable only when it earns its place.

## Relationship between Plystra and projects

Plystra is the parent philosophy and brand layer for its owned projects and sub-brands. Individual identities, technical stacks, and release strategies are welcome within the full philosophy. Sub-brands must carry the same obligations through to every project they contain.

A project under Plystra should never feel like a random prototype with a logo attached. It should feel like a serious tool being prepared for a long life.

Project-specific documents supplement this repository; they cannot override its obligations. Sponsored projects retain their own governance and standards, subject to the separate sponsorship requirements. Public wording must distinguish ownership, a sub-brand relationship, sponsorship, and voluntary adoption of the philosophy.

## Stewardship

Plystra is currently stewarded by [immoses (Moses Qiu)](https://www.immoses.com).

This may evolve over time, but the current responsibility for the direction, naming, public standards, and project association of Plystra belongs to immoses.

Plystra should be treated as a personal craft umbrella first: careful, independent, and not prematurely institutionalized.

## Attribution and brand use

The text and documentation in this repository are available under the license described below.

However, the Plystra name, logo, visual identity, and other brand-identifying materials are not a general-purpose public brand asset library. Please do not use them in a way that suggests official affiliation, endorsement, ownership, or representation without permission from immoses.

Plystra is not currently represented here as a registered trademark. This section is a practical brand-use notice, not a claim of trademark registration.

## License

Unless otherwise noted, the documentation and non-code content in this repository are licensed under the Creative Commons Attribution 4.0 International License.

See [LICENSE](./LICENSE) for details.

© 2026 immoses (Moses Qiu)
