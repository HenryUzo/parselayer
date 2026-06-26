import { createPrismaClient } from '../src/index.js';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required to seed the database.');
}

const prisma = createPrismaClient(databaseUrl);

try {
  console.info('ParseLayer seed completed. No production-like sample data is inserted by default.');
} finally {
  await prisma.$disconnect();
}
