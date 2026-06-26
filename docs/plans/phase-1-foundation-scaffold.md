# Phase 1 Execution Plan: Foundation Scaffold

## Understanding

The approved Phase 0 architecture exists, but no executable workspace, CI pipeline, local infrastructure, typed configuration, application shell, worker, or database schema exists.

## Scope

This plan creates the minimum coherent engineering foundation for later authentication, tenant authorization, secure ingestion, and processing work. It does not implement document uploads, parsing, AI calls, billing, or production authentication.

## Acceptance criteria

- pnpm and Turborepo manage the workspace.
- TypeScript strict mode applies across all workspaces.
- Next.js web, NestJS/Fastify API, and NestJS worker build independently.
- PostgreSQL, Redis, and private S3-compatible local storage start through Docker Compose.
- Environment variables are typed and validated without exposing values in errors.
- Prisma models establish users, organisations, memberships, projects, and test/live environments.
- CI runs formatting, linting, type checking, unit tests, integration-test placeholders, migration deployment, and production builds.
- Health endpoints exist for web and API.
- No placeholder is presented as a complete product capability.

## Architecture impact

Creates the planned deployment units and shared `config`, `domain`, and `database` packages. Queue processors remain deliberately unimplemented until the processing phase.

## Database impact

Creates the first Prisma schema and migration for tenant foundations. Every project and environment carries an explicit organisation boundary.

## API impact

Adds only metadata and health/readiness endpoints. Public document endpoints are not implemented.

## Security and privacy impact

Adds secret-safe environment validation, log redaction, isolated local service credentials, private object-storage setup, and CI secret discipline. No personal documents or external provider credentials are included.

## Test strategy

Run formatting, linting, strict type checking, unit tests, Prisma generation, migration validation, and production builds. Docker-dependent runtime checks remain manual where Docker is unavailable.

## Rollback

The scaffold is isolated on a feature branch. It can be reverted without data migration impact before deployment. Once the initial migration is deployed, later changes must use additive migrations rather than editing migration history.

## Verification results

Executed locally on 26 June 2026:

- Dependency installation and lockfile generation: passed through the controlled package mirror.
- Supply-chain build-script allow-list: configured for Prisma engines, Prisma, esbuild, Sharp, and msgpackr extraction.
- `pnpm format:check`: passed.
- `pnpm lint`: passed for all six workspaces.
- `pnpm typecheck`: passed for all six workspaces.
- `pnpm test`: passed; five tests across configuration, API health, and worker runtime.
- `pnpm test:integration`: command passed with no integration fixtures yet.
- Prisma client generation: passed.
- Prisma schema validation: passed.
- Individual production builds for config, domain, database, API, worker, and web: passed.
- Next.js production route generation: passed for `/`, `/_not-found`, and `/api/health`.

Not executed locally:

- Docker Compose service startup and migration deployment, because Docker and PostgreSQL clients are unavailable in the execution environment.
- Real queue, object-storage, authentication, OCR, and AI provider tests, because those capabilities are deliberately outside this scaffold.

GitHub Actions created workflow runs but failed before exposing executable step logs. The pull request remains a draft until repository Actions execution is available or an equivalent independent CI run passes.

## Review

The scaffold now has strict package boundaries, explicit native dependency approval, a locally generated lockfile, a tenant-aware initial schema, secret-safe configuration validation, private local object-storage defaults, and independently buildable deployment units. The lockfile still needs to be committed before the pull request can leave draft status. No product feature is represented as complete.
