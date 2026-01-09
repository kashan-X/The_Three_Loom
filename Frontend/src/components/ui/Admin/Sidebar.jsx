import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded-md text-sm font-medium transition-all ${isActive
      ? 'bg-white text-black shadow'
      : 'text-black/80 hover:bg-white/20 hover:text-black'
    }`;

  return (
    <aside className="w-45 min-h-screen bg-gradient-to-b from-[#ef9a9a] to-[#f48fb1] text-black hidden md:block shadow-md">
      <div className="p-6">
        <h2 className="text-xl font-bold mb-8 tracking-wide text-black">Admin Panel</h2>
        <nav className="space-y-2">
          <NavLink to="/admin/dashboard" className={linkClass}>Dashboard</NavLink>
          <NavLink to="/admin/products" className={linkClass}>Products</NavLink>
          <NavLink to="/admin/customers-summary" className={linkClass}>Customers</NavLink>
          <NavLink to="/admin/orders" className={linkClass}>Orders</NavLink>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
