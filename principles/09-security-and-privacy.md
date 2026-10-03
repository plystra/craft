# Security and Privacy

## 1. Security posture

Plystra projects should treat security and privacy as product design constraints.

A project does not need enterprise complexity to be responsible. It needs clear boundaries, honest documentation, safe defaults, and a habit of thinking about misuse.

## 2. Basic security requirements

Every serious Plystra project should define:

- authentication model, if users exist;
- authorization model, if data access varies;
- secret handling rules;
- data storage locations;
- backup expectations;
- logging policy;
- third-party service usage;
- vulnerability reporting path;
- dependency update process.

Security work should validate untrusted input at every boundary: user input, HTTP requests, files, webhooks, CLI arguments, external APIs, database queries, and AI or tool outputs.

## 3. Secret handling

Rules:

- never commit secrets;
- never place real credentials in documentation;
- never include private server addresses or tokens in public examples;
- use `.env.example` with placeholder values;
- rotate secrets after accidental exposure;
- keep production secrets out of local test fixtures;
- avoid logging authorization headers, API keys, session tokens, or private payloads.

## 4. Authentication and sessions

When a product has accounts:

- password storage must use accepted password hashing mechanisms;
- session cookies should use secure settings in production;
- account recovery should be designed carefully;
- rate limits should protect sensitive endpoints;
- login and registration errors should not leak unnecessary account existence information;
- administrative access should be separated from normal user access.

## 5. Authorization

Authorization must be enforced server-side.

Frontend checks are user experience helpers, not security boundaries.

Rules:

- define ownership clearly;
- check access on every protected request;
- use least privilege;
- avoid broad admin shortcuts;
- log security-relevant changes;
- test cross-user access failures.

Client-side authorization checks are never sufficient for protecting data. Enforce access in the server, database policy layer, or another trusted boundary.

## 6. Common vulnerability baseline

Code projects should deliberately guard against:

- SQL injection;
- command injection;
- path traversal;
- unsafe deserialization;
- cross-site scripting;
- CSRF where applicable;
- auth bypass;
- privilege escalation;
- insecure session handling;
- sensitive-data leakage.

Use parameterized queries or the project's safe query builder for database access. Avoid raw HTML rendering unless the content is necessary and sanitized.

## 7. Privacy

Before collecting real user data, a project must provide an accurate, accessible privacy notice in plain language. This applies to private alpha tests and pilots as well as public products, including data collected through telemetry, debugging, and support.

The notice must explain:

- what data is collected;
- why it is collected;
- how long it is kept;
- who can access it;
- which third parties receive or process it and for what purposes;
- how to request export or deletion, including any limits and retained copies;
- what happens during debugging or support;
- how to contact the responsible operator about data handling.

Collect only the data needed for the stated purposes. The notice must match actual behavior and be updated before changed data handling begins. Disclosure does not replace authorization where it is required.

## 8. AI and private data

Before sending private files, code, messages, or other private content to an AI provider or another third-party processor, a project must have explicit authorization from a user or organization entitled to authorize that processing. Authorization must cover the stated purpose, identified recipient, and data scope; merely listing a provider in documentation is insufficient.

An explicit, continuing workflow authorization may cover repeated transfers within those boundaries without a prompt each time. A new purpose or recipient, or an expanded data scope, requires renewed authorization before transmission. Model training and other secondary uses are not included by default and require separate explicit authorization.

When using AI providers:

- identify the providers that receive private content;
- explain what data may be sent;
- avoid sending more context than necessary;
- distinguish model output from verified data;
- allow user review for meaningful changes;
- provide configuration paths to disable AI where appropriate;
- avoid logging full private prompts in production.

## 9. Data deletion and export

Data deletion and export behavior must be honest.

Do not claim complete deletion if backups, logs, audit trails, or third-party processors retain data for a period of time. Explain the actual behavior.

Exports should prefer formats that preserve meaning, not only raw dumps.

## 10. Payments and financial data

Products that involve checkout, subscriptions, invoicing, donations, or e-commerce must use a real payment integration.

Rules:

- do not collect or handle raw card data directly;
- keep payment secrets server-side;
- verify webhook signatures before processing events;
- make payment event handling idempotent;
- do not imply that checkout works until required payment configuration is present, unless the surface is explicitly a visual-only prototype.

## 11. Logging

Logs are operational tools, not shadow databases.

Rules:

- log events, not full private content;
- redact secrets;
- use request IDs;
- set retention expectations;
- separate development verbosity from production behavior;
- document where logs are stored.

## 12. Security review checklist

Before shipping a feature involving user data:

1. Who can access this data?
2. Is access checked server-side?
3. Is sensitive data logged anywhere?
4. Does the user understand what happens?
5. Can data be exported or deleted?
6. Are third parties involved?
7. Are errors safe?
8. Is there a recovery path after mistakes?
9. Does documentation match implementation?
10. Is an accurate privacy notice available before any real user data is collected, including in private tests?
11. Are transfers of private content to AI providers or other third parties within valid, explicit authorization for the purpose, recipient, and data scope?
