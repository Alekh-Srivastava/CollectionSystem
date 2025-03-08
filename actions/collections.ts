import { prisma } from '@/lib/db';
import { generateSlug } from '@/lib/utils';
import { CollectionFormValues } from '@/lib/validation';
import { ReviewStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function getCollectionTypes() {
  return prisma.collection_types.findMany({
    orderBy: {
      name: 'asc'
    }
  });
}

export async function getCollections() {
  return prisma.collections.findMany({
    include: {
      type: true,
      creator: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      _count: {
        select: {
          products: true
        }
      }
    },
    orderBy: {
      created_at: 'desc'
    }
  });
}

export async function getCollectionById(id: string) {
  return prisma.collections.findUnique({
    where: { id },
    include: {
      type: true,
      creator: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      products: {
        include: {
          product: true
        },
        orderBy: {
          display_order: 'asc'
        }
      }
    }
  });
}

export async function getCollectionsReview() {
  return prisma.collections_review.findMany({
    include: {
      type: true,
      creator: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      _count: {
        select: {
          products: true
        }
      }
    },
    orderBy: {
      created_at: 'desc'
    }
  });
}

export async function getCollectionReviewById(id: string) {
  return prisma.collections_review.findUnique({
    where: { id },
    include: {
      type: true,
      creator: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      products: {
        include: {
          product: true
        },
        orderBy: {
          display_order: 'asc'
        }
      }
    }
  });
}

export async function createCollectionReview(
  data: CollectionFormValues,
  userId: string
) {
  const slug = generateSlug(data.name);
  
  // Check if slug already exists in collections or collections_review
  const existingCollection = await prisma.collections.findUnique({
    where: { slug }
  });
  
  const existingReviewCollection = await prisma.collections_review.findUnique({
    where: { slug }
  });
  
  if (existingCollection || existingReviewCollection) {
    throw new Error('A collection with this name already exists');
  }
  
  const collection = await prisma.collections_review.create({
    data: {
      name: data.name,
      slug,
      description: data.description,
      image_url: data.image_url || null,
      banner_url: data.banner_url || null,
      is_featured: data.is_featured,
      status: ReviewStatus.pending,
      type_id: data.type_id,
      created_by: userId,
      marketing_images: data.marketing_images || [],
      products: {
        create: data.product_ids.map((productId, index) => ({
          product_id: productId,
          display_order: index
        }))
      }
    }
  });
  
  revalidatePath('/collections');
  return collection;
}

export async function updateCollectionReview(
  id: string,
  data: CollectionFormValues
) {
  const collection = await prisma.collections_review.findUnique({
    where: { id }
  });
  
  if (!collection) {
    throw new Error('Collection not found');
  }
  
  // Only update slug if name has changed
  let slug = collection.slug;
  if (collection.name !== data.name) {
    slug = generateSlug(data.name);
    
    // Check if new slug already exists
    const existingCollection = await prisma.collections.findFirst({
      where: { 
        slug,
        id: { not: id }
      }
    });
    
    const existingReviewCollection = await prisma.collections_review.findFirst({
      where: { 
        slug,
        id: { not: id }
      }
    });
    
    if (existingCollection || existingReviewCollection) {
      throw new Error('A collection with this name already exists');
    }
  }
  
  // Delete existing product associations
  await prisma.collection_review_products.deleteMany({
    where: { collection_review_id: id }
  });
  
  // Update collection with new data
  const updatedCollection = await prisma.collections_review.update({
    where: { id },
    data: {
      name: data.name,
      slug,
      description: data.description,
      image_url: data.image_url || null,
      banner_url: data.banner_url || null,
      is_featured: data.is_featured,
      status: ReviewStatus.pending, // Reset to pending on update
      type_id: data.type_id,
      marketing_images: data.marketing_images || [],
      products: {
        create: data.product_ids.map((productId, index) => ({
          product_id: productId,
          display_order: index
        }))
      }
    }
  });
  
  revalidatePath('/collections');
  revalidatePath(`/collections/${id}`);
  return updatedCollection;
}

export async function approveCollectionReview(id: string, userId: string) {
  const reviewCollection = await prisma.collections_review.findUnique({
    where: { id },
    include: {
      products: true
    }
  });
  
  if (!reviewCollection) {
    throw new Error('Collection not found');
  }
  
  // Create the approved collection
  const approvedCollection = await prisma.collections.create({
    data: {
      name: reviewCollection.name,
      slug: reviewCollection.slug,
      description: reviewCollection.description,
      image_url: reviewCollection.image_url,
      banner_url: reviewCollection.banner_url,
      display_order: 0, // Default order
      is_featured: reviewCollection.is_featured,
      type_id: reviewCollection.type_id,
      created_by: reviewCollection.created_by, // Keep original creator
      marketing_images: reviewCollection.marketing_images,
    }
  });
  
  // Add products to the approved collection
  for (const product of reviewCollection.products) {
    await prisma.collection_products.create({
      data: {
        collection_id: approvedCollection.id,
        product_id: product.product_id,
        display_order: product.display_order
      }
    });
  }
  
  // Update the review collection status
  await prisma.collections_review.update({
    where: { id },
    data: {
      status: ReviewStatus.approved
    }
  });
  
  revalidatePath('/collections');
  return approvedCollection;
}

export async function rejectCollectionReview(id: string, notes: string) {
  const updatedCollection = await prisma.collections_review.update({
    where: { id },
    data: {
      status: ReviewStatus.rejected,
      reviewer_notes: notes
    }
  });
  
  revalidatePath('/collections');
  return updatedCollection;
}
