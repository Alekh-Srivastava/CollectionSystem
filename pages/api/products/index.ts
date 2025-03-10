import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const products = await prisma.products.findMany({
        where: {
          deleted_at: null,
          status: 'published',
        },
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          image_url: true,
          status: true,
        },
        orderBy: {
          created_at: 'desc',
        },
      });

      // Transform price to string with 2 decimal places
      const formattedProducts = products.map(product => ({
        ...product,
        price: product.price ? parseFloat(product.price.toString()).toFixed(2) : '0.00'
      }));

      res.status(200).json(formattedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: 'Error fetching products' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}