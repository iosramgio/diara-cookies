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

describe('Order API', () => {
  it('should get all orders', async () => {
    const response = await request(app)
      .get('/api/orders')
      .expect(200);

    expect(response.body.orders).toBeDefined();
  });

  it('should get order summary', async () => {
    const response = await request(app)
      .get('/api/orders/summary')
      .expect(200);

    expect(response.body.summary).toBeDefined();
  });

  it('should get a specific order', async () => {
    // First, get orders to find an ID
    const ordersList = await request(app)
      .get('/api/orders')
      .expect(200);

    if (ordersList.body.orders.length > 0) {
      const orderId = ordersList.body.orders[0].id;
      
      const response = await request(app)
        .get(`/api/orders/${orderId}`)
        .expect(200);

      expect(response.body.order).toBeDefined();
      expect(response.body.order.id).toBe(orderId);
    }
  });
});