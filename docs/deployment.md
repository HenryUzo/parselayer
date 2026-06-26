# Deployment

## Environments

- local development
- automated test
- staging
- production

Each environment has separate credentials, databases, queues, object-storage locations, provider configuration, and observability context.

## Target platform

- Next.js web application: Vercel or AWS
- API and workers: AWS ECS Fargate
- PostgreSQL: AWS RDS
- Redis: AWS ElastiCache
- Object storage: AWS S3
- Secrets: AWS Secrets Manager
- Edge protection: AWS WAF and CloudFront where applicable

A lower-cost beta may use Neon, Railway, or Render, but domain and provider interfaces must remain portable.

## CI/CD

Pull requests run formatting, linting, type checking, tests, security checks, migration validation, and production builds. Merges deploy to staging first. Production promotion requires passing checks, migration review, health checks, release identification, and rollback readiness.

## Deployment rules

- never deploy directly to production without staging verification
- validate required environment variables at startup
- run backward-compatible migrations before application rollout where possible
- use health and readiness probes
- support graceful API and worker shutdown
- preserve the previous deployable release
- record release SHA, schema version, pipeline version, and migration state

## Secrets

Secrets remain outside source control. Browser-accessible variables must never contain server credentials. Rotate provider, API, webhook, and infrastructure secrets through documented procedures.

## Backup and recovery

Use encrypted backups and point-in-time recovery for PostgreSQL. Define recovery-time and recovery-point objectives before production. Test restoration and document limitations of deletion propagation into backups.
