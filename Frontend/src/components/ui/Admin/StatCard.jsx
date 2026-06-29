import React from "react";

export default function StatCard({
  label,
  value,
  trend,
  trendType = "up",
  icon,
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#F3D8DF] shadow-sm hover:shadow-md transition-all duration-300 p-6">

      <div className="flex justify-between items-start">

        <div>

          <p className="text-sm text-gray-500 font-medium">
            {label}
          </p>

          <h2 className="mt-3 text-3xl font-bold text-gray-800">
            {value}
          </h2>

        </div>

        <div className="w-12 h-12 rounded-xl bg-[#FFF5F7] flex items-center justify-center text-[#E88DA2]">

          {icon}

        </div>

      </div>

      <div className="mt-6 flex items-center justify-between">

        <span
          className={`text-sm font-semibold ${
            trendType === "up"
              ? "text-green-600"
              : "text-red-500"
          }`}
        >
          {trendType === "up" ? "↗" : "↘"} {trend}
        </span>

        <span className="text-xs text-gray-400">
          This Month
        </span>

      </div>

    </div>
  );
}