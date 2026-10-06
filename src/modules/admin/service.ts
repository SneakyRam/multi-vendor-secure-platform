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

export const getSecurityEvents = async (limit: number = 50) => {
  const events = await prisma.securityEvent.findMany({
    orderBy: { timestamp: 'desc' },
    take: limit,
    include: {
      actor: {
        select: { email: true, name: true, role: true }
      }
    }
  });
  return events;
};

export const seedDummyData = async () => {
  const { graphService } = await import('../../neo4j/graph.service.js');
  
  // Create some fake users
  const users = [
    { id: 'usr_mock_1', email: 'alice@example.com', name: 'Alice', role: 'CUSTOMER', status: 'ACTIVE' },
    { id: 'usr_mock_2', email: 'bob_vendor@example.com', name: 'Bob', role: 'VENDOR', status: 'ACTIVE' },
    { id: 'usr_mock_3', email: 'eve_hacker@example.com', name: 'Eve', role: 'CUSTOMER', status: 'SUSPENDED' },
  ];

  for (const u of users) {
    await graphService.syncUserNode(u);
  }

  // Create devices
  await graphService.syncDeviceRelationship({ userId: 'usr_mock_1', ipAddress: '192.168.1.100', userAgent: 'Chrome/100' });
  await graphService.syncDeviceRelationship({ userId: 'usr_mock_2', ipAddress: '10.0.0.5', userAgent: 'Safari/15' });
  await graphService.syncDeviceRelationship({ userId: 'usr_mock_3', ipAddress: '185.220.101.4', userAgent: 'Tor Browser' }); // Suspicious IP
  await graphService.syncDeviceRelationship({ userId: 'usr_mock_1', ipAddress: '185.220.101.4', userAgent: 'Tor Browser' }); // Alice compromised by Eve's IP

  // Create a Vendor
  await graphService.syncVendorNode({ id: 'vnd_mock_1', businessName: 'Bob Store', userId: 'usr_mock_2', status: 'ACTIVE' });

  // Create Orders
  await graphService.syncOrderRelationship({ customerId: 'usr_mock_1', orderId: 'ord_mock_101', vendorId: 'vnd_mock_1' });
  await graphService.syncOrderRelationship({ customerId: 'usr_mock_3', orderId: 'ord_mock_102', vendorId: 'vnd_mock_1' }); // Suspicious order

  // Create Security Events
  await graphService.syncSecurityEvent({
    id: 'sec_mock_1', actorId: 'usr_mock_3', action: 'XSS_ATTEMPT', decision: 'DENY', resourceType: 'Order', resourceId: 'ord_mock_102', timestamp: new Date()
  });
  await graphService.syncSecurityEvent({
    id: 'sec_mock_2', actorId: 'usr_mock_1', action: 'LOGIN', decision: 'ALLOW', resourceType: 'Auth', resourceId: null, timestamp: new Date()
  });

  return { message: 'Dummy data injected into Neo4j graph successfully!' };
};
