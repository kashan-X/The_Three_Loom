import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProductForm from '../../components/ui/Admin/ProductForm';

const CreateProduct = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('http://localhost:8000/product/create_Products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        navigate('/admin/products');
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to create product');
      }
    } catch (err) {
      console.error('Create error:', err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-[#f6f5f3] rounded-2xl shadow-xl mt-10">
      <h2 className="text-3xl font-bold mb-8 text-center text-black">Create New Product</h2>
      <ProductForm onSubmit={handleSubmit} />
    </div>
  );
};

export default CreateProduct;
