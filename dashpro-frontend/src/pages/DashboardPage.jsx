import React, { useState, useEffect } from 'react';
import { DollarSign, ShoppingCart, Users, Package } from 'lucide-react';
import api from '../utils/api';
import StatCard from '../components/StatCard';
import RevenueChart from '../components/RevenueChart';
import OrdersChart from '../components/OrdersChart';
import ActivityFeed from '../components/ActivityFeed';
import { formatCurrency, formatDate } from '../utils/formatters';

const DashboardPage = () => {
  const [dashboardStats, setDashboardStats] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [ordersData, setOrdersData] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [recentOrdersList, setRecentOrdersList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // decided to mix async/await and .then here because why not
    const fetchDashboardData = async () => {
      try {
        // fetch stats overview first so the top numbers load fast
        const statsRes = await api.get('/stats/overview');
        setDashboardStats(statsRes.data);
        
        // then fetch everything else in parallel
        Promise.all([
          api.get('/stats/revenue-chart'),
          api.get('/stats/orders-chart'),
          api.get('/stats/recent-activity'),
          api.get('/orders?limit=5') // just get the last 5 for the preview table
        ]).then(([revRes, ordRes, actRes, recentOrdRes]) => {
          setRevenueData(revRes.data);
          setOrdersData(ordRes.data);
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

  // TODO: move this to a constants file later if we add more statuses
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
          title="Total Revenue" 
          value={dashboardStats?.totalRevenue} 
          prefix="$"
          icon={DollarSign} 
          color="green"
          change={dashboardStats?.revenueGrowth}
          trendUp={dashboardStats?.revenueGrowth?.includes('+')}
        />
        <StatCard 
          title="Total Orders" 
          value={dashboardStats?.totalOrders} 
          icon={ShoppingCart} 
          color="blue"
          change={dashboardStats?.ordersGrowth}
          trendUp={dashboardStats?.ordersGrowth?.includes('+')}
        />
        <StatCard 
          title="Total Users" 
          value={dashboardStats?.totalUsers} 
          icon={Users} 
          color="purple"
          change={dashboardStats?.usersGrowth}
          trendUp={dashboardStats?.usersGrowth?.includes('+')}
        />
        <StatCard 
          title="Total Products" 
          value={dashboardStats?.totalProducts} 
          icon={Package} 
          color="gold"
          change="+5" // hardcoded for now until backend is ready
          trendUp={true}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[400px]">
        <RevenueChart data={revenueData} />
        <OrdersChart data={ordersData} />
      </div>

      {/* Bottom Row */}
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
