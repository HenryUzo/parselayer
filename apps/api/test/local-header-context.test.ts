import { describe, expect, it } from 'vitest';

import { resolveLocalHeaderAccessContext } from '../src/access/local-header-context.js';

describe('local header access context', () => {
  it('resolves a local owner context with project and environment boundaries', () => {
    const context = resolveLocalHeaderAccessContext(
      {
        'x-parselayer-user-id': 'user_123',
        'x-parselayer-organisation-id': 'org_123',
        'x-parselayer-role': 'OWNER',
        'x-parselayer-project-id': 'project_123',
        'x-parselayer-environment-id': 'env_123',
      },
      'local',
    );

    expect(context).toMatchObject({
      actor: {
        kind: 'user',
        userId: 'user_123',
        externalAuthUserId: null,
        email: null,
      },
      organisationId: 'org_123',
      role: 'OWNER',
      projectId: 'project_123',
      environmentId: 'env_123',
    });
    expect(context?.permissions).toContain('api_key:create');
  });

  it('allows local header auth in tests', () => {
    const context = resolveLocalHeaderAccessContext(
      {
        'x-parselayer-user-id': ['user_123'],
        'x-parselayer-organisation-id': ['org_123'],
        'x-parselayer-role': ['REVIEWER'],
      },
      'test',
    );

    expect(context?.role).toBe('REVIEWER');
    expect(context?.permissions).toContain('review:write');
    expect(context?.permissions).not.toContain('api_key:create');
  });

  it('blocks local header auth outside local and test environments', () => {
    const context = resolveLocalHeaderAccessContext(
      {
        'x-parselayer-user-id': 'user_123',
        'x-parselayer-organisation-id': 'org_123',
        'x-parselayer-role': 'OWNER',
      },
      'production',
    );

    expect(context).toBeNull();
  });

  it('rejects missing tenant boundary or invalid role', () => {
    expect(
      resolveLocalHeaderAccessContext(
        {
          'x-parselayer-user-id': 'user_123',
          'x-parselayer-role': 'OWNER',
        },
        'local',
      ),
    ).toBeNull();

    expect(
      resolveLocalHeaderAccessContext(
        {
          'x-parselayer-user-id': 'user_123',
          'x-parselayer-organisation-id': 'org_123',
          'x-parselayer-role': 'SUPERUSER',
        },
        'local',
      ),
    ).toBeNull();
  });
});
