import Cart from '../models/Cart.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
export async function createOrder(req, res) {
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  if (!cart?.items.length) return res.status(400).json({ message: 'Your cart is empty.' });
  const items = cart.items.map(({ product, quantity }) => ({ product: product._id, quantity, unitPrice: product.price, name: product.name, image: product.image }));
  if (cart.items.some(i => !i.product.available)) return res.status(400).json({ message: 'One or more products are no longer available.' });
  const total = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const order = await Order.create({ user: req.user._id, items, total });
  cart.items = []; await cart.save();
  res.status(201).json({ order });
}
export async function getOrders(req, res) { res.json({ orders: await Order.find({ user: req.user._id }).sort({ createdAt: -1 }) }); }
export async function getOrder(req, res) { const o = await Order.findById(req.params.id); if (!o) return res.status(404).json({ message: 'Order not found.' }); if (o.user.toString() !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ message: 'Not allowed.' }); res.json({ order: o }); }
export async function allOrders(req, res) { res.json({ orders: await Order.find().populate('user', 'name email').sort({ createdAt: -1 }) }); }
export async function updateOrderStatus(req, res) { const o = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true, runValidators: true }); if (!o) return res.status(404).json({ message: 'Order not found.' }); res.json({ order: o }); }
export async function dashboard(req, res) { const [products, pending, completed, reviews] = await Promise.all([Product.countDocuments(), Order.countDocuments({ status: 'pending' }), Order.countDocuments({ status: 'completed' }), (await import('../models/Review.js')).default.countDocuments()]); res.json({ products, pending, completed, reviews }); }
