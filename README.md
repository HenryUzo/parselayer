# ParseLayer

ParseLayer is a production-grade, multi-tenant AI document intelligence platform for classifying documents and extracting evidence-backed structured data through a web application and versioned developer API.

## Initial document types

- CV or resume
- Cover letter
- Job description
- Government-issued identification document

## Project status

Phase 0 — discovery, product definition, architecture, security planning, and execution planning.

No production feature implementation should begin until the Phase 0 architecture and first execution plan have been reviewed.

## Planned architecture

- TypeScript monorepo using pnpm workspaces and Turborepo
- Next.js web application
- NestJS API using Fastify
- PostgreSQL with Prisma
- Redis and BullMQ for durable asynchronous processing
- S3-compatible private object storage
- OpenAPI-based public API
- Separate background worker applications
- Provider adapters for AI, OCR, storage, malware scanning, authentication, and billing

The final architecture and technology decisions are recorded in `docs/` and `docs/decisions/`.

## Repository documentation

- `AGENTS.md` — enforceable repository working rules
- `PLANS.md` — execution-plan format and active plans
- `docs/product-requirements.md` — approved product scope and exclusions
- `docs/system-architecture.md` — target system architecture
- `docs/data-model.md` — initial multi-tenant data model
- `docs/api-design.md` — versioned API conventions and initial endpoints
- `docs/ai-extraction-strategy.md` — extraction, confidence, evidence, and review strategy
- `docs/evaluation-framework.md` — quality measurement and regression gates
- `docs/security-and-privacy.md` — threat model and security requirements
- `docs/design-system.md` — interface and accessibility direction
- `docs/deployment.md` — environments and deployment model
- `docs/testing-strategy.md` — automated and manual verification strategy
- `docs/observability.md` — logs, metrics, traces, dashboards, and alerts
- `docs/roadmap.md` — phased delivery roadmap

## Current decisions

The following defaults are provisionally approved:

- Deployment target: AWS, with optional Vercel hosting for the Next.js application
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
