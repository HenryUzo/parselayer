# Phase 1 Execution Plan: Production Authentication Adapter

## Understanding

The repository already includes the Phase 1 scaffold, shared role policy, tenant-bound API-key primitives, additive auth-related tables, and a local/test-only access-context diagnostic path. Production authentication is still missing. This increment introduces a production-safe authentication boundary that can verify Clerk-backed request identity through an adapter, resolve ParseLayer-owned auth context from the application database, and enforce organisation membership and permissions in the API layer.

This plan intentionally excludes document ingestion, uploads, parsing, OCR, AI extraction, billing, webhooks, SDKs, and review workflows. This PR is security infrastructure only.

## Scope

In scope:

- Add ParseLayer-owned auth context types in the domain layer without leaking Clerk-specific types.
- Add an API auth module that resolves request-scoped auth context for both production and local/test flows.
- Keep local/test header auth available only in `local` and `test`.
- Add provider-adapter interfaces and a Clerk-backed session verifier implementation boundary.
- Load users from `users.external_auth_id` and memberships from `organisation_memberships`.
- Derive permissions from the shared role policy in `packages/domain/src/access.ts`.
- Add guards and decorators for required auth, organisation access, and permissions.
- Keep a diagnostic endpoint for resolved auth context, but ensure it remains safe for local/test use.
- Add tests for auth resolution, environment gating, membership enforcement, and permission enforcement.

Out of scope:

- Document ingestion, uploads, parsing, OCR, AI extraction, billing, webhooks, SDKs, review workflows, and UI onboarding.
- API-key authentication beyond preserving room for later extension.
- Storing Clerk secrets in source control or exposing provider payloads publicly.

## Acceptance criteria

- Production requests can resolve an authenticated ParseLayer auth context from a verified provider identity plus database membership lookup.
- The API depends on ParseLayer-owned auth types instead of Clerk payload types.
- Local/test header auth continues to work only in `local` and `test`, and remains blocked in `staging` and `production`.
- Unauthenticated requests are rejected by required-auth guards.
- Authenticated users without organisation membership are rejected.
- Permission guards reject actors missing required permissions.
- Cross-tenant access is rejected through organisation checks.
- Provider-specific logic is isolated behind a narrow verifier interface.
- Tests cover the new auth context resolution path, permission enforcement, organisation enforcement, and environment gating.
- CI-quality commands remain green.

## Architecture impact

This change introduces a dedicated `apps/api/src/auth` module and shifts request auth handling away from the current local-header-only access module. Domain-owned auth context types will become the stable boundary consumed by guards, decorators, and controllers. Provider verification remains adapter-scoped so that future provider changes do not leak across the codebase.

## Database impact

No schema change is expected if the current `users` and `organisation_memberships` tables are sufficient. This increment reads existing `users.external_auth_id` and membership records to resolve request context. If implementation reveals a required schema adjustment, it must remain additive and receive an explicit migration plus rollback note.

## API impact

- Add a production auth module under `apps/api/src/auth`.
- Keep request-scoped auth context on the request object.
- Introduce required-auth, optional-auth, required-organisation, and required-permission enforcement primitives.
- Preserve a safe diagnostic access-context endpoint for local/test verification.
- Do not add document, upload, or parsing endpoints.

## Security and privacy impact

- Frontend claims are not trusted for authorization decisions.
- Clerk only verifies user identity; ParseLayer decides organisation membership, role, and permissions from its own database.
- Raw session tokens, cookies, payloads, or provider errors must not be exposed in logs or public API responses.
- Local/test header auth stays environment-gated and unavailable in `staging` and `production`.
- Secrets remain configuration-only and must not be committed.

## UX states

This increment is primarily backend infrastructure, but the API behaviour must support these states for future consumers:

- unauthenticated
- authenticated without membership
- authenticated with membership
- forbidden due to missing permission
- forbidden due to cross-tenant access
- local/test diagnostic success
- local/test diagnostic blocked outside allowed environments

## Expected files

- `docs/plans/phase-1-production-auth-adapter.md`
- `PLANS.md`
- `packages/domain/src/access.ts`
- `packages/domain/src/index.ts`
- `packages/domain/test/*.test.ts`
- `apps/api/src/auth/*`
- `apps/api/src/access/*` if the diagnostic endpoint is migrated or narrowed
- `apps/api/src/app.module.ts`
- `apps/api/test/*.test.ts`
- `.github/workflows/ci.yml` only if verification needs fixture-safe environment additions

## Test strategy

Planned verification:

- `pnpm format:check`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm test:integration`
- `pnpm build`
- `pnpm db:generate`
- `pnpm db:validate`

Tests should cover:

- domain auth-context and permission derivation behaviour
- local/test header auth gating by environment
- provider-auth resolution with verifier fakes
- missing user and missing membership rejection
- permission guard behaviour
- organisation guard behaviour

## Risks and rollback

Main risks:

- accidentally coupling API logic to Clerk-specific types
- accidentally trusting provider claims for tenant authorization
- breaking local/test diagnostics relied on by current tests
- leaking provider error detail into responses or logs

Rollback approach:

- revert the auth module and request-context wiring
- restore the prior local/test-only auth path if necessary
- no data rollback is expected unless a later schema change is introduced

## Verification results

Updated on 27 June 2026.

- Branch created: `phase-1-production-auth-adapter`
- `pnpm --filter @parselayer/config build`: passed
- `npx prisma generate` in `packages/database`: passed after elevated network access for Prisma engine download
- direct TypeScript builds passed for `packages/domain`, `packages/database`, and `apps/api`
- direct API typecheck passed: `apps/api` `tsc -p tsconfig.json --noEmit`
- direct API unit tests passed: `apps/api` `vitest run`
- direct domain unit tests passed: `packages/domain` `vitest run`
- touched-package lint passed:
  - `pnpm --filter @parselayer/api lint`
  - `pnpm --filter @parselayer/domain lint`
  - `pnpm --filter @parselayer/config lint`
- direct API build passed: `apps/api` `tsc -p tsconfig.build.json`
- repo-wide `pnpm format:check` is not green because the repository already has Prettier drift across 81 files outside this PR
- repo-wide `pnpm db:validate` hits a sandboxed Prisma engine download check without elevated network access
- repo-wide Turbo `pnpm test` is not reliable in this Windows sandbox because unrelated packages hit Vitest fork `EPERM` errors
- repo-wide Turbo `pnpm lint` is blocked by the database package build script re-running Prisma generation under the same sandbox restrictions

## Review

Planned review focus:

- provider boundary remains narrow and replaceable
- auth context is ParseLayer-owned
- organisation membership and permissions come from the database plus shared role policy
- no out-of-scope upload or parsing work appears in the PR
- logs and errors avoid credential or provider-payload leakage
