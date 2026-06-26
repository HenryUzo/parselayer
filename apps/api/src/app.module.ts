import { Module } from '@nestjs/common';

import { AccessModule } from './access/access.module.js';
import { HealthController } from './health.controller.js';
import { RootController } from './root.controller.js';

@Module({
  imports: [AccessModule],
  controllers: [RootController, HealthController],
})
export class AppModule {}
