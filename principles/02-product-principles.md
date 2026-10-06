# Product Principles

## 1. Build for long-term use

Plystra products should be designed for repeated use, not only first impressions.

A product that feels impressive for one minute but tiring after one week does not fit Plystra. The interface, data model, onboarding, documentation, and support paths should all assume that users may return many times over a long period.

Prefer features that become more useful with continuity:

- records that remain understandable;
- settings that age well;
- APIs that do not change casually;
- export paths that preserve meaning;
- workflows that users can trust under stress;
- defaults that do not need constant correction.

## 2. Prefer legibility over magic

A Plystra product may automate work, but it should not make the system mysterious.

Automation should answer:

- What happened?
- Why did it happen?
- What data was used?
- What changed?
- Can the user undo it?
- Can the user inspect the result?

AI-assisted features must be especially explicit. If AI is involved, explain what it does, what it does not do, and what the user controls. Do not present probabilistic output as verified fact. When a model suggests, extracts, summarizes, classifies, or acts, the interface should make the status clear, and users should be able to review meaningful AI-generated changes before they are applied.

Recommended labels:

- `Suggested`
- `Draft`
- `Candidate`
- `Needs review`
- `Confirmed`
- `Applied`
- `Reverted`

Avoid labels that overstate certainty:

- `Solved`
- `Understood`
- `Perfect`
- `Final`
- `Autofixed`

## 3. Use friction where trust requires it

Not all friction is bad. Plystra products should remove unnecessary work, but preserve deliberate steps around actions that affect trust.

Use confirmation or review for:

- deleting user data;
- publishing private information;
- sending messages to other people;
- changing billing or legal state;
- modifying many records at once;
- accepting AI-generated changes;
- importing data that changes existing records;
- irreversible exports or transfers.

Avoid confirmation for harmless actions. Warning fatigue lowers trust.

## 4. Make the ordinary path excellent

A high-end product does not need to make every edge case prominent. It should make the ordinary path calm, fast, and reliable.

For a product with a repeated workflow, define the primary loop:

```text
trigger -> action -> feedback -> record -> next step
```

Then design the product so the loop can be completed with minimal uncertainty.

Examples:

- Prepare -> verify -> apply -> report what changed.
- Request -> evaluate -> decide -> record the reason.
- Import -> review candidates -> confirm -> keep the record.

For writing, research, or an object without a repeated workflow, describe how people encounter, use, understand, or preserve the work instead. The goal is a clear purpose and experience appropriate to the medium.

## 5. Respect user data ownership

Plystra products should treat user data as something entrusted, not captured.

Every serious product should be able to answer what its [privacy notice](09-security-and-privacy.md#9-privacy-notice) must state, and also:

- where data is stored;
- what remains after account deletion;
- what logs may contain.

For developer tools, this includes configuration, secrets, deployment metadata, logs, and generated artifacts.

## 6. Scope follows demonstrated need

A product's scope, concepts, and machinery grow only under demonstrated, repeated, concrete need. Nothing is added because it might be needed later, because a competitor has it, or because it makes the design feel complete.

Scope may be large when the problem is large. A product may serve organizations, many parties, or other systems, and may need a full permission or governance model. What must be earned is each concept a user or contributor has to learn. Keep the default path small and disclose the rest progressively, so that a small use and a large use follow the same model without a complexity cliff.

Prefer:

- one model from small to large use;
- defaults that hide machinery until it is needed;
- explicit sharing and transparent permissions;
- clear audit trails.

Avoid:

- speculative concepts, options, and extension points;
- viral loops that distort the product;
- opaque recommendation systems;
- manipulative notifications;
- engagement metrics as product goals.

## 7. Defer what real use must decide

Some questions can only be answered by real use: how finely a variation should be cut, which integrations matter, what a downstream system actually needs. Do not design those answers in advance. A shape fixed before real use is usually the wrong shape, and replacing it later costs more than having waited.

Mechanisms that every use depends on are the opposite case. Determinism, safety boundaries, data integrity, and the rules for how parts compose should be settled early, because changing them later breaks everything built on them. Fix mechanisms early and let real use decide shapes.

When current work would close the door on a deferred option, say so; otherwise leave the question open and do not fill it with a plausible guess.

## 8. Agents are first-class users

Software and developer tools should be usable by agents as well as by people. An agent should be able to discover what a system supports, supply complete intent, verify the result, and recover from failure without private context or undocumented knowledge.

People and agents use the same interface. Behavior must never depend on whether the caller is a person or an agent, and being an agent grants no authority by itself. Every decision the system makes should be recoverable from files people can review, such as source, configuration, generated output, and history, so that people can inspect any result without having to take part in every one.

## 9. Naming inside products

Names should be concrete, calm, and stable.

Use domain words when they help understanding. Avoid trendy internal vocabulary that users must memorize.

Good internal naming tends to be:

- short;
- descriptive;
- plural only when representing a collection;
- consistent across UI, API, and docs;
- easy to translate if needed.

Avoid names that are:

- cute but unclear;
- clever at the expense of accuracy;
- borrowed from unrelated metaphors;
- likely to become embarrassing when the product matures.

## 10. Product maturity levels

Projects should label their maturity honestly.

Recommended maturity labels:

- `Exploration` — idea and prototype; unstable.
- `Private Alpha` — usable by maintainers and invited users; breaking changes expected.
- `Public Alpha` — publicly accessible; incomplete but intentionally maintained.
- `Beta` — core loop stable; some APIs or UI may change.
- `Stable` — suitable for serious use within documented limits.

How actively a project is maintained, including retirement, is stated separately with a [maintenance state](10-release-and-maintenance.md#7-maintenance-states).

Do not use `Stable` because the project feels polished. Use it when maintenance, support, documentation, and upgrade expectations are also stable.

Before public announcement, a project also passes the [public launch checklist](10-release-and-maintenance.md#10-public-launch-checklist).
