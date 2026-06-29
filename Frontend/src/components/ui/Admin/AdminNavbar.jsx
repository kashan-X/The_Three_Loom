// src/components/ui/Admin/AdminNavbar.jsx

import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Bell,
  Settings,
  LogOut,
} from "lucide-react";

const links = [
  {
    label: "Dashboard",
    to: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Products",
    to: "/admin/products",
    icon: Package,
  },
  {
    label: "Orders",
    to: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    label: "Customers",
    to: "/admin/customers-summary",
    icon: Users,
  },
];

const AdminNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto h-16 px-8 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <img
            src="/Logo.png"
            alt="The Three Loom"
            className="w-10 h-10 rounded-lg object-cover border border-slate-200"
          />

          <div>
            <h1 className="text-base font-semibold text-slate-900">
              The Three Loom
            </h1>

            <p className="text-xs tracking-widest uppercase text-slate-500">
              Admin Dashboard
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="hidden lg:flex items-center gap-2">
          {links.map((item) => {
            const Icon = item.icon;

            const active =
              location.pathname === item.to ||
              location.pathname.startsWith(item.to + "/");

            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 no-underline ${
                  active
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon size={18} strokeWidth={2} />
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-5">

          {/* Notifications */}
          <Bell
            size={50}
            strokeWidth={1.8}
            className="cursor-pointer text-slate-500 hover:text-slate-900 transition-colors duration-200"
          />

          {/* Settings */}
          <Settings
            size={20}
            strokeWidth={1.8}
            className="cursor-pointer text-slate-500 hover:text-slate-900 transition-colors duration-200"
          />

          {/* Divider */}
          <div className="h-6 w-px bg-slate-200"></div>

          {/* Logout */}
          <button
            onClick={logout}
            className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-red-600 transition-colors duration-200"
          >
            <LogOut size={18} strokeWidth={2} />
            Logout
          </button>

        </div>

      </div>
    </nav>
  );
};

export default AdminNavbar;