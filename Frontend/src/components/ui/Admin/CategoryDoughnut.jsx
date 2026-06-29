import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = [
  "#E88DA2",
  "#F5B6C5",
  "#F8D6DF",
];

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-white border border-pink-100 rounded-xl shadow-lg px-4 py-3">
      <p className="font-semibold text-gray-700">
        {payload[0].name}
      </p>

      <p className="text-[#E88DA2] mt-1">
        {payload[0].value} Products
      </p>
    </div>
  );
}

export default function CategoryDoughnut({ data }) {

  const chartData = [
    {
      name: "Men",
      value: data?.Men || 0,
    },
    {
      name: "Women",
      value: data?.Women || 0,
    },
    {
      name: "Kids",
      value: data?.Children || 0,
    },
  ];

  return (
    <ResponsiveContainer width="100%" height={330}>

      <PieChart>

        <Pie
          data={chartData}
          innerRadius={70}
          outerRadius={95}
          paddingAngle={4}
          dataKey="value"
          stroke="none"
        >

          {chartData.map((entry, index) => (

            <Cell
              key={index}
              fill={COLORS[index]}
            />

          ))}

        </Pie>

        <Tooltip content={<CustomTooltip />} />

        <Legend
          verticalAlign="bottom"
          iconType="circle"
        />

      </PieChart>

    </ResponsiveContainer>
  );
}