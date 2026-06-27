import { Module } from '@nestjs/common';

import { AccessModule } from './access/access.module.js';
import { AuthModule } from './auth/auth.module.js';
import { HealthController } from './health.controller.js';
import { RootController } from './root.controller.js';

@Module({
  imports: [AuthModule, AccessModule],
  controllers: [RootController, HealthController],
})
export class AppModule {}
