import { prisma } from '../../database/prisma.js';
import { hashPassword, verifyPassword } from '../../security/password.js';
import { createSession, revokeSession } from '../../security/sessions.js';
import { ConflictError, UnauthorizedError, ForbiddenError, NotFoundError } from '../../utils/errors.js';
import { RegisterInput, LoginInput } from './auth.schema.js';
import { env } from '../../config/env.js';
import { logger } from '../../utils/logger.js';
import { graphService } from '../../neo4j/graph.service.js';
import { OAuth2Client } from 'google-auth-library';

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

  // Fire-and-forget sync to Neo4j graph
  graphService.syncUserNode({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    status: user.status,
  }).catch(console.error);

  if (ipAddress) {
    graphService.syncDeviceRelationship({
      userId: user.id,
      ipAddress: ipAddress,
      userAgent: userAgent || null,
    }).catch(console.error);
  }

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

  if (ipAddress) {
    graphService.syncDeviceRelationship({
      userId: user.id,
      ipAddress: ipAddress,
      userAgent: userAgent || null,
    }).catch(console.error);
  }

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

export async function googleLogin(token: string, ipAddress?: string, userAgent?: string) {
  const client = new OAuth2Client(env.GOOGLE_CLIENT_ID);
  
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: env.GOOGLE_CLIENT_ID,
  });
  
  const payload = ticket.getPayload();
  if (!payload || !payload.email || !payload.sub) {
    throw new UnauthorizedError('Invalid Google Token');
  }

  const { email, sub: googleId, name, picture } = payload;
  
  let user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        name: name || 'Google User',
        googleId,
        status: 'ACTIVE',
        role: 'CUSTOMER'
      }
    });
    
    logger.info({ event: 'USER_REGISTERED_VIA_GOOGLE', userId: user.id });
    
    graphService.syncUserNode({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      status: user.status,
    }).catch(console.error);
  } else if (!user.googleId) {
    user = await prisma.user.update({
      where: { id: user.id },
      data: { googleId }
    });
  }

  if (user.status === 'SUSPENDED') {
    logger.warn({ event: 'LOGIN_FAILED', reason: 'USER_SUSPENDED', userId: user.id });
    throw new ForbiddenError('Account is suspended');
  }

  const { token: sessionToken, session } = await createSession(user.id, user.role, ipAddress, userAgent);

  logger.info({ event: 'USER_LOGGED_IN_VIA_GOOGLE', userId: user.id });

  if (ipAddress) {
    graphService.syncDeviceRelationship({
      userId: user.id,
      ipAddress: ipAddress,
      userAgent: userAgent || null,
    }).catch(console.error);
  }

  const safeUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    status: user.status,
  };

  return { user: safeUser, token: sessionToken };
}
