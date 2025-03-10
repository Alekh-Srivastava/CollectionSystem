import { GetServerSideProps } from 'next';
import { PrismaClient, collections, products, collections_review } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';

interface CollectionDetailsPageProps {
  collection: (collections & {
    products: products[];
    type: {
      id: string;
      name: string;
    };
  }) | null;
}

export default function CollectionDetailsPage({ collection }: CollectionDetailsPageProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!collection || !confirm('Are you sure you want to delete this collection? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/collections/${collection.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete collection');
      }

      toast.success('Collection deleted successfully');
      
      // Navigate to collections page and force a hard reload
      const collectionsUrl = '/collections';
      router.push(collectionsUrl).then(() => {
        router.reload();
      });
    } catch (error) {
      console.error('Error deleting collection:', error);
      toast.error('Failed to delete collection');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!collection) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/10">
            <h1 className="text-3xl font-bold text-white">Collection not found</h1>
            <Link href="/collections" className="mt-4 inline-block text-cyan-400 hover:text-cyan-300">
              ← Back to Collections
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/10">
          <div className="mb-10 pb-6 border-b border-white/20">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white mb-4 sm:mb-0">{collection.name}</h1>
                <div className="mt-2 w-16 h-1 bg-cyan-400 rounded-full"></div>
                <p className="mt-4 text-cyan-300/80">{collection.description}</p>
              </div>
              <div className="flex items-center space-x-4">
                <Link href="/collections" className="text-cyan-400 hover:text-cyan-300">
                  ← Back to Collections
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className={`px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors ${
                    isDeleting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isDeleting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-400 mr-2"></div>
                      Deleting...
                    </div>
                  ) : (
                    'Delete Collection'
                  )}
                </button>
              </div>
            </div>
            <div className="mt-4 flex items-center space-x-4">
              <span className="px-3 py-1 rounded-full bg-cyan-400/10 text-cyan-400 text-sm">
                {collection.type.name}
              </span>
              <span className="text-cyan-300">
                {collection.products.length} products
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {collection.products.map((product) => (
              <div
                key={product.id}
                className="group bg-white/5 backdrop-blur-md rounded-xl overflow-hidden border border-white/10 hover:shadow-lg transition-all duration-300"
              >
                {product.image_url && (
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-800">
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      priority
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-lg font-medium text-cyan-100 mb-1">{product.name}</h3>
                  <p className="text-sm text-cyan-300/80 mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-cyan-400 font-medium">
                      ${product.price ? parseFloat(product.price.toString()).toFixed(2) : '0.00'}
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

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  if (!params?.id) {
    return { props: { collection: null } };
  }

  const prisma = new PrismaClient();
  try {
    // First get the collection review to get the product IDs
    const collectionReview = await prisma.collections_review.findUnique({
      where: {
        id: params.id as string,
      },
      include: {
        type: true,
        products: {
          include: {
            product: true, // Include the full product details
          },
        },
      },
    });

    if (!collectionReview) {
      // If not in review, try to find in published collections
      const collection = await prisma.collections.findUnique({
        where: {
          id: params.id as string,
        },
        include: {
          type: true,
          products: {
            include: {
              product: true,
            },
          },
        },
      });

      if (!collection) {
        return { props: { collection: null } };
      }

      // Transform the data to match our expected format
      const transformedCollection = {
        ...collection,
        products: collection.products.map(cp => cp.product),
      };

      return {
        props: {
          collection: JSON.parse(JSON.stringify(transformedCollection)),
        },
      };
    }

    // Transform review collection data
    const transformedReviewCollection = {
      ...collectionReview,
      products: collectionReview.products.map(cp => cp.product),
    };

    return {
      props: {
        collection: JSON.parse(JSON.stringify(transformedReviewCollection)),
      },
    };
  } catch (error) {
    console.error('Error fetching collection:', error);
    return {
      props: {
        collection: null,
      },
    };
  } finally {
    await prisma.$disconnect();
  }
};
