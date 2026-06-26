# ADR 0001: Modular Monolith with Independent Workers

- Status: Accepted
- Date: 2026-06-26

## Context

ParseLayer needs strong domain consistency, multi-tenant authorization, durable asynchronous processing, and independent scaling for document workloads. The initial team is small and premature service separation would increase operational and testing cost.

## Decision

Use a modular monolith for the API and domain, plus separately deployable worker applications that consume durable queues. Modules own clear domain boundaries but initially share the same PostgreSQL system of record and versioned contracts.

## Consequences

- Domain rules remain centralized and easier to test.
- API and workers can scale independently.
- Queue boundaries make long-running work asynchronous.
- Modules must avoid circular dependencies and direct cross-module persistence access.
- A module may become a service later only when scale, ownership, security, or reliability evidence justifies it.