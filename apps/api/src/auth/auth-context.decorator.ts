import { createParamDecorator, type ExecutionContext, UnauthorizedException } from '@nestjs/common';
import type { ResolvedAuthContext } from '@parselayer/domain';

import type { AuthenticatedRequest } from './auth-provider.types.js';

export const CurrentAuthContext = createParamDecorator(
  (_data: unknown, context: ExecutionContext): ResolvedAuthContext => {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    if (!request.authContext) {
      throw new UnauthorizedException('Auth context has not been resolved.');
    }

    return request.authContext;
  },
);
