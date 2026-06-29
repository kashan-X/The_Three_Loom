import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#f6f5f3] border-t border-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Main Footer */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <h2 className="text-2xl font-serif text-gray-900 mb-4">
              The Three Loom
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Discover timeless fashion crafted with elegance, comfort, and
              quality. Every piece is designed to celebrate individuality and
              confidence.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4 uppercase tracking-wide">
              Shop
            </h3>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li>
                <Link to="/WomenPage" className="hover:text-black transition">
                  Women
                </Link>
              </li>
              <li>
                <Link to="/MenPage" className="hover:text-black transition">
                  Men
                </Link>
              </li>
              <li>
                <Link to="/ChildrenPage" className="hover:text-black transition">
                  Kids
                </Link>
              </li>
              <li>
                <Link to="/AllProducts" className="hover:text-black transition">
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4 uppercase tracking-wide">
              Customer Care
            </h3>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li>
                <Link to="/contact" className="hover:text-black transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/policies/shipping" className="hover:text-black transition">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link to="/policies/returns" className="hover:text-black transition">
                  Return & Exchange
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-black transition">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4 uppercase tracking-wide">
              Get In Touch
            </h3>

            <div className="space-y-3 text-sm text-gray-600">
              <p>
                📧{" "}
                <a
                  href="mailto:kashankarim12@gmail.com"
                  className="hover:text-black"
                >
                  kashankarim12@gmail.com
                </a>
              </p>

              <p>
                📞{" "}
                <a
                  href="tel:+923489928595"
                  className="hover:text-black"
                >
                  +92 348 9928595
                </a>
              </p>

              <div className="flex gap-4 pt-2">
                {/* No live social accounts yet — shown for branding, not yet clickable */}
                <span className="cursor-not-allowed text-gray-400" title="Coming soon">Instagram</span>
                <span className="cursor-not-allowed text-gray-400" title="Coming soon">Facebook</span>
                <span className="cursor-not-allowed text-gray-400" title="Coming soon">TikTok</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-300 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} The Three Loom. All Rights Reserved.
          </p>

          <div className="flex gap-6 text-sm text-gray-500">
            <Link to="/policies/privacy" className="hover:text-black">
              Privacy Policy
            </Link>
            <Link to="/policies/terms" className="hover:text-black">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}