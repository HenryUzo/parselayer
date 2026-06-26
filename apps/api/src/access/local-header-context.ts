export const LOCAL_HEADER_AUTH_ALLOWED_ENVS = ['local', 'test'] as const;
export const LOCAL_MEMBERSHIP_ROLES = ['OWNER', 'ADMIN', 'MEMBER', 'REVIEWER'] as const;

export type LocalHeaderAuthEnvironment = (typeof LOCAL_HEADER_AUTH_ALLOWED_ENVS)[number];
export type LocalMembershipRole = (typeof LOCAL_MEMBERSHIP_ROLES)[number];

export type LocalPermission =
  | 'organisation:read'
  | 'organisation:update'
  | 'member:read'
  | 'member:invite'
  | 'member:update_role'
  | 'project:read'
  | 'project:create'
  | 'project:update'
  | 'environment:read'
  | 'api_key:read'
  | 'api_key:create'
  | 'api_key:revoke'
  | 'audit_log:read'
  | 'document:read'
  | 'document:write'
  | 'review:read'
  | 'review:write';

export interface HeaderBag {
  readonly [key: string]: string | readonly string[] | undefined;
}

export interface AccessRequest {
  headers: HeaderBag;
  accessContext?: LocalHeaderAccessContext;
}

export interface LocalHeaderAccessContext {
  actorKind: 'user';
  actorId: string;
  organisationId: string;
  role: LocalMembershipRole;
  permissions: readonly LocalPermission[];
  projectId?: string;
  environmentId?: string;
}

const rolePermissions: Record<LocalMembershipRole, readonly LocalPermission[]> = {
  OWNER: [
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
};

export function resolveLocalHeaderAccessContext(
  headers: HeaderBag,
  appEnvironment: string,
): LocalHeaderAccessContext | null {
  if (!isLocalHeaderAuthEnvironment(appEnvironment)) {
    return null;
  }

  const actorId = firstHeader(headers['x-parselayer-user-id']);
  const organisationId = firstHeader(headers['x-parselayer-organisation-id']);
  const roleHeader = firstHeader(headers['x-parselayer-role']);
  const projectId = firstHeader(headers['x-parselayer-project-id']);
  const environmentId = firstHeader(headers['x-parselayer-environment-id']);

  if (!actorId || !organisationId || !roleHeader || !isLocalMembershipRole(roleHeader)) {
    return null;
  }

  return {
    actorKind: 'user',
    actorId,
    organisationId,
    role: roleHeader,
    permissions: rolePermissions[roleHeader],
    ...(projectId ? { projectId } : {}),
    ...(environmentId ? { environmentId } : {}),
  };
}

export function isLocalMembershipRole(value: string): value is LocalMembershipRole {
  return LOCAL_MEMBERSHIP_ROLES.includes(value as LocalMembershipRole);
}

function isLocalHeaderAuthEnvironment(value: string): value is LocalHeaderAuthEnvironment {
  return LOCAL_HEADER_AUTH_ALLOWED_ENVS.includes(value as LocalHeaderAuthEnvironment);
}

function firstHeader(value: string | readonly string[] | undefined): string | null {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value ?? null;
}
