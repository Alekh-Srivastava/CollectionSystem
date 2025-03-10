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
        message: `Cannot reject collection that is already ${reviewCollection.status}` 
      });
    }

    // Start a transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      // Delete all collection review products
      await tx.collection_review_products.deleteMany({
        where: { collection_review_id: String(id) },
      });

      // Update the review collection status
      const updatedReviewCollection = await tx.collections_review.update({
        where: { id: String(id) },
        data: { 
          status: 'rejected',
          updated_at: new Date(),
        },
      });

      return updatedReviewCollection;
    });

    // Revalidate the collections page
    try {
      await res.revalidate('/collections');
    } catch (error) {
      console.error('Error revalidating collections page:', error);
    }

    return res.status(200).json({ 
      message: 'Collection rejected successfully',
      collection: result,
    });
  } catch (error) {
    console.error('Error rejecting collection:', error);
    if (error instanceof Error) {
      return res.status(500).json({ message: `Error rejecting collection: ${error.message}` });
    }
    return res.status(500).json({ message: 'Error rejecting collection' });
  }
}
