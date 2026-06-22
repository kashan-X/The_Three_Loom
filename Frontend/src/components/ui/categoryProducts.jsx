import React, { useEffect, useState } from 'react';
import ProductGrid from './ProductGrid';

export default function CategoryProducts({ searchTerm, category }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!category) return;

    fetch(`http://localhost:8000/product/Product_by_Category/${category}`)
      .then(res => res.json())
      .then(data => {
        // sizes/colors/images are already real arrays coming from MongoDB now,
        // no JSON.parse needed (that was only required for the old MySQL string columns)
        setProducts(data.data || []);
      })
      .catch(err => console.error("Fetch error:", err))
      .finally(() => setLoading(false));
  }, [category]);

  if (loading) return <p className="text-center text-gray-500">Loading products...</p>;

  return <ProductGrid products={products} searchTerm={searchTerm} />;
}