# Initial Data Model

## Tenant hierarchy

- `users`
- `organisations`
- `organisation_memberships`
- `roles`
- `projects`
- `environments` (`test`, `live`)

Every organisation-owned record carries `organisation_id`. Project-scoped records also carry `project_id`; environment-specific records carry `environment_id`.

## Access and integration

- `api_keys`: prefix, hashed secret, scopes, status, last-used timestamp, expiry, project and environment
- `webhook_endpoints`: URL, encrypted secret, subscribed events, status
- `webhook_deliveries`: event, attempt, response metadata, next retry, terminal status
- `audit_logs`: actor, action, resource, tenant, metadata, request and trace identifiers

## Documents and parsing

- `documents`: tenant ownership, source metadata, detected MIME, size, page count, checksum, sensitivity class, storage object reference, retention deadline, deletion status
- `parse_jobs`: requested type, detected type, schema version, pipeline version, status, attempts, timings, terminal error
- `parse_results`: immutable result version, provider/model/prompt/OCR versions, raw structured output reference, validation summary, final status
- `field_results`: field path, raw value, normalised value, provenance, confidence, review state, validation state
- `field_evidence`: page, source text, character offsets or bounding box, extraction method, evidence confidence
- `parse_warnings`: code, severity, field path, explanation, review requirement

## Schemas and configuration

- `document_schemas`
- `document_schema_versions`
- `prompt_versions`
- `pipeline_versions`
- `confidence_policies`
- `normalisation_rule_versions`

Released public schema versions are immutable.

## Review and correction

- `review_tasks`: reason, priority, assignment, SLA, status
- `corrections`: original value, corrected value, reason, reviewer, accepted timestamp
- `review_events`: assignment, decision, escalation, rejection, completion

Corrections never overwrite the original field result.

## Evaluation and improvement

- `evaluation_datasets`
- `evaluation_dataset_versions`
- `evaluation_documents`
- `expected_results`
- `evaluation_runs`
- `evaluation_metrics`
- `candidate_training_examples`

Customer corrections are not automatically included in datasets. Inclusion requires permission and approval.

## Usage and billing

- `usage_records`: organisation, project, environment, document, pages, provider units, cost estimate, billable event key
- `plans`
- `subscriptions`
- `entitlements`
- `billing_events`

Internal usage records are the source of truth; provider billing events are reconciled against them.

## Required indexes

At minimum:

- tenant and project foreign-key indexes
- unique active API-key prefix constraints
- document checksum and idempotency indexes scoped to tenant/environment
- parse-job status and queue-recovery indexes
- review queue status/priority indexes
- retention deadline indexes
- webhook retry indexes
- audit-log tenant/time indexes

## Deletion model

Deletion is an auditable workflow, not a single row delete. It tracks source objects, previews, OCR artefacts, extracted text, parse results where policy requires, caches, search indexes, and provider-side artefacts. Tombstones may remain only where required for security, legal, or billing integrity.
