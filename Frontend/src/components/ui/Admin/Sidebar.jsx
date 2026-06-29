import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  ClipboardList,
  Tag,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  const menu = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      link: "/admin/dashboard",
    },
    {
      title: "Products",
      icon: ShoppingBag,
      link: "/admin/products",
    },
    {
      title: "Customers",
      icon: Users,
      link: "/admin/customers-summary",
    },
    {
      title: "Orders",
      icon: ClipboardList,
      link: "/admin/orders",
    },
    {
      title: "Sale & Discounts",
      icon: Tag,
      link: "/admin/discounts",
    },
  ];

  return (
    <aside className="w-[270px] bg-white border-r border-[#F3D8DF] flex flex-col justify-between min-h-screen">

      {/* Top */}

      <div>

        {/* Logo */}

        <div className="px-7 py-7 border-b border-[#F6E6EA]">

          <div className="flex items-center gap-4">

            <img
              src="/Logo.png"
              alt="Logo"
              className="w-14 h-14 rounded-2xl object-cover border border-pink-200 shadow-sm"
            />

            <div>

              <h2 className="text-lg font-bold text-gray-800">
                The Three Loom
              </h2>

              <p className="text-xs tracking-[0.2em] uppercase text-[#E88DA2] mt-1">
                Admin Panel
              </p>

            </div>

          </div>

        </div>

        {/* Menu */}

        <div className="mt-8 px-4">

          <p className="px-4 mb-4 text-xs uppercase tracking-[0.25em] text-gray-400">
            Navigation
          </p>

          <nav className="space-y-2">

            {menu.map((item) => {

              const Icon = item.icon;

              return (

                <NavLink
                  key={item.link}
                  to={item.link}
                  className={({ isActive }) =>
                    `group flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 no-underline ${
                      isActive
                        ? "bg-[#FFF4F7] text-[#E88DA2] border-l-4 border-[#E88DA2] shadow-sm font-semibold"
                        : "text-gray-600 hover:bg-[#FFF7F9] hover:text-[#E88DA2]"
                    }`
                  }
                >

                  <div className="w-10 h-10 rounded-xl bg-[#FFF2F5] flex items-center justify-center group-hover:bg-white transition">

                    <Icon size={19} />

                  </div>

                  <span className="text-[15px]">
                    {item.title}
                  </span>

                </NavLink>

              );

            })}

          </nav>

        </div>

      </div>

      {/* Bottom */}

      <div className="border-t border-[#F6E6EA] p-5">

        <div className="bg-[#FFF7F9] rounded-2xl p-4 mb-5">

          <div className="flex items-center gap-3">

            <img
              src="/Logo.png"
              alt=""
              className="w-11 h-11 rounded-full border border-pink-200"
            />

            <div>

              <h4 className="font-semibold text-gray-800">
                Administrator
              </h4>

              <p className="text-xs text-gray-500">
                The Three Loom
              </p>

            </div>

          </div>

        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-3 rounded-xl border border-[#F3D8DF] bg-white py-3 text-[#E88DA2] font-semibold hover:bg-[#E88DA2] hover:text-white transition-all duration-300"
        >

          <LogOut size={18} />

          Logout

        </button>

      </div>

    </aside>
  );
}