import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';

export const API_KEY_SCOPES = [
  'documents:read',
  'documents:write',
  'parse_jobs:read',
  'parse_jobs:write',
  'webhooks:read',
  'webhooks:write',
  'usage:read',
] as const;

export type ApiKeyScope = (typeof API_KEY_SCOPES)[number];
export type ApiKeyEnvironment = 'test' | 'live';

export interface CreateApiKeySecretInput {
  environment: ApiKeyEnvironment;
  randomBytesFn?: (size: number) => Buffer;
}

export interface CreatedApiKeySecret {
  secret: string;
  prefix: string;
  hash: string;
}

export class InvalidApiKeySecretError extends Error {
  constructor(message = 'Invalid API key secret format') {
    super(message);
    this.name = 'InvalidApiKeySecretError';
  }
}

export function createApiKeySecret(input: CreateApiKeySecretInput): CreatedApiKeySecret {
  const entropy = input.randomBytesFn?.(32) ?? randomBytes(32);
  const token = entropy.toString('base64url');
  const secret = `pl_${input.environment}_${token}`;

  return {
    secret,
    prefix: getApiKeyPrefix(secret),
    hash: hashApiKeySecret(secret),
  };
}

export function getApiKeyPrefix(secret: string): string {
  const [productPrefix, environment, token] = secret.split('_');

  if (productPrefix !== 'pl' || !isApiKeyEnvironment(environment) || !token) {
    throw new InvalidApiKeySecretError();
  }

  return `${productPrefix}_${environment}_${token.slice(0, 10)}`;
}

export function hashApiKeySecret(secret: string): string {
  return createHash('sha256').update(secret, 'utf8').digest('hex');
}

export function verifyApiKeySecret(secret: string, expectedHash: string): boolean {
  const actualHash = hashApiKeySecret(secret);
  const actual = Buffer.from(actualHash, 'hex');
  const expected = Buffer.from(expectedHash, 'hex');

  if (actual.length !== expected.length) {
    return false;
  }

  return timingSafeEqual(actual, expected);
}

export function hasApiKeyScopes(
  grantedScopes: readonly ApiKeyScope[],
  requiredScopes: readonly ApiKeyScope[],
): boolean {
  const granted = new Set(grantedScopes);
  return requiredScopes.every((scope) => granted.has(scope));
}

export function isApiKeyScope(value: string): value is ApiKeyScope {
  return API_KEY_SCOPES.includes(value as ApiKeyScope);
}

function isApiKeyEnvironment(value: string | undefined): value is ApiKeyEnvironment {
  return value === 'test' || value === 'live';
}
