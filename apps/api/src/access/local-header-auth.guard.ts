import { type CanActivate, type ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { loadApiEnvironment } from '@parselayer/config';

import type { AccessRequest } from './local-header-context.js';
import { resolveLocalHeaderAccessContext } from './local-header-context.js';

@Injectable()
export class LocalHeaderAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AccessRequest>();
    const environment = loadApiEnvironment().APP_ENV;
    const accessContext = resolveLocalHeaderAccessContext(request.headers, environment);

    if (!accessContext) {
      throw new UnauthorizedException('Local header authentication is not available.');
    }

    request.accessContext = accessContext;
    return true;
  }
}
