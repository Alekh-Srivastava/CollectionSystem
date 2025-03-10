const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedTestData() {
  try {
    // Create a test user if none exists
    const user = await prisma.users.upsert({
      where: { email: 'test@example.com' },
      update: {},
      create: {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123', // In production, this should be hashed
      },
    });

    // Create collection types
    const types = await Promise.all([
      prisma.collection_types.upsert({
        where: { slug: 'featured' },
        update: {},
        create: {
          name: 'Featured',
          slug: 'featured',
          description: 'Featured collections displayed on homepage',
          icon: '⭐',
        },
      }),
      prisma.collection_types.upsert({
        where: { slug: 'seasonal' },
        update: {},
        create: {
          name: 'Seasonal',
          slug: 'seasonal',
          description: 'Seasonal collections',
          icon: '🌸',
        },
      }),
    ]);

    // Create test products
    const products = await Promise.all([
      prisma.products.upsert({
        where: { slug: 'test-product-1' },
        update: {},
        create: {
          name: 'Test Product 1',
          slug: 'test-product-1',
          description: 'A beautiful test product',
          price: 29.99,
          image_url: 'https://picsum.photos/400/300',
          status: 'published',
        },
      }),
      prisma.products.upsert({
        where: { slug: 'test-product-2' },
        update: {},
        create: {
          name: 'Test Product 2',
          slug: 'test-product-2',
          description: 'Another amazing test product',
          price: 39.99,
          image_url: 'https://picsum.photos/400/300',
          status: 'published',
        },
      }),
      prisma.products.upsert({
        where: { slug: 'test-product-3' },
        update: {},
        create: {
          name: 'Test Product 3',
          slug: 'test-product-3',
          description: 'The best test product',
          price: 49.99,
          image_url: 'https://picsum.photos/400/300',
          status: 'published',
        },
      }),
    ]);

    console.log('Test data seeded successfully:', {
      user: { id: user.id, email: user.email },
      types: types.map(t => ({ id: t.id, name: t.name })),
      products: products.map(p => ({ id: p.id, name: p.name })),
    });
  } catch (error) {
    console.error('Error seeding test data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedTestData();
