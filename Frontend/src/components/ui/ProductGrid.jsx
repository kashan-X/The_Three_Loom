// components/ui/ProductGrid.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../../context/FavoritesContext';

export default function ProductGrid({ products, searchTerm }) {
  const { isFavorite, toggleFavorite } = useFavorites();

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes((searchTerm || '').toLowerCase())
  );

  return (
    <div className="px-6 py-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        {filtered.map(product => {
          const soldOut    = product.stock <= 0;
          const favorited  = isFavorite(product._id);
          const onSale     = product.discountPercent > 0;

          return (
            <div key={product._id} className="h-full">
              <Link to={`/product/${product._id}`} className="block no-underline text-black h-full">
                <div className="group border border-gray-300 overflow-hidden shadow-sm transition hover:border-[#FFC0CB] h-full flex flex-col">

                  <div className="relative w-full h-100 overflow-hidden flex-shrink-0">
                    <img
                      src={`/${product.images[0]}`}
                      alt={product.name}
                      className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
                    />

                    {/* Favorite button */}
                    <button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(product._id); }}
                      className={`absolute top-2 right-2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 shadow-sm hover:bg-white overflow-hidden ${favorited ? 'ring-2 ring-[#FFC0CB]' : ''}`}
                      aria-label="Toggle favorite"
                    >
                      <img src="/Favorite.jpg" alt="Favorite" className="w-full h-full object-cover" />
                    </button>

                    {/* Sold Out badge */}
                    {soldOut && (
                      <div className="absolute top-2 left-2 bg-black text-white text-xs font-semibold px-3 py-1 rounded-full">
                        Sold Out
                      </div>
                    )}

                    {/* Sale badge */}
                    {onSale && !soldOut && (
                      <div className="absolute top-2 left-2 bg-[#e8003d] text-white text-xs font-bold px-3 py-1 rounded-full">
                        {product.discountPercent}% OFF
                      </div>
                    )}
                  </div>

                  <div className="p-4 flex flex-col flex-grow">
                    <h2 className="text-lg font-semibold line-clamp-2 min-h-[3.5rem]">{product.name}</h2>
                    <div className="flex items-center justify-between mt-auto pt-2">
                      <p className="text-sm text-gray-500">{product.category}</p>

                      {/* Price — show strikethrough original + sale price when on sale */}
                      <div className="text-right">
                        {onSale ? (
                          <>
                            <p className="text-xs text-gray-400 line-through">Rs. {product.price}</p>
                            <p className="font-bold text-[#e8003d]">Rs. {product.discountedPrice}</p>
                          </>
                        ) : (
                          <p className="font-bold">Rs. {product.price}</p>
                        )}
                      </div>
                    </div>
                  </div>

                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}