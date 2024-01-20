import React, { useContext } from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { Download, Calendar } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import toast from 'react-hot-toast';

const AnalyticsPage = () => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';
  const textColor = isDark ? '#8B949E' : '#64748B';
  const gridColor = isDark ? '#30363D' : '#E2E8F0';

  // Mock Data
  const revenueData = [
    { month: 'Jan', actual: 4200, target: 4000 },
    { month: 'Feb', actual: 3800, target: 4200 },
    { month: 'Mar', actual: 5100, target: 4500 },
    { month: 'Apr', actual: 4600, target: 4800 },
    { month: 'May', actual: 5800, target: 5000 },
    { month: 'Jun', actual: 6200, target: 5500 }
  ];

  const categoryData = [
    { name: 'Electronics', value: 400 },
    { name: 'Clothing', value: 300 },
    { name: 'Books', value: 300 },
    { name: 'Home', value: 200 }
  ];
  const COLORS = ['#1E90FF', '#10B981', '#F59E0B', '#8B5CF6'];

  const productsData = [
    { name: 'MacBook Pro', revenue: 15000 },
    { name: 'iPhone 15', revenue: 12000 },
    { name: 'AirPods', revenue: 8000 },
    { name: 'Nike Air', revenue: 5000 },
    { name: 'Sony WH', revenue: 4500 }
  ];

  const trafficData = [
    { name: 'Organic', value: 45 },
    { name: 'Direct', value: 25 },
    { name: 'Social', value: 20 },
    { name: 'Referral', value: 10 }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="card-bg border border-custom rounded-lg shadow-lg p-3 text-sm">
          <p className="font-semibold mb-1">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="font-medium">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const handleExport = () => toast.success('Analytics exported to CSV');
  const handleDateChange = () => toast.success('Date range updated to Last 30 Days');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-sub">Detailed performance metrics</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleDateChange} className="flex items-center gap-2 px-4 py-2 card-bg border border-custom rounded-lg hover:bg-light-main dark:hover:bg-dark-main transition-colors text-sm font-medium">
            <Calendar size={16} /> Last 30 Days
          </button>
          <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-accent-primary hover:bg-blue-600 text-white rounded-lg transition-colors text-sm font-medium">
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* Mini Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: '$124,500', change: '+12%' },
          { label: 'Avg Order Value', value: '$145.20', change: '+5%' },
          { label: 'Conversion Rate', value: '3.24%', change: '-1.2%' },
          { label: 'Return Rate', value: '1.4%', change: '-0.5%' },
        ].map((stat, i) => (
          <div key={i} className="card-bg border border-custom p-4 rounded-xl flex flex-col justify-center">
            <p className="text-sub text-xs font-medium mb-1">{stat.label}</p>
            <div className="flex items-end gap-2">
              <h4 className="text-xl font-bold">{stat.value}</h4>
              <span className={`text-xs font-medium pb-1 ${stat.change.includes('+') ? 'text-accent-success' : 'text-accent-danger'}`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card-bg border border-custom p-6 rounded-2xl h-[350px] flex flex-col">
          <h3 className="font-semibold mb-4">Revenue vs Target</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: textColor, fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: textColor, fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" dataKey="actual" name="Actual Revenue" stroke="#1E90FF" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="target" name="Target" stroke={textColor} strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-bg border border-custom p-6 rounded-2xl h-[350px] flex flex-col">
          <h3 className="font-semibold mb-4">Category Sales</h3>
          <div className="flex-1 min-h-0 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
              <span className="text-xl font-bold">1.2K</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-bg border border-custom p-6 rounded-2xl h-[350px] flex flex-col">
          <h3 className="font-semibold mb-4">Top 5 Products</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={productsData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke={gridColor} />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: textColor, fontSize: 12 }} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: textColor, fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: isDark ? '#30363D' : '#E2E8F0', opacity: 0.4 }} />
                <Bar dataKey="revenue" fill="#10B981" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-bg border border-custom p-6 rounded-2xl h-[350px] flex flex-col">
          <h3 className="font-semibold mb-4">Traffic Sources</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={trafficData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {trafficData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
