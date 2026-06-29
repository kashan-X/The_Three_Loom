import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'three_loom_cart';

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  // Load cart from localStorage once on app start
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (err) {
      console.error('Failed to load cart from storage:', err);
    }
  }, []);

  // Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  // Each cart item: { productId, name, price, image, size, color, quantity }
  const addToCart = (product) => {
    setItems((prev) => {
      // If the same product + size + color combo already exists, just bump quantity
      const existingIndex = prev.findIndex(
        (item) =>
          item.productId === product.productId &&
          item.size === product.size &&
          item.color === product.color
      );

      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += product.quantity;
        return updated;
      }

      return [...prev, product];
    });
  };

  const removeFromCart = (productId, size, color) => {
    setItems((prev) =>
      prev.filter(
        (item) =>
          !(item.productId === productId && item.size === size && item.color === color)
      )
    );
  };

  const updateQuantity = (productId, size, color, quantity) => {
    if (quantity < 1) return;
    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId && item.size === size && item.color === color
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => setItems([]);

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}