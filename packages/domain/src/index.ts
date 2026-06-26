export const PARSE_QUEUE_NAME = 'document-parse';
export const WEBHOOK_QUEUE_NAME = 'webhook-delivery';
export const RETENTION_QUEUE_NAME = 'retention';

export const DOCUMENT_TYPES = ['resume', 'cover_letter', 'job_description', 'government_id'] as const;

export type DocumentType = (typeof DOCUMENT_TYPES)[number];
export type EnvironmentType = 'test' | 'live';
