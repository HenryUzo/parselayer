# Security and Privacy

## Data classes

- Public: marketing and public documentation
- Internal: operational metadata without document contents
- Confidential: customer documents, extracted personal data, API logs, and billing metadata
- Highly sensitive: government-ID data, authentication secrets, API keys, and webhook secrets

## Required controls

- TLS in transit and encryption at rest
- private object storage with short-lived access URLs
- file type, size, page-count, MIME, and file-signature validation
- upload quarantine and security scanning
- tenant-scoped authorization in API, service, and persistence layers
- hashed API keys with one-time secret display
- encrypted provider and webhook secrets
- least-privilege service identities
- structured log redaction
- configurable retention and auditable deletion
- rate limits, quotas, and abuse controls
- secure headers, content security policy, and CSRF protection where applicable
- dependency, secret, and container checks

## Threat model summary

### Untrusted files

Uploaded files may be malformed, disguised, oversized, password-protected, or harmful. Enforce limits, quarantine, scanning, and isolated parsers before processing.

### Instructions inside documents

Document text is data, not authority. It cannot override extraction rules. Use fixed system instructions, constrained schemas, and deterministic validation.

### Cross-tenant access

Scope every tenant query, enforce service-level policy, use opaque identifiers, and maintain negative isolation tests.

### Stolen credentials

Hash API keys, scope them narrowly, support expiry, rotation, and revocation, rate-limit use, and audit access.

### Forged webhooks

Sign payloads, include timestamps and event IDs, use timing-safe verification, rotate secrets, and reject replayed requests.

### Storage and log exposure

Block public object access, restrict infrastructure identities, redact sensitive fields, and never log full document contents, ID numbers, keys, or provider payloads.

### Processing abuse

Use queue validation, limited retries, dead-letter handling, backpressure, concurrency controls, document limits, and cost caps.

### Provider exposure

Send only required content, document provider retention settings, separate environments, and disable training use by default.

## Government-ID rules

- mask sensitive values by default
- use shorter retention periods
- restrict review and download permissions
- record enhanced access audits
- review processing regions and provider terms
- make no identity-verification, authenticity, fraud, liveness, or KYC claims

## Production readiness

Before production, define incident ownership, severity levels, containment, key rotation, notification criteria, evidence handling, and post-incident review.
