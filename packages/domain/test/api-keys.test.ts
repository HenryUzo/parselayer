import { describe, expect, it } from 'vitest';

import {
  createApiKeySecret,
  getApiKeyPrefix,
  hasApiKeyScopes,
  hashApiKeySecret,
  InvalidApiKeySecretError,
  verifyApiKeySecret,
} from '../src/api-keys.js';

describe('api key primitives', () => {
  it('creates a test key with a stable prefix and non-persisted secret', () => {
    const key = createApiKeySecret({
      environment: 'test',
      randomBytesFn: () => Buffer.alloc(32, 1),
    });

    expect(key.secret).toMatch(/^pl_test_/);
    expect(key.prefix).toBe(getApiKeyPrefix(key.secret));
    expect(key.secret).not.toBe(key.prefix);
    expect(key.hash).toBe(hashApiKeySecret(key.secret));
  });

  it('verifies only the matching secret against the stored hash', () => {
    const key = createApiKeySecret({
      environment: 'live',
      randomBytesFn: () => Buffer.alloc(32, 2),
    });

    expect(verifyApiKeySecret(key.secret, key.hash)).toBe(true);
    expect(verifyApiKeySecret('pl_live_wrong', key.hash)).toBe(false);
  });

  it('rejects malformed key prefixes', () => {
    expect(() => getApiKeyPrefix('not-a-parselayer-key')).toThrow(InvalidApiKeySecretError);
  });

  it('requires all requested scopes', () => {
    expect(hasApiKeyScopes(['documents:read', 'documents:write'], ['documents:read'])).toBe(true);
    expect(hasApiKeyScopes(['documents:read'], ['documents:read', 'documents:write'])).toBe(false);
  });
});
