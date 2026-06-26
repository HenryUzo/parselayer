# Local Development

## Prerequisites

- Node.js 22
- pnpm 11.9.0
- Docker with Docker Compose

## Setup

1. Copy `.env.example` to `.env`.
2. Run `pnpm install`.
3. Start local services with `pnpm infra:up`.
4. Generate the Prisma client with `pnpm db:generate`.
5. Apply migrations with `pnpm db:migrate`.
6. Start applications with `pnpm dev`.

Default local endpoints:

- Web: `http://localhost:3000`
- API: `http://localhost:3001`
- API health: `http://localhost:3001/health`
- MinIO API: `http://localhost:9000`
- MinIO console: `http://localhost:9001`

Local credentials are development-only and must never be reused outside local environments.

## Quality commands

- `pnpm format:check`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm test:integration`
- `pnpm build`

## Database commands

- `pnpm db:generate`
- `pnpm db:migrate`
- `pnpm db:migrate:deploy`
- `pnpm db:seed`

Prisma 7 requires explicit client generation after schema or migration changes.
