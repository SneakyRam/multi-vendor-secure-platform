// @ts-nocheck
import { randomBytes, createHash } from 'crypto';
import { prisma } from '../database/prisma.js';
import { cacheGet, cacheSet, cacheDel } from '../redis/cache.js';
import { env } from '../config/env.js';

const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days

/**
 * Hash a session token for storage.
 */
function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

/**
 * Create a new session.
 */
export async function createSession(userId: string, role: string, ipAddress?: string, userAgent?: string): Promise<{ token: string, session: any }> {
  const token = randomBytes(32).toString('hex');
  const tokenHash = hashToken(token);
  
  const expiresAt = new Date(Date.now() + SESSION_TTL_SECONDS * 1000);

  const session = await prisma.session.create({
    data: {
      userId,
      tokenHash,
      expiresAt,
      ipAddress,
      userAgent,
    },
  });

  const sessionData = {
    id: session.id,
    userId,
    role,
    expiresAt: expiresAt.toISOString(),
    revokedAt: null,
  };

  await cacheSet(`session:${tokenHash}`, sessionData, SESSION_TTL_SECONDS);

  return { token, session: sessionData };
}

/**
 * Validate a session token.
 */
export async function validateSession(token: string): Promise<any | null> {
  const tokenHash = hashToken(token);
  const cacheKey = `session:${tokenHash}`;

  let sessionData = await cacheGet<any>(cacheKey);

  if (!sessionData) {
    const session = await prisma.session.findUnique({
      where: { tokenHash },
      include: { user: true }
    });

    if (!session) return null;

    sessionData = {
      id: session.id,
      userId: session.userId,
      role: session.user.role,
      expiresAt: session.expiresAt.toISOString(),
      revokedAt: session.revokedAt ? session.revokedAt.toISOString() : null,
    };

    if (!session.revokedAt && session.expiresAt > new Date()) {
      const ttl = Math.max(0, Math.floor((session.expiresAt.getTime() - Date.now()) / 1000));
      if (ttl > 0) {
        await cacheSet(cacheKey, sessionData, ttl);
      }
    }
  }

  if (sessionData.revokedAt) return null;
  if (new Date(sessionData.expiresAt) < new Date()) return null;

  return sessionData;
}

/**
 * Revoke a session.
 */
export async function revokeSession(token: string): Promise<void> {
  const tokenHash = hashToken(token);
  
  await prisma.session.update({
    where: { tokenHash },
    data: { revokedAt: new Date() },
  });

  await cacheDel(`session:${tokenHash}`);
}
