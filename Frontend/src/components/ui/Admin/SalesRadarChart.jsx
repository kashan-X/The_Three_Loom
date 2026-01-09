import React from 'react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer
} from 'recharts';

const SalesRadarChart = ({ data }) => (
  <div className="bg-white p-6 rounded-2xl shadow">
    <h2 className="text-lg font-semibold mb-4">Sales by Country</h2>
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="country" />
        <PolarRadiusAxis />
        <Radar name="2019" dataKey="year2019" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
        <Radar name="2020" dataKey="year2020" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
        <Radar name="2021" dataKey="year2021" stroke="#ffc658" fill="#ffc658" fillOpacity={0.6} />
        <Radar name="2022" dataKey="year2022" stroke="#ff7300" fill="#ff7300" fillOpacity={0.6} />
        <Radar name="2023" dataKey="year2023" stroke="#0088fe" fill="#0088fe" fillOpacity={0.6} />
      </RadarChart>
    </ResponsiveContainer>
  </div>
);

export default SalesRadarChart;
