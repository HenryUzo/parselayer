import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import {
  AuthenticationRequiredError,
  OrganisationContextRequiredError,
} from './auth-errors.js';
import type { AuthenticatedRequest } from './auth-provider.types.js';

@Injectable()
export class RequiredOrganisationGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    if (!request.authContext) {
      throw new AuthenticationRequiredError();
    }

    if (!request.authContext.organisationId) {
      throw new OrganisationContextRequiredError();
    }

    return true;
  }
}
