import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import { getCustomerToken, isCustomerLoggedIn } from '../utils/customerAuth';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', cnic: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isCustomerLoggedIn()) {
      navigate('/login');
      return;
    }
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch('http://localhost:8000/customer/me', {
        headers: { Authorization: `Bearer ${getCustomerToken()}` }
      });
      const data = await res.json();
      if (res.ok) {
        setForm({
          name: data.user.name || '',
          email: data.user.email || '',
          phone: data.user.phone || '',
          cnic: data.user.cnic || ''
        });
      } else {
        setError(data.message || 'Failed to load profile');
      }
    } catch (err) {
      setError('Server error loading profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const res = await fetch('http://localhost:8000/customer/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getCustomerToken()}`
        },
        body: JSON.stringify({ name: form.name, phone: form.phone, cnic: form.cnic })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Failed to update profile');
        return;
      }

      // keep the stored display name in sync with what's shown in the Header
      localStorage.setItem('customerName', data.user.name);
      setMessage('Profile updated successfully.');
    } catch (err) {
      setError('Server error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <p className="text-center py-20 text-gray-500">Loading profile...</p>
      </>
    );
  }

  return (
  <div className="min-h-screen flex flex-col bg-white">
    <Header />

    <main className="flex-grow py-14 px-6">
      <div className="max-w-2xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-10">
          <h1 className="text-sm font-light uppercase tracking-[0.10em] text-gray-900">
            Profile
          </h1>

          <p className="mt-3 text-[18px] text-gray-600">
            Manage your account information.
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
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-5 py-3 text-sm placeholder-gray-400 outline-none transition duration-300 focus:border-[#FFC0CB]"
          />

          <input
            type="email"
            value={form.email}
            disabled
            className="w-full border border-gray-200 bg-gray-50 px-5 py-3 text-sm text-gray-500 cursor-not-allowed"
          />

          <p className="-mt-3 text-xs text-gray-400">
            Email address cannot be changed.
          </p>

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            className="w-full border border-gray-300 px-5 py-3 text-sm placeholder-gray-400 outline-none transition duration-300 focus:border-[#FFC0CB]"
          />

          <input
            type="text"
            name="cnic"
            placeholder="CNIC"
            value={form.cnic}
            onChange={handleChange}
            className="w-full border border-gray-300 px-5 py-3 text-sm placeholder-gray-400 outline-none transition duration-300 focus:border-[#FFC0CB]"
          />

          <button
            type="submit"
            disabled={saving}
            style={{ backgroundColor: '#FFC0CB' }}
            className="w-full rounded-full py-3 uppercase tracking-[0.18em] text-sm font-semibold text-black transition-all duration-300 hover:opacity-90 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>

        </form>

      </div>
    </main>

    <Footer />
  </div>
);
}