---
name: plystra-craft-website
description: "Plystra Craft rules for official websites and public web documentation. Use when building, changing, or releasing a Plystra project's public site: factual content, readable HTML, titles and descriptions, canonical URLs, robots.txt, sitemap.xml, sharing previews, JSON-LD, the required /llms.txt, and deployed-response checks. Usually paired with plystra-craft-design and plystra-craft-code. Requires plystra-craft."
---

# Plystra website

Rules that make an official site explain the project accurately to people, search engines, and systems that share or summarize it. They add to `plystra-craft`, which governs the site's wording, claims, and privacy notices. If `plystra-craft` is not installed, tell the user to run `bunx --bun skills add plystra/craft --skill plystra-craft`.

Read [website standards](references/website-standards.md) in full; every section applies to an official site.

Before editing, identify the public origin, the real pages, which pages are indexable, the project's status and publisher, and its confirmed relationship to Plystra. Every official site must publish a deliberate `robots.txt`, a valid `sitemap.xml`, and `/llms.txt`, and these must agree with the visible pages.

Verify the production output and, when a deployment is in scope, the deployed responses. A successful local build is not evidence that the live site is correct. Record the routes and release-verification checks covered. Do not publish or change domains unless the user asked for it.

The [index](references/index.md) and [source ledger](references/sources.json) identify the canonical sources of this snapshot. Keep the [license](references/LICENSE) when reusing them.
