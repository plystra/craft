# Accessibility and Interaction

## 1. Accessibility is part of craft

Accessibility is not a compliance layer added after design. For Plystra, accessibility is part of product quality.

A high-end interface must be usable by people with different devices, input methods, vision, motion preferences, language abilities, attention levels, and stress conditions.

## 2. Baseline standard

Plystra projects should aim for WCAG 2.2 AA where applicable. When a project cannot fully meet this standard yet, the limitation should be acknowledged and tracked.

Minimum expectations:

- meaningful semantic HTML where possible;
- keyboard access for interactive controls;
- visible focus states;
- sufficient contrast;
- labels for form controls;
- alt text for meaningful images;
- reduced-motion support;
- no color-only status communication;
- predictable navigation order;
- clear error messages.

## 3. Keyboard interaction

Interactive elements should be reachable and usable by keyboard.

Rules:

- use native elements before custom controls;
- preserve visible focus rings;
- do not trap focus unless using a modal or controlled overlay;
- ensure `Escape` closes dismissible overlays;
- ensure `Enter` and `Space` behave as expected;
- document custom shortcuts;
- avoid shortcuts that conflict with browser or assistive technology defaults.

## 4. Focus states

Focus states should be visible, calm, and consistent.

Do not remove outlines just because they look imperfect. Design better focus states instead.

A good focus state:

- is visible against the surrounding surface;
- does not rely on color alone;
- follows the component's shape;
- is consistent across controls;
- does not cause layout shift.

## 5. Contrast

Text contrast must be sufficient in both light and dark modes when supported.

Muted text should still be readable. Elegance is not an excuse for low contrast.

Avoid:

- pale gray body text;
- critical labels with low contrast;
- status colors that disappear in dark mode;
- thin text on blurred or gradient backgrounds.

## 6. Motion sensitivity

Respect `prefers-reduced-motion`.

When reduced motion is enabled:

- remove non-essential animation;
- reduce transition distance;
- avoid parallax;
- avoid looping particles in content-heavy contexts;
- preserve instant state feedback.

Motion should never be required to understand state.

## 7. Touch interaction

Mobile and touch interfaces should not be second-class.

Rules:

- use comfortable tap targets;
- avoid hover-only controls;
- keep destructive actions away from frequent safe actions;
- use bottom sheets for long mobile modal content;
- avoid placing primary actions where browser UI frequently interferes;
- ensure scrolling areas are obvious;
- test with one-handed use when the project is mobile-first.

## 8. Cognitive accessibility

Interfaces should be understandable under stress.

This matters especially for systems involving personal data, deployment, communication, money, privacy, or irreversible changes.

Rules:

- use consistent names;
- avoid unnecessary modes;
- show current state clearly;
- explain consequences before irreversible actions;
- avoid hiding important settings;
- group choices by user intent;
- make undo or recovery paths visible when available.

## 9. Internationalization readiness

Not every Plystra project needs immediate internationalization. However, projects should avoid decisions that make future localization unnecessarily hard.

Recommended practices:

- do not concatenate translated strings in code;
- avoid hard-coded date, time, and number formats;
- allow UI text to expand;
- avoid icon metaphors that only work in one culture;
- keep technical identifiers separate from user-facing labels;
- document the current language policy.

A project may intentionally support only one language during early phases, but that decision should be explicit.

## 10. Interaction review checklist

Before shipping a new interaction:

1. Can it be completed with keyboard only?
2. Can it be completed on touch devices?
3. Is the focus path predictable?
4. Is the result clear without animation?
5. Is the status clear without color?
6. Is there a recovery path for mistakes?
7. Does the interface use the same words as the documentation?
8. Is the interaction still clear when the user is tired or distracted?
