import React, { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext(null);
const STORAGE_KEY = 'three_loom_favorites';

export function FavoritesProvider({ children }) {
  const [favoriteIds, setFavoriteIds] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setFavoriteIds(JSON.parse(stored));
      }
    } catch (err) {
      console.error('Failed to load favorites from storage:', err);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  const isFavorite = (productId) => favoriteIds.includes(productId);

  const toggleFavorite = (productId) => {
    setFavoriteIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <FavoritesContext.Provider value={{ favoriteIds, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}