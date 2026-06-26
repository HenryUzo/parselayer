export const MEMBERSHIP_ROLES = ['OWNER', 'ADMIN', 'MEMBER', 'REVIEWER'] as const;

export type MembershipRole = (typeof MEMBERSHIP_ROLES)[number];

export const PERMISSIONS = [
  'organisation:read',
  'organisation:update',
  'member:read',
  'member:invite',
  'member:update_role',
  'project:read',
  'project:create',
  'project:update',
  'environment:read',
  'api_key:read',
  'api_key:create',
  'api_key:revoke',
  'audit_log:read',
  'document:read',
  'document:write',
  'review:read',
  'review:write',
] as const;

export type Permission = (typeof PERMISSIONS)[number];

const rolePermissions = {
  OWNER: PERMISSIONS,
  ADMIN: [
    'organisation:read',
    'organisation:update',
    'member:read',
    'member:invite',
    'member:update_role',
    'project:read',
    'project:create',
    'project:update',
    'environment:read',
    'api_key:read',
    'api_key:create',
    'api_key:revoke',
    'audit_log:read',
    'document:read',
    'document:write',
    'review:read',
    'review:write',
  ],
  MEMBER: [
    'organisation:read',
    'member:read',
    'project:read',
    'environment:read',
    'document:read',
    'document:write',
    'review:read',
  ],
  REVIEWER: [
    'organisation:read',
    'project:read',
    'environment:read',
    'document:read',
    'review:read',
    'review:write',
  ],
} satisfies Record<MembershipRole, readonly Permission[]>;

export class AccessDeniedError extends Error {
  constructor(message = 'Access denied') {
    super(message);
    this.name = 'AccessDeniedError';
  }
}

export function isMembershipRole(value: string): value is MembershipRole {
  return MEMBERSHIP_ROLES.includes(value as MembershipRole);
}

export function getPermissionsForRole(role: MembershipRole): readonly Permission[] {
  return rolePermissions[role];
}

export function roleHasPermission(role: MembershipRole, permission: Permission): boolean {
  return rolePermissions[role].includes(permission);
}

export function assertRoleHasPermission(role: MembershipRole, permission: Permission): void {
  if (!roleHasPermission(role, permission)) {
    throw new AccessDeniedError(`Role ${role} does not include permission ${permission}.`);
  }
}

export function isSameOrganisation(
  actorOrganisationId: string,
  targetOrganisationId: string,
): boolean {
  return actorOrganisationId === targetOrganisationId;
}

export function assertSameOrganisation(
  actorOrganisationId: string,
  targetOrganisationId: string,
): void {
  if (!isSameOrganisation(actorOrganisationId, targetOrganisationId)) {
    throw new AccessDeniedError('Resource belongs to a different organisation.');
  }
}
