import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/ui/Admin/Sidebar';
import ProductForm from '../../components/ui/Admin/ProductForm';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => { fetchProduct(); }, []);

  const fetchProduct = async () => {
    try {
      const res  = await fetch(`http://localhost:8000/product/single_Product/${id}`);
      const data = await res.json();
      if (data.data) setProduct(data.data);
    } catch (err) { console.error('Failed to load product:', err); }
  };

  const handleSubmit = async (formData) => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`http://localhost:8000/product/update_Product/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        navigate('/admin/products');
      } else {
        const errData = await res.json();
        alert(errData.message || 'Failed to update product');
      }
    } catch (err) { console.error('Update error:', err); }
  };

  return (
    <div className="flex min-h-screen bg-[#f7f8fc]">
      <Sidebar />
      <main className="flex-1 p-8 min-w-0">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
          <p className="text-gray-500 mt-1">Update product details and save changes.</p>
        </div>
        <div className="max-w-3xl bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          {product ? (
            <ProductForm onSubmit={handleSubmit} initialData={product} />
          ) : (
            <div className="flex items-center justify-center py-20 text-gray-400">Loading product…</div>
          )}
        </div>
      </main>
    </div>
  );
};

export default EditProduct;