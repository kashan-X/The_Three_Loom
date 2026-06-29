import React, { useState } from 'react';

const CATEGORY_STYLES = {
  'Super List':    { bg: '#fdf4ff', color: '#7e22ce', dot: '#a855f7' },
  'Excellent List':{ bg: '#eff6ff', color: '#1d4ed8', dot: '#3b82f6' },
  'Good List':     { bg: '#f0fdf4', color: '#15803d', dot: '#22c55e' },
  'Regular':       { bg: '#f8fafc', color: '#475569', dot: '#94a3b8' },
};

const CustomerSummaryTable = ({ customers }) => {
  const [search, setSearch] = useState('');

  const filtered = customers.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">

      {/* Header card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Customer Summary</h1>
            <p className="text-sm text-gray-400 mt-1">Overview of all customers and their order activity.</p>
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-sm">🔍</span>
            <input
              type="text"
              placeholder="Search by name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-[#FFC0CB] focus:bg-white transition w-64"
            />
          </div>
        </div>

        {/* Summary pills */}
        <div className="flex flex-wrap gap-3 mt-5">
          {Object.entries(CATEGORY_STYLES).map(([label, cfg]) => {
            const count = customers.filter(c => c.category === label).length;
            return (
              <div key={label}
                style={{ background: cfg.bg, color: cfg.color }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold">
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: cfg.dot, display: 'inline-block' }} />
                {label}: {count}
              </div>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: '#fdf6f8' }}>
                {['#', 'Customer', 'Phone', 'Total Orders', 'Category'].map((h) => (
                  <th key={h}
                    className="px-6 py-4 text-left text-[11px] uppercase tracking-widest font-semibold text-gray-400">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? filtered.map((c, i) => {
                const cfg = CATEGORY_STYLES[c.category] || CATEGORY_STYLES['Regular'];
                return (
                  <tr key={c.email} className="border-t border-gray-50 hover:bg-[#fffbfc] transition-colors">

                    {/* # */}
                    <td className="px-6 py-4 text-gray-300 text-xs font-mono">{String(i + 1).padStart(2, '0')}</td>

                    {/* Customer */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div style={{ background: cfg.bg, color: cfg.color }}
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {c.name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{c.name}</p>
                          <p className="text-xs text-gray-400">{c.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="px-6 py-4 text-gray-600 text-sm">{c.phone || '—'}</td>

                    {/* Total Orders */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 rounded-full bg-gray-100 w-16 overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${Math.min((c.orders / 50) * 100, 100)}%`,
                              background: cfg.dot,
                            }}
                          />
                        </div>
                        <span className="font-semibold text-gray-800">{c.orders}</span>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4">
                      <span style={{ background: cfg.bg, color: cfg.color }}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold">
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.dot, display: 'inline-block' }} />
                        {c.category}
                      </span>
                    </td>

                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan="5" className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div style={{ background: '#fdf6f8' }} className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl">👥</div>
                      <p className="font-semibold text-gray-600">No customers found</p>
                      <p className="text-xs text-gray-400">Try adjusting your search</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer count */}
        {filtered.length > 0 && (
          <div style={{ borderTop: '1px solid #fdf0f3' }} className="px-6 py-3">
            <p className="text-xs text-gray-400">
              Showing <span className="font-semibold text-gray-600">{filtered.length}</span> of <span className="font-semibold text-gray-600">{customers.length}</span> customers
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerSummaryTable;