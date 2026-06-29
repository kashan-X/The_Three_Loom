import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';

export default function CustomerSignup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    cnic: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:8000/customer/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Something went wrong. Please try again.');
        return;
      }

      localStorage.setItem('customerToken', data.user.token);
      localStorage.setItem('customerName', data.user.name);

      navigate('/');
    } catch (err) {
      setError('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <main className="min-h-[85vh] bg-white py-14 px-6">
        <div className="max-w-2xl mx-auto">

          {/* Heading */}
          <div className="text-center mb-10">
            <h1 className="text-lg font-medium uppercase tracking-[0.15em] text-gray-900">
              Sign Up
            </h1>

            <p className="mt-3 text-[18px] text-gray-600">
              Please fill in the information below.
            </p>
          </div>

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
              name="email"
              placeholder="E-mail"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 px-5 py-3 text-sm placeholder-gray-400 outline-none transition duration-300 focus:border-[#FFC0CB]"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full border border-gray-300 px-5 py-3 text-sm placeholder-gray-400 outline-none transition duration-300 focus:border-[#FFC0CB]"
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number (Optional)"
              value={form.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 px-5 py-3 text-sm placeholder-gray-400 outline-none transition duration-300 focus:border-[#FFC0CB]"
            />

            <input
              type="text"
              name="cnic"
              placeholder="CNIC (Optional)"
              value={form.cnic}
              onChange={handleChange}
              className="w-full border border-gray-300 px-5 py-3 text-sm placeholder-gray-400 outline-none transition duration-300 focus:border-[#FFC0CB]"
            />

            <button
              type="submit"
              disabled={loading}
              style={{ backgroundColor: '#FFC0CB' }}
              className="w-full rounded-full py-3 uppercase tracking-[0.18em] text-sm font-semibold text-black transition-all duration-300 hover:opacity-90 disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

            <p className="pt-2 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium hover:underline"
                style={{ color: '#FFC0CB' }}
              >
                Log In
              </Link>
            </p>

          </form>

        </div>
      </main>

      <Footer />
    </>
  );
}