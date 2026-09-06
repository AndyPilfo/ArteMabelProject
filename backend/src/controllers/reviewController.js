import Review from '../models/Review.js';
import Order from '../models/Order.js';
export async function productReviews(req, res) { res.json({ reviews: await Review.find({ product: req.params.productId }).populate('user', 'name').sort({ createdAt: -1 }) }); }
export async function createReview(req, res) {
  const { rating, comment = '' } = req.body;
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return res.status(400).json({ message: 'Rating from 1 to 5 is required.' });
  const purchased = await Order.exists({ user: req.user._id, 'items.product': req.params.productId });
  if (!purchased) return res.status(403).json({ message: 'Only customers who bought this product may review it.' });
  const review = await Review.create({ user: req.user._id, product: req.params.productId, rating, comment });
  await review.populate('user', 'name'); res.status(201).json({ review });
}
export async function deleteReview(req, res) { const review = await Review.findById(req.params.id); if (!review) return res.status(404).json({ message: 'Review not found.' }); if (req.user.role !== 'admin' && !review.user.equals(req.user._id)) return res.status(403).json({ message: 'Not allowed.' }); await review.deleteOne(); res.status(204).end(); }
export async function allReviews(req, res) { res.json({ reviews: await Review.find().populate('user', 'name email').populate('product', 'name').sort({ createdAt: -1 }) }); }
