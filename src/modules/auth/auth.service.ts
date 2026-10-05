import { prisma } from '../../database/prisma.js';
import { hashPassword, verifyPassword } from '../../security/password.js';
import { createSession, revokeSession } from '../../security/sessions.js';
import { ConflictError, UnauthorizedError, ForbiddenError, NotFoundError } from '../../utils/errors.js';
import { RegisterInput, LoginInput } from './auth.schema.js';
import { env } from '../../config/env.js';
import { logger } from '../../utils/logger.js';

export async function register(input: RegisterInput, ipAddress?: string, userAgent?: string) {
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (existingUser) {
    throw new ConflictError('Email already in use');
  }

  const hashedPassword = await hashPassword(input.password);

  const user = await prisma.user.create({
    data: {
      email: input.email,
      passwordHash: hashedPassword,
      name: input.name,
      role: input.role,
      status: 'ACTIVE',
    },
  });

  const { token, session } = await createSession(user.id, user.role, ipAddress, userAgent);

  logger.info({ event: 'USER_REGISTERED', userId: user.id, role: user.role });

  const safeUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    status: user.status,
  };

  return { user: safeUser, token };
}

export async function login(input: LoginInput, ipAddress?: string, userAgent?: string) {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!user) {
    logger.warn({ event: 'LOGIN_FAILED', reason: 'USER_NOT_FOUND', email: input.email });
    throw new UnauthorizedError('Invalid credentials');
  }

  const isValidPassword = await verifyPassword(user.passwordHash, input.password);

  if (!isValidPassword) {
    logger.warn({ event: 'LOGIN_FAILED', reason: 'INVALID_PASSWORD', userId: user.id });
    throw new UnauthorizedError('Invalid credentials');
  }

  if (user.status === 'SUSPENDED') {
    logger.warn({ event: 'LOGIN_FAILED', reason: 'USER_SUSPENDED', userId: user.id });
    throw new ForbiddenError('Account is suspended');
  }

  const { token, session } = await createSession(user.id, user.role, ipAddress, userAgent);

  logger.info({ event: 'USER_LOGGED_IN', userId: user.id });

  const safeUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    status: user.status,
  };

  return { user: safeUser, token };
}

export async function logout(token: string) {
  await revokeSession(token);
  logger.info({ event: 'USER_LOGGED_OUT' });
}

export async function getMe(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    }
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  return user;
}
