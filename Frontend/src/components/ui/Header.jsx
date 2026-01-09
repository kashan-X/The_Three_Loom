import { Menu, ShoppingCart, User } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

export default function Header({ onSearch }) {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 0);

      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setVisible(false);
      } else {
        setVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <header
      className={`
        w-full flex flex-col items-center border-b sticky top-0 z-50
        transition-all duration-300 transform
        ${scrolled ? "bg-white shadow-md" : "bg-transparent"}
        ${visible ? "-translate-y-[2px]" : "-translate-y-full"}
      `}
    >
      {/* Top Row */}
      <div className="w-full flex justify-between items-center px-4 py-1 max-w-7xl h-[50px]">
        <button className="text-black text-[10px] border border-black px-2 py-1 rounded-full font-medium">
          <Menu size={12} />
        </button>

        <p className="text-[40px] font-normal tracking-tight">
          <strong>The Three Loom</strong>
        </p>

        <div className="flex items-center gap-1">
          <div className="w-6 h-6 flex items-center justify-center border border-black rounded-full cursor-pointer">
            <User size={11} />
          </div>
          <div className="w-6 h-6 flex items-center justify-center border border-black rounded-full cursor-pointer">
            <ShoppingCart size={11} />
          </div>
        </div>
      </div>

      {/* Search & Filters Row */}
      <div className="w-full max-w-7xl px-4 py-1 flex flex-col lg:flex-row items-center justify-between gap-1">
        {/* Left Buttons and Search */}
        <div className="flex gap-1 text-[10px]">
          <button
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
          <button className="px-2 py-[1px] rounded-full bg-white border border-black text-black">
            POPULAR
          </button>
        </div>
      </div>
    </header>
  );
}
