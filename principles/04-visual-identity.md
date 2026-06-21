# Visual Identity

## 1. Visual direction

Plystra's visual identity should feel quiet, precise, and lasting.

It should avoid the visual language of disposable startup websites: excessive gradients, floating cards without purpose, noisy illustration packs, animated buzzwords, fake dashboards, and over-lit glass effects.

A Plystra interface should look like it was designed by someone who expects to maintain it.

## 2. Core visual values

### Restraint

Every visual element must earn its place. If a border, shadow, animation, icon, or color does not clarify structure or communicate state, remove it.

### Precision

Spacing, alignment, contrast, and typography should feel intentional. Imperfect implementation is acceptable during early development, but visual looseness should not become the house style.

### Calm density

Plystra products may contain complex information, but the density should feel organized rather than crowded. Use hierarchy, grouping, progressive disclosure, and clear labels before adding decorative separation.

### Quiet motion

Motion should communicate continuity, not performance. It should help the user understand where they are and what changed.

## 3. Color philosophy

Plystra should not depend on color for identity alone.

Default direction:

- neutral surfaces;
- high-quality grayscale hierarchy;
- one restrained accent color per product;
- semantic colors only when they communicate state;
- no rainbow palettes unless the product has a real data visualization need.

Use color for:

- current selection;
- focused element;
- primary action;
- warning or destructive state;
- data series when necessary;
- project identity in small amounts.

Do not use color for:

- making a weak layout look interesting;
- arbitrary card decoration;
- excessive gradients;
- background noise;
- status when text or icon is also required.

## 4. Typography

Typography should carry much of the premium feeling.

Recommended principles:

- use a small number of type styles;
- prefer system or well-licensed fonts;
- avoid novelty typefaces in product UI;
- make body text comfortable to read;
- ensure code and identifiers use a distinct monospace style;
- keep line length reasonable;
- avoid tiny text that looks elegant but hurts usability.

Suggested type roles:

```text
Display       Rare, for landing or identity moments.
Heading       Section and page structure.
Body          Main reading and interface text.
Muted         Secondary explanations and metadata.
Label         Forms, controls, tags, table headers.
Code          Code, commands, identifiers, config.
```

## 5. Layout

Plystra layouts should be stable and easy to scan.

General rules:

- align to a consistent spacing scale;
- keep primary actions predictable;
- avoid centered text for long content;
- avoid full-width text blocks on large screens;
- preserve generous margins where possible;
- use cards only when they represent meaningful objects;
- use tables when comparison is the primary task;
- use drawers and modals sparingly.

## 6. Logo usage

The Plystra logo should be treated as a mark of stewardship, not decoration.

Use the logo:

- on the main Plystra site;
- in project footers or about pages;
- in repository documentation where brand affiliation matters;
- in release assets when appropriate.

Avoid:

- repeating the logo in every card;
- using the logo as a loading spinner by default;
- distorting the mark;
- placing it on noisy backgrounds;
- combining it with unrelated decorative shapes.

## 7. Project identity

Each project may have its own accent and small identity system.

However, project identity must not fight Plystra identity.

A project may define:

- accent color;
- product icon;
- illustration style;
- landing page motion direction;
- screenshot composition;
- domain-specific visual metaphors.

A project should inherit:

- writing tone;
- restraint;
- accessibility standards;
- typography discipline;
- documentation style;
- maintenance labeling;
- legal attribution pattern.

## 8. Imagery and animation

When using particles, diagrams, or abstract animation, the image should express system behavior rather than decoration.

Good uses:

- traces becoming records;
- nodes forming a stable structure;
- a deployment bundle moving through constrained paths;
- a local object becoming a maintained system;
- small signals becoming legible patterns.

Bad uses:

- generic glowing orbs;
- random network lines;
- meaningless AI particles;
- stock 3D devices;
- looping animations that distract from reading.

## 9. Screenshots

Product screenshots should be honest.

Do not fake impossible states. Do not show data that implies maturity the project does not have. Use realistic sample data that communicates the product clearly without exposing private information.

Screenshots should show:

- real layout density;
- true empty, loading, and error states when relevant;
- primary workflows;
- product constraints;
- meaningful data examples.

## 10. Visual review test

Before shipping a public visual surface, ask:

1. Does the page still look good without animation?
2. Does the hierarchy work in grayscale?
3. Can a user understand the main action in five seconds?
4. Does any element exist only to look fashionable?
5. Would the design still feel acceptable if trends changed next year?

If the design depends on novelty, reduce it.
