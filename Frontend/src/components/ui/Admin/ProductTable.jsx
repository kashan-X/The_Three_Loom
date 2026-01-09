
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductModal from './ProductModal';
import './ProductTable.css';

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [modalProduct, setModalProduct] = useState(null);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:8000/product/all_Products');
      const data = await res.json();
      setProducts(data.data || []);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const token = localStorage.getItem('adminToken');
      await fetch(`http://localhost:8000/product/delete_Product/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <div className="product-page">
      <div className="product-header">
        <div className="product-filters">
          <input
            type="text"
            className="search-input"
            placeholder="Search for Product"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select>
            <option>All Categories</option>
          </select>
          <select>
            <option>All Products</option>
          </select>
        </div>
        <div className="product-actions">
          <button className="btn btn-outline">Import</button>
          <button className="btn btn-outline">Export</button>
          <button className="btn btn-primary" onClick={() => navigate('/admin/products/create')}>
            Create Product
          </button>
        </div>
      </div>

      <table className="product-table">
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Category</th>
            <th>Status</th>
            <th>Stock</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginated.length > 0 ? (
            paginated.map((product) => (
              <tr key={product.id}>
                <td>
                  <img
                    src={product.images?.[0] || 'https://via.placeholder.com/50'}
                    alt={product.name}
                    width="40"
                    height="40"
                  />
                </td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>
                  <span className={`status-dot ${product.status === 'Available' ? 'green' : 'red'}`}></span>
                  {product.status}
                </td>
                <td style={{ color: product.stock <= 5 ? 'red' : '#333' }}>{product.stock}</td>
                <td>${parseFloat(product.price).toLocaleString()}</td>
                <td>
                  <button
                    className="btn btn-edit"
                    onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-delete"
                    onClick={() => handleDelete(product.id)}
                  >
                    Delete
                  </button>
                  <button
                    className="btn btn-preview"
                    onClick={() => setModalProduct(product)}
                  >
                    Preview
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No products found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {/* Pagination with Square Buttons and Arrows */}
      <div className="pagination-container" style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
        <ul className="pagination-list" style={{ display: 'flex', gap: '6px', listStyle: 'none', padding: 0 }}>

          {/* Previous Arrow */}
          <li>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              style={{
                width: '40px',
                height: '40px',
                border: '1px solid #ccc',
                backgroundColor: currentPage === 1 ? '#f0f0f0' : '#fff',
                color: '#333',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              }}
            >
              ←
            </button>
          </li>

          {/* Page Numbers */}
          {Array.from({ length: totalPages }, (_, i) => (
            <li key={i + 1}>
              <button
                onClick={() => setCurrentPage(i + 1)}
                className={currentPage === i + 1 ? 'active' : ''}
                style={{
                  width: '40px',
                  height: '40px',
                  border: '1px solid #ccc',
                  backgroundColor: currentPage === i + 1 ? '#1f2937' : '#fff',
                  color: currentPage === i + 1 ? '#fff' : '#333',
                  fontWeight: currentPage === i + 1 ? '600' : '400',
                  cursor: 'pointer',
                }}
              >
                {i + 1}
              </button>
            </li>
          ))}

          {/* Next Arrow */}
          <li>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              style={{
                width: '40px',
                height: '40px',
                border: '1px solid #ccc',
                backgroundColor: currentPage === totalPages ? '#f0f0f0' : '#fff',
                color: '#333',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              }}
            >
              →
            </button>
          </li>
        </ul>
      </div>

      {/* Modal */}
      <ProductModal product={modalProduct} onClose={() => setModalProduct(null)} />
    </div>
  );
};

export default ProductTable;
