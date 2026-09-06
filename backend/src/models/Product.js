import mongoose from 'mongoose';

export const CATEGORIES = ['queques', 'galletas', 'panes', 'postres', 'otros'];
const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  description: { type: String, required: true, trim: true, maxlength: 1500 },
  price: { type: Number, required: true, min: 0 },
  image: { type: String, required: true, trim: true },
  category: { type: String, required: true, enum: CATEGORIES },
  tags: [{ type: String, trim: true, maxlength: 40 }],
  available: { type: Boolean, default: true }
}, { timestamps: true });
export default mongoose.model('Product', productSchema);
