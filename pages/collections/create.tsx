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
    <div>
      <h1>Create Collection</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Collection Name:
          <input type="text" value={collectionName} onChange={(e) => setCollectionName(e.target.value)} />
        </label>
        <label>
          Collection Description:
          <textarea value={collectionDescription} onChange={(e) => setCollectionDescription(e.target.value)} />
        </label>
        <h2>Products:</h2>
        <ul>
          {products.map(product => (
            <li key={product.id}>
              <label>
                <input
                  type="checkbox"
                  value={product.id}
                  onChange={() => handleProductSelection(product.id)}
                />
                {product.name}
              </label>
            </li>
          ))}
        </ul>
        <button type="submit">Create Collection</button>
      </form>
    </div>
  );
};

export default CreateCollectionPage;