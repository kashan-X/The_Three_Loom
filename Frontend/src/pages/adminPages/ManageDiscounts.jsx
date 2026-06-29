import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/ui/Admin/Sidebar';

const CATEGORIES = ['Men', 'Women', 'Children'];

const token = () => localStorage.getItem('adminToken');

export default function ManageDiscounts() {
  const [discounts, setDiscounts]   = useState([]); // existing records from DB
  const [category, setCategory]     = useState(CATEGORIES[0]);
  const [percent, setPercent]        = useState('');
  const [saving, setSaving]          = useState(false);
  const [togglingId, setTogglingId]  = useState(null);
  const [msg, setMsg]                = useState('');

  useEffect(() => { fetchDiscounts(); }, []);

  const fetchDiscounts = async () => {
    try {
      const res  = await fetch('http://localhost:8000/category-discount/all', {
        headers: { Authorization: `Bearer ${token()}` }
      });
      const data = await res.json();
      setDiscounts(data.discounts || []);
    } catch (err) {
      console.error('Failed to fetch discounts', err);
    }
  };

  const flash = (text) => { setMsg(text); setTimeout(() => setMsg(''), 3000); };

  const handleSave = async () => {
    if (!percent || isNaN(percent) || percent < 0 || percent > 100) {
      return flash('Enter a valid percentage between 0 and 100.');
    }
    setSaving(true);
    try {
      const res = await fetch('http://localhost:8000/category-discount/set', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify({ category, discountPercent: Number(percent), active: true })
      });
      const data = await res.json();
      if (res.ok) { flash(`✅ ${category} discount set to ${percent}%`); setPercent(''); fetchDiscounts(); }
      else flash(data.error || 'Failed to save discount');
    } catch { flash('Server error'); }
    finally { setSaving(false); }
  };

  const handleToggle = async (cat) => {
    setTogglingId(cat);
    try {
      const res = await fetch(`http://localhost:8000/category-discount/${cat}/toggle`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token()}` }
      });
      const data = await res.json();
      if (res.ok) { flash(data.message); fetchDiscounts(); }
      else flash(data.error || 'Failed to toggle');
    } catch { flash('Server error'); }
    finally { setTogglingId(null); }
  };

  const handleDelete = async (cat) => {
    if (!window.confirm(`Remove the ${cat} discount entirely?`)) return;
    try {
      await fetch(`http://localhost:8000/category-discount/${cat}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token()}` }
      });
      flash(`${cat} discount removed`);
      fetchDiscounts();
    } catch { flash('Server error'); }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8 max-w-4xl">

        <h1 className="text-3xl font-semibold text-gray-900 mb-1">Sale & Discounts</h1>
        <p className="text-gray-500 mb-8">Set a percentage discount on an entire category. Customers see the sale price immediately.</p>

        {msg && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-pink-50 border border-pink-200 text-sm text-pink-700 font-medium">
            {msg}
          </div>
        )}

        {/* Set discount form */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-5">Apply New Discount</h2>
          <div className="flex flex-wrap gap-4 items-end">

            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:border-[#FFC0CB] text-sm"
              >
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Discount %</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="e.g. 10"
                  value={percent}
                  onChange={e => setPercent(e.target.value)}
                  className="w-28 px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:border-[#FFC0CB] text-sm"
                />
                <span className="text-gray-400 text-sm">%</span>
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              style={{ backgroundColor: '#FFC0CB' }}
              className="px-6 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Apply Discount'}
            </button>
          </div>
        </div>

        {/* Active discounts table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">Active Discounts</h2>
          </div>

          {discounts.length === 0 ? (
            <div className="py-16 text-center text-gray-400">
              <div className="text-4xl mb-3">🏷️</div>
              <p className="font-medium text-gray-600">No discounts set yet</p>
              <p className="text-sm mt-1">Use the form above to create one.</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-[#fcf6f8]">
                <tr>
                  {['Category', 'Discount', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-6 py-4 text-left text-xs uppercase tracking-wider text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {discounts.map(d => (
                  <tr key={d.category} className="hover:bg-[#fffafb] transition">
                    <td className="px-6 py-4 font-semibold text-gray-800">{d.category}</td>
                    <td className="px-6 py-4">
                      <span className="text-2xl font-bold text-[#c0576a]">{d.discountPercent}%</span>
                      <span className="text-xs text-gray-400 ml-1">off</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        d.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {d.active ? '● Active' : '○ Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleToggle(d.category)}
                          disabled={togglingId === d.category}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition disabled:opacity-50 ${
                            d.active
                              ? 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                              : 'bg-green-50 text-green-700 hover:bg-green-100'
                          }`}
                        >
                          {togglingId === d.category ? '…' : d.active ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleDelete(d.category)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 transition"
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </main>
    </div>
  );
}