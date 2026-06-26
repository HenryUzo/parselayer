import { Injectable, Logger, type OnModuleInit } from '@nestjs/common';

@Injectable()
export class WorkerRuntimeService implements OnModuleInit {
  private readonly logger = new Logger(WorkerRuntimeService.name);

  onModuleInit(): void {
    this.logger.log('Worker runtime initialized; queue processors are added in Phase 3.');
  }
}
