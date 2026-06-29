import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("adminToken", data.user.token);
        navigate("/admin/dashboard");
      } else {
        setError(data.message || "Login failed.");
      }
    } catch {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* LEFT */}
      <div className="w-full lg:w-[45%] bg-white flex items-center justify-center px-12">
        {/* Top Left Label */}
        <div className="absolute top-10 left-5 z-20">
          <p>Admin Panel</p>
        </div>
        <div className="w-full max-w-md">
          <h2 className="text-4xl font-bold mb-2">Welcome Back</h2>

          <p className="text-gray-500 mb-10">Sign in to manage your store.</p>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email */}
            <div>
              <label className="text-sm font-medium">Email Address</label>

              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="mt-2 w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:border-[#FFC0CB] transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium">Password</label>

              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="mt-2 w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:border-[#FFC0CB] transition"
              />

              <div className="flex justify-end mt-2">
                <Link
                  to="/admin/forgot-password"
                  className="text-sm text-gray-500 hover:text-[#FFC0CB] transition"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              style={{ backgroundColor: "#FFC0CB" }}
              className="w-full py-3 rounded-full font-semibold text-black hover:opacity-90 transition disabled:opacity-60"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT */}
      <div className="hidden lg:block lg:w-[55%] relative">
        <img
          src="/Cover_Image/image5.png"
          alt="Fashion"
          className="w-full h-screen object-cover"
        />

        <div className="absolute inset-0 bg-black/10"></div>
      </div>
    </div>
  );
}
