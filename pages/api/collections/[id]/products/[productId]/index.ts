import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { name, description, productIds } = req.body;

    try {
      const newCollection = await prisma.collections.create({
        data: {
          id: uuidv4(), // Generate a unique ID for the collection
          name,
          description,
          products: {
            connect: productIds.map((productId: string) => ({ id: productId })),
          },
        },
      });

      res.status(201).json(newCollection);
    } catch (error) {
      res.status(500).json({ error: 'Error creating collection' });
    }
  } else if (req.method === 'GET') {
    const { id } = req.query;

    try {
      const collection = await prisma.collections.findUnique({
        where: { id: String(id) },
        include: {
          products: true,
        },
      });

      if (!collection) {
        return res.status(404).json({ error: 'Collection not found' });
      }

      res.status(200).json(collection);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching collection' });
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}