import request from 'supertest';
import app from '../src/app';

// Mock auth middleware
jest.mock('../src/middleware/auth', () => ({
  authenticateToken: (req, res, next) => {
    // Mock admin authentication
    req.user = { userId: 1, role: 'admin' };
    next();
  },
  requireAdmin: (req, res, next) => next(),
}));

describe('Product API', () => {
  it('should get all products', async () => {
    const response = await request(app)
      .get('/api/admin/products')
      .expect(200);

    expect(Array.isArray(response.body.products)).toBeTruthy();
  });

  it('should get a product by ID', async () => {
    // First, get a product to use its ID
    const productList = await request(app)
      .get('/api/admin/products')
      .expect(200);

    if (productList.body.products.length > 0) {
      const productId = productList.body.products[0].id;
      
      const response = await request(app)
        .get(`/api/admin/products/${productId}`)
        .expect(200);

      expect(response.body.product).toBeDefined();
      expect(response.body.product.id).toBe(productId);
    }
  });

  it('should get all promos', async () => {
    const response = await request(app)
      .get('/api/admin/promos')
      .expect(200);

    expect(Array.isArray(response.body.promos)).toBeTruthy();
  });

  it('should get all blog posts', async () => {
    const response = await request(app)
      .get('/api/admin/blog-posts')
      .expect(200);

    expect(Array.isArray(response.body.blogPosts)).toBeTruthy();
  });
});