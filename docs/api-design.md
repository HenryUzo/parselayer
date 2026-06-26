# API Design

## Conventions

- Base path: `/v1`
- JSON request and response bodies
- OpenAPI is the contract source for public endpoints
- Stable error envelope with machine-readable code, message, request ID, and optional field errors
- Cursor pagination for large collections
- ISO 8601 UTC timestamps
- Explicit test and live environments
- API-key scopes and project/environment binding

## Initial resources

- `POST /v1/upload-intents`
- `POST /v1/documents/{document_id}/complete-upload`
- `GET /v1/documents/{document_id}`
- `DELETE /v1/documents/{document_id}`
- `POST /v1/parse-jobs`
- `GET /v1/parse-jobs/{parse_job_id}`
- `POST /v1/parse-jobs/{parse_job_id}/retries`
- `GET /v1/parse-results/{parse_result_id}`
- `GET /v1/document-types`
- `GET /v1/schemas/{schema_name}/versions/{version}`
- `GET|POST|PATCH|DELETE /v1/webhook-endpoints`
- `GET /v1/webhook-deliveries`
- `POST /v1/webhook-deliveries/{delivery_id}/resend`
- `GET /v1/usage`
- `GET /v1/request-logs`
- `GET /health`
- `GET /ready`

## Asynchronous parsing

Creating a parse job returns `202 Accepted` with a resource URL and status. Ordinary requests do not wait for OCR or AI processing to finish.

## Idempotency

Mutation endpoints that can create chargeable or duplicate work accept `Idempotency-Key`. Keys are scoped to organisation, project, environment, endpoint, and authenticated principal. Replays return the original compatible response.

## Status model

Non-terminal examples: `accepted`, `queued`, `scanning`, `extracting_text`, `ocr`, `classifying`, `extracting_fields`, `validating`, `awaiting_review`, `retrying`.

Terminal examples: `completed`, `completed_with_warnings`, `failed`, `rejected`, `cancelled`, `deleted`.

## Errors

Public errors never expose provider payloads, stack traces, storage keys, or sensitive document content. Expected categories include authentication, permission, validation, unsupported file, malware, corrupted file, password-protected file, page/size limit, rate limit, provider unavailable, processing failure, and deleted resource.

## Webhooks

- Signed with a rotating secret
- Timestamped and replay-resistant
- Delivered at least once
- Exponential retry with jitter
- Delivery attempts are inspectable
- Manual resend is supported
- Consumers must deduplicate by event ID

## Versioning

Breaking API changes require a new API version. Breaking document-output changes require a new schema version. Released schema versions are not silently modified.