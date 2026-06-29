import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";

export default function AdminResetPassword() {
  const [searchParams]                  = useSearchParams();
  const navigate                        = useNavigate();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [newPassword,     setNewPassword]     = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew,         setShowNew]         = useState(false);
  const [showConfirm,     setShowConfirm]     = useState(false);
  const [loading,         setLoading]         = useState(false);
  const [error,           setError]           = useState("");
  const [done,            setDone]            = useState(false);

  // If token/email missing from URL, show error immediately
  const invalidLink = !token || !email;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 6) {
      return setError("Password must be at least 6 characters.");
    }
    if (newPassword !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    setLoading(true);
    try {
      const res  = await fetch("http://localhost:8000/auth/reset-password", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email, token, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");
      setDone(true);
      // Auto-redirect to login after 3 s
      setTimeout(() => navigate("/admin/login"), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Password strength indicator
  const strength = (() => {
    if (!newPassword) return null;
    if (newPassword.length < 6)  return { label: "Too short", color: "#ef4444", width: "25%" };
    if (newPassword.length < 8)  return { label: "Weak",      color: "#f97316", width: "50%" };
    if (!/[A-Z]/.test(newPassword) || !/[0-9]/.test(newPassword))
                                  return { label: "Fair",      color: "#eab308", width: "75%" };
    return                               { label: "Strong",    color: "#22c55e", width: "100%" };
  })();

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="w-full lg:w-[45%] bg-white flex items-center justify-center px-12">
        <div className="absolute top-10 left-5 z-20 text-sm text-gray-400">Admin Panel</div>

        <div className="w-full max-w-md">

          {invalidLink ? (
            /* ── Invalid link state ── */
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6"
                style={{ background: "#fff1f2" }}>
                🔗
              </div>
              <h2 className="text-3xl font-bold mb-3">Invalid Link</h2>
              <p className="text-gray-500 mb-8">
                This password reset link is missing required information.
                Please request a new one.
              </p>
              <Link
                to="/admin/forgot-password"
                style={{ backgroundColor: "#FFC0CB" }}
                className="inline-block px-8 py-3 rounded-full font-semibold text-black hover:opacity-90 transition"
              >
                Request New Link
              </Link>
            </div>
          ) : done ? (
            /* ── Success state ── */
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6"
                style={{ background: "#f0fdf4" }}>
                ✅
              </div>
              <h2 className="text-3xl font-bold mb-3">Password Reset!</h2>
              <p className="text-gray-500 mb-8">
                Your password has been updated successfully.<br/>
                Redirecting you to login in a moment…
              </p>
              <Link
                to="/admin/login"
                className="text-sm font-semibold hover:opacity-80 transition"
                style={{ color: "#c0576a" }}
              >
                Go to Login →
              </Link>
            </div>
          ) : (
            /* ── Form state ── */
            <>
              <h2 className="text-4xl font-bold mb-2">Set New Password</h2>
              <p className="text-gray-500 mb-2">
                Creating a new password for <strong>{decodeURIComponent(email)}</strong>.
              </p>
              <p className="text-xs text-gray-400 mb-10">This link expires 30 minutes after it was sent.</p>

              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* New password */}
                <div>
                  <label className="text-sm font-medium">New Password</label>
                  <div className="relative mt-2">
                    <input
                      type={showNew ? "text" : "password"}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full border border-gray-300 px-4 py-3 pr-12 rounded-lg focus:outline-none focus:border-[#FFC0CB] transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew((v) => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 text-sm"
                    >
                      {showNew ? "Hide" : "Show"}
                    </button>
                  </div>

                  {/* Strength bar */}
                  {strength && (
                    <div className="mt-2">
                      <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{ width: strength.width, background: strength.color }}
                        />
                      </div>
                      <p className="text-xs mt-1" style={{ color: strength.color }}>{strength.label}</p>
                    </div>
                  )}
                </div>

                {/* Confirm password */}
                <div>
                  <label className="text-sm font-medium">Confirm Password</label>
                  <div className="relative mt-2">
                    <input
                      type={showConfirm ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat your new password"
                      className="w-full border border-gray-300 px-4 py-3 pr-12 rounded-lg focus:outline-none focus:border-[#FFC0CB] transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 text-sm"
                    >
                      {showConfirm ? "Hide" : "Show"}
                    </button>
                  </div>
                  {/* Match indicator */}
                  {confirmPassword && (
                    <p className={`text-xs mt-1 ${newPassword === confirmPassword ? "text-green-600" : "text-red-500"}`}>
                      {newPassword === confirmPassword ? "✓ Passwords match" : "✗ Passwords do not match"}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{ backgroundColor: "#FFC0CB" }}
                  className="w-full py-3 rounded-full font-semibold text-black hover:opacity-90 transition disabled:opacity-60 mt-2"
                >
                  {loading ? "Resetting…" : "Reset Password"}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link
                  to="/admin/forgot-password"
                  className="text-sm text-gray-400 hover:text-gray-700 transition"
                >
                  Need a new link?
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right panel */}
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