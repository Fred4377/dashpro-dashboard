import React, { useState, useEffect, useRef } from 'react';
import { DollarSign, ShoppingCart, Users, Package, Terminal } from 'lucide-react';
import api from '../utils/api';
import StatCard from '../components/StatCard';
import RevenueChart from '../components/RevenueChart';
import ActivityFeed from '../components/ActivityFeed';
import { formatCurrency, formatDate } from '../utils/formatters';

// 1. Custom flat weekly checkout counts vertical bar chart
const WeeklyCheckoutChart = () => {
  const chartData = [
    { day: 'Mon', count: 241, height: 120 },
    { day: 'Tue', count: 160, height: 80 },
    { day: 'Wed', count: 310, height: 140 },
    { day: 'Thu', count: 190, height: 95 },
    { day: 'Fri', count: 280, height: 135 },
  ];

  return (
    <div className="card-bg border border-custom rounded-2xl p-6 flex flex-col h-full shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-semibold text-lg uppercase tracking-wider text-xs text-sub">Weekly Checkout Counts</h3>
          <p className="text-sm text-sub mt-1">Last 5 Days</p>
        </div>
      </div>
      <div className="flex-1 flex items-end justify-between border-b border-l border-custom pb-2 pl-4 h-[200px] mb-2">
        {chartData.map((d, i) => (
          <div key={i} className="flex flex-col items-center flex-1 group relative">
            <div 
              style={{ height: `${d.height}px` }} 
              className="w-10 bg-accent-primary rounded-t-sm relative transition-all duration-300 hover:brightness-110 hover:shadow-[0_0_15px_rgba(255,107,53,0.4)] cursor-pointer"
            >
              <div className="opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 absolute -top-8 left-1/2 -translate-x-1/2 bg-[#0b111e] border border-custom text-light-text dark:text-dark-text text-[10px] py-1 px-2 rounded whitespace-nowrap z-10 shadow-lg">
                {d.count} Orders
              </div>
            </div>
            <span className="text-[10px] text-sub mt-2">{d.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// 2. Handwritten post-it notes widget
const PostItWidget = () => {
  return (
    <div className="card-bg border border-custom rounded-2xl p-6 flex flex-col items-center justify-center h-full shadow-sm">
      <div className="postit">
        <div className="postit-title">Todo Tasks:</div>
        <div className="postit-body">
          <ul className="space-y-1.5 list-none">
            <li>- Meet Inceptor Institute mentor @ 2PM</li>
            <li>- Fix Firefox CSS chart layout offset</li>
            <li>- Re-check Safaricom Callback response delay</li>
            <li>- Check Nyakach TVC portfolio files</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// 3. Real-time scrolling server log terminal
const TerminalLogs = () => {
  const [logs, setLogs] = useState([]);
  const terminalEndRef = useRef(null);

  const initialEntries = [
    { tag: "CRON", text: "Database backup completed successfully (124.5 MB)", type: "success" },
    { tag: "DARAJA-API", text: "Initiating STK Push request to +254712***678", type: "info" },
    { tag: "DARAJA-API", text: "Callback verified. Payment KSh 39,550 received. Success.", type: "success" },
    { tag: "AUTH-SERVICE", text: "JWT token signed and emitted for user: admin@shopease.co.ke", type: "info" },
    { tag: "MONITOR", text: "CPU usage: 14% | RAM allocation: 48% | Temp: 42°C", type: "success" },
    { tag: "SCHEDULER", text: "Pruning inactive tokens in database. 42 files removed.", type: "info" }
  ];

  const getTimestamp = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const date = String(now.getDate()).padStart(2, '0');
    const time = now.toTimeString().split(' ')[0];
    return `[${year}-${month}-${date} ${time}]`;
  };

  useEffect(() => {
    const initialLogs = initialEntries.map(entry => ({
      ...entry,
      timestamp: getTimestamp()
    }));
    setLogs(initialLogs);

    const interval = setInterval(() => {
      const roll = Math.random();
      let newLog;
      if (roll < 0.25) {
        newLog = {
          tag: "MONITOR",
          text: `System resources: CPU: ${Math.floor(Math.random() * 15 + 5)}% | RAM: ${Math.floor(Math.random() * 10 + 40)}%`,
          type: "success"
        };
      } else if (roll < 0.5) {
        const randomPhone = "07" + Math.floor(Math.random() * 90000000 + 10000000);
        newLog = {
          tag: "DARAJA-API",
          text: `STK Push prompt dispatched successfully to +254${randomPhone.substring(1, 4)}***${randomPhone.substring(7)}`,
          type: "info"
        };
      } else if (roll < 0.7) {
        const txCodes = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let tx = "QE";
        for (let i = 0; i < 8; i++) tx += txCodes.charAt(Math.floor(Math.random() * txCodes.length));
        const cash = Math.floor(Math.random() * 20 + 2) * 150;
        newLog = {
          tag: "DARAJA-API",
          text: `STK validation successful. Trans: ${tx} | Amt: KSh ${cash.toLocaleString()}`,
          type: "success"
        };
      } else if (roll < 0.9) {
        newLog = {
          tag: "CRON",
          text: "Running weekly cleanups for expired session configurations.",
          type: "info"
        };
      } else {
        newLog = {
          tag: "AUTH-SERVICE",
          text: "JWT signature verified - payload validation OK",
          type: "success"
        };
      }

      setLogs(prev => {
        const updated = [...prev, { ...newLog, timestamp: getTimestamp() }];
        if (updated.length > 15) {
          updated.shift();
        }
        return updated;
      });
    }, 3200);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  return (
    <div className="terminal-custom flex flex-col h-[220px] w-full">
      <div className="bg-[#0e1624] border-b border-custom px-4 py-2 flex justify-between items-center">
        <div className="text-sub font-mono text-[10px] uppercase tracking-wider flex items-center gap-2">
          <Terminal size={12} className="text-accent-primary animate-pulse" />
          Real-time Application Server Logs
        </div>
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#ef4444]"></div>
          <div className="w-2 h-2 rounded-full bg-[#f59e0b]"></div>
          <div className="w-2 h-2 rounded-full bg-[#10b981]"></div>
        </div>
      </div>
      <div className="p-4 flex-1 overflow-y-auto font-mono text-xs text-[#10b981] space-y-1.5">
        {logs.map((log, index) => (
          <div key={index} className="leading-relaxed whitespace-pre-wrap">
            <span className="text-gray-500 mr-1.5">{log.timestamp}</span>
            <span className="text-accent-primary font-semibold mr-1.5">[{log.tag}]</span>
            <span className={log.type === 'success' ? 'text-accent-success' : log.type === 'info' ? 'text-blue-400' : 'text-[#10b981]'}>
              {log.text}
            </span>
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>
    </div>
  );
};

const DashboardPage = () => {
  const [dashboardStats, setDashboardStats] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [recentOrdersList, setRecentOrdersList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const statsRes = await api.get('/stats/overview');
        setDashboardStats(statsRes.data);
        
        Promise.all([
          api.get('/stats/revenue-chart'),
          api.get('/stats/recent-activity'),
          api.get('/orders?limit=5')
        ]).then(([revRes, actRes, recentOrdRes]) => {
          setRevenueData(revRes.data);
          setRecentActivities(actRes.data);
          setRecentOrdersList(recentOrdRes.data.orders);
          setIsLoading(false);
        }).catch(err => {
          console.error('Failed to fetch secondary dashboard data', err);
          setIsLoading(false);
        });
        
      } catch (error) {
        console.error('Failed to fetch dashboard stats', error);
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary"></div>
      </div>
    );
  }

  const statusColors = {
    pending: 'bg-accent-warning/10 text-accent-warning border-accent-warning/20',
    processing: 'bg-accent-primary/10 text-accent-primary border-accent-primary/20',
    shipped: 'bg-accent-purple/10 text-accent-purple border-accent-purple/20',
    delivered: 'bg-accent-success/10 text-accent-success border-accent-success/20',
    cancelled: 'bg-accent-danger/10 text-accent-danger border-accent-danger/20',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard 
          title="STK Push Income" 
          value={329400} 
          prefix="KSh "
          icon={DollarSign} 
          color="green"
          change="+18.2%"
          trendUp={true}
        />
        <StatCard 
          title="Active Orders" 
          value={3621} 
          icon={ShoppingCart} 
          color="blue"
          change="+5.1%"
          trendUp={true}
        />
        <StatCard 
          title="Total Users" 
          value={12847} 
          icon={Users} 
          color="purple"
          change="+12.4%"
          trendUp={true}
        />
        <StatCard 
          title="API Success Rate" 
          value="99.87"
          suffix="%"
          icon={Package} 
          color="gold"
          change="+0.02%"
          trendUp={true}
        />
      </div>

      {/* Main Charts & Widgets Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-[400px]">
          <RevenueChart data={revenueData} />
        </div>
        <div className="h-[400px]">
          <WeeklyCheckoutChart />
        </div>
      </div>

      {/* Post-it Note & Live Terminal Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <PostItWidget />
        </div>
        <div className="lg:col-span-2 flex items-center">
          <TerminalLogs />
        </div>
      </div>

      {/* Bottom Row: Recent Orders & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Recent Orders Table */}
        <div className="lg:col-span-3 card-bg border border-custom rounded-2xl p-6 overflow-hidden flex flex-col shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-lg">Recent Orders</h3>
            <a href="/orders" className="text-sm text-accent-primary hover:underline transition-all hover:text-opacity-80">View All</a>
          </div>
          
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="text-sub border-b border-custom">
                  <th className="pb-3 font-medium">Order ID</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrdersList?.map((order) => (
                  <tr key={order._id} className="border-b border-custom last:border-0 hover:bg-light-main dark:hover:bg-dark-main transition-colors cursor-pointer">
                    <td className="py-4 font-medium text-accent-primary">{order.orderNumber}</td>
                    <td className="py-4 font-medium">{order.customerName}</td>
                    <td className="py-4 font-bold">{formatCurrency(order.totalAmount)}</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColors[order.status] || statusColors.pending}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 text-sub">{formatDate(order.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="lg:col-span-2">
          <ActivityFeed activities={recentActivities} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
