import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const EMOJIS = ["👗", "👘", "🧣", "👒", "🧥", "👙", "🥻", "🩱", "👚", "🧤", "👠", "👡", "👟", "🥿", "👜", "👛", "💍", "🧦", "🩴", "👞"];

function FloatingItem({ emoji, style }) {
  return (
    <div
      className="absolute select-none pointer-events-none animate-float"
      style={style}
    >
      <span style={{ fontSize: style.fontSize }}>{emoji}</span>
    </div>
  );
}

const ITEMS = [
  { emoji: "👗", style: { top: "8%",  left: "4%",  fontSize: "28px", animationDelay: "0s",   animationDuration: "6s",   opacity: 0.18 } },
  { emoji: "🧣", style: { top: "20%", left: "88%", fontSize: "22px", animationDelay: "1s",   animationDuration: "7s",   opacity: 0.15 } },
  { emoji: "👒", style: { top: "55%", left: "6%",  fontSize: "24px", animationDelay: "2s",   animationDuration: "8s",   opacity: 0.13 } },
  { emoji: "🧥", style: { top: "72%", left: "90%", fontSize: "30px", animationDelay: "0.5s", animationDuration: "6.5s", opacity: 0.16 } },
  { emoji: "🥻", style: { top: "85%", left: "15%", fontSize: "20px", animationDelay: "3s",   animationDuration: "9s",   opacity: 0.12 } },
  { emoji: "👘", style: { top: "40%", left: "92%", fontSize: "26px", animationDelay: "1.5s", animationDuration: "7.5s", opacity: 0.14 } },
  { emoji: "👙", style: { top: "5%",  left: "75%", fontSize: "18px", animationDelay: "4s",   animationDuration: "8.5s", opacity: 0.11 } },
  { emoji: "🧤", style: { top: "90%", left: "80%", fontSize: "22px", animationDelay: "2.5s", animationDuration: "7s",   opacity: 0.13 } },
  { emoji: "👗", style: { top: "30%", left: "2%",  fontSize: "20px", animationDelay: "3.5s", animationDuration: "9s",   opacity: 0.10 } },
  { emoji: "🩱", style: { top: "65%", left: "96%", fontSize: "18px", animationDelay: "0.8s", animationDuration: "6s",   opacity: 0.12 } },
  { emoji: "👠", style: { top: "14%", left: "92%", fontSize: "24px", animationDelay: "1.2s", animationDuration: "7.2s", opacity: 0.15 } },
  { emoji: "👡", style: { top: "78%", left: "3%",  fontSize: "22px", animationDelay: "2.8s", animationDuration: "8.2s", opacity: 0.13 } },
  { emoji: "👟", style: { top: "48%", left: "95%", fontSize: "26px", animationDelay: "0.3s", animationDuration: "6.8s", opacity: 0.14 } },
  { emoji: "🥿", style: { top: "93%", left: "50%", fontSize: "20px", animationDelay: "3.8s", animationDuration: "9.5s", opacity: 0.11 } },
  { emoji: "👜", style: { top: "3%",  left: "40%", fontSize: "22px", animationDelay: "1.8s", animationDuration: "7.8s", opacity: 0.12 } },
  { emoji: "👛", style: { top: "60%", left: "1%",  fontSize: "18px", animationDelay: "4.5s", animationDuration: "8s",   opacity: 0.10 } },
  { emoji: "💍", style: { top: "35%", left: "97%", fontSize: "16px", animationDelay: "2.2s", animationDuration: "6.2s", opacity: 0.13 } },
  { emoji: "🧦", style: { top: "96%", left: "35%", fontSize: "18px", animationDelay: "3.2s", animationDuration: "8.8s", opacity: 0.10 } },
  { emoji: "🩴", style: { top: "18%", left: "10%", fontSize: "20px", animationDelay: "5s",   animationDuration: "7.5s", opacity: 0.12 } },
  { emoji: "👞", style: { top: "82%", left: "60%", fontSize: "22px", animationDelay: "1.6s", animationDuration: "6.6s", opacity: 0.13 } },
];

export default function RoleSelectPage() {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        @keyframes floatUp {
          0%   { transform: translateY(0px) rotate(-4deg); }
          50%  { transform: translateY(-18px) rotate(4deg); }
          100% { transform: translateY(0px) rotate(-4deg); }
        }
        .animate-float {
          animation: floatUp ease-in-out infinite;
        }
      `}</style>

      <div className="min-h-screen flex items-center justify-center bg-[#fdf6f8] relative overflow-hidden">

        {/* Background image — faded */}
        <div
          className="absolute inset-0 bg-cover bg-center pointer-events-none"
          style={{
            backgroundImage: "url('/The_Home_Image.png')",
            opacity: 0.15,
          }}
        />

        {/* Floating clothing items */}
        {ITEMS.map((item, i) => (
          <FloatingItem key={i} emoji={item.emoji} style={item.style} />
        ))}

        {/* Soft pink glow blobs */}
        <div className="absolute top-[-80px] left-[-80px] w-72 h-72 rounded-full opacity-20 pointer-events-none"
          style={{ background: "radial-gradient(circle, #FFC0CB, transparent 30%)" }} />
        <div className="absolute bottom-[-60px] right-[-60px] w-64 h-64 rounded-full opacity-15 pointer-events-none"
          style={{ background: "radial-gradient(circle, #FFC0CB, transparent 30%)" }} />

        {/* Card */}
        <div className="relative z-10 w-full max-w-sm px-6">

          {/* Logo */}
          <div className="text-center mb-10">
            <img
              src="/Logo.png"
              alt="The Three Loom"
              className="w-16 h-16 rounded-full object-cover border border-pink-200 mx-auto mb-4 shadow-sm"
            />
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight whitespace-nowrap">The Three Loom</h1>
            <p className="text-xs text-gray-400 mt-1 tracking-[0.2em] uppercase">Pakistani Fashion</p>
            <p className="text-sm text-gray-500 mt-2 italic font-light">Crafted with tradition, worn with pride.</p>
          </div>

          <p className="text-center text-gray-400 text-xs tracking-widest uppercase mb-5">Continue as</p>

          <div className="space-y-3">

            {/* Customer */}
            <button
              onClick={() => navigate("/home")}
              className="w-full flex items-center justify-between px-6 py-4 bg-white border border-gray-200 hover:border-[#FFC0CB] hover:shadow-sm rounded-xl transition-all duration-200 group"
            >
              <div className="text-left">
                <p className="font-semibold text-gray-800 text-sm">Customer</p>
                <p className="text-xs text-gray-400 mt-0.5">Browse & shop the collection</p>
              </div>
              <svg className="w-4 h-4 text-gray-300 group-hover:text-[#FFC0CB] transition-colors" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Admin */}
            <button
              onClick={() => navigate("/admin")}
              className="w-full flex items-center justify-between px-6 py-4 bg-white border border-gray-200 hover:border-gray-700 hover:shadow-sm rounded-xl transition-all duration-200 group"
            >
              <div className="text-left">
                <p className="font-semibold text-gray-800 text-sm">Admin</p>
                <p className="text-xs text-gray-400 mt-0.5">Manage store & operations</p>
              </div>
              <svg className="w-4 h-4 text-gray-300 group-hover:text-gray-700 transition-colors" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>

          </div>

          <p className="text-center text-xs text-gray-300 mt-10">
            © {new Date().getFullYear()} The Three Loom · All rights reserved
          </p>

        </div>
      </div>
    </>
  );
}