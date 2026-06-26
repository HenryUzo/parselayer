import 'reflect-metadata';

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { loadWorkerEnvironment } from '@parselayer/config';
import { PARSE_QUEUE_NAME, RETENTION_QUEUE_NAME, WEBHOOK_QUEUE_NAME } from '@parselayer/domain';

import { WorkerModule } from './worker.module.js';

async function bootstrap(): Promise<void> {
  const config = loadWorkerEnvironment();
  const app = await NestFactory.createApplicationContext(WorkerModule, { bufferLogs: true });
  const logger = new Logger('WorkerBootstrap');

  logger.log({
    message: 'ParseLayer worker foundation started',
    environment: config.APP_ENV,
    queues: [PARSE_QUEUE_NAME, WEBHOOK_QUEUE_NAME, RETENTION_QUEUE_NAME],
  });

  await new Promise<void>((resolve) => {
    const shutdown = (): void => resolve();
    process.once('SIGINT', shutdown);
    process.once('SIGTERM', shutdown);
  });

  await app.close();
}

void bootstrap();
