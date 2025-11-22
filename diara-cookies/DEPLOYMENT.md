# Deployment Diara Cookies

## Prasyarat

- Docker dan Docker Compose
- PostgreSQL (jika tidak menggunakan Docker)
- Node.js dan npm

## Deployment dengan Docker (Direkomendasikan)

1. Pastikan Anda telah mengisi konfigurasi yang diperlukan di `docker-compose.yml`, terutama:
   - Password database
   - JWT secret
   - Informasi lainnya

2. Jalankan perintah berikut di direktori utama proyek:
   ```bash
   docker-compose up -d
   ```

3. Aplikasi akan tersedia di `http://localhost:3000`

## Deployment Manual

### Backend
1. Masuk ke direktori backend:
   ```bash
   cd backend
   ```

2. Install dependensi:
   ```bash
   npm install
   ```

3. Buat file `.env` berdasarkan `.env.example` dan isi dengan konfigurasi yang sesuai

4. Jalankan migrasi database:
   ```bash
   npx drizzle-kit push:pg
   ```

5. Jalankan aplikasi:
   ```bash
   npm start
   ```

### Frontend
1. Masuk ke direktori frontend:
   ```bash
   cd frontend
   ```

2. Install dependensi:
   ```bash
   npm install
   ```

3. Build aplikasi:
   ```bash
   npm run build
   ```

## Backup Database

### Manual
Jalankan perintah berikut di direktori backend:
```bash
npm run backup
```

### Otomatis
Dalam lingkungan produksi, Anda dapat mengatur cron job untuk menjalankan backup secara otomatis:

```bash
# Contoh: Backup setiap hari pukul 02:00
0 2 * * * cd /path/to/backend && npm run backup
```

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

## Konfigurasi Produksi

Pastikan variabel lingkungan berikut telah diatur dengan benar:
- `NODE_ENV=production`
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- `JWT_SECRET` (gunakan string acak yang kuat)
- `STORE_BANK_INFO`
- `WA_NUMBER`

## Monitoring dan Logging

Untuk produksi, pertimbangkan untuk menambahkan:
- Sistem logging (misalnya dengan Winston)
- Monitoring kinerja (misalnya dengan PM2 atau APM tools)
- Notifikasi kesalahan (misalnya dengan Sentry)