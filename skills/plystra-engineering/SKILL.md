---
name: plystra-engineering
description: Implement, debug, or review software, APIs, CLIs, libraries, data changes, and release workflows for Plystra projects or code explicitly adopting Plystra Craft. Use for engineering work within the actual repository and its existing architecture.
---

# Plystra engineering

Complete authorized software work with explicit contracts, maintainable changes, and evidence appropriate to the risk.

## Establish obligations and authorization

Use the project's maintained relationship record and the [scope definitions](references/README.md#scope-and-project-relationships). Interpret requirements and recommendations through [ADOPTION](references/ADOPTION.md). Sponsored projects retain their chosen scope; ownership and sub-brand obligations cover all applicable provisions.

Read the relevant [Code Project Working Standards](references/principles/12-code-project-working-standards.md), including the distinction between project obligations, maintainer authorization, and trusted guidance. This entry point adds no requirements and does not override platform instruction priority or grant access to unrelated systems. Existing authorization remains effective within its stated bounds.

Keep the user's requested mode: a review produces findings; an implementation task includes the implementation and relevant verification. Resolve an actual conflict explicitly, continuing unaffected authorized work where possible. A narrow engineering task does not amount to a full Craft assessment.

## Gather the necessary project context

Inspect trusted contributor guidance, working-tree changes, relevant source and contracts, manifests, lockfiles, and existing public commands. Preserve unrelated changes. Use [Engineering Standards](references/principles/07-engineering-standards.md) for the affected architecture, configuration, APIs, data, dependencies, and verification decisions.

Load additional references by the work being done:

- [Security and Privacy](references/principles/09-security-and-privacy.md) for trust boundaries, credentials, authentication, data handling, external processors, or sensitive logging.
- [Documentation Standards](references/principles/08-documentation-standards.md) for changed setup, configuration, public contracts, operations, or contributor guidance.
- [Frontend UI Design](references/principles/05-frontend-ui-design.md) and [Accessibility and Interaction](references/principles/06-accessibility-and-interaction.md) for changes to a digital interface.
- [Websites, Search, and Sharing](references/principles/13-websites-search-and-sharing.md) for an official website or public web documentation, including the mandatory `/llms.txt` and real-response verification.
- [Release and Maintenance](references/principles/10-release-and-maintenance.md) for compatibility, migrations, release preparation, deployment, or retirement.
- [Governance and Legal](references/principles/11-governance-and-legal.md) for license decisions, ownership, or public claims; the [Charter](references/CHARTER.md) for changes of purpose or admission.

The [reference index](references/index.md) lists the complete bundle. Read only the sections needed for the actual change and its affected contracts.

## Make the change reviewable

1. State the intended observable behavior and the boundary it must preserve. Scale planning to uncertainty and consequence.
2. Follow the actual project architecture and maintained dependency choices. Implement the smallest coherent change that completes the requested behavior, including necessary documentation and configuration updates.
3. Exercise the relevant public surface and failure paths. Use meaningful regression, integration, migration, browser, CLI, or library checks according to the changed contract; explain unavailable verification accurately.
4. Inspect the final diff for unintended scope, sensitive data, broken contracts, and unsupported claims.
5. Carry out any explicitly authorized commit, push, release, or deployment using the project workflow. Without that authorization, leave a reviewable result and accurately state what remains unpublished.

Use bundled assets only for a matching deliverable: [decision record](assets/templates/decision-record.md), [README](assets/templates/project-readme.md), [release notes](assets/templates/release-notes.md), or [project adoption record](assets/templates/project-principles.md). Replace their prompts and destination-specific links; do not treat a template as evidence of compliance.

For reviews, lead with concrete findings and failure scenarios. For implementation, report changed behavior, verification results, and material limitations. The [source ledger](references/sources.json) identifies the canonical snapshot used here. Confirm the applicable published revision for formal or current-policy assessments, edit canonical rules rather than generated copies, and preserve the [documentation license](references/LICENSE) when adapting their text.
