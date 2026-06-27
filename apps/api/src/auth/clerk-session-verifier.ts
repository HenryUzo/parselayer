import { Injectable } from '@nestjs/common';
import { createClerkClient } from '@clerk/backend';
import { loadApiAuthEnvironment } from '@parselayer/config';
import type { AuthProviderUser } from '@parselayer/domain';

import { AuthConfigurationError, AuthenticationRequiredError } from './auth-errors.js';
import type { AuthSessionVerifier, VerifyAuthRequestInput } from './auth-provider.types.js';

@Injectable()
export class ClerkSessionVerifier implements AuthSessionVerifier {
  async verifyRequest(input: VerifyAuthRequestInput): Promise<AuthProviderUser | null> {
    const environment = loadApiAuthEnvironment();

    if (!environment.CLERK_SECRET_KEY || !environment.CLERK_PUBLISHABLE_KEY) {
      throw new AuthConfigurationError();
    }

    try {
      const requestState = await createClerkClient({
        secretKey: environment.CLERK_SECRET_KEY,
        publishableKey: environment.CLERK_PUBLISHABLE_KEY,
        ...(environment.CLERK_JWT_KEY ? { jwtKey: environment.CLERK_JWT_KEY } : {}),
        ...(environment.CLERK_API_URL ? { apiUrl: environment.CLERK_API_URL } : {}),
      }).authenticateRequest(input.request);

      if (!requestState.isAuthenticated) {
        return null;
      }

      const auth = requestState.toAuth();

      if (!auth.isAuthenticated || auth.tokenType !== 'session_token' || !auth.userId) {
        return null;
      }

      return {
        provider: 'clerk',
        externalUserId: auth.userId,
        email: getEmailFromSessionClaims(auth.sessionClaims),
        sessionId: auth.sessionId,
      };
    } catch {
      throw new AuthenticationRequiredError('Authentication could not be verified.');
    }
  }
}

function getEmailFromSessionClaims(claims: unknown): string | null {
  if (!claims || typeof claims !== 'object') {
    return null;
  }

  const record = claims as Record<string, unknown>;
  const email = record.email ?? record.email_address ?? record.primary_email_address;

  return typeof email === 'string' ? email : null;
}
