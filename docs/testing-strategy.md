# Testing Strategy

## Unit tests

Cover validators, normalisers, confidence calculations, schema rules, authorization policies, webhook signatures, idempotency, cost calculations, retention, and date/contact handling.

## Integration tests

Cover API and PostgreSQL behaviour, queue and worker transitions, private storage workflows, tenant isolation, API-key scopes, review corrections, deletion, usage recording, and webhook retries.

Use provider fakes for ordinary CI. Live provider tests run separately with controlled fixtures and budgets.

## End-to-end tests

Cover organisation onboarding, project creation, API-key creation, upload, parse completion, field review, correction, export, deletion, webhook configuration, and team permissions.

## AI evaluation tests

Run versioned private datasets across document types, countries, layouts, scans, missing data, conflicts, and adversarial instructions. Gate changes to models, prompts, OCR, schemas, normalisation, evidence, and confidence policies.

## Non-functional tests

- accessibility and keyboard navigation
- responsive layout
- rate-limit and abuse behaviour
- upload and parsing limits
- queue backpressure and recovery
- migration validation
- load and latency testing
- secret and dependency scanning

## CI quality gate

Formatting, linting, strict type checking, unit tests, integration tests, production build, migration validation, security checks, and selected end-to-end tests must pass before merge.

## Test data

Do not place uncontrolled real personal documents or government IDs in source control. Use synthetic fixtures and separately controlled private evaluation storage.