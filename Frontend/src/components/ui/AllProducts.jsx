
import React, { useEffect, useState } from 'react';
import ProductGrid from './ProductGrid';

export default function AllProducts({ searchTerm }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/product/all_Products')
      .then(res => res.json())
      .then(data => {
        setProducts(data.data || []);
      })
      .catch(err => {
        console.error("Fetch error:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center text-gray-500">Loading products...</p>;

  return <ProductGrid products={products} searchTerm={searchTerm} />;
}
