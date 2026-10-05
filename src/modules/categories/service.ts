import { prisma } from '../../database/prisma.js';
import { CategoryCreateInput, CategoryUpdateInput } from './schema.js';
import { NotFoundError, ConflictError } from '../../utils/errors.js';

export async function createCategory(data: CategoryCreateInput) {
  const existing = await prisma.category.findUnique({ where: { slug: data.slug } });
  if (existing) {
    throw new ConflictError('Category with this slug already exists');
  }

  return prisma.category.create({ data });
}

export async function getCategoryBySlug(slug: string) {
  const category = await prisma.category.findUnique({
    where: { slug },
    include: { children: true }
  });
  if (!category) throw new NotFoundError('Category not found');
  return category;
}

export async function updateCategory(id: string, data: CategoryUpdateInput) {
  if (data.slug) {
    const existing = await prisma.category.findUnique({ where: { slug: data.slug } });
    if (existing && existing.id !== id) {
      throw new ConflictError('Category with this slug already exists');
    }
  }

  try {
    return await prisma.category.update({
      where: { id },
      data,
    });
  } catch (error) {
    throw new NotFoundError('Category not found');
  }
}

export async function listCategories() {
  return prisma.category.findMany({
    where: { parentId: null },
    include: { children: true }
  });
}

export async function deleteCategory(id: string) {
  try {
    await prisma.category.delete({ where: { id } });
  } catch (error) {
    throw new NotFoundError('Category not found');
  }
}
