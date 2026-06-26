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

## Active plan

Phase 1 creates the executable engineering foundation: pnpm/Turborepo workspace, strict TypeScript, Next.js web app, NestJS/Fastify API, worker process, PostgreSQL/Prisma, Redis/BullMQ dependencies, local S3-compatible storage, typed configuration, initial tenant schema, CI, and health endpoints.

This phase does not implement document ingestion, parsing, OCR, AI extraction, billing, or production authentication.
