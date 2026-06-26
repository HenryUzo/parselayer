import { describe, expect, it } from 'vitest';

import {
  EnvironmentValidationError,
  loadApiEnvironment,
  loadDataServicesEnvironment,
} from '../src/index.js';

describe('environment validation', () => {
  it('applies safe API defaults', () => {
    const config = loadApiEnvironment({});
    expect(config.API_PORT).toBe(3001);
    expect(config.API_HOST).toBe('0.0.0.0');
    expect(config.APP_ENV).toBe('local');
  });

  it('coerces the object-storage path-style flag', () => {
    const config = loadDataServicesEnvironment({
      DATABASE_URL: 'postgresql://user:example@localhost:5432/parselayer',
      REDIS_URL: 'redis://localhost:6379',
      OBJECT_STORAGE_ENDPOINT: 'http://localhost:9000',
      OBJECT_STORAGE_REGION: 'us-east-1',
      OBJECT_STORAGE_BUCKET: 'parselayer-test',
      OBJECT_STORAGE_ACCESS_KEY: 'example',
      OBJECT_STORAGE_SECRET_KEY: 'example-value',
      OBJECT_STORAGE_FORCE_PATH_STYLE: 'false',
    });
    expect(config.OBJECT_STORAGE_FORCE_PATH_STYLE).toBe(false);
  });

  it('reports invalid variable names without exposing values', () => {
    expect(() => loadDataServicesEnvironment({ DATABASE_URL: '', REDIS_URL: 'not-a-url' })).toThrow(
      EnvironmentValidationError,
    );
  });
});
