import React, { useEffect, useState } from 'react';
import AdminNavbar from '../../components/ui/Admin/AdminNavbar';
import Sidebar from '../../components/ui/Admin/Sidebar';
import StatCard from '../../components/ui/Admin/StatCard';
import SalesReportChart from '../../components/ui/Admin/SalesReportChart';
import SalesRadarChart from '../../components/ui/Admin/SalesRadarChart';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalSales: 0,
    categoryCounts: { Men: 0, Women: 0, Children: 0 },
    monthlySales: [],
    countrySales: [],
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('http://localhost:8000/admin/stats', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setStats({
            totalProducts: data.totalProducts,
            totalOrders: data.totalOrders,
            totalUsers: data.totalUsers,
            totalSales: data.totalSales,
            categoryCounts: data.categoryCounts || { Men: 0, Women: 0, Children: 0 },
            monthlySales: data.monthlySales || [],
            countrySales: data.countrySales || [],
          });
        } else {
          console.error('Failed to load stats:', data.message || 'Unknown error');
        }
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="flex h-screen bg-[#f6f8fc] text-gray-800">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-y-auto">
        <main className="p-6 space-y-6">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard label="Total Orders" value={stats.totalOrders} trend="+39.4%" trendType="up" />
            <StatCard label="Total Products" value={stats.totalProducts} trend="+12.0%" trendType="up" />
            <StatCard label="Total Users" value={stats.totalUsers} trend="+6.8%" trendType="up" />
            <StatCard label="Total Sales" value={stats.totalSales} trend="+12.4%" trendType="up" />
            <StatCard label="Men's Clothes" value={stats.categoryCounts.Men} trend="+4.1%" trendType="up" />
            <StatCard label="Women's Clothes" value={stats.categoryCounts.Women} trend="+5.6%" trendType="up" />
            <StatCard label="Children's Clothes" value={stats.categoryCounts.Children} trend="+3.2%" trendType="up" />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SalesReportChart data={stats.monthlySales} />
            <SalesRadarChart data={stats.countrySales} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
