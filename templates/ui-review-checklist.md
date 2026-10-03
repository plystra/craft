# UI Review Checklist

Use this checklist before merging visible UI changes in a Plystra project.

## Product fit

- [ ] The change supports the project's primary loop.
- [ ] The screen has one clear primary action.
- [ ] The change reduces uncertainty rather than adding visual noise.
- [ ] The copy is calm, specific, and proportionate.
- [ ] The interface does not exaggerate AI or automation capability.

## Visual design

- [ ] Spacing follows the project scale.
- [ ] Typography uses existing roles and tokens.
- [ ] The hierarchy works in grayscale.
- [ ] Color communicates state only with text or icon support.
- [ ] Borders and shadows are used intentionally.
- [ ] There are no unnecessary nested cards.
- [ ] The design still works without animation.
- [ ] Text fits within its containers at supported viewport sizes.
- [ ] Icons come from the existing icon system when one exists.

## Interaction

- [ ] Loading state is handled.
- [ ] Empty state is handled.
- [ ] Error state is handled.
- [ ] User input is preserved after recoverable errors.
- [ ] Destructive actions are explicit.
- [ ] High-risk actions require confirmation or review.
- [ ] Undo or recovery is provided where appropriate.

## Accessibility

- [ ] Interactive controls are keyboard accessible.
- [ ] Focus states are visible.
- [ ] Form controls have labels.
- [ ] Images have appropriate alt text or are marked decorative.
- [ ] Contrast is sufficient.
- [ ] Motion respects reduced-motion settings.
- [ ] The flow works without hover.
- [ ] Touch targets are comfortable on mobile.

## Responsive behavior

- [ ] The layout works on the minimum supported viewport.
- [ ] The rendered UI was checked at desktop and mobile sizes.
- [ ] Critical actions remain available on mobile.
- [ ] Tables, code, or dense data have a mobile strategy.
- [ ] Modals or overlays are usable on small screens.

## Engineering

- [ ] Components use design tokens.
- [ ] No one-off visual constants were added without reason.
- [ ] New components have documented variants.
- [ ] The change does not introduce unnecessary dependencies.
- [ ] Tests or manual QA notes cover the critical path.
- [ ] Console errors, broken assets, and obvious network failures were checked.

## Public websites and documentation

Apply [Websites, Search, and Sharing](../principles/13-websites-search-and-sharing.md) when the change affects an official website or public documentation. Sponsored projects may choose whether to adopt these checks.

- [ ] Indexable pages return readable primary content and accurate page-specific metadata in their HTML.
- [ ] Canonical URLs, internal links, sharing metadata, and sitemap entries agree.
- [ ] Status codes and indexing rules match the intended public surface.
- [ ] The sitemap excludes errors, redirects, duplicates, private pages, and `noindex` pages.
- [ ] The required `/llms.txt` is publicly reachable and current, with accurate status and canonical links.
- [ ] Share images resolve, have alternative text, and remain readable in previews.
- [ ] Applicable structured data is valid and reflects actual content and relationships.
- [ ] Production build and deployed-response checks cover the affected pages and assets.

## Final question

- [ ] Does the interface feel calmer and more trustworthy after this change?
