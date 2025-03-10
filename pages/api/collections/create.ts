import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { nanoid } from 'nanoid';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, description, type_id, products } = req.body;

    // Validate required fields
    if (!name?.trim()) {
      return res.status(400).json({ message: 'Collection name is required' });
    }

    if (!type_id) {
      return res.status(400).json({ message: 'Collection type is required' });
    }

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: 'At least one product must be selected' });
    }

    // Validate that all products exist and are published
    const existingProducts = await prisma.products.findMany({
      where: {
        id: { in: products },
        status: 'published',
        deleted_at: null,
      },
    });

    if (existingProducts.length !== products.length) {
      return res.status(400).json({ 
        message: 'Some selected products are not available' 
      });
    }

    // Generate a URL-friendly slug from the name
    const slug = `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${nanoid(6)}`;

    // Get the first user from the database to use as creator
    const defaultUser = await prisma.users.findFirst();

    if (!defaultUser) {
      return res.status(500).json({ message: 'No users found in the database. Please contact administrator.' });
    }

    // Create a new collection in review
    const collection = await prisma.collections_review.create({
      data: {
        name: name.trim(),
        description: description?.trim(),
        slug,
        type_id,
        status: 'pending',
        created_by: defaultUser.id,
        products: {
          create: products.map((productId: string, index: number) => ({
            product_id: productId,
            display_order: index,
          })),
        },
      },
      include: {
        products: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                description: true,
                price: true,
                image_url: true,
              },
            },
          },
        },
        type: true,
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return res.status(201).json({
      message: 'Collection created successfully and sent for review',
      collection,
    });
  } catch (error) {
    console.error('Error creating collection:', error);
    // Handle Prisma errors
    if (error && typeof error === 'object' && 'code' in error) {
      if (error.code === 'P2002') {
        return res.status(400).json({ message: 'A collection with this name already exists.' });
      } else if (error.code === 'P2003') {
        return res.status(400).json({ message: 'Invalid type_id or product_id provided.' });
      }
    }
    return res.status(500).json({ message: 'Error creating collection. Please try again.' });
  }
}
