import express from 'express';
import { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  getPromos,
  createPromo,
  getBlogPosts,
  createBlogPost,
  getBanners,
  getTestimonials,
  getDashboardSummary
} from '../controllers/productController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
const router = express.Router();

// Semua route ini memerlukan otentikasi admin
router.use(authenticateToken);
router.use(requireAdmin);

// Routes untuk produk
router.get('/products', getProducts);
router.get('/products/:id', getProductById);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// Routes untuk promosi
router.get('/promos', getPromos);
router.post('/promos', createPromo);

// Routes untuk blog
router.get('/blog-posts', getBlogPosts);
router.post('/blog-posts', createBlogPost);

// Routes untuk banner
router.get('/banners', getBanners);

// Routes untuk testimonial
router.get('/testimonials', getTestimonials);

// Route untuk ringkasan dashboard
router.get('/dashboard-summary', getDashboardSummary);

export default router;