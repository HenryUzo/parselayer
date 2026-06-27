import type { ExecutionContext } from '@nestjs/common';
import type { Reflector } from '@nestjs/core';
import { describe, expect, it } from 'vitest';

import { MissingPermissionError } from '../src/auth/auth-errors.js';
import { RequiredPermissionGuard } from '../src/auth/required-permission.guard.js';

describe('RequiredPermissionGuard', () => {
  it('allows requests with the required permission', () => {
    const guard = new RequiredPermissionGuard(createReflector('api_key:create'));

    expect(guard.canActivate(createExecutionContext(['api_key:create']))).toBe(true);
  });

  it('rejects requests missing the required permission', () => {
    const guard = new RequiredPermissionGuard(createReflector('api_key:create'));

    expect(() => guard.canActivate(createExecutionContext(['project:read']))).toThrow(
      MissingPermissionError,
    );
  });
});

function createReflector(permission: string): Reflector {
  return {
    getAllAndOverride: () => permission,
  } as unknown as Reflector;
}

function createExecutionContext(permissions: readonly string[]): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => ({
        authContext: {
          actor: {
            kind: 'user',
            userId: 'user_1',
            externalAuthUserId: 'clerk_user_1',
            email: 'user@example.com',
          },
          organisationId: 'org_1',
          role: 'OWNER',
          permissions,
        },
      }),
    }),
    getHandler: () => null,
    getClass: () => null,
  } as unknown as ExecutionContext;
}
