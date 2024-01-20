import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    status: {
      type: String,
      enum: ['active', 'out_of_stock', 'discontinued'],
      default: 'active',
    },
    sales: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 },
    image: { type: String, default: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80' },
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
