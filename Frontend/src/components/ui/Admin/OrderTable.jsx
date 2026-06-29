import React, { useState } from "react";

const STATUSES = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled", "Rejected"];

const STATUS_CONFIG = {
  Delivered:  { bg: "#f0fdf4", color: "#15803d", dot: "#22c55e" },
  Pending:    { bg: "#fefce8", color: "#a16207", dot: "#eab308" },
  Processing: { bg: "#eff6ff", color: "#1d4ed8", dot: "#3b82f6" },
  Shipped:    { bg: "#faf5ff", color: "#7e22ce", dot: "#a855f7" },
  Cancelled:  { bg: "#fff1f2", color: "#be123c", dot: "#f43f5e" },
  Rejected:   { bg: "#f8fafc", color: "#475569", dot: "#94a3b8" },
};

const BRAND   = "#FFC0CB";
const BRAND_D = "#f9a8b8"; // slightly deeper for hover

const SCREENSHOT_BASE = "http://localhost:8000/payment-screenshots";

const StatusBadge = ({ status, penalty }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.Pending;
  return (
    <span style={{ background: cfg.bg, color: cfg.color }}
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap">
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.dot, display: "inline-block", flexShrink: 0 }} />
      {status}
      {status === "Cancelled" && penalty && (
        <span title={`Penalty: Rs. ${penalty}`} className="ml-0.5">⚠️</span>
      )}
    </span>
  );
};

const OrderTable = ({ orders, onDelete, onStatusChange }) => {
  const [search,        setSearch]        = useState("");
  const [statusFilter,  setStatusFilter]  = useState("All");
  const [currentPage,   setCurrentPage]   = useState(1);
  const [updatingId,    setUpdatingId]    = useState(null);
  const [lightbox,      setLightbox]      = useState(null);
  const [rejectModal,   setRejectModal]   = useState(null);
  const [rejectReason,  setRejectReason]  = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  const itemsPerPage = 5;

  const filtered = orders.filter((o) => {
    const matchName   = o.fullName?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || o.status === statusFilter;
    return matchName && matchStatus;
  });

  const paginated  = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const isPendingOnline = (o) =>
    o.status === "Pending" && o.paymentMethod === "online" && o.paymentScreenshot;

  const handleStatusChange = async (id, val) => {
    setUpdatingId(id);
    await onStatusChange(id, val);
    setUpdatingId(null);
  };

  const handleApprove = async (id) => {
    if (!window.confirm("Approve this payment and move to Processing?")) return;
    setActionLoading(id + "_approve");
    try {
      const res = await fetch(`http://localhost:8000/order/${id}/approve-payment`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      });
      if (!res.ok) { const d = await res.json(); alert(d.error || "Failed"); return; }
      onStatusChange(id, "Processing");
    } catch { alert("Server error"); }
    finally { setActionLoading(null); }
  };

  const handleRejectConfirm = async () => {
    if (!rejectModal) return;
    setActionLoading(rejectModal + "_reject");
    try {
      const res = await fetch(`http://localhost:8000/order/${rejectModal}/reject-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
        body: JSON.stringify({ reason: rejectReason || "Payment could not be verified." }),
      });
      if (!res.ok) { const d = await res.json(); alert(d.error || "Failed"); return; }
      onStatusChange(rejectModal, "Rejected");
      setRejectModal(null);
      setRejectReason("");
    } catch { alert("Server error"); }
    finally { setActionLoading(null); }
  };

  return (
    <>
    <div className="space-y-5">

      {/* ── Header card ──────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-5">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Orders</h1>
            <p className="text-sm text-gray-400 mt-1">Review, verify and manage all customer orders.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition font-medium">
              Import
            </button>
            <button className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition font-medium">
              Export
            </button>
            <button
              style={{ background: BRAND }}
              className="px-5 py-2 rounded-lg text-sm font-semibold text-gray-900 hover:opacity-90 transition"
            >
              + New Order
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid md:grid-cols-3 gap-3 mt-6">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-sm">🔍</span>
            <input
              type="text"
              placeholder="Search by name…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-[#FFC0CB] focus:bg-white transition"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-700 focus:outline-none focus:border-[#FFC0CB] focus:bg-white transition"
          >
            <option value="All">All Statuses</option>
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
          <select className="px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-700 focus:outline-none focus:border-[#FFC0CB]">
            <option>All Orders</option>
          </select>
        </div>
      </div>

      {/* ── Table ────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "#fdf6f8" }}>
                {["Order", "Customer", "Items", "Total", "Payment", "Status", "Actions"].map((h) => (
                  <th key={h}
                    className={`px-5 py-4 text-[11px] uppercase tracking-widest font-semibold text-gray-400 ${h === "Actions" ? "text-center" : "text-left"}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {paginated.length > 0 ? paginated.map((order, idx) => (
                <tr key={order.id}
                  className="border-t border-gray-50 hover:bg-[#fffbfc] transition-colors">

                  {/* Order */}
                  <td className="px-5 py-4">
                    <p className="font-mono text-xs text-gray-400 font-medium">
                      #{(order.id || "").slice(-8).toUpperCase()}
                    </p>
                    <p className="text-[11px] text-gray-300 mt-0.5">{order.city}</p>
                  </td>

                  {/* Customer */}
                  <td className="px-5 py-4">
                    <p className="font-semibold text-gray-800">{order.fullName}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{order.email}</p>
                    <p className="text-xs text-gray-400">{order.phoneNumber}</p>
                  </td>

                  {/* Items */}
                  <td className="px-5 py-4 max-w-[200px]">
                    <p className="text-gray-700 text-xs leading-relaxed line-clamp-2">{order.product}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{order.itemCount} item{order.itemCount !== 1 ? "s" : ""}</p>
                  </td>

                  {/* Total */}
                  <td className="px-5 py-4">
                    <p className="font-bold text-gray-900">Rs. {order.totalPrice?.toLocaleString()}</p>
                  </td>

                  {/* Payment — screenshot thumbnail or COD pill */}
                  <td className="px-5 py-4">
                    {order.paymentScreenshot ? (
                      <button
                        onClick={() => setLightbox(order.paymentScreenshot)}
                        className="group relative block"
                        title="View payment screenshot"
                      >
                        <img
                          src={`${SCREENSHOT_BASE}/${order.paymentScreenshot}`}
                          alt="Payment proof"
                          onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
                          className="w-14 h-14 object-cover rounded-xl border-2 border-pink-100 group-hover:border-pink-300 transition shadow-sm"
                        />
                        {/* fallback if image 404s */}
                        <div style={{ display: "none" }}
                          className="w-14 h-14 rounded-xl border-2 border-dashed border-pink-200 flex items-center justify-center text-pink-300 text-lg">
                          🖼
                        </div>
                        <div className="absolute inset-0 rounded-xl bg-black/0 group-hover:bg-black/20 transition flex items-center justify-center">
                          <span className="text-white text-[10px] font-bold opacity-0 group-hover:opacity-100 transition">VIEW</span>
                        </div>
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-500 rounded-lg text-xs font-medium">
                        💵 COD
                      </span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    {["Cancelled", "Rejected"].includes(order.status) ? (
                      <StatusBadge status={order.status} penalty={order.cancellationPenaltyApplied ? order.cancellationPenalty : null} />
                    ) : isPendingOnline(order) ? (
                      // Lock the dropdown while awaiting payment verification
                      <span style={{ background: "#fefce8", color: "#a16207" }}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold">
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#eab308", display: "inline-block" }} />
                        Awaiting Verification
                      </span>
                    ) : (
                      <div className="relative inline-block">
                        <select
                          value={order.status || "Pending"}
                          disabled={updatingId === order.id}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          style={{
                            background: STATUS_CONFIG[order.status]?.bg || "#fdf6f8",
                            color: STATUS_CONFIG[order.status]?.color || "#c0576a",
                          }}
                          className="appearance-none pl-3 pr-6 py-1.5 rounded-full text-xs font-semibold border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FFC0CB] disabled:opacity-50 disabled:cursor-wait"
                        >
                          {STATUSES.filter((s) => !["Cancelled", "Rejected"].includes(s)).map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        <span className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-[9px] opacity-60">
                          {updatingId === order.id ? "⏳" : "▾"}
                        </span>
                      </div>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {isPendingOnline(order) ? (
                        <>
                          <button
                            onClick={() => handleApprove(order.id)}
                            disabled={actionLoading === order.id + "_approve"}
                            style={{ background: "#f0fdf4", color: "#15803d" }}
                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold hover:opacity-80 disabled:opacity-50 transition whitespace-nowrap border border-green-100"
                          >
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                              <path d="M2 6l3 3 5-5" stroke="#15803d" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            {actionLoading === order.id + "_approve" ? "Approving…" : "Approve"}
                          </button>
                          <button
                            onClick={() => { setRejectModal(order.id); setRejectReason(""); }}
                            style={{ background: "#fff1f2", color: "#be123c" }}
                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold hover:opacity-80 transition whitespace-nowrap border border-rose-100"
                          >
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                              <path d="M3 3l6 6M9 3l-6 6" stroke="#be123c" strokeWidth="1.8" strokeLinecap="round"/>
                            </svg>
                            Reject
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => onDelete(order.id)}
                          className="px-3.5 py-2 rounded-lg bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 transition text-xs font-medium border border-gray-100 hover:border-red-100"
                        >
                          Delete
                        </button>
                      )}
                      {/* Always show delete for non-pending-online too */}
                      {isPendingOnline(order) && (
                        <button
                          onClick={() => onDelete(order.id)}
                          className="px-3 py-2 rounded-lg bg-gray-50 hover:bg-red-50 text-gray-300 hover:text-red-400 transition border border-gray-100 hover:border-red-100"
                          title="Delete order"
                        >
                          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                            <path d="M2 3.5h9M5 3.5V2.5h3v1M4.5 3.5l.5 7h3l.5-7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>

                </tr>
              )) : (
                <tr>
                  <td colSpan="7" className="py-24 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div style={{ background: "#fdf6f8" }} className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl">📦</div>
                      <p className="font-semibold text-gray-600">No orders found</p>
                      <p className="text-sm text-gray-400">Try adjusting your filters</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ──────────────────────────────────────────────────── */}
        {totalPages > 1 && (
          <div style={{ borderTop: "1px solid #fdf0f3" }} className="flex justify-between items-center px-5 py-4">
            <p className="text-xs text-gray-400">
              Showing {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 text-sm transition"
              >←</button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  style={currentPage === i + 1 ? { background: BRAND, color: "#1a1a1a" } : {}}
                  className={`w-8 h-8 rounded-lg text-xs font-semibold transition ${
                    currentPage === i + 1 ? "shadow-sm" : "border border-gray-200 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 text-sm transition"
              >→</button>
            </div>
          </div>
        )}
      </div>
    </div>

    {/* ── Screenshot Lightbox ───────────────────────────────────────────────── */}
    {lightbox && (
      <div
        onClick={() => setLightbox(null)}
        className="fixed inset-0 z-50 flex items-center justify-center p-6"
        style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
      >
        <div className="relative max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
          <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
            <div style={{ background: "#fdf6f8", borderBottom: "1px solid #fce8ed" }}
              className="flex items-center justify-between px-5 py-3.5">
              <div>
                <p className="text-xs font-bold text-gray-700 uppercase tracking-widest">Payment Screenshot</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Easypaisa / JazzCash</p>
              </div>
              <button
                onClick={() => setLightbox(null)}
                className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 transition text-sm"
              >✕</button>
            </div>
            <img
              src={`${SCREENSHOT_BASE}/${lightbox}`}
              alt="Payment proof"
              className="w-full object-contain max-h-[70vh]"
            />
          </div>
        </div>
      </div>
    )}

    {/* ── Reject Modal ──────────────────────────────────────────────────────── */}
    {rejectModal && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-6"
        style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
      >
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
          {/* Modal header */}
          <div style={{ background: "#fff1f2", borderBottom: "1px solid #fecdd3" }} className="px-6 py-5">
            <div className="flex items-center gap-3">
              <div style={{ background: "#fecdd3" }} className="w-9 h-9 rounded-xl flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 4l8 8M12 4l-8 8" stroke="#be123c" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <p className="font-bold text-gray-900">Reject Payment</p>
                <p className="text-xs text-gray-500 mt-0.5">Customer will be notified via email</p>
              </div>
            </div>
          </div>

          {/* Modal body */}
          <div className="px-6 py-5">
            <div className="bg-gray-50 rounded-xl p-4 mb-4 text-xs text-gray-500 leading-relaxed">
              This order will be marked <strong className="text-gray-700">Rejected</strong> and kept in your records.
              The customer receives an email with the reason and instructions to resubmit.
            </div>

            <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider">
              Reason <span className="text-gray-400 font-normal normal-case">(optional)</span>
            </label>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Screenshot is unclear, amount doesn't match, duplicate transaction…"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 resize-none transition"
            />
          </div>

          {/* Modal footer */}
          <div style={{ borderTop: "1px solid #f1f5f9" }} className="px-6 py-4 flex gap-3">
            <button
              onClick={() => { setRejectModal(null); setRejectReason(""); }}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 font-medium transition"
            >
              Cancel
            </button>
            <button
              onClick={handleRejectConfirm}
              disabled={!!actionLoading}
              className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold disabled:opacity-60 transition"
            >
              {actionLoading ? "Rejecting…" : "Confirm Rejection"}
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default OrderTable;