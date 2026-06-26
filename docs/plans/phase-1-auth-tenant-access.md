# Phase 1 Execution Plan: Auth, Tenant Access, and API Keys

## Understanding

The Phase 1 scaffold is merged. The repository has deployable web, API, worker, database, and CI foundations, but it still lacks enforceable access rules. The next increment must establish authentication context contracts, organisation membership policy, tenant-bound resources, API-key primitives, and database records before document ingestion begins.

## Scope

This increment creates the access-control foundation only. It does not implement Clerk sign-in, production sessions, public API-key management UI, document upload, parsing, OCR, AI extraction, billing, or customer-facing onboarding.

## Acceptance criteria

- Membership roles and permissions are defined in a shared domain policy.
- API-key secrets can be generated, prefixed, hashed, and verified without storing raw secrets.
- API-key scopes can be checked deterministically.
- Prisma records exist for API keys and audit logs with explicit organisation boundaries.
- API keys are project and environment scoped.
- Local/test-only request context resolution exists for development and tests without pretending to be production authentication.
- Production requests cannot use local header authentication.
- The API exposes a guarded diagnostic access-context endpoint for local/test verification only.
- Unit tests cover role permissions, tenant checks, API-key hashing, API-key scopes, and local/test request context resolution.
- CI remains green with frozen dependency resolution and PostgreSQL migration deployment.

## Architecture impact

Adds shared domain policy primitives and an API access module. The API access module intentionally depends on request context and local/test headers only; Clerk and production session verification are planned as separate adapters.

## Database impact

Adds `api_keys` and `audit_logs` tables plus an `ApiKeyStatus` enum. API keys reference organisation, project, environment, and optional creator. Audit logs may reference a user or API key actor. The migration is additive.

## API impact

Adds `GET /v1/access/context` for local/test development diagnostics. It is blocked in staging and production. No customer-facing auth or API-key management endpoint is added yet.

## Security and privacy impact

Raw API-key secrets are never persisted. Only a prefix and SHA-256 hash are stored. Scope checks are explicit. Local header auth is environment-gated and unavailable outside `local` and `test`. Audit-log structure is introduced without storing sensitive payloads.

## UX states

No user-facing UX is added. Later UI work must cover invite, role change, API-key creation, copy-once secret display, revoke, expired key, unauthorized, forbidden, and tenant-switching states.

## Expected files

- `packages/domain/src/access.ts`
- `packages/domain/src/api-keys.ts`
- `packages/domain/src/index.ts`
- `packages/domain/test/*.test.ts`
- `packages/database/prisma/schema.prisma`
- `packages/database/prisma/migrations/*/migration.sql`
- `apps/api/src/access/*`
- `apps/api/src/app.module.ts`
- `apps/api/test/*.test.ts`
- `docs/plans/phase-1-auth-tenant-access.md`
- `PLANS.md`

## Test strategy

Run repository formatting, linting, strict type checking, domain unit tests, API unit tests, Prisma generation, schema validation, PostgreSQL migration deployment, integration-test command, and production builds.

## Risks and rollback

The migration is additive. Before production data exists, rollback can remove `api_keys`, `audit_logs`, and `ApiKeyStatus`. After API keys exist, revocation and audit integrity must be preserved before destructive rollback.

## Verification results

Pending CI.

## Review

Pending implementation and CI verification.
