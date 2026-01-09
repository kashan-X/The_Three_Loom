import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import ProductDetailContent from '../components/ui/ProductDetailContent';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8000/product/single_Product/${id}`)
      .then(res => res.json())
      .then(({ data }) => setProduct(data))
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return <p className="p-6 text-center">Loading…</p>;
  if (!product) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <ProductDetailContent product={product} />
      <Footer />
    </div>
  );
}
