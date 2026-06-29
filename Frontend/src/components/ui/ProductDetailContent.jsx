import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useFavorites } from "../../context/FavoritesContext";

const generateSKU = (product) => {
  const base = product?._id || product?.name || "SKU";
  const hash = Array.from(base).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return `SKU-${hash}`;
};

export default function ProductDetailContent({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  const soldOut   = product.stock <= 0;
  const favorited = isFavorite(product._id);
  const onSale    = product.discountPercent > 0;
  const salePrice = product.discountedPrice || product.price;

  const sizes  = product.sizes  || [];
  const colors = product.colors || [];
  const images = product.images || [];

  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [selectedSize,  setSelectedSize]  = useState("");
  const [quantity,      setQuantity]      = useState(1);
  const [added,         setAdded]         = useState(false);
  const [showSizeChart, setShowSizeChart] = useState(false);

  const normalizeImagePath = (src) => (src.startsWith("/") ? src : `/${src}`);

  const handleAddToCart = () => {
    if (soldOut) return;
    addToCart({
      productId: product._id,
      name:      product.name,
      price:     salePrice,          // always use the effective price
      image:     selectedImage,
      size:      selectedSize,
      color:     colors[0] || "",
      quantity,
      sku:       product.sku || generateSKU(product),
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (soldOut) return;
    handleAddToCart();
    navigate("/cart");
  };

  return (
    <main className="flex flex-col md:flex-row gap-8 p-4 md:p-6 max-w-7xl mx-auto">

      {/* Image gallery */}
      <div className="flex flex-col md:flex-row gap-4 w-full md:w-1/2">
        {images.length > 1 && (
          <div className="flex md:flex-col gap-2">
            {images.map((src, i) => (
              <img
                key={i}
                src={normalizeImagePath(src)}
                alt={`Thumb ${i}`}
                onClick={() => setSelectedImage(src)}
                className={`w-14 h-16 object-cover cursor-pointer border ${selectedImage === src ? "border-black" : "border-gray-300"} rounded transition duration-200`}
              />
            ))}
          </div>
        )}

        <div className="w-full relative">
          <img
            src={normalizeImagePath(selectedImage)}
            alt="Selected"
            onError={(e) => { e.target.src = "/IMAGE10.jpg"; }}
            className="w-full h-[700px] object-cover rounded shadow-md"
          />

          {soldOut && (
            <div className="absolute top-4 left-4 bg-black text-white text-sm font-semibold px-4 py-1.5 rounded-full">
              Sold Out
            </div>
          )}

          {/* Sale badge on main image */}
          {onSale && !soldOut && (
            <div className="absolute top-4 left-4 bg-[#e8003d] text-white text-sm font-bold px-4 py-1.5 rounded-full">
              {product.discountPercent}% OFF
            </div>
          )}

          <button
            onClick={() => toggleFavorite(product._id)}
            className={`absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/90 shadow-sm hover:bg-white overflow-hidden ${favorited ? "ring-2 ring-[#FFC0CB]" : ""}`}
            aria-label="Toggle favorite"
          >
            <img src="/Favorite.jpg" alt="Favorite" className="w-full h-full object-cover" />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="w-full md:w-1/2 space-y-6 text-left">
        <h1 className="text-2xl font-bold">{product.name}</h1>
        <p className="text-sm text-gray-600">SKU: {product.sku || generateSKU(product)}</p>

        {/* Price block */}
        {onSale ? (
          <div className="space-y-1">
            <p className="text-sm text-gray-400 line-through">Rs. {Number(product.price).toLocaleString()}</p>
            <div className="flex items-center gap-3">
              <p className="text-2xl font-bold text-[#e8003d]">Rs. {Number(salePrice).toLocaleString()}</p>
              <span className="bg-[#e8003d] text-white text-xs font-bold px-2.5 py-1 rounded-full">
                {product.discountPercent}% OFF
              </span>
            </div>
            <p className="text-xs text-gray-500">
              You save Rs. {(Number(product.price) - Number(salePrice)).toLocaleString()}
            </p>
          </div>
        ) : (
          <p className="text-lg font-medium"><strong>Rs. {Number(product.price).toLocaleString()}</strong></p>
        )}

        {/* Stock status */}
        {soldOut ? (
          <p className="text-red-600 font-medium text-sm">This product is currently sold out.</p>
        ) : product.stock <= 5 ? (
          <p className="text-orange-600 font-medium text-sm">Only {product.stock} left in stock — order soon.</p>
        ) : null}

        <div className="border-t border-gray-200 my-4" />

        {/* Style */}
        <div className="flex items-center gap-14">
          <p className="text-sm font-medium">STYLE:</p>
          <p className="text-sm">STITCHED</p>
          <button type="button" onClick={() => setShowSizeChart(true)} className="text-sm underline text-gray-600 hover:text-black transition">
            <strong>Size Chart</strong>
          </button>
        </div>

        <div className="border-t border-gray-200 my-4" />

        {/* Size */}
        <div>
          <p className="text-sm font-medium mb-2">SIZE:</p>
          <div className="flex gap-2">
            {sizes.map((size, i) => (
              <button
                key={i}
                onClick={() => setSelectedSize(size)}
                disabled={soldOut}
                className={`px-4 py-2 text-sm border rounded-full disabled:opacity-40 disabled:cursor-not-allowed ${selectedSize === size ? "bg-black text-white" : "border-gray-300"}`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 my-4" />

        {/* Quantity */}
        <div className="flex items-center gap-4">
          <div className="flex items-center border rounded px-4 py-2">
            <button onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={soldOut} className="px-2 disabled:opacity-40">-</button>
            <span className="px-4">{quantity}</span>
            <button onClick={() => setQuantity(q => Math.min(product.stock || 1, q + 1))} disabled={soldOut} className="px-2 disabled:opacity-40">+</button>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleAddToCart}
            disabled={soldOut}
            className="w-full border border-black text-black py-3 hover:bg-gray-100 transition rounded-none font-medium disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
          >
            {soldOut ? "SOLD OUT" : added ? "Added to Cart ✓" : "ADD TO CART"}
          </button>
          <button
            onClick={handleBuyNow}
            disabled={soldOut}
            style={{ backgroundColor: soldOut ? "#ddd" : "#FFC0CB" }}
            className="w-full py-3 hover:opacity-90 transition rounded-none disabled:cursor-not-allowed"
          >
            {soldOut ? "UNAVAILABLE" : "BUY IT NOW"}
          </button>
        </div>

        <div className="border-t border-gray-200 my-6" />

        {/* Description */}
        <div className="space-y-2">
          <p className="font-medium"><strong>Description</strong></p>
          <p className="text-sm text-gray-700">{product.description}</p>

          <div className="space-y-1 mt-4">
            <p className="font-medium"><strong>Delivery</strong></p>
            <p className="text-sm text-gray-700 leading-7">
              We deliver nationwide across Pakistan. Orders are usually processed within 1–2 business days and delivered within 3–7 working days, depending on your location. Delivery times may vary during sales, public holidays, or due to unforeseen circumstances. Once your order has been dispatched, you will receive a confirmation message along with tracking details.
            </p>
          </div>

          <div className="space-y-1 mt-4">
            <p className="font-medium"><strong>Exchange and Return</strong></p>
            <p className="text-sm text-gray-700 leading-7">
              We want you to be completely satisfied with your purchase. If you receive a damaged, defective, or incorrect item, you may request an exchange or return within 7 days of receiving your order. Products must be unused, unwashed, with original tags and packaging intact. Items purchased during promotional sales or clearance may not be eligible for return unless they are damaged or defective. Shipping charges are non-refundable unless the error is on our part.
            </p>
          </div>
        </div>
      </div>

      {/* Size Chart Modal */}
      {showSizeChart && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={() => setShowSizeChart(false)}>
          <div className="bg-white w-[95%] max-w-3xl rounded-xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4" style={{ backgroundColor: "#FFC0CB" }}>
              <h2 className="text-xl font-semibold text-black">Size Chart</h2>
              <button onClick={() => setShowSizeChart(false)} className="text-3xl text-black hover:scale-110 transition">&times;</button>
            </div>
            <div className="p-6 overflow-x-auto">
              <table className="w-full border-collapse text-center">
                <thead>
                  <tr style={{ backgroundColor: "#FFF3F6" }}>
                    {['Size','Chest','Waist','Hip','Length'].map(h => (
                      <th key={h} className="border border-[#FFC0CB] p-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[['S','36"','32"','38"','42"'],['M','38"','34"','40"','43"'],['L','40"','36"','42"','44"'],['XL','42"','38"','44"','45"']].map(([s,...m]) => (
                    <tr key={s} className="hover:bg-pink-50">
                      <td className="border border-gray-200 p-3 font-medium">{s}</td>
                      {m.map((v,i) => <td key={i} className="border border-gray-200 p-3">{v}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-center text-sm text-gray-500 mt-6">All measurements are in inches. Actual garment measurements may vary by ±0.5".</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}