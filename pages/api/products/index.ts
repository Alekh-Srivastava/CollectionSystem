import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/db';
import { faker } from '@faker-js/faker';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Generate fake products
      const fakeProducts = Array.from({ length: 10 }).map(() => ({
        id: faker.datatype.uuid(),
        name: faker.commerce.productName(),
        price: faker.commerce.price(),
        description: faker.commerce.productDescription(),
        imageUrl: faker.image.imageUrl(),
      }));

      res.status(200).json(fakeProducts);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching products' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}