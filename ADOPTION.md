# Applying the Philosophy

## 1. Purpose and scope

This document defines how to read and apply the philosophy. It is part of the philosophy, not a way to opt out of it. Who it binds is defined in [scope and project relationships](README.md#scope-and-project-relationships). Owned projects, sub-brands, and their projects follow the full philosophy; what changes from project to project is which provisions apply to the work it actually contains.

## 2. Requirement levels

Use these meanings throughout the philosophy, regardless of capitalization:

| Level | Wording | Meaning |
| --- | --- | --- |
| Requirement | `must`, `must not`, `required`, `never`, or an unqualified procedural instruction | Must be met when its stated condition or activity applies. A project cannot waive it. |
| Recommendation | `should`, `should not`, `recommended`, `prefer`, `avoid`, or `suggested` | The expected default. A different approach is allowed when it serves the same purpose; record the reason for a material departure in the project principles or a decision record. |
| Option | `may`, `optional`, or `can` when describing a choice | A permitted choice, not an obligation to implement it. |

The governing modal determines combined wording: `should never` means `should not`, while `must never` means `must not`. Read lists within their introducing statement. For example, bare instructions under `Recommended practices` remain recommendations; an explicit `must` in an individual item still creates a requirement. A recommendation cannot weaken a requirement governing the same behavior elsewhere in the philosophy.

Examples, suggested scales, and sample wording do not create independent requirements. Descriptions of values explain the purpose behind the provisions; they do not turn every aesthetic preference into a release condition.

Project documents and local instructions may explain implementation choices and add stricter rules. They must not waive or weaken applicable requirements. If a provision is materially ambiguous, ask Plystra's steward and record the interpretation in the project principles; a project cannot resolve ambiguity by silently weakening the rule.

## 3. Applicability follows the work

The philosophy covers software, physical objects, tools, writing, research, experiments, and other forms of craft. The medium determines which concrete provisions apply:

| Subject | Applies when |
| --- | --- |
| Identity, ownership, honest claims, licensing, and documentation | Every project has these responsibilities; the records and public surfaces may take different forms. |
| Product, visual, and interaction standards | The project has the described use, visual material, or interaction. Web-specific techniques apply to web interfaces, not to every physical object or written work. |
| Engineering and code working standards | The project contains software or code. A mixed project must apply them to its software components. |
| Security, privacy, and data handling | The project encounters the described risks or handles data, including through research, support, or telemetry. Being a physical product or a private experiment does not remove these obligations. |
| Releases and maintenance | The project publishes work or supports something people use. Versions, editions, care instructions, and retirement notices should match that form. |
| Website search and sharing | The project or sub-brand operates an official website or public web documentation, whatever the underlying project medium. |

A project without a website does not need to build one to satisfy website rules. A project without code does not need to invent an API, build pipeline, or code repository. Once those surfaces exist, the corresponding requirements apply, including the mandatory `/llms.txt` for official websites.

Low maturity, a different business model, or limited resources do not by themselves make a requirement inapplicable. Conditions that must be met before an activity starts still apply before it starts: privacy information and required authorization must be in place before the relevant data collection or disclosure.

## 4. Project principles

Each owned project and sub-brand keeps a `PROJECT_PRINCIPLES.md` in its repository; other work may keep an equivalent document. A sub-brand's record also states its identity and relationship to Plystra and lists the records of its projects. Start from the [project principles template](templates/project-principles.md).

The record exists for the people and agents who work on the project. It states what the project is, what it values and refuses, how its interface should feel, the commands and checks that define done, and any material departure from a recommendation with its reason. It is not a compliance audit: do not fill it with review tables, deadlines, or statements of what was verified. Keep it short enough to read before every task, and update it when the project changes.

Do not describe a project as compliant with or certified under this philosophy. Public claims follow [claims must be earned](principles/03-language-and-writing.md#3-claims-must-be-earned).

## 5. Versions

The current version of the philosophy is recorded below. Distributed skills record the version they were built from.

| Version | Effective date | Change |
| --- | --- | --- |
| 2.0.0 | 2026-10-07 | Project principles became a working record for contributors and agents instead of a compliance review with deadlines. Taste rules were added for agent-first work, deferred design, wordmark use, imagery and icons, motion, page grounds, project site identity, and document form. |
| 1.0.1 | 2026-10-04 | Each provision received one canonical home. No obligation changes. |
| 1.0.0 | 2026-10-04 | First versioned baseline. |

Plystra's steward confirms changes to the philosophy. Use a major version for incompatible changes to existing obligations, a minor version for additions, and a patch version for corrections that do not change obligations. A project applies the current version; when it changes, update the project principles at the next task that touches them.
