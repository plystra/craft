# Language and Writing

## 1. Voice

Plystra writes with restraint.

The voice should be calm, exact, and lightly poetic when appropriate. It should not sound like a growth team, a corporate brochure, or a technical manual written without care.

The ideal tone is:

- plain but not flat;
- confident but not loud;
- technical but not hostile;
- serious but not theatrical;
- warm but not sentimental.

## 2. Default writing style

Use short sentences when explaining actions. Use longer sentences only when the rhythm benefits the idea.

Prefer concrete nouns and active verbs.

Avoid filler phrases:

- `seamlessly`
- `revolutionary`
- `next-generation`
- `AI-powered` unless it is technically necessary;
- `all-in-one`
- `supercharge`
- `unlock your potential`
- `delightful` as a substitute for describing the actual quality;
- `trusted by` without evidence;
- `enterprise-grade` without explaining the standard.

## 3. Claims must be earned

Public claims should match the project's actual maturity.

Do not say:

> The most advanced personal operating system.

Say:

> A personal record system for turning scattered traces into confirmed facts and next actions.

Do not say:

> Deploy anywhere with zero friction.

Say:

> Bundle, transfer, and deploy Docker Compose releases in environments where normal registry access is unreliable.

Do not say:

> Private by design.

Say:

> Data is stored in your configured database. AI processing is opt-in for supported flows. Export and deletion behavior is documented here.

## 4. Project descriptions

A project description should answer three questions:

1. What is it?
2. Who is it for?
3. What kind of system does it help create or maintain?

Recommended pattern:

```text
[Project] is a [kind of tool] for [audience/context] who need to [primary job] without [important negative pattern].
```

Example:

```text
Tarsail is a release bundler and SSH deployer for teams that need to ship Docker Compose applications in restricted or unreliable network environments without depending on live registry access during deployment.
```

## 5. Interface copy

Interface copy should reduce uncertainty.

Use direct labels:

- `Save`
- `Export`
- `Review changes`
- `Create record`
- `Send message`
- `Archive project`
- `Delete permanently`

Avoid vague labels:

- `Go`
- `Magic`
- `Enhance`
- `Smart apply`
- `Boost`
- `Optimize` unless the optimization is explicit.

## 6. Empty states

An empty state should not be cute unless the product itself is intentionally playful.

Good empty states:

```text
No records yet.
Capture a note, import a file, or create a record manually.
```

```text
No deployments have been created.
Create a release bundle to begin.
```

Avoid:

```text
Nothing here... yet! ✨
```

unless the project's tone specifically allows it.

## 7. Error messages

Error messages should be specific, useful, and calm.

A good error explains:

- what failed;
- whether the user's data is safe;
- what the user can do next;
- whether retrying may help.

Example:

```text
The import could not be completed because the file is larger than the configured limit. No records were changed. Reduce the file size or change the import limit, then try again.
```

Avoid:

```text
Something went wrong.
```

If details are sensitive, show a safe summary and provide a diagnostic reference.

## 8. Documentation tone

Documentation should respect the reader's time.

Start with the shape of the system before listing commands. A contributor should understand why a command exists, not only how to run it.

Recommended order:

1. What this project is.
2. Current maturity and limitations.
3. System architecture.
4. Local development.
5. Configuration.
6. Data and security model.
7. Deployment.
8. Operations.
9. Contribution rules.

## 9. Capitalization

Use sentence case for UI labels and headings unless a project has a strong reason otherwise.

Recommended:

- `Create record`
- `Import data`
- `Release notes`
- `Security policy`

Avoid unnecessary title case:

- `Create Record`
- `Import Data`
- `Release Notes`

## 10. Words Plystra likes

Use these words when they are accurate:

- craft;
- durable;
- quiet;
- legible;
- careful;
- explicit;
- record;
- trace;
- system;
- maintenance;
- stewardship;
- human-scale;
- independent;
- long-lived.

Do not overuse them. A vocabulary becomes a costume when repeated too often.
