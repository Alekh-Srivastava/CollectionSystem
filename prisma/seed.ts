import { PrismaClient, ProductStatus, ReviewStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create users
  const users = await Promise.all([
    prisma.users.create({
      data: {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password' // In a real app, this would be hashed
      }
    }),
    prisma.users.create({
      data: {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password' // In a real app, this would be hashed
      }
    })
  ]);

  // Create collection types
  const types = await Promise.all([
    prisma.collection_types.create({
      data: {
        name: 'Featured',
        slug: 'featured',
        description: 'Featured collections',
        icon: 'star'
      }
    }),
    prisma.collection_types.create({
      data: {
        name: 'Seasonal',
        slug: 'seasonal',
        description: 'Seasonal collections',
        icon: 'calendar'
      }
    }),
    prisma.collection_types.create({
      data: {
        name: 'Trending',
        slug: 'trending',
        description: 'Trending collections',
        icon: 'trending-up'
      }
    })
  ]);

  // Create sample products
  const products = [];
  for (let i = 1; i <= 30; i++) {
    products.push(await prisma.products.create({
      data: {
        name: `Product ${i}`,
        slug: `product-${i}`,
        description: `Description for product ${i}`,
        price: (Math.random() * 100 + 10).toFixed(2) as unknown as number,
        image_url: `https://picsum.photos/seed/${i}/300/300`,
        status: i % 3 === 0 ? ProductStatus.draft : ProductStatus.published
      }
    }));
  }

  // Create sample collections
  const collections = await Promise.all([
    prisma.collections.create({
      data: {
        name: 'Summer Collection',
        slug: 'summer-collection',
        description: 'Products for summer',
        image_url: 'https://picsum.photos/seed/summer/600/400',
        banner_url: 'https://picsum.photos/seed/summer-banner/1200/400',
        is_featured: true,
        status: ProductStatus.published,
        type_id: types[1].id,
        created_by: users[0].id,
        marketing_images: [
          'https://picsum.photos/seed/summer1/600/400',
          'https://picsum.photos/seed/summer2/600/400'
        ]
      }
    }),
    prisma.collections.create({
      data: {
        name: 'Winter Collection',
        slug: 'winter-collection',
        description: 'Products for winter',
        image_url: 'https://picsum.photos/seed/winter/600/400',
        banner_url: 'https://picsum.photos/seed/winter-banner/1200/400',
        status: ProductStatus.published,
        type_id: types[1].id,
        created_by: users[0].id
      }
    })
  ]);

  // Create sample collections in review
  const collectionsReview = await Promise.all([
    prisma.collections_review.create({
      data: {
        name: 'Spring Collection',
        slug: 'spring-collection',
        description: 'Products for spring',
        image_url: 'https://picsum.photos/seed/spring/600/400',
        banner_url: 'https://picsum.photos/seed/spring-banner/1200/400',
        is_featured: true,
        status: ReviewStatus.pending,
        type_id: types[1].id,
        created_by: users[1].id,
        marketing_images: [
          'https://picsum.photos/seed/spring1/600/400',
          'https://picsum.photos/seed/spring2/600/400'
        ]
      }
    }),
    prisma.collections_review.create({
      data: {
        name: 'New Arrivals',
        slug: 'new-arrivals',
        description: 'Latest products',
        image_url: 'https://picsum.photos/seed/new/600/400',
        is_featured: true,
        status: ReviewStatus.pending,
        type_id: types[0].id,
        created_by: users[1].id
      }
    })
  ]);

  // Add products to collections
  for (let i = 0; i < 10; i++) {
    await prisma.collection_products.create({
      data: {
        collection_id: collections[0].id,
        product_id: products[i].id,
        display_order: i
      }
    });
  }

  for (let i = 10; i < 20; i++) {
    await prisma.collection_products.create({
      data: {
        collection_id: collections[1].id,
        product_id: products[i].id,
        display_order: i - 10
      }
    });
  }

  // Add products to collections in review
  for (let i = 20; i < 25; i++) {
    await prisma.collection_review_products.create({
      data: {
        collection_review_id: collectionsReview[0].id,
        product_id: products[i].id,
        display_order: i - 20
      }
    });
  }

  for (let i = 25; i < 30; i++) {
    await prisma.collection_review_products.create({
      data: {
        collection_review_id: collectionsReview[1].id,
        product_id: products[i].id,
        display_order: i - 25
      }
    });
  }

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
