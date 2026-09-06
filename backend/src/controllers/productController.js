import Product, { CATEGORIES } from '../models/Product.js';
import Review from '../models/Review.js';

const formatted = async product => {
  const p = product.toObject ? product.toObject() : product;
  const ratings = await Review.aggregate([{ $match: { product: product._id } }, { $group: { _id: null, average: { $avg: '$rating' }, count: { $sum: 1 } } }]);
  return { ...p, rating: ratings[0]?.average || 0, reviewCount: ratings[0]?.count || 0 };
};
export async function listProducts(req, res) {
  const { search = '', category, tag, includeUnavailable } = req.query;
  const filter = {};
  if (category && category !== 'all') filter.category = category;
  if (tag) filter.tags = tag;
  if (includeUnavailable !== 'true') filter.available = true;
  if (search) filter.$or = [{ name: new RegExp(search, 'i') }, { description: new RegExp(search, 'i') }, { tags: new RegExp(search, 'i') }];
  const products = await Product.find(filter).sort({ createdAt: -1 });
  res.json({ products: await Promise.all(products.map(formatted)), categories: CATEGORIES });
}
export async function getProduct(req, res) {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found.' });
  res.json({ product: await formatted(product) });
}
export async function createProduct(req, res) { const p = await Product.create(req.body); res.status(201).json({ product: await formatted(p) }); }
export async function updateProduct(req, res) {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!product) return res.status(404).json({ message: 'Product not found.' });
  res.json({ product: await formatted(product) });
}
export async function deleteProduct(req, res) {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found.' });
  res.status(204).end();
}
