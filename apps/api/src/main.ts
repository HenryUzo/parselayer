import 'reflect-metadata';

import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify';
import { loadApiEnvironment } from '@parselayer/config';

import { AppModule } from './app.module.js';

async function bootstrap(): Promise<void> {
  const config = loadApiEnvironment();
  const adapter = new FastifyAdapter({
    logger: {
      level: config.LOG_LEVEL,
      redact: {
        paths: [
          'req.headers.authorization',
          'req.headers.cookie',
          'req.headers.x-api-key',
          'res.headers.set-cookie',
        ],
        censor: '[REDACTED]',
      },
    },
    trustProxy: true,
  });

  const app = await NestFactory.create<NestFastifyApplication>(AppModule, adapter, {
    bufferLogs: true,
  });

  app.enableCors({ origin: config.WEB_ORIGIN, credentials: true });
  app.enableShutdownHooks();
  await app.listen({ host: config.API_HOST, port: config.API_PORT });
}

void bootstrap();
