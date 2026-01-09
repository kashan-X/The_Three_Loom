import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ label, value, trend, trendType, color = 'blue' }) => {
  const TrendIcon = trendType === 'up' ? TrendingUp : TrendingDown;
  const trendColor = trendType === 'up' ? 'text-pink-300' : 'text-red-500';

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition duration-300">
      <div className="flex justify-between items-center">
        <h3 className="text-sm text-gray-500 font-medium">{label}</h3>
        <span className={`text-xs font-semibold ${trendColor} flex items-center gap-1`}>
          <TrendIcon className="w-4 h-4" />
          {trend}
        </span>
      </div>
      <p className={`text-2xl font-bold mt-2 text-${color}-600`}>{value}</p>
    </div>
  );
};

export default StatCard;
