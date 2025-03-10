import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const collectionTypes = await prisma.collection_types.findMany({
        orderBy: {
          name: 'asc',
        },
      });

      res.status(200).json(collectionTypes);
    } catch (error) {
      console.error('Error fetching collection types:', error);
      res.status(500).json({ error: 'Error fetching collection types' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
