# Product Requirements

## Product statement

ParseLayer converts uploaded documents into application-ready structured data with source evidence, field-level confidence, deterministic validation, and human correction.

## Primary users

- Developers integrating document parsing
- Recruitment and applicant-tracking platforms
- HR and onboarding products
- Operations reviewers handling uncertain results
- Organisation administrators managing access, usage, billing, and retention
- End users uploading and reviewing documents

## Initial document types

1. Resume or CV
2. Cover letter
3. Job description
4. Government-issued identification document

## Launch scope

- Organisation and project setup
- Test and live environments
- Secure upload and private storage
- Automatic type classification with manual override
- Asynchronous parsing
- Native text extraction with OCR fallback
- Versioned schema-constrained output
- Field evidence and confidence
- Validation, normalisation, warnings, and contradictions
- Human correction and audit history
- Versioned REST API and OpenAPI documentation
- API keys, signed webhooks, usage records, and retention controls
- Basic developer application and operations review interface

## Explicit exclusions at launch

- Identity verification
- Document authenticity verification
- Fraud detection
- Liveness or face matching
- Regulatory KYC certification
- Automatic production learning from customer corrections
- Broad multilingual support
- Support for every government-ID format in target countries

## Critical product rules

- Never present inferred data as directly extracted.
- Every value records provenance: extracted, normalised, calculated, inferred, corrected, missing, or unverified.
- Critical non-null fields require supporting evidence where technically possible.
- Low-confidence critical fields enter review according to configurable policy.
- Original results remain preserved after correction.
- Customer documents are excluded from model training by default.
- Test and live environments remain logically and operationally separated.

## Initial constraints

- Maximum default file size: 25 MB
- Maximum general page count: 50 pages
- English only at launch
- Initial countries: Nigeria, United Kingdom, United States, and Canada
- Private beta target: 31 October 2026

Limits are configurable by plan, organisation, environment, and document type.

## Success metrics

Measure by document type and field:

- classification accuracy
- exact and normalised match accuracy
- precision, recall, and F1
- hallucination rate
- evidence accuracy
- human-review rate
- correction rate
- parse success rate
- processing latency
- cost per page and successful parse
- webhook delivery success
- tenant-isolation and security incidents

## Commercial readiness criteria

The product is not commercially ready until secure deletion, usage reconciliation, access audits, staging verification, incident response, provider failure handling, load testing, billing entitlements, and support procedures are operational.
