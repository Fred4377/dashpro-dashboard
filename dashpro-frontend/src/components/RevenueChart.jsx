import React, { useContext } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ThemeContext } from '../context/ThemeContext';

const RevenueChart = ({ data }) => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';
  
  const textColor = isDark ? '#8B949E' : '#64748B';
  const gridColor = isDark ? '#30363D' : '#E2E8F0';

  const formatYAxis = (tickItem) => {
    return `$${tickItem / 1000}k`;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="card-bg border border-custom rounded-lg shadow-lg p-3 text-sm">
          <p className="font-semibold mb-1">{label}</p>
          <p className="text-accent-primary font-bold">
            ${payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card-bg border border-custom rounded-2xl p-6 h-full flex flex-col">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="font-semibold text-lg">Revenue Overview</h3>
          <p className="text-sm text-sub">Last 12 months</p>
        </div>
        <div className="flex bg-light-main dark:bg-dark-main rounded-lg p-1 border border-custom">
          {['7D', '30D', '90D', '1Y'].map((filter, i) => (
            <button 
              key={filter} 
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                i === 3 ? 'bg-light-card dark:bg-dark-card shadow-sm text-light-text dark:text-dark-text' : 'text-sub hover:text-light-text dark:hover:text-dark-text'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex-1 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1E90FF" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#1E90FF" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: textColor, fontSize: 12 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: textColor, fontSize: 12 }} tickFormatter={formatYAxis} />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="#1E90FF" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorRevenue)" 
              activeDot={{ r: 6, strokeWidth: 0, fill: '#1E90FF' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;
