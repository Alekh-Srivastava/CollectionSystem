import { useState } from 'react';
import { GetStaticProps } from 'next';
import { PrismaClient, products, collection_types } from '@prisma/client';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';

interface CreateCollectionPageProps {
  products: products[];
  collectionTypes: collection_types[];
}

export default function CreateCollectionPage({ products, collectionTypes }: CreateCollectionPageProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type_id: '',
  });
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (selectedProducts.length === 0) {
      toast.error('Please select at least one product');
      return;
    }

    if (!formData.name.trim()) {
      toast.error('Please enter a collection name');
      return;
    }

    if (!formData.type_id) {
      toast.error('Please select a collection type');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/collections/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          products: selectedProducts,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create collection');
      }

      toast.success('Collection created and sent for review');
      router.push('/collections/review');
    } catch (error) {
      console.error('Error creating collection:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create collection. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/10">
          <div className="mb-10 pb-6 border-b border-white/20">
            <h1 className="text-3xl font-bold text-white">Create Collection</h1>
            <div className="mt-2 w-16 h-1 bg-cyan-400 rounded-full"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="bg-slate-800/95 backdrop-blur-md rounded-xl p-6 border border-white/10">
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-cyan-100 mb-2">
                    Collection Name
                    <span className="text-cyan-400"> *</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-sm text-cyan-100 placeholder:text-cyan-300/50 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all"
                    placeholder="Enter collection name"
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-semibold text-cyan-100 mb-2">
                    Collection Description
                    <span className="text-cyan-400"> *</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-sm text-cyan-100 placeholder:text-cyan-300/50 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all"
                    placeholder="Enter collection description"
                  />
                </div>
                <div>
                  <label htmlFor="type_id" className="block text-sm font-semibold text-cyan-100 mb-2">
                    Collection Type
                    <span className="text-cyan-400"> *</span>
                  </label>
                  <select
                    id="type_id"
                    name="type_id"
                    required
                    value={formData.type_id}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-sm text-cyan-100 placeholder:text-cyan-300/50 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all"
                  >
                    <option value="">Select a type</option>
                    {collectionTypes.map((type) => (
                      <option key={type.id} value={type.id} className="bg-slate-800">
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/95 backdrop-blur-md rounded-xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-cyan-100">Select Products</h2>
                <span className="text-sm text-cyan-300">
                  {selectedProducts.length} products selected
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product, index) => (
                  <div
                    key={product.id}
                    onClick={() => toggleProductSelection(product.id)}
                    className={`group bg-white/5 border border-white/10 rounded-xl overflow-hidden cursor-pointer hover:shadow-lg hover:border-cyan-400/30 transition-all duration-300
                      ${selectedProducts.includes(product.id) ? 'ring-2 ring-cyan-400' : ''}`}
                  >
                    {product.image_url && (
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-800">
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          priority={index < 8} // Prioritize loading first 8 images
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="text-sm font-medium text-cyan-100 mb-1">{product.name}</h3>
                      <p className="text-sm text-cyan-300/80 mb-3 line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-cyan-400 font-medium text-sm">
                          ${product.price ? parseFloat(product.price.toString()).toFixed(2) : '0.00'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`inline-flex items-center justify-center rounded-xl bg-cyan-400/10 border border-cyan-400/20 px-6 py-3 text-sm font-medium text-cyan-400 hover:bg-cyan-400/20 hover:border-cyan-400/30 focus:outline-none focus:ring-2 focus:ring-cyan-400/30 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all ${
                  isSubmitting ? 'cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  'Create Collection'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prisma = new PrismaClient();
  try {
    const [products, collectionTypes] = await Promise.all([
      prisma.products.findMany({
        where: {
          deleted_at: null,
          status: 'published',
        },
        orderBy: {
          created_at: 'desc',
        },
        take: 20, // Limit to 20 most recent products
      }),
      prisma.collection_types.findMany({
        orderBy: {
          name: 'asc',
        },
      }),
    ]);

    return {
      props: {
        products: JSON.parse(JSON.stringify(products)),
        collectionTypes: JSON.parse(JSON.stringify(collectionTypes)),
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: {
        products: [],
        collectionTypes: [],
      },
    };
  } finally {
    await prisma.$disconnect();
  }
};