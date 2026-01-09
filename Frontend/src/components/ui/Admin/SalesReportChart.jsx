import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

const SalesReportChart = ({ data }) => (
  <div className="bg-white p-6 rounded-2xl shadow">
    <h2 className="text-lg font-semibold mb-4">Sales Report</h2>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#3b82f6" radius={[5, 5, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default SalesReportChart;
