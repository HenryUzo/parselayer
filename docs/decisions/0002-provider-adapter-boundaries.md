# ADR 0002: Provider Adapter Boundaries

- Status: Accepted
- Date: 2026-06-26

## Context

AI, OCR, storage, authentication, malware scanning, and billing providers may change because of quality, cost, region, reliability, or legal requirements. Exposing provider-specific models throughout the codebase would create lock-in and inconsistent behaviour.

## Decision

Define domain-owned interfaces for external providers. Provider adapters translate external requests and responses into stable internal types. Public APIs never expose raw provider payloads.

## Consequences

- Providers can be replaced or compared without rewriting domain logic.
- Provider-specific capabilities remain isolated.
- Contract tests are required for every adapter.
- The abstraction must remain narrow and based on proven use cases rather than pretending all providers are identical.
