import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import connectDB from './config/db.js';

import User from './models/User.js';
import Product from './models/Product.js';
import Order from './models/Order.js';
import Activity from './models/Activity.js';

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    await Activity.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);

    const users = [
      { name: 'Admin User', email: 'admin@dashpro.com', password: adminPassword, role: 'admin', status: 'active', avatar: 'AU' },
      { name: 'John Manager', email: 'manager@dashpro.com', password: adminPassword, role: 'manager', status: 'active', avatar: 'JM' },
      { name: 'Sarah Viewer', email: 'sarah@example.com', password: adminPassword, role: 'viewer', status: 'active', avatar: 'SV' },
      { name: 'Inactive User', email: 'inactive@example.com', password: adminPassword, role: 'viewer', status: 'inactive', avatar: 'IU' },
      { name: 'Banned User', email: 'banned@example.com', password: adminPassword, role: 'viewer', status: 'banned', avatar: 'BU' },
      { name: 'Mike Smith', email: 'mike@example.com', password: adminPassword, role: 'manager', status: 'active', avatar: 'MS' },
      { name: 'Jane Doe', email: 'jane@example.com', password: adminPassword, role: 'viewer', status: 'active', avatar: 'JD' },
      { name: 'Bob Wilson', email: 'bob@example.com', password: adminPassword, role: 'viewer', status: 'active', avatar: 'BW' },
      { name: 'Alice Brown', email: 'alice@example.com', password: adminPassword, role: 'viewer', status: 'inactive', avatar: 'AB' },
      { name: 'Charlie Davis', email: 'charlie@example.com', password: adminPassword, role: 'viewer', status: 'active', avatar: 'CD' }
    ];

    const createdUsers = await User.insertMany(users);

    const products = [
      { name: 'MacBook Pro 16', category: 'Electronics', price: 2499, stock: 50, status: 'active', sales: 120, revenue: 299880, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80' },
      { name: 'iPhone 15 Pro', category: 'Electronics', price: 999, stock: 200, status: 'active', sales: 450, revenue: 449550, image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&q=80' },
      { name: 'AirPods Pro', category: 'Electronics', price: 249, stock: 300, status: 'active', sales: 800, revenue: 199200, image: 'https://images.unsplash.com/photo-1608156681070-5232ba53ce91?w=800&q=80' },
      { name: 'Samsung 4K TV', category: 'Electronics', price: 799, stock: 45, status: 'active', sales: 90, revenue: 71910, image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&q=80' },
      { name: 'Sony WH-1000XM5', category: 'Electronics', price: 348, stock: 120, status: 'active', sales: 300, revenue: 104400, image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80' },
      { name: 'Nike Air Max', category: 'Clothing', price: 120, stock: 150, status: 'active', sales: 500, revenue: 60000, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80' },
      { name: 'Adidas Ultraboost', category: 'Clothing', price: 180, stock: 90, status: 'active', sales: 250, revenue: 45000, image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80' },
      { name: 'Levi 501 Jeans', category: 'Clothing', price: 60, stock: 400, status: 'active', sales: 1000, revenue: 60000, image: 'https://images.unsplash.com/photo-1542272604-780c8d523671?w=800&q=80' },
      { name: 'North Face Jacket', category: 'Clothing', price: 150, stock: 0, status: 'out_of_stock', sales: 200, revenue: 30000, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80' },
      { name: 'Atomic Habits', category: 'Books', price: 20, stock: 1000, status: 'active', sales: 3000, revenue: 60000, image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&q=80' },
      { name: 'Dune Paperback', category: 'Books', price: 15, stock: 500, status: 'active', sales: 1200, revenue: 18000, image: 'https://images.unsplash.com/photo-1600189021966-24ba3615467f?w=800&q=80' },
      { name: 'Dyson V15', category: 'Home', price: 699, stock: 30, status: 'active', sales: 150, revenue: 104850, image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&q=80' },
      { name: 'Nespresso Machine', category: 'Home', price: 199, stock: 80, status: 'active', sales: 400, revenue: 79600, image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&q=80' },
      { name: 'Yoga Mat', category: 'Sports', price: 30, stock: 200, status: 'active', sales: 600, revenue: 18000, image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80' },
      { name: 'Dumbbell Set', category: 'Sports', price: 100, stock: 50, status: 'active', sales: 250, revenue: 25000, image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=80' }
    ];

    const createdProducts = await Product.insertMany(products);

    const orders = [];
    const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    const paymentStatuses = ['paid', 'unpaid', 'refunded'];

    for (let i = 1; i <= 30; i++) {
      const orderProducts = [
        createdProducts[Math.floor(Math.random() * createdProducts.length)]._id,
        createdProducts[Math.floor(Math.random() * createdProducts.length)]._id
      ];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      orders.push({
        orderNumber: `ORD-${1000 + i}`,
        customerName: `Customer ${i}`,
        customerEmail: `customer${i}@example.com`,
        products: orderProducts,
        totalAmount: Math.floor(Math.random() * 2000) + 50,
        status: status,
        paymentStatus: status === 'cancelled' ? 'refunded' : (status === 'pending' ? 'unpaid' : 'paid'),
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000) // Random date in last 90 days
      });
    }

    await Order.insertMany(orders);

    const activities = [
      { action: 'New Order', description: 'Order ORD-1030 was placed', icon: '🛒', color: 'blue' },
      { action: 'User Registered', description: 'John Doe joined', icon: '👤', color: 'green' },
      { action: 'Product Added', description: 'Sony WH-1000XM5 added', icon: '📦', color: 'purple' },
      { action: 'User Banned', description: 'Banned User violated TOS', icon: '🚫', color: 'red' },
      { action: 'Order Shipped', description: 'Order ORD-1025 shipped', icon: '🚚', color: 'yellow' },
      { action: 'System Alert', description: 'High CPU Usage', icon: '⚠️', color: 'red' },
      { action: 'New Order', description: 'Order ORD-1029 was placed', icon: '🛒', color: 'blue' },
      { action: 'User Registered', description: 'Jane Smith joined', icon: '👤', color: 'green' },
      { action: 'Order Shipped', description: 'Order ORD-1020 shipped', icon: '🚚', color: 'yellow' },
      { action: 'Product Added', description: 'AirPods Pro added', icon: '📦', color: 'purple' }
    ];

    await Activity.insertMany(activities);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
