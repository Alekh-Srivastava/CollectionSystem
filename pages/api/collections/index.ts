import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import slugify from 'slugify';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { name, description, productIds, slug, type, creator } = req.body;

    try {
      const newCollection = await prisma.collections.create({
        data: {
          id: uuidv4(), // Generate a unique ID for the collection
          name,
          description,
          slug,
          type: {
            connect: { id: type }, // Assuming type is an ID of an existing type
          },
          creator: {
            connect: { id: creator }, // Connect to an existing user by their ID
          },
          products: {
            connect: productIds.map((productId: string) => ({ id: productId })),
          },
        },
      });

      res.status(201).json(newCollection);
    } catch (error) {
      console.log("error is here");

      res.status(500).json({ error: 'Error creating collection' });
    }
  } else if (req.method === 'GET') {
    try {
      const collections = await prisma.collections.findMany({
        where: {
          deleted_at: null,
        },
        include: {
          products: {
            include: {
              product: true,
            },
          },
          type: true,
          creator: true,
        },
        orderBy: {
          created_at: 'desc',
        },
      });

      res.status(200).json(collections);
    } catch (error) {
      console.error('Error fetching collections:', error);
      res.status(500).json({ error: 'Error fetching collections' });
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}