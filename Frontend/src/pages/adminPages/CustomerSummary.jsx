import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/ui/Admin/Sidebar';
import CustomerSummaryTable from '../../components/ui/Admin/CustomerSummaryTable';

const CustomerSummary = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => { fetchCustomerSummary(); }, []);

  const fetchCustomerSummary = async () => {
    try {
      const res = await fetch('http://localhost:8000/order/customer-summary', {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
      });
      const data = await res.json();
      setCustomers(data.customers || []);
    } catch (err) { console.error('Failed to fetch customer summary', err); }
  };

  return (
    <div className="flex min-h-screen bg-[#f7f8fc]">
      <Sidebar />
      <main className="flex-1 p-8 min-w-0">
        <CustomerSummaryTable customers={customers} />
      </main>
    </div>
  );
};

export default CustomerSummary;