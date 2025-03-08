import { prisma } from '@/lib/db';
import { ProductStatus } from '@prisma/client';

export async function getProducts(search?: string) {
  const whereCondition = {
    status: ProductStatus.published,
    deleted_at: null,
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { description: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {}),
  };

  return prisma.products.findMany({
    where: whereCondition,
    orderBy: {
      name: 'asc',
    },
    take: 100, // Limit to 100 products for performance
  });
}

export async function getProductById(id: string) {
  return prisma.products.findUnique({
    where: { id },
  });
}

export async function getProductsByIds(ids: string[]) {
  return prisma.products.findMany({
    where: {
      id: { in: ids },
      status: ProductStatus.published,
      deleted_at: null,
    },
    orderBy: {
      name: 'asc',
    },
  });
}
