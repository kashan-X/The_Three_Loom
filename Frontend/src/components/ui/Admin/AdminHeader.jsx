import React from "react";
import {
  Search,
  Bell,
  Settings,
} from "lucide-react";

export default function AdminHeader() {
  return (
    <header className="bg-white h-[82px] px-8 border-b border-[#F3D8DF] flex items-center justify-between">

      {/* Search */}

      <div className="relative">

        <Search
          size={18}
          className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          placeholder="Search products, orders..."
          className="w-[420px] h-[48px] rounded-2xl bg-[#FCFAFB] border border-[#F3D8DF] pl-14 pr-5 outline-none focus:border-[#E88DA2] focus:ring-2 focus:ring-pink-100 transition-all duration-300"
        />

      </div>

      {/* Right */}

      <div className="flex items-center gap-6">

        {/* Notification */}

        <div className="relative cursor-pointer group">

          <Bell
            size={22}
            className="text-gray-600 transition-all duration-300 group-hover:text-[#E88DA2]"
          />

          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#E88DA2]"></span>

        </div>

        {/* Settings */}

        <Settings
          size={22}
          className="cursor-pointer text-gray-600 transition-all duration-300 hover:text-[#E88DA2]"
        />

        {/* Divider */}

        <div className="h-8 w-px bg-[#F3D8DF]"></div>

        {/* Logo */}

        <div className="flex items-center gap-3 cursor-pointer">

          <img
            src="/Logo.png"
            alt="The Three Loom"
            className="w-11 h-11 rounded-xl border border-pink-200 object-cover"
          />

          <h4 className="text-[15px] font-semibold text-gray-800">
            The Three Loom
          </h4>

        </div>

      </div>

    </header>
  );
}