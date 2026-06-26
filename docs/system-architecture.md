# System Architecture

## Architectural style

ParseLayer starts as a modular monolith with independently scalable background workers. This keeps domain rules consistent while allowing document processing to scale separately. Microservices are not justified until operational evidence shows a clear boundary requiring independent ownership or deployment.

## Deployment units

- `web`: Next.js application for product, review, administration, and developer experiences
- `api`: NestJS/Fastify REST API for authentication integration, authorisation, metadata, uploads, results, webhooks, and usage
- `worker`: queue consumers for extraction, OCR, classification, AI extraction, validation, evidence, confidence, review routing, retention, and webhook delivery

## Core modules

- Identity integration
- Organisations and memberships
- Projects and environments
- API keys and scopes
- Documents and storage
- Parse jobs and pipeline orchestration
- Schemas and schema versions
- Field results, evidence, warnings, and provenance
- Review tasks and corrections
- Webhooks and delivery attempts
- Usage and entitlements
- Evaluation datasets and runs
- Audit logs
- Retention and deletion

## Infrastructure

- PostgreSQL as system of record
- Redis for BullMQ, rate-limit coordination, and short-lived caching
- AWS S3 for private object storage
- OpenAI behind an AI provider adapter
- AWS Textract behind an OCR adapter
- Malware scanner behind a scanning adapter
- OpenTelemetry-compatible tracing and metrics

## Processing pipeline

1. Authorise request and enforce plan limits.
2. Create an upload intent and short-lived presigned URL.
3. Validate upload completion, size, MIME type, extension, and file signature.
4. Quarantine and scan for malware.
5. Promote clean content to private storage.
6. Create document and parse-job records transactionally.
7. Enqueue an idempotent processing job.
8. Attempt native text and layout extraction.
9. Route to OCR if quality is insufficient.
10. Classify document type.
11. Select schema and pipeline versions.
12. Run schema-constrained extraction.
13. Validate and normalise fields.
14. Generate evidence and confidence signals.
15. Detect contradictions and warnings.
16. Route critical uncertain fields to review.
17. Store immutable result versions and usage.
18. Dispatch signed webhook events.
19. Apply retention and deletion policies.

## Reliability rules

- Every stage has an idempotency key and explicit status.
- Retries are limited to safe, classified failures.
- Poison jobs move to a dead-letter path.
- Provider timeouts and rate limits do not leave jobs permanently running.
- Billing and usage records are idempotent and reconciled.
- Workers support graceful shutdown and lock renewal.

## Security boundaries

- Browser clients never receive infrastructure credentials.
- Object access uses short-lived, purpose-bound URLs.
- Tenant ownership is checked in service and persistence layers.
- Provider adapters receive only the minimum required content.
- Government-ID access is more restricted and more heavily audited.

## Scaling model

Scale API instances for request load and worker pools by queue depth, document size, provider limits, and cost policy. Separate queues isolate ingestion, OCR, extraction, webhook delivery, retention, and evaluation workloads.