import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductForm from '../../components/ui/Admin/ProductForm';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`http://localhost:8000/product/single_Product/${id}`);
      const data = await res.json();
      if (data.data) {
        // sizes/colors/images are already real arrays from MongoDB now — no JSON.parse needed
        setProduct(data.data);
      }
    } catch (err) {
      console.error('Failed to load product:', err);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`http://localhost:8000/product/update_Product/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        navigate('/admin/products');
      } else {
        const errData = await res.json();
        alert(errData.message || 'Failed to update product');
      }
    } catch (err) {
      console.error('Update error:', err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-[#f6f5f3] rounded-2xl shadow-xl mt-10">
      <h2 className="text-3xl font-bold mb-8 text-center text-black">Edit Product</h2>
      {product ? (
        <ProductForm onSubmit={handleSubmit} initialData={product} />
      ) : (
        <p className="text-center">Loading product...</p>
      )}
    </div>
  );
};

export default EditProduct;