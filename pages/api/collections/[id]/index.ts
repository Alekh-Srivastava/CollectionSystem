import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Collection ID is required' });
  }

  try {
    switch (req.method) {
      case 'DELETE':
        // Try to delete from collections first
        try {
          // Delete in a transaction to ensure all related data is deleted
          const result = await prisma.$transaction(async (tx) => {
            // First delete all collection products
            await tx.collection_products.deleteMany({
              where: { collection_id: id },
            });

            // Then delete the collection itself
            const deletedCollection = await tx.collections.delete({
              where: { id },
            });

            return deletedCollection;
          });

          // Revalidate both collections and products pages
          await Promise.all([
            res.revalidate('/collections'),
            res.revalidate('/products')
          ]).catch(error => {
            console.error('Error revalidating pages:', error);
          });

          return res.status(200).json({
            message: 'Collection deleted successfully',
            collection: result,
          });
        } catch (error) {
          // If not found in collections, try collections_review
          const result = await prisma.$transaction(async (tx) => {
            // First delete all collection review products
            await tx.collection_review_products.deleteMany({
              where: { collection_review_id: id },
            });

            // Then delete the collection review itself
            const deletedReview = await tx.collections_review.delete({
              where: { id },
            });

            return deletedReview;
          });

          // Revalidate both collections and products pages
          await Promise.all([
            res.revalidate('/collections'),
            res.revalidate('/products')
          ]).catch(error => {
            console.error('Error revalidating pages:', error);
          });

          return res.status(200).json({
            message: 'Collection deleted successfully',
            collection: result,
          });
        }

      default:
        res.setHeader('Allow', ['DELETE']);
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('Error handling collection:', error);
    return res.status(500).json({ message: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}
