import { db } from '../db/connection.js';
import { orders, orderItems } from '../db/schema.js';
import { eq, and, inArray, sql } from 'drizzle-orm';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

// Fungsi untuk mendapatkan daftar pesanan
export const getOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let conditions = [];
    
    if (status) {
      conditions.push(orders.orderStatus === status);
    }
    
    let query = db
      .select({
        id: orders.id,
        orderNumber: orders.orderNumber,
        customerData: orders.customerData,
        grandTotal: orders.grandTotal,
        paymentStatus: orders.paymentStatus,
        orderStatus: orders.orderStatus,
        payableAmount: orders.payableAmount,
        paymentCode: orders.paymentCode,
        expiresAt: orders.expiresAt,
        paidAt: orders.paidAt,
        createdAt: orders.createdAt
      })
      .from(orders)
      .orderBy(orders.createdAt);

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const result = await query.limit(limit).offset(offset);
    
    // Dapatkan total jumlah pesanan untuk pagination
    let countQuery = db.select({ count: sql`count(*)` }).from(orders);
    if (conditions.length > 0) {
      countQuery = countQuery.where(and(...conditions));
    }
    const [{ count }] = await countQuery;
    
    res.json({
      orders: result,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(count),
        pages: Math.ceil(parseInt(count) / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Fungsi untuk mendapatkan detail pesanan
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, id));

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Ambil item pesanan
    const orderItemsResult = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, id));

    res.json({
      order: {
        ...order,
        items: orderItemsResult
      }
    });
  } catch (error) {
    console.error('Get order by ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Fungsi untuk menandai pesanan sebagai dibayar
export const markOrderAsPaid = async (req, res) => {
  try {
    const { id } = req.params;

    const [order] = await db
      .select({
        id: orders.id,
        orderStatus: orders.orderStatus,
        paymentStatus: orders.paymentStatus,
        expiresAt: orders.expiresAt
      })
      .from(orders)
      .where(eq(orders.id, id));

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Cek apakah pesanan masih dalam status yang bisa dibayar
    if (order.orderStatus !== 'PendingPayment') {
      return res.status(400).json({ error: 'Order cannot be marked as paid in current status' });
    }

    // Cek apakah pesanan sudah kadaluarsa
    if (new Date() > new Date(order.expiresAt)) {
      return res.status(400).json({ error: 'Order has expired' });
    }

    // Update status pembayaran dan pesanan
    const [updatedOrder] = await db
      .update(orders)
      .set({
        paymentStatus: 'paid',
        orderStatus: 'Paid',
        paidAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(orders.id, id))
      .returning();

    res.json({
      message: 'Order marked as paid successfully',
      order: updatedOrder
    });
  } catch (error) {
    console.error('Mark order as paid error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Fungsi untuk membatalkan pesanan
export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const [order] = await db
      .select({
        id: orders.id,
        orderStatus: orders.orderStatus,
        paymentStatus: orders.paymentStatus
      })
      .from(orders)
      .where(eq(orders.id, id));

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Cek apakah pesanan masih dalam status yang bisa dibatalkan
    if (['Processing', 'Shipped', 'ReadyForPickup', 'Completed'].includes(order.orderStatus)) {
      return res.status(400).json({ error: 'Order cannot be cancelled in current status' });
    }

    // Update status pesanan
    const [updatedOrder] = await db
      .update(orders)
      .set({
        orderStatus: 'Cancelled',
        updatedAt: new Date()
      })
      .where(eq(orders.id, id))
      .returning();

    res.json({
      message: 'Order cancelled successfully',
      order: updatedOrder
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Fungsi untuk mengupdate status pesanan
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['PendingPayment', 'Paid', 'Processing', 'Shipped', 'ReadyForPickup', 'Completed', 'Cancelled'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Valid order status is required' });
    }

    const [order] = await db
      .select({
        id: orders.id,
        orderStatus: orders.orderStatus,
        paymentStatus: orders.paymentStatus
      })
      .from(orders)
      .where(eq(orders.id, id));

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Validasi transisi status yang valid
    let isValidTransition = true;
    
    switch(order.orderStatus) {
      case 'PendingPayment':
        isValidTransition = status === 'Paid' || status === 'Cancelled';
        break;
      case 'Paid':
        isValidTransition = status === 'Processing' || status === 'Cancelled';
        break;
      case 'Processing':
        isValidTransition = status === 'Shipped' || status === 'ReadyForPickup' || status === 'Cancelled';
        break;
      case 'Shipped':
        isValidTransition = status === 'Completed';
        break;
      case 'ReadyForPickup':
        isValidTransition = status === 'Completed';
        break;
      case 'Cancelled':
        // Tidak bisa berpindah dari status Cancelled
        isValidTransition = status === 'Cancelled';
        break;
      default:
        // Untuk status lainnya, validasi khusus
        isValidTransition = true;
    }

    if (!isValidTransition) {
      return res.status(400).json({ error: `Invalid status transition from ${order.orderStatus} to ${status}` });
    }

    // Update status pesanan
    const [updatedOrder] = await db
      .update(orders)
      .set({
        orderStatus: status,
        updatedAt: new Date()
      })
      .where(eq(orders.id, id))
      .returning();

    res.json({
      message: 'Order status updated successfully',
      order: updatedOrder
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Fungsi untuk mendapatkan ringkasan pesanan untuk dashboard
export const getOrderSummary = async (req, res) => {
  try {
    // Dapatkan jumlah pesanan per status
    const statusCounts = await db
      .select({
        status: orders.orderStatus,
        count: sql`COUNT(*)`
      })
      .from(orders)
      .groupBy(orders.orderStatus);

    // Dapatkan total pendapatan
    const totalRevenueResult = await db
      .select({
        total: sql`SUM(${orders.grandTotal}) FILTER (WHERE ${orders.paymentStatus} = 'paid')`
      })
      .from(orders);
      
    const totalRevenue = totalRevenueResult[0].total || '0';

    // Dapatkan 5 pesanan terbaru
    const recentOrders = await db
      .select({
        id: orders.id,
        orderNumber: orders.orderNumber,
        customerData: orders.customerData,
        grandTotal: orders.grandTotal,
        orderStatus: orders.orderStatus,
        createdAt: orders.createdAt
      })
      .from(orders)
      .orderBy(orders.createdAt.desc())
      .limit(5);

    res.json({
      summary: {
        statusCounts,
        totalRevenue,
        recentOrders
      }
    });
  } catch (error) {
    console.error('Get order summary error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};