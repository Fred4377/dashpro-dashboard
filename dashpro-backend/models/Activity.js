import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      enum: ['New Order', 'User Registered', 'Product Added', 'User Banned', 'Order Shipped', 'System Alert'],
    },
    description: { type: String, required: true },
    icon: { type: String },
    color: {
      type: String,
      enum: ['blue', 'green', 'red', 'yellow', 'purple', 'gray'],
      default: 'blue',
    },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Activity = mongoose.model('Activity', activitySchema);
export default Activity;
