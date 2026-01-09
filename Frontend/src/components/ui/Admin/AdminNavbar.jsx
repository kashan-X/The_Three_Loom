// src/components/ui/Admin/AdminNavbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './AdminStyles.css';

const AdminNavbar = () => {
  return (
    <nav className="admin-navbar">
      <h1 className="admin-logo">Admin Panel</h1>
      <ul className="admin-nav-links">
        <li><Link to="/admin/dashboard">Dashboard</Link></li>
        <li><Link to="/admin/products">Products</Link></li>
        <li><Link to="/admin/users">Users</Link></li>
        <li><Link to="/admin/orders">Orders</Link></li>
      </ul>
    </nav>
  );
};

export default AdminNavbar;