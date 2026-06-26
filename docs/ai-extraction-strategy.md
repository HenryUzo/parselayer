# AI Extraction Strategy

## Design principle

The extraction system is schema-driven, evidence-backed, measurable, and provider-agnostic. AI output is treated as probabilistic input to a deterministic validation pipeline.

## Pipeline separation

1. Native text and layout extraction
2. OCR fallback
3. Language and quality assessment
4. Document classification
5. Schema selection
6. Structured field extraction
7. Deterministic validation
8. Normalisation
9. Evidence linking
10. Confidence calculation
11. Contradiction and warning detection
12. Human-review routing

Each stage has its own adapter, version, metrics, retry policy, and failure state.

## Initial schemas

- `resume.v1`
- `cover_letter.v1`
- `job_description.v1`
- `government_id.v1`

Each field definition records type, required state, nullable behaviour, cardinality, validation, normalisation, inference permission, evidence expectations, confidence policy, and review requirements.

## Provenance states

Every field must be marked as one of:

- directly extracted
- normalised
- calculated
- inferred
- manually corrected
- missing
- unverified

Inferred values are never presented as directly extracted.

## Evidence

Critical non-null fields should include page number, source text, character offsets or layout coordinates, extraction method, and evidence confidence where technically possible. Evidence must come from the processed source; it is never generated or fabricated.

## Confidence

Confidence combines measurable signals:

- native extraction or OCR confidence
- source-text match quality
- schema validity
- field-format validity
- cross-field consistency
- classification confidence
- historical field accuracy
- provider and layout performance
- human-review outcomes

Thresholds are configurable by document type, field, organisation, and environment.

## Human review

Critical fields below policy thresholds create review tasks. Reviewers can inspect evidence, compare raw and normalised values, correct or reject fields, record reasons, and preserve the original result.

## Provider strategy

OpenAI and AWS Textract are initial providers behind internal interfaces. Provider responses are translated into domain-owned types. No public response depends directly on a provider schema.

## Prompt-injection defence

Document contents are untrusted data. Extraction instructions are fixed outside the document context. The model is explicitly instructed to ignore commands found inside documents. Output is constrained by versioned schemas and validated after generation.

## Change control

Changes to models, prompts, OCR, schemas, normalisation, evidence logic, or confidence thresholds require versioning, regression evaluation, comparison against the current production baseline, controlled rollout, and rollback support.