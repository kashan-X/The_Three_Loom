import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/ui/Admin/Sidebar';
import ProductForm from '../../components/ui/Admin/ProductForm';

const CreateProduct = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('http://localhost:8000/product/create_Products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        navigate('/admin/products');
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to create product');
      }
    } catch (err) { console.error('Create error:', err); }
  };

  return (
    <div className="flex min-h-screen bg-[#f7f8fc]">
      <Sidebar />
      <main className="flex-1 p-8 min-w-0">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Create Product</h1>
          <p className="text-gray-500 mt-1">Add a new product to your catalogue.</p>
        </div>
        <div className="max-w-3xl bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <ProductForm onSubmit={handleSubmit} />
        </div>
      </main>
    </div>
  );
};

export default CreateProduct;