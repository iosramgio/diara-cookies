import express from 'express';
import { 
  getOrders, 
  getOrderById, 
  markOrderAsPaid, 
  cancelOrder, 
  updateOrderStatus,
  getOrderSummary
} from '../controllers/orderController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
const router = express.Router();

// Semua route ini memerlukan otentikasi admin
router.use(authenticateToken);
router.use(requireAdmin);

// Routes untuk operasi pesanan
router.get('/', getOrders);
router.get('/summary', getOrderSummary);
router.get('/:id', getOrderById);
router.patch('/:id/mark-paid', markOrderAsPaid);
router.patch('/:id/cancel', cancelOrder);
router.patch('/:id/status', updateOrderStatus);

export default router;