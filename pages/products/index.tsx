// filepath: /c:/Users/ALEKH SRIVASTAVA/Downloads/collections-test/collections-test/app/pages/products/index.tsx
import { useState } from 'react';
import { GetServerSideProps } from 'next';
import { PrismaClient, products } from '@prisma/client';
import Image from 'next/image';

interface ProductsPageProps {
  products: products[];
}

export default function ProductsPage({ products }: ProductsPageProps) {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const formatPrice = (price: number | null) => {
    if (!price) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div 
            key={product.id} 
            className={`bg-white rounded-lg border border-gray-200 overflow-hidden cursor-pointer
              ${selectedProducts.includes(product.id) ? 'ring-2 ring-indigo-500' : ''}`}
            onClick={() => toggleProductSelection(product.id)}
          >
            {product.image_url && (
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
              </div>
            )}
            <div className="p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-1">{product.name}</h3>
              <p className="text-sm text-gray-500 mb-3 line-clamp-2">{product.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-indigo-600 font-medium">
                  {formatPrice(Number(product.price))}
                </span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  product.status === 'published' ? 'bg-green-50 text-green-700' :
                  product.status === 'draft' ? 'bg-gray-50 text-gray-700' :
                  'bg-red-50 text-red-700'
                }`}>
                  {product.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const prisma = new PrismaClient();
  const products = await prisma.products.findMany({
    where: {
      deleted_at: null,
    },
    orderBy: {
      created_at: 'desc',
    },
  });

  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
    },
  };
};