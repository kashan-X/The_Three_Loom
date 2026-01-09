import React from 'react';
import Sidebar from '../../components/ui/Admin/Sidebar';
import AdminNavbar from '../../components/ui/Admin/AdminNavbar';
import ProductTable from '../../components/ui/Admin/ProductTable';
import '../../styles/admin.css';

const ManageProducts = () => {
  return (
    <div className="admin-container">
      <Sidebar />
      <div className="admin-content">
        <ProductTable />
      </div>
    </div>
  );
};

export default ManageProducts;
