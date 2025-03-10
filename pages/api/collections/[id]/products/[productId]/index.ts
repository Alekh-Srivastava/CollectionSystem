import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import slugify from 'slugify';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { name, description, productIds, typeId, userId } = req.body;

    if (!name || !typeId || !userId) {
      return res.status(400).json({ error: 'Missing required fields: name, typeId, and userId are required' });
    }

    try {
      const slug = slugify(name, { lower: true, strict: true });
      
      // Check if slug already exists
      const existingCollection = await prisma.collections.findUnique({
        where: { slug }
      });

      if (existingCollection) {
        return res.status(400).json({ error: 'A collection with this name already exists' });
      }

      const newCollection = await prisma.collections.create({
        data: {
          id: uuidv4(),
          name,
          description,
          slug,
          type: {
            connect: { id: typeId }
          },
          creator: {
            connect: { id: userId }
          },
          products: {
            create: productIds.map((productId: string) => ({
              product: {
                connect: { id: productId }
              }
            }))
          }
        },
        include: {
          products: {
            include: {
              product: true
            }
          },
          type: true,
          creator: true
        }
      });

      res.status(201).json(newCollection);
    } catch (error) {
      console.error('Error creating collection:', error);
      res.status(500).json({ error: 'Error creating collection' });
    }
  } else if (req.method === 'GET') {
    const { id } = req.query;

    try {
      const collection = await prisma.collections.findUnique({
        where: { id: String(id) },
        include: {
          products: {
            include: {
              product: true
            }
          },
          type: true,
          creator: true
        }
      });

      if (!collection) {
        return res.status(404).json({ error: 'Collection not found' });
      }

      res.status(200).json(collection);
    } catch (error) {
      console.error('Error fetching collection:', error);
      res.status(500).json({ error: 'Error fetching collection' });
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}