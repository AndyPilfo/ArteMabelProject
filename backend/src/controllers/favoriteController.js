import Product from '../models/Product.js';
export async function getFavorites(req, res) { await req.user.populate('favorites'); res.json({ products: req.user.favorites }); }
export async function addFavorite(req, res) {
  const product = await Product.findById(req.params.productId);
  if (!product) return res.status(404).json({ message: 'Product not found.' });
  if (!req.user.favorites.some(id => id.equals(product._id))) { req.user.favorites.push(product._id); await req.user.save(); }
  res.json({ favorites: req.user.favorites });
}
export async function removeFavorite(req, res) { req.user.favorites = req.user.favorites.filter(id => !id.equals(req.params.productId)); await req.user.save(); res.json({ favorites: req.user.favorites }); }
