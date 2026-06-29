import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';

export default function CustomerLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:8000/customer/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Login failed. Please try again.');
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

      <main className="min-h-[80vh] bg-white py-16 px-6">
        <div className="max-w-xl mx-auto">

          {/* Heading */}
          <div className="text-center mb-10">
            <h1 className="text-lg font-medium uppercase tracking-[0.15em] text-gray-900">
              Login
            </h1>

            <p className="mt-4 text-[18px] text-gray-600">
              Please login to your account.
            </p>
          </div>

          {error && (
            <div className="mb-5 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 px-5 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none transition duration-300 focus:border-[#FFC0CB]"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 px-5 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none transition duration-300 focus:border-[#FFC0CB]"
            />

            <button
              type="submit"
              disabled={loading}
              style={{ backgroundColor: '#FFC0CB' }}
              className="w-full rounded-full py-3 uppercase tracking-[0.18em] text-sm font-semibold text-black transition-all duration-300 hover:opacity-90 disabled:opacity-50"
            >
              {loading ? 'Logging In...' : 'Log In'}
            </button>

            <p className="pt-3 text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="font-medium hover:underline"
                style={{ color: '#FFC0CB' }}
              >
                Sign Up
              </Link>
            </p>

          </form>

        </div>
      </main>

      <Footer />
    </>
  );
}