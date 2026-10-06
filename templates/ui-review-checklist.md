# UI Review Checklist

Use this checklist before merging visible UI changes in a Plystra project. Apply it to the actual interface and supported devices.

## Product fit

- [ ] The change supports the project's primary loop.
- [ ] The screen has one clear primary action.
- [ ] The change reduces uncertainty rather than adding visual noise.
- [ ] The copy is clear, specific, proportionate, and appropriate to the project.
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
- [ ] Icons, if any, serve controls or labels and match the identity; none are used as decoration.
- [ ] Nothing reads as a template, clip-art, or a figure added to fill space.
- [ ] The page keeps one ground per color mode, with no alternating dark and light blocks.
- [ ] Text is never animated by distorting its proportions.

## Interaction

- [ ] Loading state is handled.
- [ ] Empty state is handled.
- [ ] Error state is handled.
- [ ] User input is preserved after recoverable errors.
- [ ] Destructive actions are explicit.
- [ ] High-risk actions require confirmation or review.
- [ ] Undo or recovery is provided where appropriate.

## Accessibility

- [ ] Interactive controls are keyboard accessible; interfaces without a keyboard support their relevant assistive input methods.
- [ ] Focus states are visible.
- [ ] Form controls have labels.
- [ ] Images have appropriate alt text or are marked decorative.
- [ ] Contrast is sufficient.
- [ ] Motion respects reduced-motion settings.
- [ ] The flow works without hover.
- [ ] Touch targets are comfortable on mobile.
- [ ] The focus path is predictable.
- [ ] The interface uses the same words as the documentation.
- [ ] The flow stays clear when the user is tired or distracted.

## Responsive behavior

- [ ] The layout works on the minimum supported viewport.
- [ ] The rendered UI was checked at supported display sizes, input methods, and relevant text zoom levels.
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

- [ ] If the change affects an official website or public documentation, [website release verification](../principles/13-websites-search-and-sharing.md#10-release-verification) covers the affected pages.

## Final question

- [ ] Does the change serve the intended experience while preserving clarity, usability, accessibility, and trust?
