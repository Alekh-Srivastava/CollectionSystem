import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing collection types first to avoid duplicates
  await prisma.collection_types.deleteMany({});
  
  // Create collection types from the provided data
  const collectionTypes = await Promise.all([
    prisma.collection_types.create({
      data: {
        id: '67f2218b-1a14-4994-9fe8-e7d7b2a5a5e3',
        name: 'Sustainability',
        slug: 'sustainability',
        description: null,
        icon: null
      }
    }),
    prisma.collection_types.create({
      data: {
        id: '7ff7dc92-b75c-4692-b48d-d7e7b2a5a5e3',
        name: 'Materials & Products',
        slug: 'materials-products',
        description: null,
        icon: null
      }
    }),
    prisma.collection_types.create({
      data: {
        id: 'ac311e04-8785-4a1e-a8d7-e7d7b2a5a5e3',
        name: 'Project Type',
        slug: 'project-type',
        description: null,
        icon: null
      }
    }),
    prisma.collection_types.create({
      data: {
        id: 'aea331fd-0ca5-4dd8-b47d-e7d7b2a5a5e3',
        name: 'Color Stories',
        slug: 'color-stories',
        description: null,
        icon: null
      }
    }),
    prisma.collection_types.create({
      data: {
        id: 'b246e44f-2924-41b1-883d-e7d7b2a5a5e3',
        name: 'Interiors',
        slug: 'interiors',
        description: null,
        icon: null
      }
    })
  ]);

  console.log(`Created ${collectionTypes.length} collection types`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
