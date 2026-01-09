import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const generateSKU = (product) => {
  const base = product?.id || product?.name || 'SKU';
  const hash = Array.from(base).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return `SKU-${hash}`;
};

export default function ProductDetailContent({ product }) {
  const navigate = useNavigate();

  const sizes = JSON.parse(product.sizes || '[]');
  const colors = JSON.parse(product.colors || '[]');
  const images = JSON.parse(product.images || '[]');

  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  const normalizeImagePath = (src) => (src.startsWith('/') ? src : `/${src}`);

  const handleAddToCart = () => {
    navigate('/customer-info', {
      state: {
        name: product.name,
        price: product.price,
        category: product.category,
        size: selectedSize,
        color: colors[0],
        quantity,
        image: selectedImage,
        sku: product.sku || generateSKU(product)
      }
    });
  };

  return (
    <main className="flex flex-col md:flex-row gap-8 p-4 md:p-6 max-w-7xl mx-auto">
      {/* Image gallery - Keep existing implementation */}
      <div className="flex flex-col md:flex-row gap-4 w-full md:w-1/2">
        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex md:flex-col gap-2">
            {images.map((src, i) => (
              <img
                key={i}
                src={normalizeImagePath(src)}
                alt={`Thumb ${i}`}
                onClick={() => setSelectedImage(src)}
                className={`w-14 h-16 object-cover cursor-pointer border ${selectedImage === src ? 'border-black' : 'border-gray-300'
                  } rounded transition duration-200`}
              />
            ))}
          </div>
        )}

        {/* Main Image */}
        <div className="w-full">
          <img
            src={normalizeImagePath(selectedImage)}
            alt="Selected"
            onError={(e) => {
              e.target.src = '/IMAGE10.jpg';
            }}
            className="w-full h-[700px] object-cover rounded shadow-md"
          />
        </div>
      </div>

      {/* Product Info - Updated to match reference exactly */}
      <div className="w-full md:w-1/2 space-y-6 text-left">
        {/* Product Title */}
        <h1 className="text-2xl font-bold">{product.name}</h1>

        {/* SKU */}
        <p className="text-sm text-gray-600">SKU: {product.sku || generateSKU(product)}</p>

        {/* Price */}
        <p className="text-lg font-medium"><strong>Rs. {Number(product.price).toLocaleString()}</strong></p>

        <div className="border-t border-gray-200 my-4"></div>

        {/* Style */}
        <div className="flex items-center gap-14">
          <p className="text-sm font-medium">STYLE:</p>
          <p className="text-sm">STITCHED</p>
          <a href="#" className="text-l underline text-gray-500 font-bold"> <strong>Size Chart</strong></a>
        </div>



        <div className="border-t border-gray-200 my-4"></div>

        {/* Size */}
        <div>
          <p className="text-sm font-medium mb-2">SIZE:</p>
          <div className="flex gap-2">
            {sizes.map((size, i) => (
              <button
                key={i}
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 text-sm border rounded-full ${selectedSize === size ? 'bg-black text-white' : 'border-gray-300'
                  }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 my-4"></div>

        {/* Quantity */}
        <div className="flex items-center gap-4">
          <div className="flex items-center border rounded px-4 py-2">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="px-2"
            >
              -
            </button>
            <span className="px-4">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="px-2"
            >
              +
            </button>
          </div>
        </div>

        {/*  BUY IT NOW Button */}
        <button
          onClick={handleAddToCart}
          style={{ backgroundColor: "#FFC0CB" }}
          className="w-full bg-black text-white py-3 hover:bg-gray-800 transition rounded-none"
        >
          BUY IT NOW
        </button>


        <div className="border-t border-gray-200 my-6"></div>

        {/* Description Section - Left aligned with simple links */}
        <div className="space-y-2">
          <p className="font-medium"><strong>Description</strong></p>
          <p className="text-sm text-gray-700">{product.description}</p>

          <div className="space-y-1 mt-4">
            <p className="font-medium"><strong>Delivery</strong></p>
            <p className="text-sm text-gray-700">Standard delivery information...</p>
          </div>

          <div className="space-y-1 mt-4">
            <p className="font-medium"><strong>Exchange and Return</strong></p>
            <p className="text-sm text-gray-700">Our exchange and return policy...</p>
          </div>
        </div>
      </div>
    </main>
  );
}

