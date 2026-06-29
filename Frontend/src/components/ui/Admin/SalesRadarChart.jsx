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
  "#E88DA2",
  "#F09CB0",
  "#E88DA2",
  "#F3A8BA",
  "#E88DA2",
  "#F5B6C5",
  "#E88DA2",
  "#F09CB0",
  "#E88DA2",
  "#F3A8BA",
  "#E88DA2",
  "#F5B6C5",
];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-white border border-[#F3D8DF] rounded-xl shadow-md px-4 py-3">

      <p className="text-sm text-gray-500">
        {label}
      </p>

      <p className="mt-1 font-semibold text-[#E88DA2]">
        Rs. {payload[0].value.toLocaleString()}
      </p>

    </div>
  );
}

export default function SalesReportChart({ data }) {
  return (
    <ResponsiveContainer
      width="100%"
      height={320}
    >

      <BarChart
        data={data}
        barCategoryGap={20}
      >

        <CartesianGrid
          vertical={false}
          stroke="#F5E8EC"
          strokeDasharray="3 3"
        />

        <XAxis
          dataKey="name"
          axisLine={false}
          tickLine={false}
          tick={{
            fill: "#6B7280",
            fontSize: 12,
          }}
        />

        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{
            fill: "#9CA3AF",
            fontSize: 12,
          }}
        />

        <Tooltip
          content={<CustomTooltip />}
          cursor={{ fill: "#FFF7F9" }}
        />

        <Bar
          dataKey="value"
          radius={[8, 8, 0, 0]}
        >

          {data.map((item, index) => (

            <Cell
              key={index}
              fill={COLORS[index % COLORS.length]}
            />

          ))}

        </Bar>

      </BarChart>

    </ResponsiveContainer>
  );
}