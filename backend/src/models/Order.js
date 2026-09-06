import mongoose from 'mongoose';
export const ORDER_STATUSES = ['pending', 'contacted', 'completed', 'cancelled'];
const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{ product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, quantity: { type: Number, required: true, min: 1 }, unitPrice: { type: Number, required: true, min: 0 }, name: { type: String, required: true }, image: { type: String, required: true } }],
  total: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ORDER_STATUSES, default: 'pending' }
}, { timestamps: true });
export default mongoose.model('Order', orderSchema);
