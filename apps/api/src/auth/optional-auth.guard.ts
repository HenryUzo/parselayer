import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { AuthContextService } from './auth-context.service.js';
import type { AuthenticatedRequest } from './auth-provider.types.js';

@Injectable()
export class OptionalAuthGuard implements CanActivate {
  constructor(private readonly authContextService: AuthContextService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    await this.authContextService.resolveOptionalAuthContext(request);
    return true;
  }
}
