# Diara Cookies - Penerapan Pemasaran Digital & Optimalisasi Company Profile pada UMKM

Aplikasi ini dibangun dengan stack PERN (PostgreSQL, Express, React, Node.js) dengan Drizzle ORM.

## Prasyarat

Sebelum menjalankan aplikasi ini, pastikan Anda telah menginstal:

- Node.js (v18 atau lebih baru)
- PostgreSQL
- Git

## Instalasi dan Konfigurasi

### 1. Clone Repository

```bash
git clone <url-repositori-anda>
cd diara-cookies
```

### 2. Konfigurasi Database

1. Pastikan PostgreSQL sedang berjalan di sistem Anda
2. Buat database baru bernama `diara_cookies`
3. Sesuaikan konfigurasi di file `.env` jika diperlukan

### 3. Instalasi Backend

```bash
cd backend
npm install
```

### 4. Instalasi Frontend

```bash
cd frontend
npm install
```

## Menjalankan Aplikasi

### 1. Jalankan Backend

```bash
cd backend
npm run dev
```

Backend akan berjalan di `http://localhost:3000`

### 2. Jalankan Frontend

Dalam terminal baru:

```bash
cd frontend
npm run dev
```

Frontend akan berjalan di `http://localhost:5173`

## Migrasi Database

Sebelum menjalankan aplikasi untuk pertama kali, jalankan migrasi database:

```bash
cd backend
npx drizzle-kit push
```

Namun, perlu dicatat bahwa perintah ini hanya akan berhasil jika:
1. PostgreSQL sedang berjalan di sistem Anda
2. Database `diara_cookies` telah dibuat
3. Kredensial database di file `.env` benar

Jika Anda mendapatkan error seperti "The server does not support SSL connections", kemungkinan besar PostgreSQL tidak sedang berjalan atau tidak terinstal di sistem Anda.

## Struktur Proyek

```
diara-cookies/
├── backend/              # Server API
│   ├── src/
│   │   ├── controllers/  # Logika bisnis
│   │   ├── routes/       # Definisi endpoint
│   │   ├── db/           # Konfigurasi database
│   │   └── middleware/   # Middleware
│   ├── scripts/          # Skrip tambahan
│   └── tests/            # File pengujian
├── frontend/             # Aplikasi React
│   ├── src/
│   │   ├── components/   # Komponen UI
│   │   ├── pages/        # Halaman aplikasi
│   │   └── services/     # Layanan frontend
├── Dockerfile           # Definisi container Docker
├── docker-compose.yml   # Konfigurasi multi-container
└── deploy.sh            # Skrip deployment
```

## Fitur Utama

- **Frontend**:
  - Company profile dengan hero, USP, alamat, kontak
  - Katalog produk dengan varian, deskripsi, komposisi, alergen
  - Keranjang belanja dan checkout
  - Sistem pembayaran manual dengan kode unik
  - WhatsApp CTA

- **Backend**:
  - Autentikasi admin dengan JWT dan cookie HTTP-only
  - CRUD produk dan varian
  - Manajemen pesanan
  - Sistem pembayaran manual
  - Mini-CMS untuk produk, blog, banner, testimoni
  - Rekonsiliasi mutasi bank (CSV import)

## Deployment

Lihat file `DEPLOYMENT.md` untuk instruksi deployment lengkap.

## Backup Database

Lihat file `BACKUP.md` untuk instruksi backup database.