# Phase 1 Execution Plan: Foundation Scaffold

## Understanding

The approved Phase 0 architecture existed without an executable workspace, CI pipeline, local infrastructure, typed configuration, application shell, worker, or database schema.

## Scope

This plan creates the minimum coherent engineering foundation for later authentication, tenant authorization, secure ingestion, and processing work. It does not implement document uploads, parsing, AI calls, billing, or production authentication.

## Acceptance criteria

- pnpm and Turborepo manage the workspace.
- TypeScript strict mode applies across all workspaces.
- Next.js web, NestJS/Fastify API, and NestJS worker build independently.
- PostgreSQL, Redis, and private S3-compatible local storage are configured through Docker Compose.
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

Adds secret-safe environment validation, log redaction, isolated local service credentials, private object-storage setup, an explicit native dependency build-script allow-list, frozen dependency resolution, and read-only CI permissions. No personal documents or external provider credentials are included.

## Test strategy

Run formatting, linting, strict type checking, unit tests, Prisma generation, schema validation, PostgreSQL migration deployment, integration-test commands, and production builds. External providers remain excluded from ordinary CI.

## Rollback

The scaffold is isolated on a feature branch. It can be reverted without data migration impact before deployment. Once the initial migration is deployed, later changes must use additive migrations rather than editing migration history.

## Verification results

Completed on 26 June 2026.

Local verification:

- Dependency installation and lockfile generation passed through the controlled package mirror.
- The native build-script allow-list covers Prisma engines, Prisma, esbuild, Sharp, and msgpackr extraction.
- Formatting passed.
- Linting passed for all six workspaces.
- Strict type checking passed for all six workspaces.
- Five unit tests passed across configuration, API health, and worker runtime.
- The integration-test command passed with no integration fixtures yet.
- Prisma client generation and schema validation passed.
- Production builds passed for config, domain, database, API, worker, and web.
- Web runtime checks passed for `/` and `/api/health`.
- API runtime checks passed for `/v1`, `/health`, and `/ready`.

GitHub Actions verification:

- GitHub-hosted runner allocation passed after the account billing lock was resolved.
- Frozen lockfile installation passed.
- Repository formatting passed.
- Prisma client generation and schema validation passed.
- The initial migration deployed successfully to a PostgreSQL 16 service container.
- Linting and strict type checking passed.
- Unit tests and the integration-test command passed.
- The complete production build passed.

Not included in this phase:

- End-to-end startup of the complete local Docker Compose stack with Redis and MinIO.
- Real queue, object-storage, authentication, OCR, AI, and billing provider tests.
- Tenant-isolation tests, which require the application authorization and persistence services introduced in the next foundation increment.

## Review

The scaffold now has strict package boundaries, explicit native dependency approval, a committed lockfile, tenant-aware database foundations, secret-safe configuration validation, private local object-storage defaults, independently buildable deployment units, and a green PostgreSQL-backed CI pipeline. No product feature is represented as complete.
