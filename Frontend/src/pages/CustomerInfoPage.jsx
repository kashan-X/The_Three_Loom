import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import CustomerForm from '../components/ui/CustomerForm';
import Header from '../components/ui/Header';

export default function CustomerInfoPage() {
  const { state } = useLocation();            // product details passed via router
  const [orderCompleted, setOrderCompleted] = useState(false);

  // Build productInfo object once
 const productInfo = {
  id        : state?.id ?? '',                    // fallback to empty string
  name      : state?.name ?? '',
  image     : state?.image ?? '',
  price     : Number(state?.price ?? 0),
  quantity  : state?.quantity || 1,
  totalPrice: Number(state?.price ?? 0) * (state?.quantity || 1)
};

  const handleComplete = () => setOrderCompleted(true);

  return (
    <>
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-2">
        {/* ── Form ── */}
        <div className="lg:col-span-2">
          {orderCompleted ? (
            <p className="text-green-600 text-xl font-bold">Order Completed! 🎉</p>
          ) : (
            <CustomerForm productInfo={productInfo} onComplete={handleComplete} />
          )}
        </div>

        {/* ── Summary ── */}
        <div className="bg-white rounded-b-xl rounded-t-none shadow-md p-6 space-y-4">
          <div className="flex items-center gap-4">
            <img
              src={productInfo.image}
              alt={productInfo.name}
              className="w-20 h-30 object-cover rounded-md"
            />
            <div className="flex-1">
              <p className="font-medium">{productInfo.name}</p>
              <p className="text-sm text-gray-500">Stitched</p>
            </div>
            <p className="font-semibold">Rs {productInfo.price.toLocaleString()}</p>
          </div>

          <div className="border-t pt-4 text-sm space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>
                Rs {productInfo.price.toLocaleString()} × {productInfo.quantity}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-green-600 font-medium">FREE</span>
            </div>
            <div className="flex justify-between pt-2 text-base font-bold">
              <span>Total</span>
              <span className="text-black">
                PKR Rs {productInfo.totalPrice.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
