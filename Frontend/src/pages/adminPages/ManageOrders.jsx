import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/ui/Admin/Sidebar';
import OrderTable from '../../components/ui/Admin/OrderTable';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch('http://localhost:8000/order/all', {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) { console.warn('Unauthorized'); return; }
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) { console.error('Failed to fetch orders', err); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      await fetch(`http://localhost:8000/order/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
      });
      fetchOrders();
    } catch (error) { console.error('Failed to delete order:', error); }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`http://localhost:8000/order/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) { const data = await res.json(); alert(data.error || 'Failed to update status'); return; }
      setOrders((prev) => prev.map((order) => order.id === id ? { ...order, status: newStatus } : order));
    } catch (error) { console.error('Failed to update order status:', error); alert('Server error updating status'); }
  };

  return (
    <div className="flex min-h-screen bg-[#f7f8fc]">
      <Sidebar />
      <main className="flex-1 p-8 min-w-0">
        <OrderTable orders={orders} onDelete={handleDelete} onStatusChange={handleStatusChange} />
      </main>
    </div>
  );
};

export default ManageOrders;