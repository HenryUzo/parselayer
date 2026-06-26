# Evaluation Framework

## Purpose

Evaluation prevents plausible-looking regressions from being shipped. Quality is measured per document type and field, not hidden inside one overall score.

## Dataset design

Maintain private, permissioned, versioned datasets covering:

- digital and scanned PDFs
- images and multi-page files
- different countries, layouts, and date formats
- multi-column resumes and tables
- low-quality scans
- missing and conflicting information
- unsupported and adversarial documents
- prompt-injection content

Do not commit real uncontrolled personal documents to the public repository.

## Required metrics

- classification accuracy
- field precision, recall, and F1
- exact-match accuracy
- normalised-match accuracy
- hallucination rate
- missing-field rate
- evidence correctness and localisation accuracy
- review rate and correction rate
- processing success and failure rate
- latency by page count and stage
- cost per page and successful parse

## Evaluation records

Every run records dataset version, schema version, prompt version, model version, OCR provider/version, pipeline version, normalisation version, confidence policy, environment, timestamp, cost, and duration.

## Regression gates

No model, prompt, OCR, schema, normaliser, or confidence-policy change may ship without comparison to the current production baseline.

A candidate fails when it:

- breaches a critical-field minimum
- increases hallucination beyond the approved tolerance
- materially reduces evidence accuracy
- raises review rate or cost without justified value
- creates a security or privacy regression

## Rollout

Use offline comparison first, then staging, then controlled production traffic. Store the previous configuration for rollback. Customer corrections may become evaluation examples only after permission, redaction, and approval.
