import { Controller, Get, UseGuards } from '@nestjs/common';

import { CurrentAccessContext } from './access-context.decorator.js';
import { LocalHeaderAuthGuard } from './local-header-auth.guard.js';
import type { LocalHeaderAccessContext } from './local-header-context.js';

@Controller('v1/access')
export class AccessController {
  @Get('context')
  @UseGuards(LocalHeaderAuthGuard)
  getAccessContext(
    @CurrentAccessContext() accessContext: LocalHeaderAccessContext,
  ): LocalHeaderAccessContext {
    return accessContext;
  }
}
