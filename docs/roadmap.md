# Roadmap

## Phase 0: Discovery and architecture

Deliver product requirements, architecture, data model, API conventions, AI strategy, evaluation framework, threat model, design direction, deployment model, testing strategy, observability plan, ADRs, and the first execution plan.

Quality gate: documents agree, boundaries are explicit, unsupported claims are removed, and the product owner approves the foundation.

## Phase 1: Foundation

Set up the monorepo, strict TypeScript, CI, validated configuration, local PostgreSQL/Redis/storage, application shells, authentication integration, organisations, memberships, projects, environments, authorization policies, logging, error handling, and design-system primitives.

Quality gate: build, lint, typecheck, unit/integration tests, tenant-isolation tests, and staging deployment pass.

## Phase 2: Secure document ingestion

Implement upload intents, private storage, file validation, scanning, document records, limits, retention, and deletion workflow.

Quality gate: harmful/unsupported files are rejected, storage is private, deletion is auditable, and upload abuse tests pass.

## Phase 3: Processing pipeline

Implement queues, workers, native extraction, OCR fallback, classification, schema selection, structured extraction, validation, normalisation, evidence, confidence, warnings, retry, and dead-letter handling.

Quality gate: idempotency, state transitions, provider failures, cost limits, and baseline evaluation meet approved thresholds.

## Phase 4: Review experience

Implement viewer, split review, evidence highlights, corrections, review queues, assignment, escalation, and audit history.

Quality gate: critical workflows pass accessibility, responsive, permission, and end-to-end tests.

## Phase 5: Developer platform

Implement API keys, logs, playground, schema explorer, webhooks, usage, OpenAPI docs, TypeScript/Python SDK foundations, and integration guides.

Quality gate: examples run, signatures verify, scopes isolate access, and webhook retry/replay tests pass.

## Phase 6: Evaluation and improvement

Implement private datasets, evaluation runner, metric dashboards, configuration registry, comparisons, controlled rollout, correction analysis, and rollback.

Quality gate: regression gates are enforced and production changes are reproducible.

## Phase 7: Commercial readiness

Implement billing, plans, entitlements, administration, operational dashboards, load testing, incident procedures, compliance preparation, staging validation, and production release controls.

Quality gate: security review, recovery test, billing reconciliation, operational runbooks, load targets, and production checklist pass.
