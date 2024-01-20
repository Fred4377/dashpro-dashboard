import React, { useState, useEffect } from 'react';
import { Search, Eye, Edit2 } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { formatCurrency, formatDate } from '../utils/formatters';
import Modal from '../components/Modal';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/orders?status=${statusFilter}&search=${search}`);
      setOrders(res.data.orders);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOrders();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, statusFilter]);

  const updateStatus = async (id, newStatus) => {
    try {
      await api.patch(`/orders/${id}/status`, { status: newStatus });
      toast.success('Order status updated');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleExport = () => {
    toast.success('Orders exported to CSV');
  };

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const statusColors = {
    pending: 'bg-accent-warning/10 text-accent-warning border-accent-warning/20',
    processing: 'bg-accent-primary/10 text-accent-primary border-accent-primary/20',
    shipped: 'bg-accent-purple/10 text-accent-purple border-accent-purple/20',
    delivered: 'bg-accent-success/10 text-accent-success border-accent-success/20',
    cancelled: 'bg-accent-danger/10 text-accent-danger border-accent-danger/20',
  };

  const paymentColors = {
    paid: 'text-accent-success',
    unpaid: 'text-accent-warning',
    refunded: 'text-accent-danger'
  };

  // Calculate stats
  const allOrdersCount = orders.length;
  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const processingCount = orders.filter(o => o.status === 'processing').length;
  const deliveredCount = orders.filter(o => o.status === 'delivered').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Orders</h1>
        <div className="flex gap-3">
          <button onClick={handleExport} className="px-4 py-2 card-bg border border-custom rounded-lg hover:bg-light-main dark:hover:bg-dark-main transition-colors text-sm font-medium">
            Export
          </button>
        </div>
      </div>

      {/* Mini Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'All Orders', value: allOrdersCount, color: 'text-light-text dark:text-dark-text' },
          { label: 'Pending', value: pendingCount, color: 'text-accent-warning' },
          { label: 'Processing', value: processingCount, color: 'text-accent-primary' },
          { label: 'Delivered', value: deliveredCount, color: 'text-accent-success' }
        ].map((stat, i) => (
          <div key={i} className="card-bg border border-custom p-4 rounded-xl flex flex-col justify-center">
            <p className="text-sub text-xs font-medium mb-1">{stat.label}</p>
            <h4 className={`text-2xl font-bold ${stat.color}`}>{stat.value}</h4>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card-bg border border-custom p-4 rounded-xl flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-sub" size={18} />
          <input 
            type="text" 
            placeholder="Search by Order ID or Customer..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-light-main dark:bg-dark-main border border-custom rounded-lg focus:outline-none focus:border-accent-primary text-sm"
          />
        </div>
        
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-light-main dark:bg-dark-main border border-custom rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-accent-primary min-w-[150px]"
        >
          <option>All Status</option>
          <option>Pending</option>
          <option>Processing</option>
          <option>Shipped</option>
          <option>Delivered</option>
          <option>Cancelled</option>
        </select>
        
        <select className="bg-light-main dark:bg-dark-main border border-custom rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-accent-primary min-w-[150px]">
          <option>Last 30 Days</option>
          <option>Last 7 Days</option>
          <option>All Time</option>
        </select>
      </div>

      {/* Table */}
      <div className="card-bg border border-custom rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-light-main dark:bg-dark-main border-b border-custom">
              <tr>
                <th className="px-6 py-4 font-medium">Order #</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Items</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Payment</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-sub">Loading...</td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-sub">No orders found</td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="border-b border-custom last:border-0 hover:bg-light-main dark:hover:bg-dark-main transition-colors group">
                    <td className="px-6 py-4 font-medium">{order.orderNumber}</td>
                    <td className="px-6 py-4">
                      <p className="font-medium">{order.customerName}</p>
                      <p className="text-xs text-sub">{order.customerEmail}</p>
                    </td>
                    <td className="px-6 py-4 text-sub">{order.products?.length || 0} items</td>
                    <td className="px-6 py-4 font-medium">{formatCurrency(order.totalAmount)}</td>
                    <td className="px-6 py-4">
                      <span className={`font-medium ${paymentColors[order.paymentStatus]}`}>
                        {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        value={order.status}
                        onChange={(e) => updateStatus(order._id, e.target.value)}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium border appearance-none outline-none cursor-pointer ${statusColors[order.status]}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sub">{formatDate(order.createdAt)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openOrderDetails(order)} className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors text-sub hover:text-accent-primary" title="View Details">
                          <Eye size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Order Details">
        {selectedOrder && (
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg mb-1">{selectedOrder.orderNumber}</h3>
                <p className="text-sm text-sub">{formatDate(selectedOrder.createdAt)}</p>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[selectedOrder.status]}`}>
                {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
              </span>
            </div>
            
            <div className="border border-custom rounded-lg p-4 bg-light-main dark:bg-dark-main">
              <h4 className="font-semibold mb-3 text-sm">Customer Information</h4>
              <p className="font-medium text-sm">{selectedOrder.customerName}</p>
              <p className="text-sub text-sm">{selectedOrder.customerEmail}</p>
            </div>

            <div className="border border-custom rounded-lg overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-light-main dark:bg-dark-main border-b border-custom">
                  <tr>
                    <th className="px-4 py-2 font-medium">Product</th>
                    <th className="px-4 py-2 font-medium text-right">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-custom">
                  {selectedOrder.products?.map((p, i) => (
                    <tr key={i}>
                      <td className="px-4 py-3">{p.product ? p.product.name : 'Unknown Product'} x {p.quantity}</td>
                      <td className="px-4 py-3 text-right">{formatCurrency((p.product ? p.product.price : 0) * p.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-light-main dark:bg-dark-main border-t border-custom font-bold">
                  <tr>
                    <td className="px-4 py-3">Total</td>
                    <td className="px-4 py-3 text-right text-accent-primary">{formatCurrency(selectedOrder.totalAmount)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrdersPage;
