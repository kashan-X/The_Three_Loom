// src/pages/adminPages/ManageUsers.jsx
import React from 'react';
import AdminNavbar from '../../components/ui/Admin/AdminNavbar';
import Sidebar from '../../components/ui/Admin/Sidebar';
import UserTable from '../../components/ui/Admin/UserTable';
import '../../styles/admin.css';

const ManageUsers = () => {
  return (
    <div className="admin-container">
      <Sidebar />
      <div className="admin-main">
        <AdminNavbar />
        <main className="dashboard-main">
          <h2 className="dashboard-title">Manage Users</h2>
          <UserTable />
        </main>
      </div>
    </div>
  );
};

export default ManageUsers;
