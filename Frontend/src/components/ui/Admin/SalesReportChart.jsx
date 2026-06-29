import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";

const COLORS = [
  "#FFD4DC",
  "#FFC0CB",
  "#FFB3C1",
  "#FFA7B7",
  "#FF9AAD",
  "#FFB6C1",
  "#FFC0CB",
  "#FFB3C1",
  "#FFA7B7",
  "#FFD4DC",
  "#FFC0CB",
  "#FFB6C1",
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-pink-100 shadow-xl rounded-xl px-4 py-3">
        <p className="text-sm font-semibold text-gray-700">{label}</p>

        <p className="text-[#e88da2] font-bold mt-1">
          Rs. {payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }

  return null;
};

export default function SalesReportChart({ data }) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-7 shadow-sm">

      <div className="flex justify-between items-center mb-8">

        <div>

          <h2 className="text-xl font-semibold text-gray-900">
            Monthly Sales
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Revenue generated throughout the year
          </p>

        </div>

      </div>

      <ResponsiveContainer width="100%" height={330}>

        <BarChart
          data={data}
          barCategoryGap={18}
        >

          <CartesianGrid
            vertical={false}
            stroke="#f3f4f6"
            strokeDasharray="4 4"
          />

          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{
              fill: "#6b7280",
              fontSize: 13,
            }}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{
              fill: "#9ca3af",
              fontSize: 12,
            }}
          />

          <Tooltip
            cursor={{ fill: "#FFF6F8" }}
            content={<CustomTooltip />}
          />

          <Bar
            dataKey="value"
            radius={[12, 12, 0, 0]}
          >
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Bar>

        </BarChart>

      </ResponsiveContainer>

    </div>
  );
}