# Execution Plans

Substantial work must be planned before implementation. Each plan must be independently reviewable and verifiable.

## Required structure

Every substantial plan must cover:

- Understanding and repository findings
- Material assumptions
- User stories and acceptance criteria
- Architecture, database, and API impact
- Security and privacy impact
- UX states
- Expected files
- Test strategy
- Risks, rollback, and dependencies
- Exact verification commands and results
- Final review, limitations, and remaining work

Never mark an unexecuted check as passed.

## Plan index

- Phase 0 — foundation and architecture: completed and merged in pull request #1
- Phase 1 — foundation scaffold: `docs/plans/phase-1-foundation-scaffold.md`
- Phase 1 — auth, tenant access, and API keys: `docs/plans/phase-1-auth-tenant-access.md`

## Active plan

Phase 1 now focuses on access-control foundations: shared role and permission policy, tenant-bound API-key records, API-key hashing and scope primitives, audit-log structure, and local/test-only request context resolution.

This phase still does not implement document ingestion, parsing, OCR, AI extraction, billing, production authentication, or customer-facing onboarding.

## Current increment

- Phase 1 production authentication adapter: `docs/plans/phase-1-production-auth-adapter.md`
- Scope remains security infrastructure only.
- Document ingestion, uploads, parsing, OCR, AI extraction, billing, webhooks, SDKs, and review workflows remain out of scope for this PR.
