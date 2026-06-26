import { describe, expect, it } from 'vitest';

import { WorkerRuntimeService } from '../src/worker-runtime.service.js';

describe('WorkerRuntimeService', () => {
  it('initializes without connecting to external services during unit tests', () => {
    const service = new WorkerRuntimeService();
    expect(() => service.onModuleInit()).not.toThrow();
  });
});
