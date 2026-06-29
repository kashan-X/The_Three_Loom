import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function AdminForgotPassword() {
  const [email,     setEmail]     = useState("");
  const [loading,   setLoading]   = useState(false);
  const [sent,      setSent]      = useState(false);
  const [error,     setError]     = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res  = await fetch("http://localhost:8000/auth/forgot-password", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="w-full lg:w-[45%] bg-white flex items-center justify-center px-12">
        <div className="absolute top-10 left-5 z-20 text-sm text-gray-400">Admin Panel</div>

        <div className="w-full max-w-md">

          {sent ? (
            /* ── Success state ── */
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6"
                style={{ background: "#fdf6f8" }}>
                📬
              </div>
              <h2 className="text-3xl font-bold mb-3">Check your inbox</h2>
              <p className="text-gray-500 mb-8 leading-relaxed">
                If <strong>{email}</strong> is registered as an admin, you'll receive a
                password reset link shortly. The link expires in <strong>30 minutes</strong>.
              </p>
              <p className="text-sm text-gray-400 mb-6">
                Didn't receive it? Check your spam folder, or
                <button
                  onClick={() => { setSent(false); }}
                  className="ml-1 underline text-gray-600 hover:text-gray-900 transition"
                >
                  try again
                </button>.
              </p>
              <Link
                to="/admin/login"
                className="text-sm font-semibold hover:opacity-80 transition"
                style={{ color: "#c0576a" }}
              >
                ← Back to login
              </Link>
            </div>
          ) : (
            /* ── Form state ── */
            <>
              <Link
                to="/admin/login"
                className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition mb-10"
              >
                ← Back to login
              </Link>

              <h2 className="text-4xl font-bold mb-2">Forgot Password?</h2>
              <p className="text-gray-500 mb-10">
                Enter your admin email and we'll send you a secure reset link.
              </p>

              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="text-sm font-medium">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your admin email"
                    className="mt-2 w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:border-[#FFC0CB] transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{ backgroundColor: "#FFC0CB" }}
                  className="w-full py-3 rounded-full font-semibold text-black hover:opacity-90 transition disabled:opacity-60"
                >
                  {loading ? "Sending…" : "Send Reset Link"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      {/* Right panel — same cover image as login */}
      <div className="hidden lg:block lg:w-[55%] relative">
        <img
          src="/Cover_Image/image5.png"
          alt="Fashion"
          className="w-full h-screen object-cover"
        />
        <div className="absolute inset-0 bg-black/10" />
      </div>
    </div>
  );
}