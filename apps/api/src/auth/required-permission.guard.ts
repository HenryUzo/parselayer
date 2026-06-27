import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { RequiredPermission } from '@parselayer/domain';

import { AuthenticationRequiredError, MissingPermissionError } from './auth-errors.js';
import type { AuthenticatedRequest } from './auth-provider.types.js';
import { REQUIRED_PERMISSION_KEY } from './required-permission.decorator.js';

@Injectable()
export class RequiredPermissionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const permission = this.reflector.getAllAndOverride<RequiredPermission | undefined>(
      REQUIRED_PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!permission) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authContext = request.authContext;

    if (!authContext) {
      throw new AuthenticationRequiredError();
    }

    if (!authContext?.permissions.includes(permission)) {
      throw new MissingPermissionError(permission);
    }

    return true;
  }
}
