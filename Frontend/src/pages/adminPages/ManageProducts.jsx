import React from 'react';
import Sidebar from '../../components/ui/Admin/Sidebar';
import ProductTable from '../../components/ui/Admin/ProductTable';

const ManageProducts = () => {
  return (
    <div className="flex min-h-screen bg-[#f7f8fc]">
      <Sidebar />
      <main className="flex-1 p-8 min-w-0">
        <ProductTable />
      </main>
    </div>
  );
};

export default ManageProducts;