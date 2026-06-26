import { z } from 'zod';

const booleanFromString = z.preprocess((value) => {
  if (typeof value !== 'string') return value;
  if (value.toLowerCase() === 'true') return true;
  if (value.toLowerCase() === 'false') return false;
  return value;
}, z.boolean());

const baseEnvironmentSchema = z.object({
  APP_ENV: z.enum(['local', 'test', 'staging', 'production']).default('local'),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  LOG_LEVEL: z.enum(['silent', 'fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
});

const dataServicesSchema = z.object({
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  REDIS_URL: z.url(),
  OBJECT_STORAGE_ENDPOINT: z.url(),
  OBJECT_STORAGE_REGION: z.string().min(1).default('us-east-1'),
  OBJECT_STORAGE_BUCKET: z.string().min(3),
  OBJECT_STORAGE_ACCESS_KEY: z.string().min(1),
  OBJECT_STORAGE_SECRET_KEY: z.string().min(8),
  OBJECT_STORAGE_FORCE_PATH_STYLE: booleanFromString.default(true),
});

const apiEnvironmentSchema = baseEnvironmentSchema.extend({
  API_HOST: z.string().min(1).default('0.0.0.0'),
  API_PORT: z.coerce.number().int().min(1).max(65_535).default(3001),
  WEB_ORIGIN: z.url().default('http://localhost:3000'),
});

const workerEnvironmentSchema = baseEnvironmentSchema.merge(dataServicesSchema);

const webEnvironmentSchema = z.object({
  NEXT_PUBLIC_API_BASE_URL: z.url().default('http://localhost:3001'),
});

export type ApiEnvironment = z.infer<typeof apiEnvironmentSchema>;
export type WorkerEnvironment = z.infer<typeof workerEnvironmentSchema>;
export type WebEnvironment = z.infer<typeof webEnvironmentSchema>;
export type DataServicesEnvironment = z.infer<typeof dataServicesSchema>;

export class EnvironmentValidationError extends Error {
  readonly issues: ReadonlyArray<{ path: string; message: string }>;

  constructor(issues: ReadonlyArray<{ path: string; message: string }>) {
    super(`Environment validation failed for: ${issues.map((issue) => issue.path).join(', ')}`);
    this.name = 'EnvironmentValidationError';
    this.issues = issues;
  }
}

function parseEnvironment<T>(schema: z.ZodType<T>, input: NodeJS.ProcessEnv): T {
  const result = schema.safeParse(input);

  if (!result.success) {
    throw new EnvironmentValidationError(
      result.error.issues.map((issue) => ({
        path: issue.path.join('.') || 'environment',
        message: issue.message,
      })),
    );
  }

  return result.data;
}

export function loadApiEnvironment(input: NodeJS.ProcessEnv = process.env): ApiEnvironment {
  return parseEnvironment(apiEnvironmentSchema, input);
}

export function loadWorkerEnvironment(input: NodeJS.ProcessEnv = process.env): WorkerEnvironment {
  return parseEnvironment(workerEnvironmentSchema, input);
}

export function loadWebEnvironment(input: NodeJS.ProcessEnv = process.env): WebEnvironment {
  return parseEnvironment(webEnvironmentSchema, input);
}

export function loadDataServicesEnvironment(
  input: NodeJS.ProcessEnv = process.env,
): DataServicesEnvironment {
  return parseEnvironment(dataServicesSchema, input);
}
