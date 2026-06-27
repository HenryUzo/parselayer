import type { ResolvedAuthContext } from '@parselayer/domain';
import { getPermissionsForRole, isMembershipRole } from '@parselayer/domain';

export const LOCAL_HEADER_AUTH_ALLOWED_ENVS = ['local', 'test'] as const;
export const PARSELAYER_AUTH_HEADERS = {
  userId: 'x-parselayer-user-id',
  organisationId: 'x-parselayer-organisation-id',
  role: 'x-parselayer-role',
  projectId: 'x-parselayer-project-id',
  environmentId: 'x-parselayer-environment-id',
} as const;

export type LocalHeaderAuthEnvironment = (typeof LOCAL_HEADER_AUTH_ALLOWED_ENVS)[number];

export interface HeaderBag {
  readonly [key: string]: string | readonly string[] | undefined;
}

export interface AccessRequest {
  headers: HeaderBag;
  method?: string;
  url?: string;
  protocol?: string;
  hostname?: string;
  authContext?: LocalHeaderAccessContext;
}

export type LocalHeaderAccessContext = ResolvedAuthContext;

export function resolveLocalHeaderAccessContext(
  headers: HeaderBag,
  appEnvironment: string,
): LocalHeaderAccessContext | null {
  if (!isLocalHeaderAuthEnvironment(appEnvironment)) {
    return null;
  }

  const actorId = firstHeader(headers[PARSELAYER_AUTH_HEADERS.userId]);
  const organisationId = firstHeader(headers[PARSELAYER_AUTH_HEADERS.organisationId]);
  const roleHeader = firstHeader(headers[PARSELAYER_AUTH_HEADERS.role]);
  const projectId = firstHeader(headers[PARSELAYER_AUTH_HEADERS.projectId]);
  const environmentId = firstHeader(headers[PARSELAYER_AUTH_HEADERS.environmentId]);

  if (!actorId || !organisationId || !roleHeader || !isMembershipRole(roleHeader)) {
    return null;
  }

  return {
    actor: {
      kind: 'user',
      userId: actorId,
      externalAuthUserId: null,
      email: null,
    },
    organisationId,
    role: roleHeader,
    permissions: getPermissionsForRole(roleHeader),
    ...(projectId ? { projectId } : {}),
    ...(environmentId ? { environmentId } : {}),
  };
}

function isLocalHeaderAuthEnvironment(value: string): value is LocalHeaderAuthEnvironment {
  return LOCAL_HEADER_AUTH_ALLOWED_ENVS.includes(value as LocalHeaderAuthEnvironment);
}

export function firstHeader(value: string | readonly string[] | undefined): string | null {
  if (typeof value === 'string') {
    return value;
  }

  if (!value) {
    return null;
  }

  return value[0] ?? null;
}
