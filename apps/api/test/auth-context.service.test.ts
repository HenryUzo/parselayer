import { describe, expect, it } from 'vitest';

import { AuthContextService } from '../src/auth/auth-context.service.js';
import {
  CrossTenantAccessError,
  OrganisationContextRequiredError,
  OrganisationMembershipRequiredError,
} from '../src/auth/auth-errors.js';
import {
  type AuthDatabaseClient,
  type AuthSessionVerifier,
} from '../src/auth/auth-provider.types.js';

const testEnvironment = {
  APP_ENV: 'test',
  NODE_ENV: 'test',
  LOG_LEVEL: 'silent',
  API_HOST: '0.0.0.0',
  API_PORT: 3001,
  DATABASE_URL: 'postgresql://parselayer:parselayer@localhost:5432/parselayer?schema=public',
  WEB_ORIGIN: 'http://localhost:3000',
  CLERK_SECRET_KEY: 'sk_test_value',
  CLERK_PUBLISHABLE_KEY: 'pk_test_value',
};

describe('AuthContextService', () => {
  it('resolves local header auth in test without calling the provider', async () => {
    const service = new AuthContextService(
      createDatabaseClient(),
      createSessionVerifier(),
    );

    const context = await service.resolveOptionalAuthContext({
      headers: {
        'x-parselayer-user-id': 'user_local',
        'x-parselayer-organisation-id': 'org_local',
        'x-parselayer-role': 'ADMIN',
      },
      method: 'GET',
      url: '/v1/access/context',
    });

    expect(context).toMatchObject({
      actor: {
        kind: 'user',
        userId: 'user_local',
        externalAuthUserId: null,
        email: null,
      },
      organisationId: 'org_local',
      role: 'ADMIN',
    });
    expect(context?.permissions).toContain('api_key:create');
  });

  it('resolves a provider-authenticated user from the database', async () => {
    const service = new AuthContextService(
      createDatabaseClient({
        user: {
          id: 'user_1',
          externalAuthId: 'clerk_user_1',
          email: 'owner@example.com',
          memberships: [{ organisationId: 'org_1', role: 'OWNER' }],
        },
        project: { id: 'project_1', organisationId: 'org_1' },
        environment: { id: 'env_1', organisationId: 'org_1', projectId: 'project_1' },
      }),
      createSessionVerifier({
        provider: 'clerk',
        externalUserId: 'clerk_user_1',
        email: 'owner@example.com',
        sessionId: 'sess_1',
      }),
    );

    const context = await withApiEnvironment(testEnvironment, () =>
      service.resolveOptionalAuthContext({
        headers: {
          authorization: 'Bearer token',
          'x-parselayer-organisation-id': 'org_1',
          'x-parselayer-project-id': 'project_1',
          'x-parselayer-environment-id': 'env_1',
          host: 'api.parselayer.test',
        },
        method: 'GET',
        url: '/v1/projects/project_1',
        protocol: 'https',
      }),
    );

    expect(context).toMatchObject({
      actor: {
        kind: 'user',
        userId: 'user_1',
        externalAuthUserId: 'clerk_user_1',
        email: 'owner@example.com',
      },
      organisationId: 'org_1',
      role: 'OWNER',
      projectId: 'project_1',
      environmentId: 'env_1',
    });
    expect(context?.permissions).toContain('audit_log:read');
  });

  it('rejects authenticated users without a matching membership', async () => {
    const service = new AuthContextService(
      createDatabaseClient({
        user: {
          id: 'user_1',
          externalAuthId: 'clerk_user_1',
          email: 'owner@example.com',
          memberships: [{ organisationId: 'org_2', role: 'OWNER' }],
        },
      }),
      createSessionVerifier({
        provider: 'clerk',
        externalUserId: 'clerk_user_1',
        email: 'owner@example.com',
        sessionId: 'sess_1',
      }),
    );

    await expect(
      withApiEnvironment(testEnvironment, () =>
        service.resolveOptionalAuthContext({
          headers: {
            authorization: 'Bearer token',
            'x-parselayer-organisation-id': 'org_1',
          },
          method: 'GET',
          url: '/v1/projects',
        }),
      ),
    ).rejects.toBeInstanceOf(OrganisationMembershipRequiredError);
  });

  it('requires explicit organisation context when a user has multiple memberships', async () => {
    const service = new AuthContextService(
      createDatabaseClient({
        user: {
          id: 'user_1',
          externalAuthId: 'clerk_user_1',
          email: 'owner@example.com',
          memberships: [
            { organisationId: 'org_1', role: 'OWNER' },
            { organisationId: 'org_2', role: 'ADMIN' },
          ],
        },
      }),
      createSessionVerifier({
        provider: 'clerk',
        externalUserId: 'clerk_user_1',
        email: 'owner@example.com',
        sessionId: 'sess_1',
      }),
    );

    await expect(
      withApiEnvironment(testEnvironment, () =>
        service.resolveOptionalAuthContext({
          headers: {
            authorization: 'Bearer token',
          },
          method: 'GET',
          url: '/v1/projects',
        }),
      ),
    ).rejects.toBeInstanceOf(OrganisationContextRequiredError);
  });

  it('rejects cross-tenant project access', async () => {
    const service = new AuthContextService(
      createDatabaseClient({
        user: {
          id: 'user_1',
          externalAuthId: 'clerk_user_1',
          email: 'owner@example.com',
          memberships: [{ organisationId: 'org_1', role: 'OWNER' }],
        },
        project: { id: 'project_2', organisationId: 'org_2' },
      }),
      createSessionVerifier({
        provider: 'clerk',
        externalUserId: 'clerk_user_1',
        email: 'owner@example.com',
        sessionId: 'sess_1',
      }),
    );

    await expect(
      withApiEnvironment(testEnvironment, () =>
        service.resolveOptionalAuthContext({
          headers: {
            authorization: 'Bearer token',
            'x-parselayer-organisation-id': 'org_1',
            'x-parselayer-project-id': 'project_2',
          },
          method: 'GET',
          url: '/v1/projects/project_2',
        }),
      ),
    ).rejects.toBeInstanceOf(CrossTenantAccessError);
  });
});

function createSessionVerifier(
  result: Awaited<ReturnType<AuthSessionVerifier['verifyRequest']>> | null = null,
): AuthSessionVerifier {
  return {
    verifyRequest: () => Promise.resolve(result),
  };
}

function createDatabaseClient(overrides?: {
  user?: {
    id: string;
    externalAuthId: string;
    email: string;
    memberships: Array<{ organisationId: string; role: 'OWNER' | 'ADMIN' | 'MEMBER' | 'REVIEWER' }>;
  } | null;
  project?: { id: string; organisationId: string } | null;
  environment?: { id: string; organisationId: string; projectId: string } | null;
}): AuthDatabaseClient {
  return {
    $disconnect: async () => {},
    user: {
      findUnique: () => Promise.resolve(overrides?.user ?? null),
    },
    project: {
      findUnique: () => Promise.resolve(overrides?.project ?? null),
    },
    environment: {
      findUnique: () => Promise.resolve(overrides?.environment ?? null),
    },
  } as unknown as AuthDatabaseClient;
}

async function withApiEnvironment<T>(
  environment: Record<string, string | number>,
  run: () => Promise<T>,
): Promise<T> {
  const originalValues = new Map<string, string | undefined>();

  for (const [key, value] of Object.entries(environment)) {
    originalValues.set(key, process.env[key]);
    process.env[key] = String(value);
  }

  try {
    return await run();
  } finally {
    for (const [key, value] of originalValues.entries()) {
      if (typeof value === 'undefined') {
        delete process.env[key];
        continue;
      }

      process.env[key] = value;
    }
  }
}
