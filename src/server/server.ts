import { app } from './app.js';
import { env } from '../config/env.js';
import logger from '../utils/logger.js';
import { prisma } from '../database/prisma.js';
import { redis } from '../redis/redis.js';
import { neo4jDriver } from '../neo4j/neo4j.js';

const server = app.listen(env.PORT, () => {
  logger.info({ port: env.PORT, env: env.NODE_ENV }, 'MarketHub server started');
});

const shutdown = async (signal: string) => {
  logger.info({ signal }, 'Shutdown signal received');
  server.close(async () => {
    logger.info('HTTP server closed');
    await prisma.$disconnect();
    logger.info('PostgreSQL disconnected');
    redis.disconnect();
    logger.info('Redis disconnected');
    await neo4jDriver.close();
    logger.info('Neo4j disconnected');
    process.exit(0);
  });
  // Force shutdown after 10s
  setTimeout(() => process.exit(1), 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('unhandledRejection', (err) => {
  logger.fatal({ err }, 'Unhandled rejection');
  process.exit(1);
});
