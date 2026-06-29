import {
  Menu,
  ShoppingCart,
  X,
  Heart,
  User,
  History,
  UserCircle,
  Bell,
  Lock,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useFavorites } from "../../context/FavoritesContext";
import {
  isCustomerLoggedIn,
  getCustomerName,
  customerLogout,
} from "../../utils/customerAuth";

export default function Header({ onSearch }) {
  const { cartCount } = useCart();
  const { favoriteIds } = useFavorites();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(isCustomerLoggedIn());
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch?.(value);
  };

  const handleShopNow = () => {
    navigate("/AllProducts");
  };

  const handleLogout = () => {
    customerLogout();
    setLoggedIn(false);
    setAccountOpen(false);
    navigate("/");
  };

  return (
    <header
      className={`
        w-full flex flex-col items-center border-b sticky top-0 z-50
        transition-colors duration-300
        ${scrolled ? "bg-white shadow-md" : "bg-transparent"}
      `}
    >
      {/* Top Row */}
      <div className="w-full flex justify-between items-center px-4 py-1 max-w-7xl h-[50px] relative">
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="text-black text-[10px] border border-black px-2 py-1 rounded-full font-medium"
        >
          {menuOpen ? <X size={12} /> : <Menu size={12} />}
        </button>

        <p className="text-[40px] font-normal tracking-tight">
          <strong>The Three Loom</strong>
        </p>

        <div className="flex items-center gap-1 relative">
          <div
            onClick={() => setAccountOpen((prev) => !prev)}
            className="w-6 h-6 flex items-center justify-center border border-black rounded-full cursor-pointer hover:bg-gray-100 transition"
            aria-label="Account"
          >
            <User size={12} />
          </div>
          {/* Account dropdown */}
          {accountOpen && (
            <div className="absolute top-10 right-0 w-56 bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
              {loggedIn ? (
                <>
                  {/* User Info */}
                  <div className="px-5 py-4 border-b border-gray-100">
                    <p className="text-xs uppercase tracking-wider text-gray-400">
                      Welcome
                    </p>
                    <p className="text-sm font-semibold text-gray-800 mt-1">
                      {getCustomerName()}
                    </p>
                  </div>
                  <Link
                    to="/order-history"
                    onClick={() => setAccountOpen(false)}
                    className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-all duration-200"
                  >
                    <History size={16} />
                    <span>Order History</span>
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setAccountOpen(false)}
                    className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-all duration-200"
                  >
                    <UserCircle size={16} />
                    <span>My Profile</span>
                  </Link>
                  <Link
                    to="/notifications"
                    onClick={() => setAccountOpen(false)}
                    className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition"
                  >
                    <Bell size={17} />
                    <span>Notifications</span>
                  </Link>
                  <Link
                    to="/change-password"
                    onClick={() => setAccountOpen(false)}
                    className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition"
                  >
                    <Lock size={17} />
                    <span>Change Password</span>
                  </Link>
                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="mx-3 my-3 w-[calc(100%-30px)] rounded-lg border border-red-100 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 hover:border-red-200 transition-all duration-200"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <div className="px-5 py-4 border-b border-gray-100">
                    <p className="text-lg font-semibold text-gray-900">
                      Welcome
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Sign in to your account.
                    </p>
                  </div>

                  <Link
                    to="/login"
                    onClick={() => setAccountOpen(false)}
                    className="block px-5 py-3 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-all duration-200"
                  >
                    Log In
                  </Link>

                  <Link
                    to="/signup"
                    onClick={() => setAccountOpen(false)}
                    className="block px-5 py-3 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-all duration-200"
                  >
                    Create Account
                  </Link>

                  <div className="border-t border-gray-100 px-5 py-3">
                    <p className="text-xs text-gray-400">
                      You can also continue shopping and checkout as a guest.
                    </p>
                  </div>
                </>
              )}
            </div>
          )}

          <Link to="/favorites" className="relative">
            <div className="w-6 h-6 flex items-center justify-center border border-black rounded-full cursor-pointer">
              <Heart size={11} />
            </div>
            {favoriteIds.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                {favoriteIds.length}
              </span>
            )}
          </Link>
          <Link to="/cart" className="relative">
            <div className="w-6 h-6 flex items-center justify-center border border-black rounded-full cursor-pointer">
              <ShoppingCart size={11} />
            </div>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>

        {/* Menu dropdown */}
        {menuOpen && (
          <div className="absolute top-12 left-4 bg-white border border-gray-200 rounded-md shadow-md w-48 py-2 text-sm z-50">
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-2 transition-colors"
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#FFC0CB")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              Home
            </Link>
            <Link
              to="/AllProducts"
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-2 transition-colors"
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#FFC0CB")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              All Products
            </Link>
            <Link
              to="/MenPage"
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-2 transition-colors"
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#FFC0CB")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              Men
            </Link>
            <Link
              to="/WomenPage"
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-2 transition-colors"
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#FFC0CB")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              Women
            </Link>
            <Link
              to="/ChildrenPage"
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-2 transition-colors"
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#FFC0CB")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              Children
            </Link>
            <Link
              to="/cart"
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-2 transition-colors"
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#FFC0CB")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              Cart
            </Link>
          </div>
        )}
      </div>

      {/* Search & Filters Row */}
      <div className="w-full max-w-7xl px-4 py-1 flex flex-col lg:flex-row items-center justify-between gap-1">
        {/* Left Buttons and Search */}
        <div className="flex gap-1 text-[10px]">
          <button
            onClick={handleShopNow}
            style={{ backgroundColor: "#FFC0CB" }}
            className="text-[6px] font-medium px-2 py-[1px] border border-black text-black rounded-full"
          >
            SHOP NOW
          </button>

          <Link to="/AllProducts">
            <button className="text-[6px] font-medium px-2 py-[1px] border border-black bg-white text-black rounded-full">
              ALL PRODUCT
            </button>
          </Link>

          <div className="relative flex-shrink-0">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleChange}
              className="px-2 py-1 pr-8 border border-black bg-white text-black rounded-full text-[12px] w-[180px]"
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] pointer-events-none">
              🔍
            </span>
          </div>
        </div>

        {/* Right Category Links */}
        <div className="flex gap-1 text-[10px] mt-1 lg:mt-0">
          <Link to="/MenPage">
            <button className="px-2 py-[1px] rounded-full bg-white border border-black text-black">
              MEN
            </button>
          </Link>
          <Link to="/WomenPage">
            <button className="px-2 py-[1px] rounded-full bg-white border border-black text-black">
              WOMEN
            </button>
          </Link>
          <Link to="/ChildrenPage">
            <button className="px-2 py-[1px] rounded-full bg-white border border-black text-black">
              CHILDREN
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
}
