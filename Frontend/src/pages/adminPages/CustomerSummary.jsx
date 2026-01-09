import React, { useEffect, useState } from 'react';
import AdminNavbar from '../../components/ui/Admin/AdminNavbar';
import Sidebar from '../../components/ui/Admin/Sidebar';
import CustomerSummaryTable from '../../components/ui/Admin/CustomerSummaryTable';
import '../../styles/admin.css';

const CustomerSummary = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    fetchCustomerSummary();
  }, []);

  const fetchCustomerSummary = async () => {
    try {
      const res = await fetch('http://localhost:8000/order/customer-summary', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });
      const data = await res.json();
      setCustomers(data.customers || []);
    } catch (err) {
      console.error('Failed to fetch customer summary', err);
    }
  };

  return (
    <div className="admin-container">
      <Sidebar />
      <div className="admin-main">

        <main className="dashboard-main">
          <h2 className="dashboard-title">Customer Order Summary</h2>
          <CustomerSummaryTable customers={customers} />
        </main>
      </div>
    </div>
  );
};

export default CustomerSummary;
