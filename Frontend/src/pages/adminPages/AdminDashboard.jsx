import React, { useEffect, useState } from "react";

import Sidebar from "../../components/ui/Admin/Sidebar";
import AdminHeader from "../../components/ui/Admin/AdminHeader";
import StatCard from "../../components/ui/Admin/StatCard";
import SalesReportChart from "../../components/ui/Admin/SalesReportChart";
import SalesRadarChart from "../../components/ui/Admin/SalesRadarChart";
import RevenueLineChart from "../../components/ui/Admin/RevenueLineChart";
import CategoryDoughnut from "../../components/ui/Admin/CategoryDoughnut";

import {
  ShoppingBag,
  Package,
  Users,
  Wallet,
  Shirt,
  Sparkles,
  Baby,
} from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalSales: 0,
    categoryCounts: {
      Men: 0,
      Women: 0,
      Children: 0,
    },
    monthlySales: [],
    countrySales: [],
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("http://localhost:8000/admin/stats", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setStats({
          totalProducts: data.totalProducts,
          totalOrders: data.totalOrders,
          totalUsers: data.totalUsers,
          totalSales: data.totalSales,
          categoryCounts: data.categoryCounts || {
            Men: 0,
            Women: 0,
            Children: 0,
          },
          monthlySales: data.monthlySales || [],
          countrySales: data.countrySales || [],
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FCFAFB]">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <AdminHeader />

        <main className="flex-1 p-8">
          {/* Welcome */}
          <div className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-sm font-bold text-gray-800">Welcome Back</h1>

              <p className="mt-2 text-gray-500">
                Here's what's happening with your fashion store today.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-pink-100 shadow-sm px-6 py-4">
              <p className="text-sm text-gray-500">Today's Revenue</p>

              <h2 className="text-3xl font-bold text-[#E88DA2] mt-2">
                Rs. {stats.totalSales.toLocaleString()}
              </h2>
            </div>
          </div>
          {/* Main Statistics */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <StatCard
              label="Orders"
              value={stats.totalOrders}
              trend="+12%"
              icon={<ShoppingBag size={22} />}
            />

            <StatCard
              label="Products"
              value={stats.totalProducts}
              trend="+8%"
              icon={<Package size={22} />}
            />

            <StatCard
              label="Customers"
              value={stats.totalUsers}
              trend="+5%"
              icon={<Users size={22} />}
            />

            <StatCard
              label="Revenue"
              value={`Rs. ${stats.totalSales.toLocaleString()}`}
              trend="+18%"
              icon={<Wallet size={22} />}
            />
          </div>
          {/* Categories */}
          <div className="grid grid-cols-3 gap-6 mb-10">
            <StatCard
              label="Men Collection"
              value={stats.categoryCounts.Men}
              trend="+4%"
              icon={<Shirt size={22} />}
            />

            <StatCard
              label="Women Collection"
              value={stats.categoryCounts.Women}
              trend="+7%"
              icon={<Sparkles size={22} />}
            />

            <StatCard
              label="Kids Collection"
              value={stats.categoryCounts.Children}
              trend="+2%"
              icon={<Baby size={22} />}
            />
          </div>{" "}
          {/* Analytics */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            {/* Sales Analytics */}

            <div className="bg-white rounded-[24px] border border-[#F3D8DF] shadow-sm p-7">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Sales Analytics
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Monthly Sales Overview
                  </p>
                </div>

                <button className="px-5 py-2 rounded-xl border border-pink-100 bg-[#FFF7F9] text-[#E88DA2] font-medium hover:bg-[#FFF2F5] transition">
                  Last 12 Months
                </button>
              </div>

              <SalesReportChart data={stats.monthlySales} />
            </div>

            {/* Radar Chart */}

            <div className="bg-white rounded-[24px] border border-[#F3D8DF] shadow-sm p-7">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  Country Sales
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Overall Performance
                </p>
              </div>

              <SalesRadarChart data={stats.countrySales} />
            </div>

            {/* Revenue Line */}

            <div className="bg-white rounded-[24px] border border-[#F3D8DF] shadow-sm p-7">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  Revenue Trend
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Monthly Revenue Growth
                </p>
              </div>

              <RevenueLineChart data={stats.monthlySales} />
            </div>

            {/* Doughnut Chart */}

            <div className="bg-white rounded-[24px] border border-[#F3D8DF] shadow-sm p-7">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  Category Distribution
                </h2>

                <p className="text-sm text-gray-500 mt-1">Men • Women • Kids</p>
              </div>

              <CategoryDoughnut data={stats.categoryCounts} />
            </div>
          </div>
          {/* Bottom Cards */}
          <div className="grid grid-cols-3 gap-6">
            {/* Revenue */}

            <div className="bg-white rounded-[24px] border border-[#F3D8DF] shadow-sm p-7 hover:shadow-lg transition">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-500 text-sm">Total Revenue</p>

                  <h2 className="text-4xl font-bold mt-3 text-gray-800">
                    Rs. {stats.totalSales.toLocaleString()}
                  </h2>

                  <p className="mt-5 text-green-600 font-medium">
                    ▲ +18% this month
                  </p>
                </div>

                <div className="w-16 h-16 rounded-2xl bg-[#FFF2F5] flex items-center justify-center">
                  <Wallet size={28} className="text-[#E88DA2]" />
                </div>
              </div>
            </div>

            {/* Users */}

            <div className="bg-white rounded-[24px] border border-[#F3D8DF] shadow-sm p-7 hover:shadow-lg transition">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-500 text-sm">Registered Users</p>

                  <h2 className="text-4xl font-bold mt-3 text-gray-800">
                    {stats.totalUsers}
                  </h2>

                  <p className="mt-5 text-[#E88DA2] font-medium">
                    Growing every day
                  </p>
                </div>

                <div className="w-16 h-16 rounded-2xl bg-[#FFF2F5] flex items-center justify-center">
                  <Users size={28} className="text-[#E88DA2]" />
                </div>
              </div>
            </div>

            {/* Products */}

            <div className="bg-white rounded-[24px] border border-[#F3D8DF] shadow-sm p-7 hover:shadow-lg transition">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-500 text-sm">Total Products</p>

                  <h2 className="text-4xl font-bold mt-3 text-gray-800">
                    {stats.totalProducts}
                  </h2>

                  <p className="mt-5 text-blue-500 font-medium">
                    Inventory Updated
                  </p>
                </div>

                <div className="w-16 h-16 rounded-2xl bg-[#FFF2F5] flex items-center justify-center">
                  <Package size={28} className="text-[#E88DA2]" />
                </div>
              </div>
            </div>
          </div>{" "}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
