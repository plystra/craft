---
name: plystra-frontend-design
description: Design, implement, or review digital interfaces and official websites for Plystra projects or work explicitly adopting Plystra Craft. Covers interface states, accessibility, visual expression, and website search and sharing requirements within the existing project.
---

# Plystra frontend design

Deliver interfaces that fit the project's purpose and identity, with usable behavior and verifiable public surfaces.

## Establish the task boundary

Use the project's relationship record and [Craft scope](references/README.md#scope-and-project-relationships), then [ADOPTION](references/ADOPTION.md) for requirement levels and medium-specific applicability when needed. Owned projects and sub-brand projects follow the full applicable standard; sponsored projects choose their scope of adoption.

This is a task workflow, not an additional policy or permission to publish. Respect the user's authorized changes, accepted designs, trusted local instructions, and platform boundaries. A focused UI check does not establish full Craft compliance.

Inspect the shipped interface, existing assets, design tokens, framework, and relevant user flow. Establish the intended surfaces and supported devices before changing them.

## Read the relevant branches

- For interface work, read [Frontend UI Design](references/principles/05-frontend-ui-design.md) and [Accessibility and Interaction](references/principles/06-accessibility-and-interaction.md).
- For visual identity or expression decisions, read [Visual Identity](references/principles/04-visual-identity.md); use [Brand Philosophy](references/principles/01-brand-philosophy.md) for positioning and affiliation.
- For workflow, automation, or consequential actions, read [Product Principles](references/principles/02-product-principles.md).
- For visible copy, read [Language and Writing](references/principles/03-language-and-writing.md).
- Before editing code, use [Engineering Standards](references/principles/07-engineering-standards.md) and [Code Project Working Standards](references/principles/12-code-project-working-standards.md) for the relevant implementation and verification work.
- For forms, authentication, private data, external providers, or telemetry, read [Security and Privacy](references/principles/09-security-and-privacy.md).
- For an official website or public web documentation, read [Websites, Search, and Sharing](references/principles/13-websites-search-and-sharing.md). Its HTML, metadata, indexing, sharing, structured-data, and mandatory `/llms.txt` provisions are part of website delivery.
- For publication, migration, or support changes, read [Release and Maintenance](references/principles/10-release-and-maintenance.md). Consult the [Charter](references/CHARTER.md) only when the task changes project purpose or admission.

The [reference index](references/index.md) gives the complete conditional map. Load needed branches rather than all references by default.

## Implement and inspect the actual interface

1. Make the hierarchy and ordinary workflow clear. Use the current product and design system as the starting point; resolve routine decisions without replacing the user's intended product or stack.
2. Cover the states and input methods the workflow actually needs. Treat keyboard operation, focus, text expansion, reduced motion, and truthful feedback as behavior to inspect.
3. Keep visual expression suited to the project or sub-brand. Explain departures from established patterns when the task calls for them.
4. Complete authorized implementation and run the project's relevant checks. Inspect the rendered result at supported viewport sizes and representative interaction states; source inspection alone does not verify appearance.
5. For public websites, perform the applicable website checks. Distinguish source and build verification from deployed-response verification, and report any unavailable evidence. The skill does not itself authorize deployment.

Use the [UI review checklist](assets/templates/ui-review-checklist.md) for applicable checks and the [decision-record template](assets/templates/decision-record.md) when a consequential decision needs a durable record. Do not create extra tracking files solely because these assets exist.

Report what changed, actual verification, and remaining issues. The [source ledger](references/sources.json) records the bundled canonical version and digests; confirm the applicable published revision for current-policy claims. Change normative sources rather than generated copies, preserving the [documentation license](references/LICENSE) when reusing their text.
