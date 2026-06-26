import { describe, expect, it } from 'vitest';

import { HealthController } from '../src/health.controller.js';

describe('HealthController', () => {
  it('returns an API health response without sensitive configuration', () => {
    const response = new HealthController().getHealth();
    expect(response.status).toBe('ok');
    expect(response.service).toBe('api');
    expect(response).not.toHaveProperty('DATABASE_URL');
  });
});
