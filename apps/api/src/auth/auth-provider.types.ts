import type { PrismaClient } from '@parselayer/database';
import type { AuthProviderUser, ResolvedAuthContext } from '@parselayer/domain';

export interface AuthenticatedRequest {
  headers: Record<string, string | readonly string[] | undefined>;
  method: string;
  url: string;
  protocol?: string;
  hostname?: string;
  authContext?: ResolvedAuthContext;
}

export interface VerifyAuthRequestInput {
  request: Request;
}

export interface AuthSessionVerifier {
  verifyRequest(input: VerifyAuthRequestInput): Promise<AuthProviderUser | null>;
}

export type AuthDatabaseClient = Pick<
  PrismaClient,
  '$disconnect' | 'user' | 'project' | 'environment'
>;

export const AUTH_DATABASE_CLIENT = Symbol('AUTH_DATABASE_CLIENT');
export const AUTH_SESSION_VERIFIER = Symbol('AUTH_SESSION_VERIFIER');
