import { useState, useEffect } from 'react';
import axios from 'axios';
import { Collection } from '../../types/collection';

const CollectionsPage = () => {
  const [collections, setCollections] = useState<Collection[]>([]);

  useEffect(() => {
    axios.get('/api/collections')
      .then(response => {
        setCollections(response.data);
      })
      .catch(error => {
        console.error("not working");
        console.error('Error fetching collections:', error);
      });
  }, []);

  return (
    <div>
      <h1>Collections</h1>
      <ul>
        {collections.map(collection => (
          <li key={collection.id}>{collection.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default CollectionsPage;