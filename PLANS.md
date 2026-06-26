# Execution Plans

Substantial work must be planned before implementation. Each plan should be small enough to review and verify independently.

## Required plan structure

### Understanding

- Problem being solved
- Repository findings
- Existing patterns to preserve
- Gaps, risks, and constraints

### Assumptions

List only material assumptions that affect architecture, privacy, cost, business rules, or user experience.

### User stories

State the actors, goals, and expected outcomes.

### Acceptance criteria

Use observable, testable statements. Include negative and permission cases.

### Architecture impact

Describe affected modules, boundaries, dependencies, queues, providers, and deployment units.

### Database impact

Describe entities, migrations, indexes, compatibility, backfills, and rollback limitations.

### API impact

Describe endpoints, schemas, events, idempotency, errors, pagination, authorization, and versioning.

### Security and privacy impact

Describe threats, data classification, access control, logging, retention, deletion, provider exposure, and abuse controls.

### UX states

Cover initial, loading, empty, partial, success, validation, permission, network, processing, retry, rate-limit, and deletion states relevant to the work.

### Files expected to change

List expected files and explain their responsibility. Update the list when implementation differs.

### Test strategy

List unit, integration, end-to-end, contract, accessibility, performance, security, and evaluation tests.

### Risks and rollback

Explain failure modes, feature flags, data compatibility, rollback steps, and irreversible changes.

### Dependencies

List external services, prior plans, credentials, fixtures, legal decisions, and unresolved requirements.

### Verification

Record exact commands run, results, warnings, and manual checks. Never mark an unrun check as passed.

### Review

Summarize what changed, why, known limitations, security and performance considerations, and remaining work.

---

# Active Plan: Phase 0 Foundation and Architecture

## Understanding

The repository contains only an initial README. It has no application code, workspace configuration, enforceable repository rules, architecture decisions, data model, API conventions, threat model, testing strategy, or delivery plan. The immediate goal is to establish a coherent foundation before scaffolding production code.

## Assumptions

- The approved working name is ParseLayer.
- The first release supports resumes, cover letters, job descriptions, and government-ID extraction.
- English is the launch language.
- Initial countries are Nigeria, the UK, the US, and Canada.
- AWS is the production target, with optional Vercel hosting for the web application.
- OpenAI, AWS Textract, Clerk, and Paddle are initial providers behind internal interfaces.
- Government-ID capability is extraction only.

## Acceptance criteria

- Root repository rules are explicit and enforceable.
- Required Phase 0 documents exist and agree with one another.
- Architecture uses a modular monolith plus independent workers, not premature microservices.
- Tenant, project, and environment boundaries are explicit in the initial data model.
- API, queue, webhook, evidence, confidence, correction, retention, and audit rules are documented.
- Threats and mitigations are identified before implementation.
- Quality gates exist for every roadmap phase.
- At least the core architecture decisions are recorded as ADRs.
- No production feature implementation is included in this plan.

## Architecture impact

Documentation only. The plan defines the future boundaries for `web`, `api`, `worker`, shared domain packages, schemas, database, SDKs, and provider adapters.

## Database impact

No migration is created in Phase 0. The initial conceptual model will inform the first Prisma schema in Phase 1.

## API impact

No endpoint is implemented. Initial `/v1` resource conventions and asynchronous processing patterns are defined.

## Security and privacy impact

Phase 0 establishes data classification, tenant isolation, upload security, prompt-injection handling, provider controls, retention, deletion, and audit requirements.

## Files expected to change

- `README.md`
- `AGENTS.md`
- `PLANS.md`
- `docs/*.md`
- `docs/decisions/*.md`

## Test strategy

Documentation consistency review only. Code checks are not applicable until workspace scaffolding exists.

## Risks and rollback

The main risk is documenting an architecture that becomes inconsistent with implementation. Mitigation: ADRs and implementation documents must be updated in the same pull request as material architectural changes.

## Dependencies

- Product owner approval of Phase 0 documents
- Legal validation of Paddle availability and government-ID data handling
- Representative, permissioned evaluation datasets
- Confirmed budget and infrastructure limits

## Verification

- Confirm every required document exists on the Phase 0 branch.
- Check links and terminology across documents.
- Review for unsupported product claims.
- Review that no secrets or personal documents were added.

## Review

After approval, Phase 1 begins with workspace scaffolding, CI, typed configuration, local infrastructure, authentication boundary, organisation/project foundations, and design-system primitives.