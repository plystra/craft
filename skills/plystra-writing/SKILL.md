---
name: plystra-writing
description: Write or edit project descriptions, interface copy, READMEs, technical documentation, release notes, and website summaries for Plystra projects or work explicitly adopting Plystra Craft. Use when Craft's voice and factual standards should guide the writing.
---

# Plystra writing

Make the work understandable through accurate claims, useful structure, and a voice appropriate to its audience.

## Establish scope and evidence

Use the project's recorded relationship and the [scope definitions](references/README.md#scope-and-project-relationships), then [ADOPTION](references/ADOPTION.md) for requirement levels and applicability as needed. Sponsored projects may adopt writing guidance without adopting the whole standard; adoption does not create affiliation.

This entry point guides the requested writing task. It does not authorize publishing, sending messages, changing implementation, or replacing platform instructions. An edited document is not proof that its project meets the full standard.

Read the existing document and the evidence behind its claims. For technical writing, inspect the relevant public interfaces, configuration, commands, and current implementation to the depth needed for the requested accuracy. Mark missing or unverified facts instead of inventing them.

## Load the matching guidance

- Use [Language and Writing](references/principles/03-language-and-writing.md) for voice, labels, errors, and descriptions.
- Use [Documentation Standards](references/principles/08-documentation-standards.md) for structure, examples, contributor guidance, and synchronization with behavior.
- For positioning or affiliation, read [Brand Philosophy](references/principles/01-brand-philosophy.md) and the relevant [Governance and Legal](references/principles/11-governance-and-legal.md) sections.
- For security examples, privacy notices, or data-processing claims, read [Security and Privacy](references/principles/09-security-and-privacy.md).
- For release, upgrade, support, or retirement communication, read [Release and Maintenance](references/principles/10-release-and-maintenance.md).
- For `AGENTS.md` or other contributor instructions, read [Code Project Working Standards](references/principles/12-code-project-working-standards.md), especially obligations, authorization, and trusted guidance.
- For official website copy, metadata, structured summaries, or `/llms.txt`, read [Websites, Search, and Sharing](references/principles/13-websites-search-and-sharing.md). Keep public summaries consistent with actual pages and current capabilities.
- Consult the [Charter](references/CHARTER.md) when describing Plystra's purpose across media.

The [reference index](references/index.md) lists the bundled sources; use only the branches relevant to the deliverable.

## Produce the requested document

Start with what the reader needs to understand or do. Explain the system shape before commands when context is necessary. Use the project's real vocabulary and distinguish available behavior from planned or experimental work.

Use templates only when their deliverable is requested or required by the project workflow:

- [Project README](assets/templates/project-readme.md)
- [Release notes](assets/templates/release-notes.md)
- [Decision record](assets/templates/decision-record.md)
- [Project principles and adoption record](assets/templates/project-principles.md)

Adapt the template to the medium, remove prompts and irrelevant examples, and replace copy-dependent relative links with destinations that exist in the receiving project. Keep ownership, sponsorship, license, maturity, and verification claims supported by records.

Review the final text against its source facts and intended reading context. Check links, terminology, examples, and material contradictions. Verify commands when asserting that they work; if verification is unavailable, state the limit rather than implying a successful run.

Report the artifact changed and any material factual gaps. The [source ledger](references/sources.json) identifies this generated Craft snapshot. Verify the applicable published revision when writing a current-policy or adoption claim; edit normative rules at their canonical source. Preserve the [documentation license](references/LICENSE) when reusing Craft text.
