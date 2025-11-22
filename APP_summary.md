Siap. Berikut **penjelasan final** aplikasi “Penerapan Pemasaran Digital & Optimalisasi Company Profile pada UMKM ‘Diara Cookies’” berbasis **PERN + Drizzle**, dengan 2 peran (**Customer** & **Admin**), **checkout tanpa payment gateway**, **tanpa unggah bukti**, dan **tanpa pihak ketiga memegang dana**.

# 1) Tujuan & Cakupan

- **Tujuan bisnis:** memperluas jangkauan pasar (B2C & B2B hampers), membangun kepercayaan merek, dan mengonversi kunjungan menjadi pesanan—tanpa ketergantungan gateway pembayaran.
- **Cakupan MVP:** company profile, katalog + varian, promo, blog/SEO, checkout manual (transfer), validasi pembayaran oleh admin, WA CTA, dashboard ringkas, dan mini-CMS.

# 2) Peran & Fitur Inti

## Customer

- **Company Profile**: hero + USP, alamat/jam, kontak, (opsional) sertifikasi ditampilkan belakangan.
- **Katalog & Varian**: kategori, detail komposisi/alergen/shelf-life, label promo (diskon nominal/persen, gratis ongkir).
- **Keranjang & Checkout**: isi alamat, ringkasan biaya, **nomor rekening toko**, **nominal unik** (grand total + _payment code_ 3 digit), batas waktu bayar (mis. 24 jam).
- **Tanpa unggah bukti**: setelah transfer, pelanggan cukup menunggu verifikasi admin. (Opsional: form **konfirmasi ringan**—bank asal, nominal, waktu—bukan bukti).
- **WhatsApp CTA**: tombol pre-filled (produk/nominal/order#) untuk konsultasi/penawaran cepat.

## Admin

- **Dashboard**: visit, CTR WA, jumlah order per status, top produk/artikel.
- **Mini-CMS**: CRUD produk, varian, blog, banner/promo, testimoni, halaman statis; media manager; **audit log**.
- **Order Ops**: daftar `PendingPayment`, **Mark as Paid**/**Cancel**, atur status (`Processing → Shipped/ReadyForPickup → Completed`), cetak invoice.
- **Lead Pipeline**: sumber dari **order PendingPayment** dan **WA Inquiry** (konversi manual ke lead). Tahap: New → Qualified → Follow-up → Won/Lost.
- **Pemasaran**: UTM generator, penjadwalan banner, GA4 + Meta Pixel.

# 3) Alur Akhir ke Akhir

1. Pengunjung masuk ke **Home** → melihat produk unggulan, testimoni, artikel → klik **Lihat Katalog** atau **Chat WA**.
2. Di **Katalog/Detail**, pilih varian → **Tambah ke Keranjang** → **Checkout**.
3. Sistem menampilkan: **rekening toko**, **nominal unik (payable_amount = total + payment_code)**, **batas waktu**.
4. Customer melakukan **transfer langsung ke rekening**.
5. **Admin memverifikasi** via mutasi bank (manual) atau **semi-otomatis** (impor CSV mutasi → _auto-match_ nominal unik & waktu → approve batch).
6. Status order berpindah: `PendingPayment → Paid → Processing → (Shipped/ReadyForPickup) → Completed`.

> **Tanpa pihak ketiga mengelola dana**: tidak ada Midtrans/Xendit/PayPal; seluruh arus kas terjadi langsung ke rekening toko.

# 4) Mekanisme Pembayaran (Tanpa Gateway, Tanpa Bukti)

- **Payment Code (3 digit)** ditambahkan ke total agar **nominal transfer tiap order unik** → memudahkan pencocokan mutasi.
- **Konfirmasi ringan (opsional)**: bank asal, waktu, nominal, 4–6 digit referensi—untuk membantu pencarian, **bukan bukti**.
- **Auto-Cancel**: job akan membatalkan `PendingPayment` yang melewati `expires_at`.

# 5) Arsitektur Teknis

- **Frontend**: React + Vite. **SSR/SSG ringan** untuk halaman publik (SEO), **CSR** untuk Admin. Form: React Hook Form + Zod; data: React Query.
- **Backend**: Node.js + Express (monolit menyajikan SSR + API). Validasi Zod/Joi, cookie **HTTP-only JWT** untuk Admin, CORS & rate-limit (auth, orders).
- **Database**: PostgreSQL + **Drizzle ORM & Drizzle Kit** (migrasi versi, rollback). Indeks: `slug`, `created_at`, `payable_amount`, `expires_at`, `utm_*`.
- **Infra & Operasional**: satu deploy (tidak dipisah FE/BE); ENV terpisah (dev/prod): `DATABASE_URL`, `SMTP_*`, `STORE_BANK_INFO`, `WA_NUMBER`. **Backup DB harian**.

# 6) Skema Data (inti, ringkas)

- `products`, `product_variants`, `promos`, `blog_posts`, `banners`, `testimonials`, `settings`, `media_assets`, `audit_logs`
- **Order**:

  - `orders(id, customer_data…, subtotal, discount_total, shipping_fee, grand_total, payment_code, payable_amount, payment_status['unpaid'|'paid'], order_status, bank_account_label, expires_at, paid_at, timestamps)`
  - `order_items(order_id, product_id, variant_id, price, qty, line_total)`

- **Rekonsiliasi (opsional)**:

  - `whatsapp_inquiries(...)` → sumber lead
  - `bank_recon_imports(...)`, `bank_recon_rows(txn_time, amount, description, matched_order_id, match_status)`

# 7) API Garis Besar

**Publik**

- `GET /products`, `GET /products/:slug`, `GET /blog`, `GET /blog/:slug`, `GET /banners/active`, `GET /testimonials`
- `POST /orders` → buat order `PendingPayment`, hitung **payment_code + payable_amount**, set `expires_at`
- `GET /orders/:id/public?key=` → lihat status order
- (Opsional) `POST /orders/:id/confirm` → konfirmasi ringan

**Admin (JWT cookie)**

- Auth: `POST /auth/login`, `POST /auth/logout`, `GET /auth/me`
- CRUD: produk, varian, blog, banner, testimoni, promos, pages, media
- Orders: `GET /orders?status=`, `PATCH /orders/:id/mark-paid`, `PATCH /orders/:id/cancel`, `PATCH /orders/:id/status`
- Rekonsiliasi CSV: `POST /recon/import`, `GET /recon/:importId/preview`, `POST /recon/:importId/apply`
- Analytics: `GET /analytics/summary?range=30d`
- Settings: `GET/PUT /settings`

# 8) Pemasaran Digital & Analitik

- **SEO**: SSR/SSG, sitemap, robots, canonical, **schema.org (Organization, Product, Article)**, Open Graph & Twitter Card.
- **Konten**: blog terjadwal (musiman: hampers Lebaran/Natal; evergreen: tips penyimpanan kue).
- **Promo**: diskon persen/nominal & gratis ongkir (syarat minimal).
- **UTM**: di CTA WA, banner, dan tautan promosi; tersimpan di DB.
- **Tracking**: GA4 + Meta Pixel + event internal (`page_view`, `product_view`, `add_to_cart`, `checkout_start`, `order_created`, `mark_paid`, `whatsapp_click`).
- **KPI**: CR ke order, %Paid dari PendingPayment, rata-rata waktu verifikasi, CTR WA, kontribusi artikel/promo ke sesi & order.

# 9) Keamanan, Kualitas, Aksesibilitas

- **Admin auth**: JWT + cookie HTTP-only; _brute-force protection_; logout server-side.
- **Validasi & sanitasi**: Zod/Joi, escape input, rate-limit di `POST /orders` & `POST /auth/login`.
- **Gambar**: kompresi, alt text; **lazy-load**; _structured data_.
- **Audit & Logging**: semua perubahan penting (status payment/order, harga, stok) tercatat di `audit_logs`.
- **Testing**: unit (pricing & promo), API (checkout & mark-paid), E2E smoke (home → produk → checkout → mark-paid).

# 10) Roadmap

- **MVP**: live dengan alur manual (payment code, mark-paid), SEO, blog, promo, WA CTA, dashboard ringkas, migrasi Drizzle, backup.
- **Fase 2** (tetap tanpa gateway): impor CSV mutasi & auto-match, A/B test hero/CTA, newsletter, integrasi ongkir, multi-gudang, multi-bahasa/sertifikasi (jika dibutuhkan).

---
