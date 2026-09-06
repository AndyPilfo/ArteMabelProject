import { Router } from 'express'; import { requireAdmin, requireAuth } from '../middleware/auth.js'; import * as favorites from '../controllers/favoriteController.js'; import * as cart from '../controllers/cartController.js'; import * as orders from '../controllers/orderController.js'; import * as reviews from '../controllers/reviewController.js';
const router = Router();
router.get('/favorites', requireAuth, favorites.getFavorites); router.post('/favorites/:productId', requireAuth, favorites.addFavorite); router.delete('/favorites/:productId', requireAuth, favorites.removeFavorite);
router.get('/cart', requireAuth, cart.cart); router.post('/cart', requireAuth, cart.addToCart); router.put('/cart/:productId', requireAuth, cart.updateCart); router.delete('/cart/:productId', requireAuth, cart.removeFromCart); router.delete('/cart', requireAuth, cart.clearCart);
router.post('/orders', requireAuth, orders.createOrder); router.get('/orders', requireAuth, orders.getOrders); router.get('/orders/:id', requireAuth, orders.getOrder);
router.delete('/reviews/:id', requireAuth, reviews.deleteReview);
router.get('/admin/dashboard', requireAuth, requireAdmin, orders.dashboard); router.get('/admin/orders', requireAuth, requireAdmin, orders.allOrders); router.put('/admin/orders/:id/status', requireAuth, requireAdmin, orders.updateOrderStatus); router.get('/admin/reviews', requireAuth, requireAdmin, reviews.allReviews);
export default router;
