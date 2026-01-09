import React, { useState } from 'react';
import './OrderTable.css'; // Assume this is where styling lives

const OrderTable = ({ orders, onDelete }) => {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filtered = orders.filter((order) =>
    order.fullName.toLowerCase().includes(search.toLowerCase())
  );

  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <div className="order-page">
      {/* Header with search and actions */}
      <div className="product-header">
        <div className="product-filters">
          <input
            type="text"
            className="search-input"
            placeholder="Search by Customer Name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select>
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select>
            <option>All Orders</option>
          </select>
        </div>
        <div className="product-actions">
          <button className="btn btn-outline">Import</button>
          <button className="btn btn-outline">Export</button>
          <button className="btn btn-primary">Create Order</button>
        </div>
      </div>

      {/* Order Table */}
      <div className="table-wrapper">
        <table className="product-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>City</th>
              <th>Phone</th>
              <th>Product</th>
              <th>Qty</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length > 0 ? (
              paginated.map((order) => (
                <tr key={order.id}>
                  <td>{order.id || 'N/A'}</td>
                  <td>{order.fullName}</td>
                  <td>{order.city}</td>
                  <td>{order.phoneNumber}</td>
                  <td>{order.product}</td>
                  <td>{order.quantity}</td>
                  <td>${order.totalPrice}</td>
                  <td>
                    <span className={`status ${order.status?.toLowerCase() || 'pending'}`}>
                      {order.status || 'Pending'}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-delete" onClick={() => onDelete(order.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9">No orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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

    </div>
  );
};

export default OrderTable;
