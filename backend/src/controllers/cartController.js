import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
const getCart = user => Cart.findOne({ user: user._id }).populate('items.product');
export async function cart(req, res) { res.json({ cart: await getCart(req.user) || { items: [] } }); }
export async function addToCart(req, res) {
  const { productId, quantity = 1 } = req.body;
  if (!Number.isInteger(quantity) || quantity < 1) return res.status(400).json({ message: 'Quantity must be a positive integer.' });
  const product = await Product.findById(productId);
  if (!product || !product.available) return res.status(400).json({ message: 'Product is not available.' });
  let userCart = await Cart.findOne({ user: req.user._id });
  if (!userCart) userCart = new Cart({ user: req.user._id, items: [] });
  const item = userCart.items.find(i => i.product.equals(product._id));
  if (item) item.quantity += quantity; else userCart.items.push({ product: product._id, quantity });
  await userCart.save(); res.status(201).json({ cart: await getCart(req.user) });
}
export async function updateCart(req, res) {
  const { quantity } = req.body;
  if (!Number.isInteger(quantity) || quantity < 1) return res.status(400).json({ message: 'Quantity must be a positive integer.' });
  const userCart = await Cart.findOne({ user: req.user._id });
  const item = userCart?.items.find(i => i.product.equals(req.params.productId));
  if (!item) return res.status(404).json({ message: 'Cart item not found.' });
  item.quantity = quantity; await userCart.save(); res.json({ cart: await getCart(req.user) });
}
export async function removeFromCart(req, res) { const c = await Cart.findOne({ user: req.user._id }); if (c) { c.items = c.items.filter(i => !i.product.equals(req.params.productId)); await c.save(); } res.json({ cart: await getCart(req.user) || { items: [] } }); }
export async function clearCart(req, res) { await Cart.findOneAndUpdate({ user: req.user._id }, { $set: { items: [] } }); res.status(204).end(); }
