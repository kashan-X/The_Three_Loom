import React, { useEffect, useState } from 'react';
import ProductGrid from './ProductGrid';

const SEASONS = ['All', 'Summer', 'Winter', 'Spring', 'Autumn'];

export default function CategoryProducts({ searchTerm, category }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSeason, setActiveSeason] = useState('All');

  useEffect(() => {
    if (!category) return;

    setLoading(true);
    const url =
      activeSeason === 'All'
        ? `http://localhost:8000/product/Product_by_Category/${category}`
        : `http://localhost:8000/product/Product_by_Category/${category}?subCategory=${activeSeason}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        // 404 with no matches comes back as { status: 'Fail' }, treat as empty list rather than error
        setProducts(data.data || []);
      })
      .catch(err => console.error("Fetch error:", err))
      .finally(() => setLoading(false));
  }, [category, activeSeason]);

  return (
    <div className="max-w-7xl mx-auto px-4 pt-6">
      {/* Season filter tabs */}
      <div className="flex gap-6 mb-6 overflow-x-auto border-b border-gray-200">
        {SEASONS.map((season) => (
          <button
            key={season}
            onClick={() => setActiveSeason(season)}
            style={{
              borderRadius: 0,
              border: 'none',
              borderBottom: activeSeason === season ? '2px solid #000' : '2px solid transparent',
              background: 'transparent',
              padding: '0 0 8px 0',
              color: activeSeason === season ? '#000' : '#777',
              fontWeight: activeSeason === season ? 600 : 400,
              outline: 'none',
              boxShadow: 'none',
            }}
            onMouseEnter={(e) => {
              if (activeSeason !== season) e.currentTarget.style.color = '#FFC0CB';
            }}
            onMouseLeave={(e) => {
              if (activeSeason !== season) e.currentTarget.style.color = '#777';
            }}
            onFocus={(e) => {
              e.currentTarget.style.outline = 'none';
              e.currentTarget.style.boxShadow = 'none';
            }}
            className="text-sm whitespace-nowrap transition-colors focus:outline-none focus:ring-0"
          >
            {season}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-center text-gray-500 py-10">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-500 py-10">
          No products found{activeSeason !== 'All' ? ` for ${activeSeason}` : ''}.
        </p>
      ) : (
        <ProductGrid products={products} searchTerm={searchTerm} />
      )}
    </div>
  );
}