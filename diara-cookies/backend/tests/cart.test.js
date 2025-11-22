import request from 'supertest';
import app from '../src/app';

describe('Cart and Checkout API', () => {
  it('should add item to cart', async () => {
    const response = await request(app)
      .post('/api/cart/add')
      .send({
        productId: 1,
        variantId: 1,
        quantity: 2
      })
      .expect(200);

    expect(response.body.message).toBe('Item added to cart successfully');
    expect(response.body.cart).toBeDefined();
  });

  it('should get cart', async () => {
    // We need to simulate a session ID for this test
    const response = await request(app)
      .get('/api/cart')
      .set('Cookie', ['sessionId=test-session-id'])
      .expect(200);

    expect(response.body.cart).toBeDefined();
  });

  it('should checkout successfully', async () => {
    const response = await request(app)
      .post('/api/cart/checkout')
      .send({
        customerData: {
          name: 'Test Customer',
          email: 'test@example.com',
          phone: '081234567890'
        },
        shippingAddress: {
          address: 'Jl. Test No. 123',
          city: 'Jakarta',
          province: 'DKI Jakarta',
          postalCode: '12345'
        },
        note: 'Test order'
      })
      .expect(201);

    expect(response.body.message).toBe('Order created successfully');
    expect(response.body.order).toBeDefined();
    expect(response.body.order.payableAmount).toBeDefined();
    expect(response.body.order.paymentCode).toBeDefined();
  });
});