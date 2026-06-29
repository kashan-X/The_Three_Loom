import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/ui/Header";
import Footer from "../components/ui/Footer";
import { getCustomerToken, isCustomerLoggedIn } from "../utils/customerAuth";

const STATUS_COLORS = {
  Pending: "bg-yellow-100 text-yellow-700",
  Processing: "bg-blue-100 text-blue-700",
  Shipped: "bg-purple-100 text-purple-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

const CANCELLABLE_STATUSES = ["Pending", "Processing"];

export default function OrderHistoryPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Cancel modal state
  const [cancelModal, setCancelModal] = useState(null); // { orderId, preview: {...} }
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelError, setCancelError] = useState("");

  useEffect(() => {
    if (!isCustomerLoggedIn()) {
      navigate("/login");
      return;
    }
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:8000/order/my-orders", {
        headers: { Authorization: `Bearer ${getCustomerToken()}` },
      });
      const data = await res.json();
      if (res.ok) {
        setOrders(data.orders || []);
      } else {
        setError(data.error || "Failed to load order history");
      }
    } catch (err) {
      setError("Server error loading orders");
    } finally {
      setLoading(false);
    }
  };

  // Step 1: fetch penalty preview, then open modal
  const handleCancelClick = async (orderId) => {
    setCancelError("");
    try {
      const res = await fetch(
        `http://localhost:8000/order/${orderId}/cancel-preview`,
        { headers: { Authorization: `Bearer ${getCustomerToken()}` } }
      );
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Unable to fetch cancellation info");
        return;
      }
      setCancelModal({ orderId, preview: data });
    } catch {
      alert("Server error. Please try again.");
    }
  };

  // Step 2: confirm cancellation
  const confirmCancel = async () => {
    if (!cancelModal) return;
    setCancelLoading(true);
    setCancelError("");
    try {
      const res = await fetch(
        `http://localhost:8000/order/${cancelModal.orderId}/cancel`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${getCustomerToken()}` },
        }
      );
      const data = await res.json();
      if (res.ok) {
        setCancelModal(null);
        fetchOrders(); // refresh list
      } else {
        setCancelError(data.error || "Cancellation failed");
      }
    } catch {
      setCancelError("Server error. Please try again.");
    } finally {
      setCancelLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow max-w-4xl mx-auto px-4 py-10 w-full">
        <p className="mt-3 text-[20px] font-bold text-gray-600">
          Order History .....
        </p>

        {loading ? (
          <p className="text-center text-gray-500 py-10">Loading orders...</p>
        ) : error ? (
          <p className="text-red-600 text-center py-10">{error}</p>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 mb-4">
              No orders found for this account.
            </p>
            <p className="text-sm text-gray-400 mb-4">
              Note: order history only shows orders placed using this account's
              email address.
            </p>
            <Link
              to="/AllProducts"
              style={{ backgroundColor: "#FFC0CB" }}
              className="inline-block px-6 py-3 rounded-full font-bold text-black"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-xs text-gray-400">
                      Order #{order.id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString("en-PK", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-medium px-3 py-1 rounded-full ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-600"}`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="space-y-1 mb-3">
                  {order.items.map((item, i) => (
                    <p key={i} className="text-sm text-gray-700">
                      {item.name} {item.size ? `(${item.size})` : ""} ×{" "}
                      {item.quantity}
                    </p>
                  ))}
                </div>

                {/* Penalty notice on cancelled orders */}
                {order.status === "Cancelled" && order.cancellationPenaltyApplied && (
                  <div className="mb-3 bg-red-50 border border-red-100 rounded-lg px-4 py-2 text-sm text-red-700">
                    ⚠️ A 20% late cancellation penalty of{" "}
                    <span className="font-semibold">
                      Rs. {order.cancellationPenalty?.toLocaleString()}
                    </span>{" "}
                    applies. Our team will contact you for collection.
                  </div>
                )}

                <div className="flex justify-between items-center border-t border-gray-100 pt-3">
                  <p className="text-sm text-gray-500">
                    {order.city} • {order.paymentMethod?.toUpperCase()}
                  </p>
                  <div className="flex items-center gap-3">
                    <p className="font-bold">
                      Rs {order.totalPrice.toLocaleString()}
                    </p>

                    {/* Cancel button — only for cancellable statuses */}
                    {CANCELLABLE_STATUSES.includes(order.status) && (
                      <button
                        onClick={() => handleCancelClick(order.id)}
                        className="text-xs px-3 py-1.5 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 transition font-medium"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Cancel Confirmation Modal */}
      {cancelModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-1">
              Cancel Order?
            </h2>
            <p className="text-xs text-gray-400 mb-4">
              Order #{cancelModal.orderId.slice(-8).toUpperCase()}
            </p>

            {cancelModal.preview.isWithinFreeWindow ? (
              <div className="bg-green-50 border border-green-100 rounded-lg px-4 py-3 mb-5 text-sm text-green-700">
                ✅ You're within the 24-hour window.{" "}
                <span className="font-semibold">No penalty applies.</span>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-100 rounded-lg px-4 py-3 mb-5 text-sm text-red-700">
                ⚠️ This order was placed{" "}
                <span className="font-semibold">
                  {cancelModal.preview.orderAgeHours} hours ago
                </span>{" "}
                — past the 24-hour free window.
                <br />
                <br />
                A <span className="font-semibold">20% penalty of Rs.{" "}
                {cancelModal.preview.cancellationPenalty?.toLocaleString()}</span>{" "}
                will be charged. Our team will contact you for collection since
                payment is COD.
              </div>
            )}

            {cancelError && (
              <p className="text-red-600 text-sm mb-3">{cancelError}</p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setCancelModal(null)}
                disabled={cancelLoading}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition text-sm font-medium"
              >
                Keep Order
              </button>
              <button
                onClick={confirmCancel}
                disabled={cancelLoading}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-black hover:bg-red-600 transition text-sm font-medium disabled:opacity-60"
              >
                {cancelLoading ? "Cancelling..." : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}