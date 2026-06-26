import { describe, expect, it } from 'vitest';

import {
  AccessDeniedError,
  assertRoleHasPermission,
  assertSameOrganisation,
  getPermissionsForRole,
  roleHasPermission,
} from '../src/access.js';

describe('access policy', () => {
  it('grants owners all declared permissions', () => {
    expect(roleHasPermission('OWNER', 'api_key:revoke')).toBe(true);
    expect(roleHasPermission('OWNER', 'audit_log:read')).toBe(true);
  });

  it('keeps reviewer permissions narrow', () => {
    expect(roleHasPermission('REVIEWER', 'review:write')).toBe(true);
    expect(roleHasPermission('REVIEWER', 'api_key:create')).toBe(false);
    expect(roleHasPermission('REVIEWER', 'member:update_role')).toBe(false);
  });

  it('returns immutable permission intent without exposing a mutable policy source', () => {
    const permissions = getPermissionsForRole('MEMBER');
    expect(permissions).toContain('document:write');
    expect(permissions).not.toContain('api_key:create');
  });

  it('throws when a role lacks a required permission', () => {
    expect(() => assertRoleHasPermission('MEMBER', 'api_key:revoke')).toThrow(AccessDeniedError);
  });

  it('blocks resources from a different organisation', () => {
    expect(() => assertSameOrganisation('org_a', 'org_b')).toThrow(AccessDeniedError);
  });
});
