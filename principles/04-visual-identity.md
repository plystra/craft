# Visual Identity

## 1. Visual direction

Plystra's own visual identity should feel quiet, precise, and lasting. This is the parent brand's direction, not the only acceptable personality for every project or sub-brand.

These principles apply to visual work across digital and physical products, publications, and other media. Interface-specific rules apply where an interface exists, as described in [Applying and Updating the Philosophy](../ADOPTION.md).

Projects may be playful, expressive, dense, or quiet when that choice serves their purpose and audience. Their visual systems must remain clear, usable, accessible, honest, and free of manipulative presentation. Gradients, illustration, cards, and effects need a purpose; fake dashboards and visual claims of capabilities the product does not have are unacceptable.

Work by Plystra should look like it was designed by someone who expects to care for it.

## 2. Core visual values

### Restraint

Every visual element must earn its place. It may support understanding, recognition, emotional tone, or the experience of the work. Decoration can serve these purposes, but must not obscure content, weaken accessibility, or mislead people about state or capability.

### Precision

Spacing, alignment, contrast, and typography should feel intentional. Imperfect implementation is acceptable during early development, but visual looseness should not become the house style.

### Organized density

Plystra products may contain complex information, but the density should feel organized rather than crowded. Use hierarchy, grouping, progressive disclosure, and clear labels before adding decorative separation.

### Purposeful motion

Motion should help people understand continuity and change, or contribute deliberately to identity and expression. It must not distract from essential tasks, simulate progress or capabilities that do not exist, or override accessibility needs.

## 3. Color philosophy

Identity should remain recognizable through more than color alone, and meaning must not depend on color alone.

Default direction for the parent brand and utility interfaces:

- neutral surfaces;
- high-quality grayscale hierarchy;
- one restrained accent color per product;
- semantic colors only when they communicate state;
- avoid arbitrary color cycling.

Projects and sub-brands may use broader or more expressive palettes for a defined identity, audience, or medium. Contrast, semantic consistency, and non-color cues remain required.

Use color for:

- current selection;
- focused element;
- primary action;
- warning or destructive state;
- data series when necessary;
- project identity and intentional expression.

Do not use color for:

- making a weak layout look interesting;
- decoration that obscures hierarchy or interaction;
- effects that impair legibility;
- communicating status without the necessary text or icon cues.

## 4. Typography

Typography should support comfortable reading and express the work's character.

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

For sponsored projects, an authorized logo placement identifies only the agreed sponsorship. Pair it with clear sponsorship wording and follow the [brand relationship rules](01-brand-philosophy.md#4-brand-hierarchy); do not present it as a mark of ownership or operation. Adoption of this philosophy alone does not grant permission to use the logo.

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

Each Plystra-owned project, sub-brand, and project under a sub-brand may have its own personality and identity system within the full philosophy. A sub-brand's separate identity does not exempt its projects from these standards.

Affiliation must be accurate, but visual similarity to the parent brand is not a condition of compliance. Shared principles do not require identical colors, typography, density, or emotional tone.

A project may define:

- palette and typography;
- product icon;
- illustration style;
- landing page motion direction;
- screenshot composition;
- domain-specific visual metaphors.

A Plystra project must carry the philosophy's standards for:

- clear and honest writing;
- purposeful expression;
- accessibility standards;
- typography discipline;
- legible and maintainable documentation;
- maintenance labeling;
- legal attribution pattern.

Sponsored projects may retain their own visual systems and choose whether to adopt these standards. Within these visual standards, they are required only to use Plystra's name and marks accurately and with authorization; the separate [sponsorship admission requirements](11-governance-and-legal.md#11-sponsorship-admission-and-continuation) still apply.

## 8. Imagery and animation

Imagery and animation may explain behavior, communicate identity, establish emotional tone, or contribute to an artistic or editorial purpose. The choice should fit the work and its audience without obscuring information or implying capabilities that do not exist.

Good uses:

- traces becoming records;
- nodes forming a stable structure;
- a deployment bundle moving through constrained paths;
- a local object becoming a maintained system;
- small signals becoming legible patterns;
- an illustration that gives a publication or sub-brand a recognizable voice;
- material photography that honestly conveys an object's texture and construction.

Bad uses:

- effects that suggest nonexistent intelligence or system activity;
- stock imagery presented as the actual product;
- visual noise that obscures content or controls;
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

1. Does essential content remain understandable without animation?
2. Does the hierarchy remain clear without relying on color alone?
3. Is the work's purpose or main action clear?
4. Does each expressive element serve understanding, identity, tone, or experience?
5. Would the design still serve its purpose if trends changed next year?

Revise elements whose novelty comes at the expense of clarity, honesty, accessibility, or the work's purpose.
