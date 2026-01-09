import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-[#f6f5f3]  border-gray-400 py-10 ">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-gray-300 pt-6">

        {/* Brand Info */}
        <div className="text-center md:text-left">
          <h2 className="text-gray-900 text-xl font-semibold tracking-wide mb-1 font-serif">
            The Three Loom
          </h2>
          <p className="text-gray-600 text-sm max-w-xs mb-2">
            Timeless apparel crafted with care — style and quality you can trust.
          </p>
          <p className="text-gray-600 text-sm">
            Email: <a href="mailto:kashankarim12@gmail.com" className="hover:underline">kashankarim12@gmail.com</a><br />
            Contact: <a href="tel:+03489928595" className="hover:underline">0348 9928595</a>
          </p>
        </div>

        {/* Social Links */}
        <nav className="flex gap-8 text-gray-700 font-semibold uppercase text-sm tracking-wide">
          <a href="#" className="hover:underline">Instagram</a>
          <a href="#" className="hover:underline">Telegram</a>
          <a href="#" className="hover:underline">Facebook</a>
          <a href="#" className="hover:underline">Twitter</a>
        </nav>
      </div>

      {/* Copyright */}
      <div className="mt-8 text-center text-gray-500 text-xs tracking-wide font-sans">
        &copy; {new Date().getFullYear()} The Three Loom. All rights reserved.
      </div>
    </footer>
  );
}
