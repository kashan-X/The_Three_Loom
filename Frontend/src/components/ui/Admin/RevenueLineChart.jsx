import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-white border border-[#F3D8DF] rounded-xl shadow-md px-4 py-3">
      <p className="text-sm text-gray-500">{label}</p>

      <p className="mt-1 text-[#E88DA2] font-semibold">
        Rs. {payload[0].value.toLocaleString()}
      </p>
    </div>
  );
}

export default function RevenueLineChart({ data = [] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{
          top: 10,
          right: 10,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid
          stroke="#F8E6EB"
          strokeDasharray="3 3"
          vertical={false}
        />

        <XAxis
          dataKey="name"
          tick={{ fill: "#6B7280", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />

        <YAxis
          tick={{ fill: "#9CA3AF", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />

        <Tooltip content={<CustomTooltip />} />

        <Line
          type="monotone"
          dataKey="value"
          stroke="#E88DA2"
          strokeWidth={3}
          dot={{
            r: 4,
            fill: "#E88DA2",
            stroke: "#FFFFFF",
            strokeWidth: 2,
          }}
          activeDot={{
            r: 6,
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}