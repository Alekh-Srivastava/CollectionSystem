import { useState, useEffect } from 'react';
import axios from 'axios';
import { Product } from '../../types/product';

const CreateCollectionPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [collectionName, setCollectionName] = useState('');
  const [collectionDescription, setCollectionDescription] = useState('');

  useEffect(() => {
    axios.get('/api/products')
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  }, []);

  const handleProductSelection = (productId: string) => {
    setSelectedProducts(prevSelectedProducts =>
      prevSelectedProducts.includes(productId)
        ? prevSelectedProducts.filter(id => id !== productId)
        : [...prevSelectedProducts, productId]
    );
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    axios.post('/api/collections', {
      name: collectionName,
      description: collectionDescription,
      productIds: selectedProducts,
    })
      .then(response => {
        console.log('Collection created:', response.data);
      })
      .catch(error => {
        console.error('Error creating collection:', error);
      });
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create Collection</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Collection Name:
          </label>
          <input
            type="text"
            value={collectionName}
            onChange={(e) => setCollectionName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Collection Description:
          </label>
          <textarea
            value={collectionDescription}
            onChange={(e) => setCollectionDescription(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <h2 className="text-lg font-medium text-gray-900">Products:</h2>
          <ul className="space-y-2">
            {products.map(product => (
              <li key={product.id} className="flex items-center">
                <input
                  type="checkbox"
                  value={product.id}
                  onChange={() => handleProductSelection(product.id)}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  {product.name}
                </label>
              </li>
            ))}
          </ul>
        </div>
        <button
          type="submit"
          className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create Collection
        </button>
      </form>
    </div>
  );
};

export default CreateCollectionPage;