import React from "react";
import {
  X,
  Package,
  Tag,
  Boxes,
  CircleDollarSign,
  ClipboardList,
} from "lucide-react";

const ProductModal = ({ product, onClose }) => {
  if (!product) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden animate-[fadeIn_.25s_ease]"
      >
        {/* Close */}

        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-10 h-10 rounded-full bg-gray-100 hover:bg-red-50 hover:text-red-500 transition flex items-center justify-center"
        >
          <X size={20} />
        </button>

        <div className="grid md:grid-cols-2">

          {/* LEFT */}

          <div
            className="flex items-center justify-center p-10"
            style={{ backgroundColor: "#FFF8FA" }}
          >
            <img
              src={product.images?.[0] || "https://via.placeholder.com/400"}
              alt={product.name}
              className="w-full max-w-sm h-[360px] object-cover rounded-2xl shadow-lg border"
            />
          </div>

          {/* RIGHT */}

          <div className="p-10">

            <p
              className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4"
              style={{
                backgroundColor: "#FFE4EC",
                color: "#C94F7C",
              }}
            >
              PRODUCT DETAILS
            </p>

            <h2 className="text-3xl font-semibold text-gray-900 mb-8">
              {product.name}
            </h2>

            <div className="space-y-5">

              <div className="flex items-center gap-4">
                <Package className="text-gray-400" size={20} />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Category
                  </p>
                  <p className="font-medium">{product.category}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <CircleDollarSign className="text-gray-400" size={20} />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Price
                  </p>
                  <p className="font-semibold text-lg">
                    Rs. {Number(product.price).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Boxes className="text-gray-400" size={20} />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Stock
                  </p>

                  <span
                    className={`font-semibold ${
                      product.stock <= 5
                        ? "text-red-500"
                        : "text-green-600"
                    }`}
                  >
                    {product.stock} Units
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Tag className="text-gray-400" size={20} />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Status
                  </p>

                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                      product.status === "Available"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {product.status}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <ClipboardList
                  className="text-gray-400 mt-1"
                  size={20}
                />

                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Description
                  </p>

                  <p className="text-gray-600 leading-7 mt-1">
                    {product.description || "No description available."}
                  </p>
                </div>
              </div>

            </div>

            <button
              onClick={onClose}
              style={{ backgroundColor: "#FFC0CB" }}
              className="mt-10 w-full py-3 rounded-2xl font-semibold text-black hover:opacity-90 transition"
            >
              Close Preview
            </button>

          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductModal;