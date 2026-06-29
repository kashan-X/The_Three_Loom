import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/ui/Admin/Sidebar';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8000/product/single_Product/${id}`)
      .then((res) => { if (!res.ok) throw new Error('Not found'); return res.json(); })
      .then(({ data }) => setProduct(data))
      .catch(() => navigate('/admin/products'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const images  = Array.isArray(product?.images)  ? product.images  : [];
  const sizes   = Array.isArray(product?.sizes)   ? product.sizes   : [];
  const colors  = Array.isArray(product?.colors)  ? product.colors  : [];

  return (
    <div className="flex min-h-screen bg-[#f7f8fc]">
      <Sidebar />
      <main className="flex-1 p-8 min-w-0">
        {loading ? (
          <div className="flex items-center justify-center py-32 text-gray-400">Loading…</div>
        ) : !product ? null : (
          <>
            <div className="mb-6 flex items-center gap-4">
              <button onClick={() => navigate('/admin/products')}
                className="text-sm text-gray-400 hover:text-gray-700 transition">← Back</button>
              <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
            </div>

            <div className="max-w-3xl bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-5">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Category</p><p className="font-semibold">{product.category}</p></div>
                <div><p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Price</p><p className="font-semibold">Rs. {product.price?.toLocaleString()}</p></div>
                <div><p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Stock</p><p className="font-semibold">{product.stock}</p></div>
                <div><p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Featured</p><p className="font-semibold">{product.isFeatured ? 'Yes' : 'No'}</p></div>
              </div>
              {product.description && (
                <div><p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Description</p><p className="text-sm text-gray-700 leading-relaxed">{product.description}</p></div>
              )}
              {sizes.length > 0 && (
                <div><p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Sizes</p>
                  <div className="flex flex-wrap gap-2">{sizes.map(s => <span key={s} className="px-3 py-1 bg-gray-100 rounded-lg text-xs font-medium">{s}</span>)}</div>
                </div>
              )}
              {colors.length > 0 && (
                <div><p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Colors</p>
                  <div className="flex flex-wrap gap-2">{colors.map(c => <span key={c} className="px-3 py-1 bg-gray-100 rounded-lg text-xs font-medium">{c}</span>)}</div>
                </div>
              )}
              {images.length > 0 && (
                <div><p className="text-gray-400 text-xs uppercase tracking-wider mb-3">Images</p>
                  <div className="grid grid-cols-3 gap-3">{images.map((img, i) => (
                    <img key={i} src={img} alt={`Product ${i + 1}`} className="w-full aspect-square object-cover rounded-xl border border-gray-100" />
                  ))}</div>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default ProductDetail;