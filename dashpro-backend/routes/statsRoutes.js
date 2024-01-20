import express from 'express';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Activity from '../models/Activity.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// All stats routes are protected and admin only
router.use(protect, admin);

router.get('/overview', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    
    // Calculate total revenue from delivered/shipped orders, or just sum all totalAmount
    const orders = await Order.find({});
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);

    res.json({
      totalUsers,
      totalRevenue,
      totalOrders,
      totalProducts,
      revenueGrowth: '+12.5%',
      ordersGrowth: '+8.2%',
      usersGrowth: '+23.1%'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/revenue-chart', async (req, res) => {
  try {
    // Mock data for 12 months as requested
    const data = [
      { month: 'Jan', revenue: 4200 },
      { month: 'Feb', revenue: 3800 },
      { month: 'Mar', revenue: 5100 },
      { month: 'Apr', revenue: 4600 },
      { month: 'May', revenue: 5800 },
      { month: 'Jun', revenue: 6200 },
      { month: 'Jul', revenue: 5900 },
      { month: 'Aug', revenue: 6800 },
      { month: 'Sep', revenue: 7100 },
      { month: 'Oct', revenue: 7500 },
      { month: 'Nov', revenue: 8200 },
      { month: 'Dec', revenue: 9400 }
    ];
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/orders-chart', async (req, res) => {
  try {
    // Mock data for 8 weeks
    const data = [
      { week: 'Week 1', orders: 45 },
      { week: 'Week 2', orders: 52 },
      { week: 'Week 3', orders: 48 },
      { week: 'Week 4', orders: 61 },
      { week: 'Week 5', orders: 59 },
      { week: 'Week 6', orders: 74 },
      { week: 'Week 7', orders: 81 },
      { week: 'Week 8', orders: 95 }
    ];
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/category-chart', async (req, res) => {
  try {
    // Instead of querying products DB, we send requested mock
    const data = [
      { category: 'Electronics', value: 35 },
      { category: 'Clothing', value: 25 },
      { category: 'Books', value: 15 },
      { category: 'Home', value: 15 },
      { category: 'Sports', value: 10 }
    ];
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/recent-activity', async (req, res) => {
  try {
    const activities = await Activity.find().sort({ timestamp: -1 }).limit(10);
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
