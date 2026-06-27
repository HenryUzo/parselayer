import { Inject, Module, type OnApplicationShutdown } from '@nestjs/common';
import { createPrismaClient } from '@parselayer/database';
import { loadApiAuthEnvironment } from '@parselayer/config';

import { AuthContextService } from './auth-context.service.js';
import {
  AUTH_DATABASE_CLIENT,
  AUTH_SESSION_VERIFIER,
  type AuthDatabaseClient,
} from './auth-provider.types.js';
import { ClerkSessionVerifier } from './clerk-session-verifier.js';
import { OptionalAuthGuard } from './optional-auth.guard.js';
import { RequiredAuthGuard } from './required-auth.guard.js';
import { RequiredOrganisationGuard } from './required-organisation.guard.js';
import { RequiredPermissionGuard } from './required-permission.guard.js';

@Module({
  providers: [
    {
      provide: AUTH_DATABASE_CLIENT,
      useFactory: (): AuthDatabaseClient =>
        createPrismaClient(loadApiAuthEnvironment().DATABASE_URL),
    },
    {
      provide: AUTH_SESSION_VERIFIER,
      useClass: ClerkSessionVerifier,
    },
    AuthContextService,
    OptionalAuthGuard,
    RequiredAuthGuard,
    RequiredOrganisationGuard,
    RequiredPermissionGuard,
  ],
  exports: [
    AuthContextService,
    OptionalAuthGuard,
    RequiredAuthGuard,
    RequiredOrganisationGuard,
    RequiredPermissionGuard,
  ],
})
export class AuthModule implements OnApplicationShutdown {
  constructor(
    @Inject(AUTH_DATABASE_CLIENT) private readonly databaseClient: AuthDatabaseClient,
  ) {}

  async onApplicationShutdown(): Promise<void> {
    await this.databaseClient.$disconnect();
  }
}
