import { createParamDecorator, type ExecutionContext, UnauthorizedException } from '@nestjs/common';

import type { AccessRequest, LocalHeaderAccessContext } from './local-header-context.js';

export const CurrentAccessContext = createParamDecorator(
  (_data: unknown, context: ExecutionContext): LocalHeaderAccessContext => {
    const request = context.switchToHttp().getRequest<AccessRequest>();

    if (!request.accessContext) {
      throw new UnauthorizedException('Access context has not been resolved.');
    }

    return request.accessContext;
  },
);
