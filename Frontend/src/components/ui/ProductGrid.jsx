// components/ui/ProductGrid.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function ProductGrid({ products, searchTerm }) {
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="px-6 py-4">
      {/* …search header unchanged… */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map(product => (
          <Link                    
            to={`/product/${product.id}`}
            key={product.id}
            className="block no-underline text-black"
          >
            <div className="group border border-gray-300 overflow-hidden shadow-sm transition hover:border-[#FFC0CB]">
              <div className="relative w-full h-100 overflow-hidden">
                <img
                  src={`/${product.images[0]}`}
                  alt={product.name}
                  className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div className="p-4">
                <h2 className="text-lg font-semibold">{product.name}</h2>
                <p className="text-sm text-gray-500">{product.category}</p>
                <p className="mt-1 font-bold">Rs. {product.price}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
