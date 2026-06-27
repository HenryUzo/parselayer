import { Controller, Get, UseGuards } from '@nestjs/common';
import type { ResolvedAuthContext } from '@parselayer/domain';

import { CurrentAccessContext } from './access-context.decorator.js';
import { LocalHeaderAuthGuard } from './local-header-auth.guard.js';

@Controller('v1/access')
export class AccessController {
  @Get('context')
  @UseGuards(LocalHeaderAuthGuard)
  getAccessContext(
    @CurrentAccessContext() accessContext: ResolvedAuthContext,
  ): ResolvedAuthContext {
    return accessContext;
  }
}
