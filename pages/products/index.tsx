// filepath: /c:/Users/ALEKH SRIVASTAVA/Downloads/collections-test/collections-test/app/pages/products/index.tsx
import { GetStaticProps } from 'next';
import { PrismaClient, products } from '@prisma/client';
import Image from 'next/image';

interface ProductsPageProps {
  products: products[];
}

export default function ProductsPage({ products }: ProductsPageProps) {
  const formatPrice = (price: number | null) => {
    if (!price) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/10">
          <div className="mb-10 pb-6 border-b border-white/20">
            <h1 className="text-3xl font-bold text-white">Products</h1>
            <div className="mt-2 w-16 h-1 bg-cyan-400 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div 
                key={product.id} 
                className="group bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:shadow-lg transition-shadow duration-300"
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
                  <h3 className="text-sm font-medium text-cyan-100 mb-1 truncate">{product.name}</h3>
                  <p className="text-sm text-cyan-300/80 mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-cyan-400 font-medium text-sm">
                      {formatPrice(Number(product.price))}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      product.status === 'published' ? 'bg-cyan-400/10 text-cyan-400' :
                      product.status === 'draft' ? 'bg-white/10 text-white/80' :
                      'bg-red-400/10 text-red-400'
                    }`}>
                      {product.status}
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

export const getStaticProps: GetStaticProps = async () => {
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