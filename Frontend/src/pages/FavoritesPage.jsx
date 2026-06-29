import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import ProductGrid from '../components/ui/ProductGrid';
import { useFavorites } from '../context/FavoritesContext';

export default function FavoritesPage() {
  const { favoriteIds } = useFavorites();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (favoriteIds.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    // Fetch each favorited product by its id, then filter out any that failed
    // (e.g. a product that was later deleted from the catalog)
    Promise.all(
      favoriteIds.map((id) =>
        fetch(`http://localhost:8000/product/single_Product/${id}`)
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => data?.data || null)
          .catch(() => null)
      )
    )
      .then((results) => {
        setProducts(results.filter(Boolean));
      })
      .finally(() => setLoading(false));
  }, [favoriteIds]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Your Favorites</h1>

        {loading ? (
          <p className="text-center text-gray-500 py-10">Loading favorites...</p>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 mb-4">You haven't added any favorites yet.</p>
            <Link
              to="/AllProducts"
              style={{ backgroundColor: '#FFC0CB' }}
              className="inline-block px-6 py-3 rounded-full font-bold text-black"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <ProductGrid products={products} searchTerm="" />
        )}
      </main>

      <Footer />
    </div>
  );
}