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
    const collection = await prisma.collections_review.findUnique({
      where: { id: String(id) },
    });

    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    if (collection.status !== 'pending') {
      return res.status(400).json({ 
        message: `Cannot reject collection that is already ${collection.status}` 
      });
    }

    // Update the collection status to rejected
    const updatedCollection = await prisma.collections_review.update({
      where: { id: String(id) },
      data: { 
        status: 'rejected',
        updated_at: new Date(),
      },
      include: {
        products: true,
        type: true,
      },
    });

    return res.status(200).json({ 
      message: 'Collection rejected successfully',
      collection: updatedCollection,
    });
  } catch (error) {
    console.error('Error rejecting collection:', error);
    if (error instanceof Error) {
      return res.status(500).json({ message: `Error rejecting collection: ${error.message}` });
    }
    return res.status(500).json({ message: 'Error rejecting collection' });
  }
}
