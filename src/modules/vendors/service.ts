import { prisma } from '../../database/prisma.js';
import { VendorRegisterInput, VendorUpdateInput } from './schema.js';
import { NotFoundError, ConflictError } from '../../utils/errors.js';
import { VendorStatus } from '@prisma/client';
import { graphService } from '../../neo4j/graph.service.js';

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

export async function registerVendor(userId: string, data: VendorRegisterInput) {
  const existing = await prisma.vendor.findUnique({ where: { userId } });
  if (existing) {
    throw new ConflictError('User already has a vendor profile');
  }

  let slug = slugify(data.businessName);
  const slugExists = await prisma.vendor.findUnique({ where: { slug } });
  if (slugExists) {
    slug += `-${Math.floor(Math.random() * 1000)}`;
  }

  const vendor = await prisma.vendor.create({
    data: {
      userId,
      businessName: data.businessName,
      slug,
      description: data.description,
      status: VendorStatus.PENDING,
    }
  });

  // Sync to Neo4j graph
  graphService.syncVendorNode({
    id: vendor.id,
    businessName: vendor.businessName,
    userId: vendor.userId,
    status: vendor.status,
  }).catch(console.error);

  return vendor;
}

export async function getVendor(id: string) {
  const vendor = await prisma.vendor.findUnique({ where: { id } });
  if (!vendor) throw new NotFoundError('Vendor not found');
  return vendor;
}

export async function getVendorBySlug(slug: string) {
  const vendor = await prisma.vendor.findUnique({ where: { slug } });
  if (!vendor) throw new NotFoundError('Vendor not found');
  return vendor;
}

export async function updateVendor(userId: string, id: string, data: VendorUpdateInput) {
  const vendor = await prisma.vendor.findUnique({ where: { id } });
  if (!vendor) throw new NotFoundError('Vendor not found');

  const updated = await prisma.vendor.update({
    where: { id },
    data,
  });

  graphService.syncVendorNode({
    id: updated.id,
    businessName: updated.businessName,
    userId: updated.userId,
    status: updated.status,
  }).catch(console.error);

  return updated;
}

export async function listVendors(query: any, isAdmin: boolean) {
  const where = isAdmin ? {} : { status: VendorStatus.ACTIVE };
  return prisma.vendor.findMany({ where });
}

export async function approveVendor(adminId: string, vendorId: string) {
  const vendor = await prisma.vendor.update({
    where: { id: vendorId },
    data: { 
      status: VendorStatus.ACTIVE,
      verifiedAt: new Date()
    }
  });

  await prisma.user.update({
    where: { id: vendor.userId },
    data: { role: 'VENDOR' }
  });

  graphService.syncVendorNode({
    id: vendor.id,
    businessName: vendor.businessName,
    userId: vendor.userId,
    status: vendor.status,
  }).catch(console.error);

  return vendor;
}
