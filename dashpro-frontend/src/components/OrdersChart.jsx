import React, { useContext } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ThemeContext } from '../context/ThemeContext';

const OrdersChart = ({ data }) => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';
  
  const textColor = isDark ? '#8B949E' : '#64748B';
  const gridColor = isDark ? '#30363D' : '#E2E8F0';

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="card-bg border border-custom rounded-lg shadow-lg p-3 text-sm">
          <p className="font-semibold mb-1">{label}</p>
          <p className="text-accent-primary font-bold">
            {payload[0].value} Orders
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card-bg border border-custom rounded-2xl p-6 h-full flex flex-col">
      <div className="mb-6">
        <h3 className="font-semibold text-lg">Weekly Orders</h3>
        <p className="text-sm text-sub">Last 8 weeks</p>
      </div>
      
      <div className="flex-1 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
            <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: textColor, fontSize: 12 }} dy={10} 
              tickFormatter={(val) => val.replace('Week ', 'W')}
            />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: textColor, fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: isDark ? '#30363D' : '#E2E8F0', opacity: 0.4 }} />
            <Bar dataKey="orders" radius={[4, 4, 0, 0]} maxBarSize={40}>
              {data && data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index === data.length - 1 ? '#1E90FF' : '#8B5CF6'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OrdersChart;
