# Plystra Philosophy

This repository defines the shared philosophy, brand standards, product principles, interface rules, documentation conventions, and stewardship expectations for projects under the Plystra name.

Plystra is not a category label, a startup slogan, or a loose collection of unrelated experiments. It is a long-term software craft umbrella for durable, human-scale systems.

> For craft that outlasts its makers.

## Purpose

The purpose of this repository is to make Plystra's taste explicit.

Every Plystra project may choose its own architecture, roadmap, business model, and release pace. But every project should feel like it belongs to the same family: quiet, durable, legible, careful, and humane.

These documents should help contributors answer questions such as:

- Does this product decision fit Plystra?
- Does this interface feel calm, precise, and trustworthy?
- Does this repository look maintainable five years from now?
- Is this feature useful because it is necessary, or only impressive because it is loud?
- Would a serious user trust this project with their time, data, or workflow?

## Repository structure

```text
plystra/philosophy
├── README.md
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
│   └── 11-governance-and-legal.md
└── templates/
    ├── decision-record.md
    ├── project-principles.md
    ├── project-readme.md
    ├── release-notes.md
    └── ui-review-checklist.md
```

## How to use these documents

### For new projects

Before a new project is publicly associated with Plystra, create a `PROJECT_PRINCIPLES.md` file using [`templates/project-principles.md`](templates/project-principles.md). The document should explain why the project belongs under Plystra, what it refuses to do, and how it will remain maintainable.

### For existing projects

Existing projects do not need to become identical. They should gradually adopt these standards where doing so improves coherence, trust, and maintainability.

Start with:

1. A clear README.
2. A quiet and consistent visual system.
3. A small set of project-specific principles.
4. A maintenance policy.
5. Documentation that explains decisions rather than only describing commands.

### For design reviews

Use [`templates/ui-review-checklist.md`](templates/ui-review-checklist.md) before shipping visible interface changes.

### For product decisions

Use [`templates/decision-record.md`](templates/decision-record.md) for meaningful decisions that affect product direction, architecture, privacy, public API, user experience, or long-term maintenance.

## The five words

Every Plystra project should be evaluated against five words:

- **Quiet** — it should not beg for attention.
- **Durable** — it should survive maintenance, not only launch.
- **Legible** — users and contributors should be able to understand it.
- **Personal** — it should respect individual context and agency.
- **Crafted** — it should feel intentionally made, not assembled from trends.

If a project violates these words repeatedly, it may still be useful, but it should not carry the Plystra name.

## Relationship between Plystra and projects

Plystra is the parent philosophy and brand layer. Individual projects are allowed to have distinct names, identities, and technical stacks, but they should inherit the same standards for care, writing, design, security, maintainability, and public behavior.

A project under Plystra should never feel like a random prototype with a logo attached. It should feel like a serious tool being prepared for a long life.
