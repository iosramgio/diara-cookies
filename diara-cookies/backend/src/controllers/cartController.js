import { db } from '../db/connection.js';
import { cart, products, productVariants, orders, orderItems, promos } from '../db/schema.js';
import { and, eq, inArray, sql } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

// Fungsi untuk mendapatkan atau membuat keranjang
export const getOrCreateCart = async (sessionId) => {
  // Kita akan menyimpan keranjang di database dengan sessionId
  // Untuk sementara, kita bisa menggunakan cookie sessionId atau buat sementara
  let [existingCart] = await db
    .select()
    .from(cart)
    .where(eq(cart.sessionId, sessionId));

  if (!existingCart) {
    // Buat keranjang baru jika belum ada
    const newCart = await db
      .insert(cart)
      .values({
        sessionId: sessionId,
        items: [],
        total: '0',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    existingCart = newCart[0];
  }

  return existingCart;
};

// Fungsi untuk menambahkan item ke keranjang
export const addToCart = async (req, res) => {
  try {
    const { productId, variantId, quantity } = req.body;
    const sessionId = req.sessionId || req.cookies.sessionId || uuidv4(); // buat sessionId jika belum ada

    // Validasi input
    if (!productId || !variantId || !quantity || quantity <= 0) {
      return res.status(400).json({ error: 'Product ID, variant ID, and quantity are required with positive value' });
    }

    // Ambil informasi produk dan varian
    const [product] = await db
      .select()
      .from(products)
      .where(and(eq(products.id, productId), eq(products.isActive, true)));

    if (!product) {
      return res.status(404).json({ error: 'Product not found or inactive' });
    }

    const [variant] = await db
      .select()
      .from(productVariants)
      .where(and(eq(productVariants.id, variantId), eq(productVariants.productId, productId), eq(productVariants.isActive, true)));

    if (!variant) {
      return res.status(404).json({ error: 'Product variant not found or inactive' });
    }

    // Ambil atau buat keranjang
    let cartData = await getOrCreateCart(sessionId);

    // Cek apakah item sudah ada di keranjang
    const existingItemIndex = cartData.items.findIndex(item => item.variantId === variantId);
    
    if (existingItemIndex > -1) {
      // Update kuantitas jika sudah ada
      cartData.items[existingItemIndex].quantity = parseInt(cartData.items[existingItemIndex].quantity) + parseInt(quantity);
    } else {
      // Tambahkan item baru ke keranjang
      cartData.items.push({
        productId: product.id,
        variantId: variant.id,
        productName: product.name,
        variantName: variant.name,
        price: parseFloat(variant.price),
        quantity: parseInt(quantity),
        image: variant.image || product.image
      });
    }

    // Hitung total keranjang
    const total = cartData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Update keranjang di database
    const updatedCart = await db
      .update(cart)
      .set({ 
        items: cartData.items,
        total: total.toString(),
        updatedAt: new Date() 
      })
      .where(eq(cart.sessionId, sessionId))
      .returning();

    res.json({
      message: 'Item added to cart successfully',
      cart: updatedCart[0]
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Fungsi untuk mendapatkan isi keranjang
export const getCart = async (req, res) => {
  try {
    const sessionId = req.sessionId || req.cookies.sessionId;

    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    const cartData = await getOrCreateCart(sessionId);

    res.json({ cart: cartData });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Fungsi untuk mengupdate kuantitas item di keranjang
export const updateCartItem = async (req, res) => {
  try {
    const { variantId, quantity } = req.body;
    const sessionId = req.sessionId || req.cookies.sessionId;

    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    if (!variantId || quantity < 0) {
      return res.status(400).json({ error: 'Variant ID and quantity are required with non-negative value' });
    }

    const cartData = await getOrCreateCart(sessionId);

    const itemIndex = cartData.items.findIndex(item => item.variantId === variantId);

    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    if (quantity === 0) {
      // Hapus item jika kuantitasnya 0
      cartData.items.splice(itemIndex, 1);
    } else {
      // Update kuantitas
      cartData.items[itemIndex].quantity = parseInt(quantity);
    }

    // Hitung total keranjang
    const total = cartData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Update keranjang di database
    const updatedCart = await db
      .update(cart)
      .set({ 
        items: cartData.items,
        total: total.toString(),
        updatedAt: new Date() 
      })
      .where(eq(cart.sessionId, sessionId))
      .returning();

    res.json({
      message: 'Cart updated successfully',
      cart: updatedCart[0]
    });
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Fungsi untuk menghapus item dari keranjang
export const removeFromCart = async (req, res) => {
  try {
    const { variantId } = req.params;
    const sessionId = req.sessionId || req.cookies.sessionId;

    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    if (!variantId) {
      return res.status(400).json({ error: 'Variant ID is required' });
    }

    const cartData = await getOrCreateCart(sessionId);

    const itemIndex = cartData.items.findIndex(item => item.variantId === parseInt(variantId));

    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    // Hapus item
    cartData.items.splice(itemIndex, 1);

    // Hitung total keranjang
    const total = cartData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Update keranjang di database
    const updatedCart = await db
      .update(cart)
      .set({ 
        items: cartData.items,
        total: total.toString(),
        updatedAt: new Date() 
      })
      .where(eq(cart.sessionId, sessionId))
      .returning();

    res.json({
      message: 'Item removed from cart successfully',
      cart: updatedCart[0]
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Fungsi untuk checkout
export const checkout = async (req, res) => {
  try {
    const {
      customerData, // { name, email, phone, address }
      shippingAddress,
      promoCode,
      note
    } = req.body;
    
    const sessionId = req.sessionId || req.cookies.sessionId;
    
    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    // Validasi data pelanggan
    if (!customerData || !customerData.name || !customerData.email || !customerData.phone || !shippingAddress) {
      return res.status(400).json({ error: 'Customer data and shipping address are required' });
    }

    // Ambil keranjang
    const cartData = await getOrCreateCart(sessionId);
    
    if (cartData.items.length === 0) {
      return res.status(400).json({ error: 'Cannot checkout empty cart' });
    }

    // Hitung subtotal
    let subtotal = 0;
    for (const item of cartData.items) {
      subtotal += item.price * item.quantity;
    }

    // Cek dan terapkan promo jika ada
    let discountTotal = 0;
    let appliedPromo = null;
    
    if (promoCode) {
      const [promo] = await db
        .select()
        .from(promos)
        .where(and(
          eq(promos.code, promoCode),
          eq(promos.isActive, true),
          sql`${promos.startDate} <= NOW()`,
          sql`${promos.endDate} >= NOW()`
        ));

      if (promo) {
        // Terapkan promo berdasarkan tipe
        if (promo.type === 'percentage') {
          discountTotal = (subtotal * parseFloat(promo.value)) / 100;
          // Batasi diskon maksimum jika ditentukan
          if (promo.maxDiscountValue && discountTotal > parseFloat(promo.maxDiscountValue)) {
            discountTotal = parseFloat(promo.maxDiscountValue);
          }
        } else if (promo.type === 'nominal') {
          discountTotal = parseFloat(promo.value);
        } else if (promo.type === 'free_shipping' && subtotal >= parseFloat(promo.minOrderValue || '0')) {
          // Promo gratis ongkir hanya mengatur biaya pengiriman nanti
        }
        
        // Batasi diskon agar tidak melebihi subtotal
        if (discountTotal > subtotal) {
          discountTotal = subtotal;
        }
        
        appliedPromo = promo;
      } else {
        return res.status(400).json({ error: 'Invalid or expired promo code' });
      }
    }

    // Untuk sementara, set biaya pengiriman tetap (akan diimplementasikan dengan layanan ekspedisi nanti)
    const shippingFee = 0; // Dalam implementasi nyata, ini akan dihitung berdasarkan berat, jarak, dsb.
    
    // Hitung total
    const grandTotal = subtotal - discountTotal + shippingFee;

    // Generate kode pembayaran unik 3 digit
    const paymentCode = Math.floor(Math.random() * 900) + 100; // Angka antara 100-999
    const payableAmount = grandTotal + paymentCode;

    // Generate nomor order
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    // Buat pesanan
    const [newOrder] = await db
      .insert(orders)
      .values({
        orderNumber,
        customerData: {
          ...customerData,
          shippingAddress
        },
        subtotal: subtotal.toString(),
        discountTotal: discountTotal.toString(),
        shippingFee: shippingFee.toString(),
        grandTotal: grandTotal.toString(),
        paymentCode,
        payableAmount: payableAmount.toString(),
        paymentStatus: 'unpaid', // Karena pembayaran manual
        orderStatus: 'PendingPayment',
        bankAccountLabel: process.env.STORE_BANK_INFO || 'BCA 1234567890 a.n. Diara Cookies',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 jam dari sekarang
        note: note || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    // Tambahkan item pesanan
    const orderItemsData = cartData.items.map(item => ({
      orderId: newOrder.id,
      productId: item.productId,
      variantId: item.variantId,
      productName: item.productName,
      variantName: item.variantName,
      price: item.price.toString(),
      quantity: item.quantity,
      lineTotal: (item.price * item.quantity).toString(),
      createdAt: new Date(),
    }));

    await db.insert(orderItems).values(orderItemsData);

    // Kosongkan keranjang setelah checkout berhasil
    await db
      .update(cart)
      .set({ 
        items: [],
        total: '0',
        updatedAt: new Date() 
      })
      .where(eq(cart.sessionId, sessionId));

    res.status(201).json({
      message: 'Order created successfully',
      order: {
        id: newOrder.id,
        orderNumber: newOrder.orderNumber,
        payableAmount: newOrder.payableAmount,
        paymentCode: newOrder.paymentCode,
        bankAccountLabel: newOrder.bankAccountLabel,
        expiresAt: newOrder.expiresAt,
        grandTotal: newOrder.grandTotal
      }
    });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Fungsi untuk mendapatkan status pesanan
export const getOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { key } = req.query; // Kunci untuk verifikasi, bisa berupa email atau nomor telepon

    if (!orderId || !key) {
      return res.status(400).json({ error: 'Order ID and key are required' });
    }

    const [order] = await db
      .select({
        id: orders.id,
        orderNumber: orders.orderNumber,
        paymentStatus: orders.paymentStatus,
        orderStatus: orders.orderStatus,
        paidAt: orders.paidAt,
        expiresAt: orders.expiresAt,
        createdAt: orders.createdAt
      })
      .from(orders)
      .where(eq(orders.id, orderId));

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Dalam implementasi nyata, kita mungkin ingin memverifikasi bahwa kunci cocok dengan data pelanggan
    // Untuk sementara, kita abaikan verifikasi ini

    res.json({ order });
  } catch (error) {
    console.error('Get order status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};