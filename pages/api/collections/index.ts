import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const collections = await prisma.collections.findMany({
        include: {
          products: true,
        },
      });
      res.status(200).json(collections);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching collections' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}