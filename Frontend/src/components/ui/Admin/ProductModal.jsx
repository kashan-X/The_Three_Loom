// ProductModal.jsx
import React from 'react';

const ProductModal = ({ product, onClose }) => {
  if (!product) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl p-6 w-[90%] max-w-md relative animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-red-500 text-xl"
          onClick={onClose}
        >
          &times;
        </button>

        <div className="flex justify-center mb-4">
          <img
            src={product.images?.[0] || 'https://via.placeholder.com/150'}
            alt={product.name}
            className="w-40 h-40 object-cover rounded-lg"
          />
        </div>

        <h3 className="text-xl font-semibold text-center mb-4">{product.name}</h3>
        <div className="space-y-2 text-sm text-gray-700">
          <p><span className="font-medium">Category:</span> {product.category}</p>
          <p><span className="font-medium">Price:</span> ${product.price}</p>
          <p><span className="font-medium">Stock:</span> {product.stock}</p>
          <p><span className="font-medium">Status:</span> {product.status}</p>
          <p><span className="font-medium">Description:</span> {product.description}</p>
        </div>

        <div className="mt-6 text-center">
          <button
            className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition"
            style={{ backgroundColor: "#FFC0CB" }}
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
