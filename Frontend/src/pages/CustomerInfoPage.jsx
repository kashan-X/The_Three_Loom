import React, { useState } from 'react';
import CustomerForm from '../components/ui/CustomerForm';
import Header from '../components/ui/Header';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

export default function CustomerInfoPage() {
  const { items, cartTotal, clearCart } = useCart();
  const [orderCompleted, setOrderCompleted] = useState(false);

  const normalizeImagePath = (src) => (src?.startsWith('/') ? src : `/${src}`);

  const handleComplete = () => {
    setOrderCompleted(true);
    clearCart(); // empty the cart now that the order has been placed
  };

  if (items.length === 0 && !orderCompleted) {
    return (
      <>
        <Header />
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
      </>
    );
  }

  return (
    <>
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-2">
        {/* Form */}
        <div className="lg:col-span-2">
          {orderCompleted ? (
            <p className="text-green-600 text-xl font-bold">Order Completed! 🎉</p>
          ) : (
            <CustomerForm items={items} totalPrice={cartTotal} onComplete={handleComplete} />
          )}
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-b-xl rounded-t-none shadow-md p-6 space-y-4">
          {!orderCompleted && (
            <>
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.size}-${item.color}`}
                  className="flex items-center gap-4"
                >
                  <img
                    src={normalizeImagePath(item.image)}
                    alt={item.name}
                    className="w-16 h-20 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.name}</p>
                    {item.size && (
                      <p className="text-xs text-gray-500">Size: {item.size}</p>
                    )}
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-sm">
                    Rs {(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}

              <div className="border-t pt-4 text-sm space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>Rs {cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>
                <div className="flex justify-between pt-2 text-base font-bold">
                  <span>Total</span>
                  <span className="text-black">
                    PKR Rs {cartTotal.toLocaleString()}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}