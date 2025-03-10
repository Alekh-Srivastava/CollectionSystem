import { GetServerSideProps } from 'next';
import { PrismaClient, collections_review, products } from '@prisma/client';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

interface ReviewQueuePageProps {
  collections: (collections_review & {
    products: {
      product: products;
      display_order: number;
    }[];
  })[];
}

export default function ReviewQueuePage({ collections: initialCollections }: ReviewQueuePageProps) {
  const [collections, setCollections] = useState(initialCollections);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const router = useRouter();

  const handleApprove = async (id: string) => {
    if (isProcessing) return;
    setIsProcessing(id);

    try {
      const response = await fetch(`/api/collections/review/${id}/approve`, {
        method: 'POST',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to approve collection');
      }

      // Remove the approved collection from the list
      setCollections(collections.filter(collection => collection.id !== id));
      toast.success('Collection approved successfully');

    } catch (error) {
      console.error('Error approving collection:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to approve collection');
    } finally {
      setIsProcessing(null);
    }
  };

  const handleReject = async (id: string) => {
    if (isProcessing) return;
    setIsProcessing(id);

    try {
      const response = await fetch(`/api/collections/review/${id}/reject`, {
        method: 'POST',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to reject collection');
      }

      // Remove the rejected collection from the list
      setCollections(collections.filter(collection => collection.id !== id));
      toast.success('Collection rejected successfully');

    } catch (error) {
      console.error('Error rejecting collection:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to reject collection');
    } finally {
      setIsProcessing(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/10">
          <div className="mb-10 pb-6 border-b border-white/20">
            <h1 className="text-3xl font-bold text-white">Review Queue</h1>
            <div className="mt-2 w-16 h-1 bg-cyan-400 rounded-full"></div>
          </div>

          <div className="space-y-6">
            {collections.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan-400/10 mb-4">
                  <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-cyan-100 mb-2">All Caught Up!</h3>
                <p className="text-cyan-300/80">There are no collections waiting for review.</p>
              </div>
            ) : (
              collections.map((collection) => (
                <div key={collection.id} className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-cyan-100">{collection.name}</h2>
                      <p className="text-sm text-cyan-300/80 mt-1 line-clamp-2">{collection.description}</p>
                    </div>
                    <span className="text-sm text-cyan-300">
                      {collection.products?.length || 0} products
                    </span>
                  </div>
                  <div className="mt-4 flex space-x-4">
                    <button
                      onClick={() => handleApprove(collection.id)}
                      disabled={isProcessing === collection.id}
                      className="inline-flex items-center justify-center rounded-xl bg-cyan-400/10 border border-cyan-400/20 px-4 py-2 text-sm font-medium text-cyan-400 hover:bg-cyan-400/20 hover:border-cyan-400/30 focus:outline-none focus:ring-2 focus:ring-cyan-400/30 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      {isProcessing === collection.id ? (
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : null}
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(collection.id)}
                      disabled={isProcessing === collection.id}
                      className="inline-flex items-center justify-center rounded-xl bg-red-400/10 border border-red-400/20 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-400/20 hover:border-red-400/30 focus:outline-none focus:ring-2 focus:ring-red-400/30 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      Reject
                    </button>
                  </div>
                  <div className="mt-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {collection.products.map((productRelation) => {
                        const product = productRelation.product;
                        return (
                          <div
                            key={product.id}
                            className="group bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                            onClick={() => router.push(`/products/${product.id}`)}
                          >
                            {product.image_url && (
                              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-800 rounded-lg">
                                <Image
                                  src={product.image_url}
                                  alt={product.name}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                />
                              </div>
                            )}
                            <div className="p-4">
                              <h4 className="text-sm font-medium text-cyan-100 mb-1 truncate">{product.name}</h4>
                              <p className="text-sm text-cyan-300/80 mb-3 line-clamp-2">{product.description}</p>
                              <span className="text-cyan-400 font-medium text-sm">
                                ${product.price ? parseFloat(product.price.toString()).toFixed(2) : '0.00'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const prisma = new PrismaClient();
  
  try {
    const collections = await prisma.collections_review.findMany({
      where: {
        status: 'pending'  // Only fetch pending collections
      },
      include: {
        products: {
          include: {
            product: true
          }
        },
        type: true,
      },
    });

    return {
      props: {
        collections: JSON.parse(JSON.stringify(collections)),
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