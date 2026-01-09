import React, { useEffect, useState } from 'react';
import AdminNavbar from '../../components/ui/Admin/AdminNavbar';
import Sidebar from '../../components/ui/Admin/Sidebar';
import OrderTable from '../../components/ui/Admin/OrderTable';
import '../../styles/admin.css';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch('http://localhost:8000/order/all', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        console.warn('Unauthorized - invalid or missing token');
      }

      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      console.error('Failed to fetch orders', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      await fetch(`http://localhost:8000/order/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });
      fetchOrders(); // Refresh list
    } catch (error) {
      console.error('Failed to delete order:', error);
    }
  };

  return (
    <div className="admin-container">
      <Sidebar />
      <div className="admin-main">
        
        <main className="dashboard-main">
        
          <OrderTable orders={orders} onDelete={handleDelete} />
        </main>
      </div>
    </div>
  );
};

export default ManageOrders;
