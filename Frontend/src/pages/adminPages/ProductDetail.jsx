import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8000/product/single_Product/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Product not found');
        return res.json();
      })
      .then(({ data }) => setProduct(data))
      .catch((err) => {
        console.error('Fetch error:', err.message);
        navigate('/admin/products'); // Redirect on error
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return <p className="p-6 text-center">Loading…</p>;
  if (!product) return <p className="p-6 text-center">Product not found.</p>;

  const parsedImages = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
  const parsedSizes = typeof product.sizes === 'string' ? JSON.parse(product.sizes) : product.sizes;
  const parsedColors = typeof product.colors === 'string' ? JSON.parse(product.colors) : product.colors;

  return (
    <div className="product-detail p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
      <p><strong>Category:</strong> {product.category}</p>
      <p><strong>Description:</strong> {product.description}</p>
      <p><strong>Price:</strong> ${product.price}</p>
      <p><strong>Stock:</strong> {product.stock}</p>
      <p><strong>Featured:</strong> {product.isFeatured ? 'Yes' : 'No'}</p>

      {parsedSizes?.length > 0 && (
        <p><strong>Sizes:</strong> {parsedSizes.join(', ')}</p>
      )}
      {parsedColors?.length > 0 && (
        <p><strong>Colors:</strong> {parsedColors.join(', ')}</p>
      )}
      {parsedImages?.length > 0 && (
        <div className="image-gallery mt-4 grid grid-cols-2 gap-2">
          {parsedImages.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`Product Image ${i + 1}`}
              className="w-full h-auto border rounded"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
