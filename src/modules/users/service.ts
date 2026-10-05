import { prisma } from '../../database/prisma.js';
import { UserUpdateInput } from './schema.js';
import { NotFoundError } from '../../utils/errors.js';

export async function getProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, role: true, status: true, createdAt: true, updatedAt: true }
  });
  if (!user) {
    throw new NotFoundError('User not found');
  }
  return user;
}

export async function updateProfile(userId: string, data: UserUpdateInput) {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data,
      select: { id: true, email: true, name: true, role: true, status: true, createdAt: true, updatedAt: true }
    });
    return user;
  } catch (error) {
    throw new NotFoundError('User not found');
  }
}

export async function listUsers(query: any) {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true, role: true, status: true, createdAt: true, updatedAt: true }
  });
  return users;
}
