import React from 'react';
import Sidebar from '../../components/ui/Admin/Sidebar';
import UserTable from '../../components/ui/Admin/UserTable';

const ManageUsers = () => {
  return (
    <div className="flex min-h-screen bg-[#f7f8fc]">
      <Sidebar />
      <main className="flex-1 p-8 min-w-0">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
          <p className="text-gray-500 mt-1">View and manage all registered customers.</p>
        </div>
        <UserTable />
      </main>
    </div>
  );
};

export default ManageUsers;