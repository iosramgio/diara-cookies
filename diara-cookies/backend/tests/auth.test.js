import request from 'supertest';
import app from '../src/app'; // Kita akan membuat file app.js terpisah untuk kebutuhan testing

// Mock auth middleware
jest.mock('../src/middleware/auth', () => ({
  authenticateToken: (req, res, next) => {
    // Mock admin authentication
    req.user = { userId: 1, role: 'admin' };
    next();
  },
  requireAdmin: (req, res, next) => next(),
}));

describe('Auth API', () => {
  it('should login admin successfully', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@diaracookies.com',
        password: 'admin123'
      })
      .expect(200);

    expect(response.body.user).toBeDefined();
    expect(response.body.user.role).toBe('admin');
  });

  it('should reject login with invalid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@diaracookies.com',
        password: 'wrongpassword'
      })
      .expect(401);

    expect(response.body.error).toBeDefined();
  });

  it('should get admin profile', async () => {
    const response = await request(app)
      .get('/api/auth/me')
      .expect(200);

    expect(response.body.user).toBeDefined();
  });
});