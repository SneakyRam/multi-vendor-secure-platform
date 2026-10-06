// @ts-nocheck
import { prisma } from '../../database/prisma.js';
import { AppError } from '../../utils/errors.js';

export const getDashboardStats = async () => {
  const [users, vendors, orders] = await Promise.all([
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
    prisma.user.count({ where: { role: 'VENDOR' } }),
    prisma.order.count(),
  ]);

  const revenueResult = await prisma.order.aggregate({
    _sum: {
      subtotal: true,
    },
  });

  return {
    users,
    vendors,
    orders,
    revenue: revenueResult._sum?.subtotal || 0,
  };
};

export const suspendUser = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  }

  await prisma.user.update({
    where: { id: userId },
    data: { status: 'SUSPENDED' },
  });

  return { success: true };
};

export const approveVendor = async (vendorId: string) => {
  const vendor = await prisma.user.findUnique({ where: { id: vendorId, role: 'VENDOR' } });
  if (!vendor) {
    throw new AppError('Vendor not found', 404, 'VENDOR_NOT_FOUND');
  }

  await prisma.user.update({
    where: { id: vendorId },
    data: { status: 'ACTIVE' },
  });

  return { success: true };
};
