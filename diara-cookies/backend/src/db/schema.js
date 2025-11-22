import { pgTable, serial, text, varchar, integer, decimal, boolean, timestamp, date, jsonb, pgEnum } from 'drizzle-orm/pg-core';

// Enums
export const orderStatusEnum = pgEnum('order_status', [
  'PendingPayment', 
  'Paid', 
  'Processing', 
  'Shipped', 
  'ReadyForPickup', 
  'Completed', 
  'Cancelled'
]);

export const paymentStatusEnum = pgEnum('payment_status', [
  'unpaid', 
  'paid'
]);

export const userRoleEnum = pgEnum('user_role', [
  'customer', 
  'admin'
]);

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(), // sudah di-hash
  role: userRoleEnum('role').default('customer'),
  isActive: boolean('is_active').default(true),
  lastLoginAt: timestamp('last_login_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Tables
export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description'),
  composition: text('composition'), // komposisi bahan
  allergens: text('allergens'), // informasi alergen
  shelfLife: varchar('shelf_life', { length: 100 }), // masa simpan
  image: varchar('image', { length: 500 }),
  thumbnail: varchar('thumbnail', { length: 500 }),
  isFeatured: boolean('is_featured').default(false),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const productVariants = pgTable('product_variants', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').references(() => products.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 255 }).notNull(), // misal: "Kecil", "Sedang", "Besar"
  sku: varchar('sku', { length: 100 }).notNull().unique(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(), // harga jual
  stock: integer('stock').default(0),
  weight: decimal('weight', { precision: 8, scale: 2 }), // berat dalam gram
  dimensions: jsonb('dimensions'), // panjang, lebar, tinggi
  image: varchar('image', { length: 500 }),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const promos = pgTable('promos', {
  id: serial('id').primaryKey(),
  code: varchar('code', { length: 50 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  type: varchar('type', { length: 50 }).notNull(), // 'percentage', 'nominal', 'free_shipping'
  value: decimal('value', { precision: 10, scale: 2 }), // untuk diskon persen atau nominal
  minOrderValue: decimal('min_order_value', { precision: 10, scale: 2 }), // minimal pembelian
  maxDiscountValue: decimal('max_discount_value', { precision: 10, scale: 2 }), // maksimal potongan (untuk persentase)
  isActive: boolean('is_active').default(true),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const blogPosts = pgTable('blog_posts', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  content: text('content').notNull(),
  excerpt: text('excerpt'),
  featuredImage: varchar('featured_image', { length: 500 }),
  isPublished: boolean('is_published').default(false),
  publishedAt: timestamp('published_at'),
  author: varchar('author', { length: 255 }),
  metaTitle: varchar('meta_title', { length: 60 }),
  metaDescription: varchar('meta_description', { length: 160 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const banners = pgTable('banners', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  subtitle: varchar('subtitle', { length: 500 }),
  imageUrl: varchar('image_url', { length: 500 }),
  targetUrl: varchar('target_url', { length: 500 }),
  position: integer('position').default(0),
  isActive: boolean('is_active').default(true),
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const testimonials = pgTable('testimonials', {
  id: serial('id').primaryKey(),
  customerName: varchar('customer_name', { length: 255 }).notNull(),
  content: text('content').notNull(),
  rating: integer('rating').notNull(), // skala 1-5
  orderReference: varchar('order_reference', { length: 100 }), // nomor order terkait
  isFeatured: boolean('is_featured').default(false),
  isVerified: boolean('is_verified').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const settings = pgTable('settings', {
  id: serial('id').primaryKey(),
  key: varchar('key', { length: 100 }).notNull().unique(),
  value: text('value').notNull(),
  description: text('description'),
  type: varchar('type', { length: 50 }).default('string'), // string, number, boolean, json
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const mediaAssets = pgTable('media_assets', {
  id: serial('id').primaryKey(),
  filename: varchar('filename', { length: 255 }).notNull(),
  originalName: varchar('original_name', { length: 500 }).notNull(),
  mimeType: varchar('mime_type', { length: 100 }).notNull(),
  size: integer('size').notNull(), // ukuran dalam bytes
  path: varchar('path', { length: 500 }).notNull(),
  altText: varchar('alt_text', { length: 500 }),
  usageCount: integer('usage_count').default(0),
  uploadedBy: varchar('uploaded_by', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const auditLogs = pgTable('audit_logs', {
  id: serial('id').primaryKey(),
  table: varchar('table_name', { length: 100 }).notNull(),
  recordId: integer('record_id').notNull(),
  action: varchar('action', { length: 50 }).notNull(), // CREATE, UPDATE, DELETE
  oldValues: jsonb('old_values'),
  newValues: jsonb('new_values'),
  changedBy: varchar('changed_by', { length: 255 }),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  orderNumber: varchar('order_number', { length: 100 }).notNull().unique(),
  customerData: jsonb('customer_data').notNull(), // nama, email, telepon, alamat
  subtotal: decimal('subtotal', { precision: 10, scale: 2 }).notNull(),
  discountTotal: decimal('discount_total', { precision: 10, scale: 2 }).default('0'),
  shippingFee: decimal('shipping_fee', { precision: 10, scale: 2 }).default('0'),
  grandTotal: decimal('grand_total', { precision: 10, scale: 2 }).notNull(),
  paymentCode: integer('payment_code').notNull(), // 3 digit unik
  payableAmount: decimal('payable_amount', { precision: 10, scale: 2 }).notNull(), // total + payment code
  paymentStatus: paymentStatusEnum('payment_status').default('unpaid'),
  orderStatus: orderStatusEnum('order_status').default('PendingPayment'),
  bankAccountLabel: varchar('bank_account_label', { length: 255 }).notNull(), // info rekening tujuan
  expiresAt: timestamp('expires_at').notNull(), // batas waktu pembayaran
  paidAt: timestamp('paid_at'),
  utmSource: varchar('utm_source', { length: 100 }),
  utmMedium: varchar('utm_medium', { length: 100 }),
  utmCampaign: varchar('utm_campaign', { length: 100 }),
  note: text('note'), // catatan dari pelanggan
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const orderItems = pgTable('order_items', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').references(() => orders.id, { onDelete: 'cascade' }).notNull(),
  productId: integer('product_id').references(() => products.id, { onDelete: 'restrict' }).notNull(),
  variantId: integer('variant_id').references(() => productVariants.id, { onDelete: 'restrict' }).notNull(),
  productName: varchar('product_name', { length: 255 }).notNull(),
  variantName: varchar('variant_name', { length: 255 }).notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  quantity: integer('quantity').notNull(),
  lineTotal: decimal('line_total', { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const whatsappInquiries = pgTable('whatsapp_inquiries', {
  id: serial('id').primaryKey(),
  customerName: varchar('customer_name', { length: 255 }),
  customerPhone: varchar('customer_phone', { length: 20 }),
  message: text('message'),
  sourcePage: varchar('source_page', { length: 255 }), // halaman asal
  utmSource: varchar('utm_source', { length: 100 }),
  utmMedium: varchar('utm_medium', { length: 100 }),
  utmCampaign: varchar('utm_campaign', { length: 100 }),
  convertedToOrder: boolean('converted_to_order').default(false),
  orderId: integer('order_id').references(() => orders.id),
  status: varchar('status', { length: 50 }).default('New'), // New, Qualified, Follow-up, Won, Lost
  assignedTo: varchar('assigned_to', { length: 255 }), // staff yang menangani
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const bankReconImports = pgTable('bank_recon_imports', {
  id: serial('id').primaryKey(),
  fileName: varchar('file_name', { length: 255 }).notNull(),
  importedBy: varchar('imported_by', { length: 255 }).notNull(),
  totalRows: integer('total_rows').notNull(),
  matchedOrders: integer('matched_orders').default(0),
  importDate: timestamp('import_date').defaultNow().notNull(),
  status: varchar('status', { length: 50 }).default('Processing'), // Processing, Completed, Error
  notes: text('notes'),
});

export const bankReconRows = pgTable('bank_recon_rows', {
  id: serial('id').primaryKey(),
  importId: integer('import_id').references(() => bankReconImports.id, { onDelete: 'cascade' }).notNull(),
  txnTime: timestamp('txn_time').notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  description: text('description'),
  matchedOrderId: integer('matched_order_id').references(() => orders.id),
  matchStatus: varchar('match_status', { length: 50 }).default('Unmatched'), // Unmatched, Manual, Auto, Confirmed, Ignored
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const cart = pgTable('cart', {
  id: serial('id').primaryKey(),
  sessionId: varchar('session_id', { length: 255 }).notNull(),
  items: jsonb('items').notNull(), // array berisi item keranjang
  total: decimal('total', { precision: 10, scale: 2 }).default('0'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});