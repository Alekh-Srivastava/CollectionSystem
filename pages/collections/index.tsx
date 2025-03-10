import { useState, useEffect } from 'react';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import { PrismaClient, collections, products, collection_types } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface CollectionsPageProps {
  collections: (collections & {
    products: products[];
    type: collection_types;
  })[];
}

export default function CollectionsPage({ collections }: CollectionsPageProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/10">
          <div className="mb-10 pb-6 border-b border-white/20">
            <h1 className="text-3xl font-bold text-white">Collections</h1>
            <div className="mt-2 w-16 h-1 bg-cyan-400 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((collection) => (
              <div
                key={collection.id}
                onClick={() => router.push(`/collections/${collection.id}`)}
                className="group relative bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
              >
                {collection.products[0]?.image_url && (
                  <div className="absolute inset-0 -z-10">
                    <Image
                      src={collection.products[0].image_url}
                      alt=""
                      fill
                      className="object-cover opacity-20 group-hover:opacity-30 group-hover:scale-105 transition-all duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-slate-900/50"></div>
                  </div>
                )}
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-cyan-100">{collection.name}</h2>
                    <span className="text-sm text-cyan-300">
                      {collection.products.length} products
                    </span>
                  </div>
                  <p className="text-sm text-cyan-300/80 mb-4 line-clamp-2">{collection.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-cyan-400/10 text-cyan-400 text-sm">
                      {collection.type.name}
                    </span>
                    <span className="text-cyan-400 group-hover:translate-x-1 transition-transform duration-300">
                      View Details →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const prisma = new PrismaClient();
  try {
    const collections = await prisma.collections.findMany({
      include: {
        products: {
          include: {
            product: true, // Include the full product details
          },
        },
        type: true,
      },
    });

    // Transform the data to match our expected format
    const transformedCollections = collections.map(collection => ({
      ...collection,
      products: collection.products.map(cp => cp.product), // Extract the full product details
    }));

    return {
      props: {
        collections: JSON.parse(JSON.stringify(transformedCollections)),
      },
    };
  } catch (error) {
    console.error('Error fetching collections:', error);
    return {
      props: {
        collections: []
      }
    };
  } finally {
    await prisma.$disconnect();
  }
};