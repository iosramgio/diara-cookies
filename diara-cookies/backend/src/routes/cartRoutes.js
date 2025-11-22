import express from 'express';
import { 
  addToCart, 
  getCart, 
  updateCartItem, 
  removeFromCart, 
  checkout,
  getOrderStatus
} from '../controllers/cartController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
const router = express.Router();

// Routes untuk keranjang
router.post('/add', addToCart);
router.get('/', getCart);
router.put('/update', updateCartItem);
router.delete('/remove/:variantId', removeFromCart);

// Route untuk checkout
router.post('/checkout', checkout);

// Route untuk mengecek status pesanan
router.get('/order/:orderId', getOrderStatus);

export default router;