# Observability

## Required signals

- structured logs
- request, correlation, parse, and trace IDs
- application and queue metrics
- distributed traces where useful
- error monitoring
- provider latency, failures, and cost
- webhook delivery metrics
- storage and deletion metrics
- evaluation metrics

## Logging rules

Logs use allow-listed structured fields. Never log full document contents, API keys, webhook secrets, ID numbers, signed URLs, or raw provider payloads.

## Initial dashboards

- API availability and latency
- parse acceptance and completion rates
- queue depth and age
- worker failures and retries
- OCR and AI provider performance
- cost per page and successful parse
- review queue age and correction rate
- webhook success and retry rate
- storage growth and retention backlog
- authentication and authorization anomalies

## Alerts

Alert on elevated parse failures, growing queue backlog, worker crashes, provider outages, high latency, unexpected cost, webhook failures, storage errors, deletion backlog, authentication abuse, and suspected cross-tenant access.

## Service-level objectives

Before beta, define measurable targets for API availability, parse acceptance latency, processing latency by page count, successful parse rate, webhook delivery, and maximum review-queue age.

## Release correlation

Every deploy and parse result records the application release, schema version, prompt version, model version, OCR version, and pipeline version so regressions can be investigated and rolled back.