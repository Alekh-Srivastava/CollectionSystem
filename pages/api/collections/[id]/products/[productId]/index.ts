import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
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
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}