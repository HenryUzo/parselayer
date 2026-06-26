import { Controller, Get } from '@nestjs/common';
import { loadApiEnvironment } from '@parselayer/config';

interface HealthResponse {
  status: 'ok' | 'ready';
  service: 'api';
  environment: string;
  timestamp: string;
}

@Controller()
export class HealthController {
  private readonly environment = loadApiEnvironment().APP_ENV;

  @Get('health')
  getHealth(): HealthResponse {
    return {
      status: 'ok',
      service: 'api',
      environment: this.environment,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('ready')
  getReadiness(): HealthResponse {
    return {
      status: 'ready',
      service: 'api',
      environment: this.environment,
      timestamp: new Date().toISOString(),
    };
  }
}
