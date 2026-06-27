import { Inject, Injectable } from '@nestjs/common';
import { loadApiAuthEnvironment, loadApiEnvironment } from '@parselayer/config';
import type { AuthProviderUser, MembershipRole, ResolvedAuthContext } from '@parselayer/domain';
import { getPermissionsForRole } from '@parselayer/domain';

import {
  firstHeader,
  PARSELAYER_AUTH_HEADERS,
  resolveLocalHeaderAccessContext,
} from '../access/local-header-context.js';
import {
  AuthConfigurationError,
  CrossTenantAccessError,
  OrganisationContextRequiredError,
  OrganisationMembershipRequiredError,
} from './auth-errors.js';
import {
  AUTH_DATABASE_CLIENT,
  AUTH_SESSION_VERIFIER,
  type AuthDatabaseClient,
  type AuthenticatedRequest,
  type AuthSessionVerifier,
} from './auth-provider.types.js';

interface RequestedBoundary {
  organisationId: string | null;
  projectId: string | null;
  environmentId: string | null;
}

interface MembershipRecord {
  organisationId: string;
  role: MembershipRole;
}

@Injectable()
export class AuthContextService {
  constructor(
    @Inject(AUTH_DATABASE_CLIENT) private readonly databaseClient: AuthDatabaseClient,
    @Inject(AUTH_SESSION_VERIFIER) private readonly sessionVerifier: AuthSessionVerifier,
  ) {}

  async resolveOptionalAuthContext(
    request: AuthenticatedRequest,
  ): Promise<ResolvedAuthContext | null> {
    const environment = loadApiEnvironment();
    const localHeaderContext = resolveLocalHeaderAccessContext(
      request.headers,
      environment.APP_ENV,
    );

    if (localHeaderContext) {
      request.authContext = localHeaderContext;
      return localHeaderContext;
    }

    if (!hasProviderAuthMaterial(request.headers)) {
      return null;
    }

    const providerUser = await this.verifyProviderRequest(request);

    if (!providerUser) {
      return null;
    }

    const user = await this.databaseClient.user.findUnique({
      where: { externalAuthId: providerUser.externalUserId },
      include: { memberships: true },
    });

    if (!user) {
      throw new OrganisationMembershipRequiredError('Authenticated user is not provisioned.');
    }

    const requestedBoundary = getRequestedBoundary(request);
    const membership = resolveMembership(user.memberships, requestedBoundary.organisationId);

    if (!membership) {
      throw new OrganisationMembershipRequiredError();
    }

    const projectId = await this.resolveProjectBoundary(requestedBoundary.projectId, membership);
    const resolvedEnvironment = await this.resolveEnvironmentBoundary(
      requestedBoundary.environmentId,
      membership,
      projectId,
    );

    const authContext: ResolvedAuthContext = {
      actor: {
        kind: 'user',
        userId: user.id,
        externalAuthUserId: user.externalAuthId,
        email: user.email,
      },
      organisationId: membership.organisationId,
      role: membership.role,
      permissions: getPermissionsForRole(membership.role),
      ...(projectId ? { projectId } : {}),
      ...(resolvedEnvironment?.id ? { environmentId: resolvedEnvironment.id } : {}),
    };

    request.authContext = authContext;
    return authContext;
  }

  private async verifyProviderRequest(
    request: AuthenticatedRequest,
  ): Promise<AuthProviderUser | null> {
    const environment = loadApiAuthEnvironment();

    if (!environment.CLERK_SECRET_KEY || !environment.CLERK_PUBLISHABLE_KEY) {
      throw new AuthConfigurationError();
    }

    return this.sessionVerifier.verifyRequest({
      request: toWebRequest(request),
    });
  }

  private async resolveProjectBoundary(
    projectId: string | null,
    membership: MembershipRecord,
  ): Promise<string | null> {
    if (!projectId) {
      return null;
    }

    const project = await this.databaseClient.project.findUnique({
      where: { id: projectId },
      select: { id: true, organisationId: true },
    });

    if (!project || project.organisationId !== membership.organisationId) {
      throw new CrossTenantAccessError('Requested project is outside the active organisation.');
    }

    return project.id;
  }

  private async resolveEnvironmentBoundary(
    environmentId: string | null,
    membership: MembershipRecord,
    projectId: string | null,
  ): Promise<{ id: string; projectId: string } | null> {
    if (!environmentId) {
      return null;
    }

    const environment = await this.databaseClient.environment.findUnique({
      where: { id: environmentId },
      select: { id: true, organisationId: true, projectId: true },
    });

    if (!environment || environment.organisationId !== membership.organisationId) {
      throw new CrossTenantAccessError(
        'Requested environment is outside the active organisation.',
      );
    }

    if (projectId && environment.projectId !== projectId) {
      throw new CrossTenantAccessError(
        'Requested environment does not belong to the requested project.',
      );
    }

    return environment;
  }
}

function hasProviderAuthMaterial(
  headers: Record<string, string | readonly string[] | undefined>,
): boolean {
  return Boolean(firstHeader(headers.authorization) || firstHeader(headers.cookie));
}

function getRequestedBoundary(request: AuthenticatedRequest): RequestedBoundary {
  return {
    organisationId: firstHeader(request.headers[PARSELAYER_AUTH_HEADERS.organisationId]),
    projectId: firstHeader(request.headers[PARSELAYER_AUTH_HEADERS.projectId]),
    environmentId: firstHeader(request.headers[PARSELAYER_AUTH_HEADERS.environmentId]),
  };
}

function resolveMembership(
  memberships: ReadonlyArray<MembershipRecord>,
  requestedOrganisationId: string | null,
): MembershipRecord | null {
  if (requestedOrganisationId) {
    return memberships.find((membership) => membership.organisationId === requestedOrganisationId) ?? null;
  }

  if (memberships.length === 1) {
    return memberships[0] ?? null;
  }

  if (memberships.length === 0) {
    return null;
  }

  throw new OrganisationContextRequiredError();
}

function toWebRequest(request: AuthenticatedRequest): Request {
  const protocol = firstHeader(request.headers['x-forwarded-proto']) ?? request.protocol ?? 'http';
  const host = firstHeader(request.headers['x-forwarded-host'])
    ?? firstHeader(request.headers.host)
    ?? request.hostname
    ?? 'localhost';
  const url = new URL(request.url, `${protocol}://${host}`);
  const headers = new Headers();

  for (const [key, value] of Object.entries(request.headers)) {
    if (typeof value === 'string') {
      headers.set(key, value);
      continue;
    }

    if (Array.isArray(value)) {
      headers.set(key, value.join(','));
    }
  }

  return new Request(url, {
    method: request.method,
    headers,
  });
}
