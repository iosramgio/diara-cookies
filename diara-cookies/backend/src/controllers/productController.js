import { db } from '../db/connection.js';
import { 
  products, 
  productVariants, 
  promos, 
  blogPosts, 
  banners, 
  testimonials,
  mediaAssets,
  auditLogs
} from '../db/schema.js';
import { eq, and, sql, desc, asc } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

// Fungsi untuk mendapatkan semua produk
export const getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category } = req.query;
    const offset = (page - 1) * limit;

    let query = db
      .select()
      .from(products)
      .orderBy(desc(products.createdAt));

    if (search) {
      query = query.where(sql`LOWER(${products.name}) LIKE LOWER('%${search}%')`);
    }

    // Tambahkan filter kategori jika diperlukan (akan memerlukan tabel kategori tambahan)
    // Untuk sementara kita abaikan filter kategori karena belum ada skema kategori

    const result = await query.limit(limit).offset(offset);
    
    // Dapatkan total jumlah produk untuk pagination
    const [{ count }] = await db.select({ count: sql`count(*)` }).from(products);
    
    // Dapatkan varian untuk setiap produk
    for (const product of result) {
      const variants = await db
        .select()
        .from(productVariants)
        .where(eq(productVariants.productId, product.id));
      
      product.variants = variants;
    }

    res.json({
      products: result,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(count),
        pages: Math.ceil(parseInt(count) / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Fungsi untuk mendapatkan produk berdasarkan ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, id));

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Dapatkan varian produk
    const variants = await db
      .select()
      .from(productVariants)
      .where(eq(productVariants.productId, product.id));

    product.variants = variants;

    res.json({ product });
  } catch (error) {
    console.error('Get product by ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Fungsi untuk membuat produk baru
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      composition,
      allergens,
      shelfLife,
      image,
      thumbnail,
      isFeatured,
      isActive,
      variants
    } = req.body;

    // Validasi input
    if (!name) {
      return res.status(400).json({ error: 'Product name is required' });
    }

    // Buat slug dari nama produk
    const slug = name.toLowerCase().replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-');

    // Cek apakah slug sudah ada
    const [existingProduct] = await db
      .select()
      .from(products)
      .where(eq(products.slug, slug));

    let uniqueSlug = slug;
    let counter = 1;
    while (existingProduct) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
      const [checkProduct] = await db
        .select()
        .from(products)
        .where(eq(products.slug, uniqueSlug));
      if (!checkProduct) break;
    }

    // Buat produk
    const [newProduct] = await db
      .insert(products)
      .values({
        name,
        slug: uniqueSlug,
        description,
        composition,
        allergens,
        shelfLife,
        image,
        thumbnail,
        isFeatured: isFeatured || false,
        isActive: isActive || true,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();

    // Buat varian produk jika ada
    if (variants && Array.isArray(variants) && variants.length > 0) {
      const variantsData = variants.map(variant => ({
        productId: newProduct.id,
        name: variant.name,
        sku: variant.sku,
        price: variant.price,
        stock: variant.stock || 0,
        weight: variant.weight,
        dimensions: variant.dimensions,
        image: variant.image,
        isActive: variant.isActive !== undefined ? variant.isActive : true,
        createdAt: new Date(),
        updatedAt: new Date()
      }));

      await db.insert(productVariants).values(variantsData);
    }

    // Catat ke audit log
    await db.insert(auditLogs).values({
      table: 'products',
      recordId: newProduct.id,
      action: 'CREATE',
      newValues: JSON.stringify(newProduct),
      changedBy: req.user.name,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      createdAt: new Date()
    });

    res.status(201).json({
      message: 'Product created successfully',
      product: newProduct
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Fungsi untuk memperbarui produk
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      composition,
      allergens,
      shelfLife,
      image,
      thumbnail,
      isFeatured,
      isActive
    } = req.body;

    // Cek apakah produk ada
    const [existingProduct] = await db
      .select()
      .from(products)
      .where(eq(products.id, id));

    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Update produk
    const [updatedProduct] = await db
      .update(products)
      .set({
        name,
        description,
        composition,
        allergens,
        shelfLife,
        image,
        thumbnail,
        isFeatured,
        isActive,
        updatedAt: new Date()
      })
      .where(eq(products.id, id))
      .returning();

    // Catat ke audit log
    await db.insert(auditLogs).values({
      table: 'products',
      recordId: updatedProduct.id,
      action: 'UPDATE',
      oldValues: JSON.stringify(existingProduct),
      newValues: JSON.stringify(updatedProduct),
      changedBy: req.user.name,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      createdAt: new Date()
    });

    res.json({
      message: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Fungsi untuk menghapus produk
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, id));

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Hapus terlebih dahulu varian produk
    await db
      .delete(productVariants)
      .where(eq(productVariants.productId, id));

    // Baru hapus produk
    await db
      .delete(products)
      .where(eq(products.id, id));

    // Catat ke audit log
    await db.insert(auditLogs).values({
      table: 'products',
      recordId: product.id,
      action: 'DELETE',
      oldValues: JSON.stringify(product),
      changedBy: req.user.name,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      createdAt: new Date()
    });

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Fungsi untuk mendapatkan semua promosi
export const getPromos = async (req, res) => {
  try {
    const promosList = await db
      .select()
      .from(promos)
      .orderBy(desc(promos.createdAt));

    res.json({ promos: promosList });
  } catch (error) {
    console.error('Get promos error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Fungsi untuk membuat promosi
export const createPromo = async (req, res) => {
  try {
    const {
      code,
      name,
      description,
      type,
      value,
      minOrderValue,
      maxDiscountValue,
      isActive,
      startDate,
      endDate
    } = req.body;

    // Validasi input
    if (!code || !name || !type) {
      return res.status(400).json({ error: 'Code, name, and type are required' });
    }

    // Cek apakah kode promosi sudah ada
    const [existingPromo] = await db
      .select()
      .from(promos)
      .where(eq(promos.code, code));

    if (existingPromo) {
      return res.status(409).json({ error: 'Promo code already exists' });
    }

    // Buat promosi
    const [newPromo] = await db
      .insert(promos)
      .values({
        code,
        name,
        description,
        type,
        value,
        minOrderValue,
        maxDiscountValue,
        isActive: isActive !== undefined ? isActive : true,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();

    // Catat ke audit log
    await db.insert(auditLogs).values({
      table: 'promos',
      recordId: newPromo.id,
      action: 'CREATE',
      newValues: JSON.stringify(newPromo),
      changedBy: req.user.name,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      createdAt: new Date()
    });

    res.status(201).json({
      message: 'Promo created successfully',
      promo: newPromo
    });
  } catch (error) {
    console.error('Create promo error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Fungsi untuk mendapatkan semua blog posts
export const getBlogPosts = async (req, res) => {
  try {
    const blogPostsList = await db
      .select()
      .from(blogPosts)
      .orderBy(desc(blogPosts.createdAt));

    res.json({ blogPosts: blogPostsList });
  } catch (error) {
    console.error('Get blog posts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Fungsi untuk membuat blog post
export const createBlogPost = async (req, res) => {
  try {
    const {
      title,
      content,
      excerpt,
      featuredImage,
      isPublished,
      author,
      metaTitle,
      metaDescription
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    // Buat slug dari judul
    const slug = title.toLowerCase().replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-');

    // Cek apakah slug sudah ada
    const [existingPost] = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.slug, slug));

    let uniqueSlug = slug;
    let counter = 1;
    while (existingPost) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
      const [checkPost] = await db
        .select()
        .from(blogPosts)
        .where(eq(blogPosts.slug, uniqueSlug));
      if (!checkPost) break;
    }

    // Buat blog post
    const [newPost] = await db
      .insert(blogPosts)
      .values({
        title,
        slug: uniqueSlug,
        content,
        excerpt,
        featuredImage,
        isPublished: isPublished || false,
        author: author || 'Admin',
        metaTitle,
        metaDescription,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();

    // Catat ke audit log
    await db.insert(auditLogs).values({
      table: 'blog_posts',
      recordId: newPost.id,
      action: 'CREATE',
      newValues: JSON.stringify(newPost),
      changedBy: req.user.name,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      createdAt: new Date()
    });

    res.status(201).json({
      message: 'Blog post created successfully',
      blogPost: newPost
    });
  } catch (error) {
    console.error('Create blog post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Fungsi untuk mendapatkan semua banner
export const getBanners = async (req, res) => {
  try {
    const bannersList = await db
      .select()
      .from(banners)
      .orderBy(asc(banners.position));

    res.json({ banners: bannersList });
  } catch (error) {
    console.error('Get banners error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Fungsi untuk mendapatkan semua testimonial
export const getTestimonials = async (req, res) => {
  try {
    const testimonialsList = await db
      .select()
      .from(testimonials)
      .orderBy(desc(testimonials.createdAt));

    res.json({ testimonials: testimonialsList });
  } catch (error) {
    console.error('Get testimonials error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Fungsi untuk mendapatkan ringkasan dashboard
export const getDashboardSummary = async (req, res) => {
  try {
    // Hitung jumlah produk
    const [{ productCount }] = await db.select({ productCount: sql`count(*)` }).from(products);
    
    // Hitung jumlah produk aktif
    const [{ activeProductCount }] = await db
      .select({ activeProductCount: sql`count(*)` })
      .from(products)
      .where(eq(products.isActive, true));
      
    // Hitung jumlah varian
    const [{ variantCount }] = await db.select({ variantCount: sql`count(*)` }).from(productVariants);
    
    // Hitung jumlah promosi aktif
    const [{ activePromoCount }] = await db
      .select({ activePromoCount: sql`count(*)` })
      .from(promos)
      .where(eq(promos.isActive, true));

    // Hitung jumlah blog post
    const [{ blogPostCount }] = await db.select({ blogPostCount: sql`count(*)` }).from(blogPosts);
    
    // Hitung jumlah blog post yang dipublikasikan
    const [{ publishedBlogPostCount }] = await db
      .select({ publishedBlogPostCount: sql`count(*)` })
      .from(blogPosts)
      .where(eq(blogPosts.isPublished, true));

    // Dapatkan 5 produk terbaru
    const latestProducts = await db
      .select({
        id: products.id,
        name: products.name,
        createdAt: products.createdAt
      })
      .from(products)
      .orderBy(desc(products.createdAt))
      .limit(5);

    // Dapatkan 5 blog post terbaru
    const latestBlogPosts = await db
      .select({
        id: blogPosts.id,
        title: blogPosts.title,
        createdAt: blogPosts.createdAt
      })
      .from(blogPosts)
      .orderBy(desc(blogPosts.createdAt))
      .limit(5);

    res.json({
      summary: {
        totalProducts: parseInt(productCount),
        activeProducts: parseInt(activeProductCount),
        totalVariants: parseInt(variantCount),
        activePromos: parseInt(activePromoCount),
        totalBlogPosts: parseInt(blogPostCount),
        publishedBlogPosts: parseInt(publishedBlogPostCount),
        latestProducts,
        latestBlogPosts
      }
    });
  } catch (error) {
    console.error('Get dashboard summary error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};