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
