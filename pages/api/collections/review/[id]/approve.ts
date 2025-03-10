import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { id } = req.query;

    // Check if the collection exists and is pending
    const reviewCollection = await prisma.collections_review.findUnique({
      where: { id: String(id) },
      include: {
        products: true,
      },
    });

    if (!reviewCollection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    if (reviewCollection.status !== 'pending') {
      return res.status(400).json({ 
        message: `Cannot approve collection that is already ${reviewCollection.status}` 
      });
    }

    // Start a transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      // Create the approved collection
      const collection = await tx.collections.create({
        data: {
          name: reviewCollection.name,
          description: reviewCollection.description,
          slug: reviewCollection.slug,
          type_id: reviewCollection.type_id,
          created_by: reviewCollection.created_by,
          image_url: reviewCollection.image_url,
          banner_url: reviewCollection.banner_url,
          display_order: reviewCollection.display_order,
          is_featured: reviewCollection.is_featured,
          marketing_images: reviewCollection.marketing_images,
          status: 'published',
          products: {
            create: reviewCollection.products.map((product) => ({
              product_id: product.product_id,
              display_order: product.display_order,
            })),
          },
        },
        include: {
          products: true,
          type: true,
        },
      });

      // Update the review collection status
      const updatedReviewCollection = await tx.collections_review.update({
        where: { id: String(id) },
        data: { 
          status: 'approved',
          updated_at: new Date(),
        },
        include: {
          products: true,
          type: true,
        },
      });

      return { collection, reviewCollection: updatedReviewCollection };
    });

    return res.status(200).json({ 
      message: 'Collection approved successfully',
      collection: result.collection,
      reviewCollection: result.reviewCollection,
    });
  } catch (error) {
    console.error('Error approving collection:', error);
    if (error instanceof Error) {
      return res.status(500).json({ message: `Error approving collection: ${error.message}` });
    }
    return res.status(500).json({ message: 'Error approving collection' });
  }
}
