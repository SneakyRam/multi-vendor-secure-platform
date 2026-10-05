import { Router } from 'express';
import { prisma } from '../database/prisma.js';
import { redis } from '../redis/redis.js';
import { neo4jDriver } from '../neo4j/neo4j.js';

const router = Router();

router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

router.get('/live', (req, res) => {
  res.json({ status: 'ok' });
});

router.get('/ready', async (req, res) => {
  const deps = {
    api: 'ok',
    postgres: 'ok',
    redis: 'ok',
    neo4j: 'ok'
  };

  let status = 'ok';

  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (error) {
    deps.postgres = 'error';
    status = 'error';
  }

  try {
    const ping = await redis.ping();
    if (ping !== 'PONG') throw new Error();
  } catch (error) {
    deps.redis = 'error';
    status = 'error';
  }

  try {
    await neo4jDriver.verifyConnectivity();
  } catch (error) {
    deps.neo4j = 'error';
    if (status !== 'error') {
      status = 'degraded';
    }
  }

  res.status(status === 'error' ? 503 : 200).json({
    status,
    dependencies: deps
  });
});

export default router;
