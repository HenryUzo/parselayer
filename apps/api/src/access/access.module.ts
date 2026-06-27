import { Module } from '@nestjs/common';

import { AccessController } from './access.controller.js';
import { LocalHeaderAuthGuard } from './local-header-auth.guard.js';

@Module({
  controllers: [AccessController],
  providers: [LocalHeaderAuthGuard],
})
export class AccessModule {}
