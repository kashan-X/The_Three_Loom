
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
        const parsed = (data.data || []).map(product => ({
          ...product,
          images: JSON.parse(product.images),
          sizes: JSON.parse(product.sizes),
          colors: JSON.parse(product.colors),
        }));
        setProducts(parsed);
      })
      .catch(err => console.error("Fetch error:", err))
      .finally(() => setLoading(false));
  }, [category]);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <p className="text-center text-gray-500">Loading products...</p>;

   return <ProductGrid products={products} searchTerm={searchTerm} />;
}
