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
- [ ] Critical actions remain available on mobile.
- [ ] Tables, code, or dense data have a mobile strategy.
- [ ] Modals or overlays are usable on small screens.

## Engineering

- [ ] Components use design tokens.
- [ ] No one-off visual constants were added without reason.
- [ ] New components have documented variants.
- [ ] The change does not introduce unnecessary dependencies.
- [ ] Tests or manual QA notes cover the critical path.

## Final question

- [ ] Does the interface feel calmer and more trustworthy after this change?
