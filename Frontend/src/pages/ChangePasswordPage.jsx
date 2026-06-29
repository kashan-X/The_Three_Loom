import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/ui/Header";
import Footer from "../components/ui/Footer";
import { getCustomerToken, isCustomerLoggedIn } from "../utils/customerAuth";

export default function ChangePasswordPage() {
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isCustomerLoggedIn()) {
      navigate("/login");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        "http://localhost:8000/customer/change-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getCustomerToken()}`,
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to change password");
        return;
      }

      setMessage("Password changed successfully.");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-grow py-16 px-6">
        <div className="max-w-xl mx-auto">
          {/* Heading */}
          <div className="text-center mb-10">
            <h1 className="text-sm font-light uppercase tracking-[0.10em] text-gray-900">
              Change
            </h1>

            <p className="mt-4 text-lg text-gray-600">
              Please enter your password details below.
            </p>
          </div>

          {/* Success */}
          {message && (
            <div className="mb-5 border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {message}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-5 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full border border-gray-300 px-5 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none transition duration-300 focus:border-[#FFC0CB]"
            />

            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
              className="w-full border border-gray-300 px-5 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none transition duration-300 focus:border-[#FFC0CB]"
            />

            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full border border-gray-300 px-5 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none transition duration-300 focus:border-[#FFC0CB]"
            />

            <button
              type="submit"
              disabled={loading}
              style={{ backgroundColor: "#FFC0CB" }}
              className="w-full py-3 mt-2 uppercase tracking-[0.2em] text-sm font-semibold text-black transition-all duration-300 hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
