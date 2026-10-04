Diara Cookies - Penerapan Pemasaran Digital & Optimalisasi Company Profile pada UMKM
Aplikasi ini dibangun dengan stack PERN (PostgreSQL, Express, React, Node.js) dengan Drizzle ORM.

Prasyarat
Sebelum menjalankan aplikasi ini, pastikan Anda telah menginstal:

Node.js (v18 atau lebih baru)
PostgreSQL
Git
Instalasi dan Konfigurasi
1. Clone Repository
git clone <url-repositori-anda>
cd diara-cookies
2. Konfigurasi Database
Pastikan PostgreSQL sedang berjalan di sistem Anda
Buat database baru bernama diara_cookies
Sesuaikan konfigurasi di file .env jika diperlukan
3. Instalasi Backend
cd backend
npm install
4. Instalasi Frontend
cd frontend
npm install
Menjalankan Aplikasi
1. Jalankan Backend
cd backend
npm run dev
Backend akan berjalan di http://localhost:3000

2. Jalankan Frontend
Dalam terminal baru:

cd frontend
npm run dev
Frontend akan berjalan di http://localhost:5173

Migrasi Database
Sebelum menjalankan aplikasi untuk pertama kali, jalankan migrasi database:

cd backend
npx drizzle-kit push
Namun, perlu dicatat bahwa perintah ini hanya akan berhasil jika:

PostgreSQL sedang berjalan di sistem Anda
Database diara_cookies telah dibuat
Kredensial database di file .env benar
Jika Anda mendapatkan error seperti "The server does not support SSL connections", kemungkinan besar PostgreSQL tidak sedang berjalan atau tidak terinstal di sistem Anda.

Struktur Proyek
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
Fitur Utama
Frontend:

Company profile dengan hero, USP, alamat, kontak
Katalog produk dengan varian, deskripsi, komposisi, alergen
Keranjang belanja dan checkout
Sistem pembayaran manual dengan kode unik
WhatsApp CTA
Backend:

Autentikasi admin dengan JWT dan cookie HTTP-only
CRUD produk dan varian
Manajemen pesanan
Sistem pembayaran manual
Mini-CMS untuk produk, blog, banner, testimoni
Rekonsiliasi mutasi bank (CSV import)
Deployment
Lihat file DEPLOYMENT.md untuk instruksi deployment lengkap.

Backup Database
Lihat file BACKUP.md untuk instruksi backup database.
