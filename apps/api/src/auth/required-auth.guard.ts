import { ExecutionContext, Injectable } from '@nestjs/common';

import { AuthenticationRequiredError } from './auth-errors.js';
import { OptionalAuthGuard } from './optional-auth.guard.js';

@Injectable()
export class RequiredAuthGuard extends OptionalAuthGuard {
  override async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);

    const request = context.switchToHttp().getRequest<{ authContext?: unknown }>();

    if (!request.authContext) {
      throw new AuthenticationRequiredError();
    }

    return true;
  }
}
