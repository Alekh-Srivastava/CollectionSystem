import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    // Check users
    const users = await prisma.users.findMany();
    console.log('\n=== Users ===');
    console.log(users);

    // Check collection types
    const types = await prisma.collection_types.findMany();
    console.log('\n=== Collection Types ===');
    console.log(types);

    // Check products
    const products = await prisma.products.findMany({
      where: {
        deleted_at: null,
        status: 'published',
      },
    });
    console.log('\n=== Products ===');
    console.log(products);

    // Check collections under review
    const reviewCollections = await prisma.collections_review.findMany({
      include: {
        products: {
          include: {
            product: true,
          },
        },
        type: true,
        creator: true,
      },
    });
    console.log('\n=== Collections Under Review ===');
    console.log(JSON.stringify(reviewCollections, null, 2));

    // Check published collections
    const collections = await prisma.collections.findMany({
      include: {
        products: {
          include: {
            product: true,
          },
        },
        type: true,
        creator: true,
      },
    });
    console.log('\n=== Published Collections ===');
    console.log(JSON.stringify(collections, null, 2));

  } catch (error) {
    console.error('Error checking database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
