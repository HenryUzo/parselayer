# ParseLayer

ParseLayer is a production-grade, multi-tenant AI document intelligence platform for classifying documents and extracting evidence-backed structured data through a web application and versioned developer API.

## Initial document types

- CV or resume
- Cover letter
- Job description
- Government-issued identification document

## Project status

Phase 1 is active. The repository now contains the engineering foundation for the web application, API, worker process, PostgreSQL, Redis, local S3-compatible storage, typed environment configuration, CI, and the initial tenant data model.

Document ingestion, AI extraction, OCR, external authentication, billing, and production queue processors are not implemented yet.

## Repository structure

- `apps/web` — Next.js product application
- `apps/api` — NestJS API using Fastify
- `apps/worker` — NestJS background-worker process
- `packages/config` — typed and validated environment configuration
- `packages/database` — Prisma schema, migrations, generated client, and database factory
- `packages/domain` — provider-independent domain constants and types
- `infra/local` — local infrastructure initialization
- `docs` — product, architecture, security, execution, and operating documentation

## Technology foundation

- pnpm workspaces and Turborepo
- TypeScript strict mode
- Next.js and React
- NestJS with Fastify
- PostgreSQL with Prisma
- Redis and BullMQ
- MinIO for local S3-compatible storage
- GitHub Actions CI
- Vitest and Playwright foundations

Architecture decisions are recorded in `docs/decisions/`.

## Local development

Prerequisites:

- Node.js 22
- pnpm 11.9.0
- Docker with Docker Compose

Setup:

```bash
cp .env.example .env
pnpm install
pnpm infra:up
pnpm db:generate
pnpm db:migrate
pnpm dev
```

Default endpoints:

- Web: `http://localhost:3000`
- API: `http://localhost:3001`
- API health: `http://localhost:3001/health`
- MinIO console: `http://localhost:9001`

See `docs/getting-started.md` for full instructions.

## Quality commands

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm test:integration
pnpm build
```

## Current provider decisions

- Production deployment target: AWS, with optional Vercel hosting for the web application
- Database: PostgreSQL
- Object storage: AWS S3
- Initial AI provider: OpenAI behind an internal provider interface
- Initial OCR provider: AWS Textract behind an internal provider interface
- Authentication: Clerk for identity; application authorization remains internal
- Billing: Paddle, subject to legal-entity and settlement validation
- Initial language: English
- Initial countries: Nigeria, United Kingdom, United States, and Canada
- Private beta target: 31 October 2026

## Important product boundary

Government-ID support at launch means data extraction only. It does not imply identity verification, authenticity verification, fraud detection, liveness detection, face matching, or regulatory KYC compliance.
