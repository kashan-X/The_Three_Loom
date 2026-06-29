import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, cartTotal } = useCart();
  const navigate = useNavigate();

  const normalizeImagePath = (src) => (src?.startsWith('/') ? src : `/${src}`);

  const handleCheckout = () => {
    navigate('/customer-info');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow max-w-5xl mx-auto px-4 py-10 w-full">
        <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 mb-4">Your cart is empty.</p>
            <Link
              to="/AllProducts"
              style={{ backgroundColor: '#FFC0CB' }}
              className="inline-block px-6 py-3 rounded-full font-bold text-black"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.size}-${item.color}`}
                  className="flex items-center gap-4 border-b border-gray-200 pb-4"
                >
                  <img
                    src={normalizeImagePath(item.image)}
                    alt={item.name}
                    className="w-20 h-24 object-cover rounded-md"
                  />

                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    {item.size && (
                      <p className="text-sm text-gray-500">Size: {item.size}</p>
                    )}
                    {item.color && (
                      <p className="text-sm text-gray-500">Color: {item.color}</p>
                    )}
                    <p className="text-sm font-semibold mt-1">
                      Rs {item.price.toLocaleString()}
                    </p>
                  </div>

                  {/* Quantity control */}
                  <div className="flex items-center border rounded px-2 py-1">
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.size, item.color, item.quantity - 1)
                      }
                      className="px-2"
                    >
                      -
                    </button>
                    <span className="px-3">{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.size, item.color, item.quantity + 1)
                      }
                      className="px-2"
                    >
                      +
                    </button>
                  </div>

                  <p className="font-semibold w-24 text-right">
                    Rs {(item.price * item.quantity).toLocaleString()}
                  </p>

                  <button
                    onClick={() => removeFromCart(item.productId, item.size, item.color)}
                    className="text-red-500 text-sm underline ml-2"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="mt-8 flex flex-col items-end space-y-2">
              <div className="flex justify-between w-full max-w-xs text-lg font-bold">
                <span>Total</span>
                <span>Rs {cartTotal.toLocaleString()}</span>
              </div>

              <button
                onClick={handleCheckout}
                style={{ backgroundColor: '#FFC0CB' }}
                className="w-full max-w-xs py-3 rounded-full font-bold text-black mt-2"
              >
                Proceed to Checkout
              </button>

              <Link
                to="/AllProducts"
                className="text-sm underline text-gray-600 mt-1"
              >
                Continue Shopping
              </Link>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}