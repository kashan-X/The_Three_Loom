import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import { getCustomerToken, isCustomerLoggedIn } from '../utils/customerAuth';

const STATUS_MESSAGES = {
  Pending: 'has been received and is pending confirmation.',
  Processing: 'is now being processed.',
  Shipped: 'has been shipped and is on its way!',
  Delivered: 'has been delivered. We hope you love it!',
  Cancelled: 'has been cancelled.'
};

const STATUS_ICON = {
  Pending: '🕐',
  Processing: '⚙️',
  Shipped: '🚚',
  Delivered: '✅',
  Cancelled: '❌'
};

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isCustomerLoggedIn()) {
      navigate('/login');
      return;
    }
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('http://localhost:8000/order/my-orders', {
        headers: { Authorization: `Bearer ${getCustomerToken()}` }
      });
      const data = await res.json();

      if (res.ok) {
        // Derive simple notifications from order status — no separate notifications
        // table exists yet, so this reflects the current state of each order.
        const derived = (data.orders || []).map((order) => {
          const shortId = order.id.slice(-8).toUpperCase();
          let message = `Order #${shortId} ${STATUS_MESSAGES[order.status] || 'has an update.'}`;

          // Append penalty note for cancelled orders with a penalty
          if (
            order.status === 'Cancelled' &&
            order.cancellationPenaltyApplied &&
            order.cancellationPenalty > 0
          ) {
            message += ` A 20% late cancellation penalty of Rs. ${order.cancellationPenalty.toLocaleString()} applies — our team will be in touch.`;
          }

          return {
            id: order.id,
            message,
            date: order.cancelledAt || order.createdAt,
            status: order.status,
            hasPenalty: order.cancellationPenaltyApplied && order.cancellationPenalty > 0
          };
        });
        setNotifications(derived);
      } else {
        setError(data.error || 'Failed to load notifications');
      }
    } catch (err) {
      setError('Server error loading notifications');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow max-w-2xl mx-auto px-4 py-10 w-full">
        <p className="mt-3 text-[20px] font-bold text-gray-600">
          Notifications .....
        </p>

        {loading ? (
          <p className="text-center text-gray-500 py-10">Loading notifications...</p>
        ) : error ? (
          <p className="text-red-600 text-center py-10">{error}</p>
        ) : notifications.length === 0 ? (
          <p className="text-center text-gray-500 py-20">
            No notifications yet — updates about your orders will show up here.
          </p>
        ) : (
          <div className="space-y-3">
            {notifications.map((note) => (
              <div
                key={note.id}
                className={`bg-white border rounded-lg p-4 flex justify-between items-start gap-4 ${
                  note.hasPenalty ? 'border-red-200 bg-red-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-lg mt-0.5 shrink-0">
                    {STATUS_ICON[note.status] || '📦'}
                  </span>
                  <p className="text-sm text-gray-700">{note.message}</p>
                </div>
                <p className="text-xs text-gray-400 whitespace-nowrap shrink-0">
                  {new Date(note.date).toLocaleDateString('en-PK', {
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}