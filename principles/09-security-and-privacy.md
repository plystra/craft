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
- never place real credentials in documentation, contributor guidance, examples, logs, or tests;
- never include private server addresses or tokens in public examples;
- keep credentials in a suitable secret store or environment injection mechanism;
- keep production secrets out of local test fixtures;
- rotate secrets after accidental exposure;
- proxy secret-bearing external API calls through backend or serverless code; do not expose them from browser code.

## 4. Authentication and sessions

Use the project's existing authentication provider and session model when present. For new projects, choose authentication and storage based on the product's security requirements, data model, privacy obligations, operational capacity, portability, and maintenance cost. Prefer maintained protocols and libraries with a clear security record. No vendor is the default for every project.

When a product has accounts:

- do not present mock authentication as production-ready;
- password storage must use accepted password hashing mechanisms;
- session cookies should use secure, HTTP-only settings in production;
- use CSRF protections where appropriate;
- account recovery should be designed carefully;
- rate limits should protect sensitive endpoints;
- login and registration errors should not leak unnecessary account existence information;
- administrative access should be separated from normal user access.

## 5. Authorization and access control

Authorization must be enforced on the server, in a database policy layer, or at another trusted boundary. Client-side checks are user experience helpers, not security boundaries, and are never sufficient for protecting data.

Enforce access controls for user data at every accessible service or database boundary, including authenticated, unauthenticated, and privileged access. Where clients can access a database directly, use database-enforced policies such as row-level security or an equivalent control; server-only authorization is insufficient for a path that bypasses the server.

Rules:

- define ownership clearly;
- check access on every protected request;
- use least privilege;
- avoid broad admin shortcuts;
- log security-relevant changes;
- test cross-user access failures.

## 6. Common vulnerabilities and misuse

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

Never build malicious, destructive, abusive, phishing, credential-theft, malware, unauthorized-access, or evasion functionality. Do not clone login pages, payment forms, or other flows that could be used for phishing. If a legitimate authenticated page must be recreated, use safe internal references such as post-login screenshots.

## 7. Payments and financial data

Products that involve checkout, subscriptions, invoicing, donations, or e-commerce must use a real payment integration.

Rules:

- do not collect or handle raw card data directly;
- keep payment secrets server-side;
- verify webhook signatures before processing events;
- make payment event handling idempotent;
- do not imply that checkout works until the required payment integration and configuration are present, unless the surface is explicitly a visual-only prototype.

## 8. Logging

Logs are operational tools, not shadow databases.

Rules:

- log events, not full private content;
- never log authorization headers, API keys, session tokens, raw secrets, private messages, full user documents, or other private payloads;
- use request IDs;
- set retention expectations;
- separate development verbosity from production behavior;
- document where logs are stored.

## 9. Privacy notice

Before collecting real user data, a project must provide an accurate, accessible privacy notice in plain language. This applies to private alpha tests and pilots as well as public products, including data collected through telemetry, debugging, and support. Private tests may use a concise notice; a later public launch is not the deadline.

The notice must be easy to find at the relevant collection or onboarding point and must explain:

- what data is collected;
- why it is collected;
- how long it is kept;
- who can access it;
- which third parties receive or process it and for what purposes;
- how to request export or deletion, including any limits and retained copies;
- what happens during debugging or support;
- how to contact the responsible operator about data handling.

Collect only the data needed for the stated purposes. The notice must match actual behavior and be updated before changed data handling begins. Disclosure does not replace authorization where it is required.

## 10. AI and private data

Before sending private files, code, messages, or other private content to an AI provider or another third-party processor, a project must have explicit authorization from a user or organization entitled to authorize that processing. Authorization must cover the stated purpose, identified recipient, and data scope; merely listing a provider in documentation is insufficient.

An explicit, continuing workflow authorization may cover repeated transfers within those boundaries without a prompt each time. A new purpose or recipient, or an expanded data scope, requires renewed authorization before transmission. Model training and other secondary uses are not included by default and require separate explicit authorization.

When using AI providers:

- identify the providers that receive private content in relevant documentation;
- explain what data may be sent;
- avoid sending more context than necessary;
- provide configuration paths to disable AI where appropriate;
- avoid logging full private prompts in production unless explicitly configured for development.

## 11. Data deletion and export

Data deletion and export behavior must be honest.

Do not claim complete deletion if backups, logs, audit trails, or third-party processors retain data for a period of time. Explain the actual behavior.

Exports should prefer formats that preserve meaning, not only raw dumps.

## 12. Security review checklist

Before shipping a feature involving user data:

1. Who can access this data?
2. Is access checked at a trusted boundary?
3. Is sensitive data logged anywhere?
4. Does the user understand what happens?
5. Can data be exported or deleted?
6. Are third parties involved?
7. Are errors safe?
8. Is there a recovery path after mistakes?
9. Does documentation match implementation?
10. Is an accurate privacy notice available before any real user data is collected, including in private tests?
11. Are transfers of private content to AI providers or other third parties within valid, explicit authorization for the purpose, recipient, and data scope?
