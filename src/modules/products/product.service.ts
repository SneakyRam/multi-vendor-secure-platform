// @ts-nocheck
import prisma from '../../database/prisma/client.js';
import { NotFoundError, ForbiddenError, BadRequestError } from '../../utils/errors.js';
import { z } from 'zod';
import { ProductCreateInput, ProductUpdateInput, ProductQuery } from './product.schema.js';
import { parsePagination, buildPaginationMeta } from '../../utils/pagination.js';

type CreateInput = z.infer<typeof ProductCreateInput>;
type UpdateInput = z.infer<typeof ProductUpdateInput>;
type QueryInput = z.infer<typeof ProductQuery>;

export async function createProduct(userId: string, data: CreateInput) {
  const vendor = await prisma.vendor.findUnique({
    where: { userId },
  });
  
  if (!vendor) {
    throw new NotFoundError('Vendor profile not found for user');
  }

  const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).substring(2, 8);

  const product = await prisma.product.create({
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      compareAtPrice: data.compareAtPrice,
      stock: data.stock,
      sku: data.sku,
      categoryId: data.categoryId,
      images: data.images || [],
      slug,
      vendorId: vendor.id,
      status: 'ACTIVE'
    },
  });
  return product;
}

export async function updateProduct(userId: string, productId: string, data: UpdateInput) {
  const vendor = await prisma.vendor.findUnique({
    where: { userId },
  });
  
  if (!vendor) {
    throw new NotFoundError('Vendor profile not found');
  }

  const existingProduct = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!existingProduct) {
    throw new NotFoundError('Product not found');
  }

  if (existingProduct.vendorId !== vendor.id) {
    throw new ForbiddenError('You do not have permission to update this product');
  }

  let slug = existingProduct.slug;
  if (data.name && data.name !== existingProduct.name) {
    slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).substring(2, 8);
  }

  const product = await prisma.product.update({
    where: { id: productId },
    data: {
      ...data,
      ...(data.name ? { slug } : {})
    },
  });
  return product;
}

export async function listProducts(query: QueryInput) {
  const { page, pageSize, skip } = parsePagination({ page: query.page, pageSize: query.pageSize });
  
  const { categorySlug, vendorSlug, minPrice, maxPrice, status } = query;
  
  const where: any = {
    status: status || { not: 'ARCHIVED' }
  };
  
  if (categorySlug) {
    where.category = {
      slug: categorySlug
    };
  }
  
  if (vendorSlug) {
    where.vendor = {
      slug: vendorSlug
    };
  }
  
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = minPrice;
    if (maxPrice !== undefined) where.price.lte = maxPrice;
  }
  
  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: pageSize,
      include: {
        vendor: {
          select: { id: true, storeName: true, slug: true }
        },
        category: {
          select: { id: true, name: true, slug: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.product.count({ where })
  ]);
  
  const meta = buildPaginationMeta(total, page, pageSize);
  
  return { items, meta };
}

export async function getProduct(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      vendor: {
        select: { id: true, storeName: true, slug: true, description: true, logoUrl: true }
      },
      category: {
        select: { id: true, name: true, slug: true }
      }
    }
  });
  
  if (!product) {
    throw new NotFoundError('Product not found');
  }
  
  return product;
}

export async function deleteProduct(userId: string, productId: string) {
  const vendor = await prisma.vendor.findUnique({
    where: { userId },
  });
  
  if (!vendor) {
    throw new NotFoundError('Vendor profile not found');
  }

  const existingProduct = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!existingProduct) {
    throw new NotFoundError('Product not found');
  }

  if (existingProduct.vendorId !== vendor.id) {
    throw new ForbiddenError('You do not have permission to delete this product');
  }

  await prisma.product.update({
    where: { id: productId },
    data: { status: 'ARCHIVED' }
  });
  
  return { success: true };
}

export async function updateStock(userId: string, productId: string, quantity: number) {
  const vendor = await prisma.vendor.findUnique({
    where: { userId },
  });
  
  if (!vendor) {
    throw new NotFoundError('Vendor profile not found');
  }

  const existingProduct = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!existingProduct) {
    throw new NotFoundError('Product not found');
  }

  if (existingProduct.vendorId !== vendor.id) {
    throw new ForbiddenError('You do not have permission to update this product');
  }

  const updatedProduct = await prisma.product.update({
    where: { id: productId },
    data: {
      stock: quantity
    }
  });
  
  return updatedProduct;
}
