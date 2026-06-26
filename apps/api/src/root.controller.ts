import { Controller, Get } from '@nestjs/common';

@Controller('v1')
export class RootController {
  @Get()
  getApiMetadata(): { name: string; version: string; status: string } {
    return { name: 'ParseLayer API', version: 'v1', status: 'foundation' };
  }
}
