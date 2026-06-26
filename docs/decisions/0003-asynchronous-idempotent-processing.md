# ADR 0003: Asynchronous and Idempotent Document Processing

- Status: Accepted
- Date: 2026-06-26

## Context

OCR and AI extraction can take seconds or minutes, fail transiently, and incur usage cost. Holding ordinary HTTP requests open would be unreliable and would make retries capable of duplicating work or billing.

## Decision

Document processing is asynchronous. The API accepts work, creates durable records, and enqueues idempotent jobs. Clients poll status resources or consume signed webhook events. Every stage has explicit non-terminal and terminal states, safe retry rules, and deduplication keys.

## Consequences

- API responsiveness is separated from processing latency.
- Worker concurrency and provider limits can be controlled.
- Clients must handle eventual completion.
- State transitions, job locks, dead-letter handling, idempotent usage recording, and webhook delivery require integration tests.