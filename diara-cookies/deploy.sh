# Deployment Script untuk Diara Cookies

# 1. Build aplikasi frontend
cd ../frontend
npm run build

# 2. Pindahkan build ke direktori publik backend (atau siapkan untuk deployment terpisah)
# Dalam implementasi nyata, Anda mungkin ingin menyajikan frontend dari CDN atau server statis
# atau menggunakan strategi SSR/SSG

# 3. Install dependensi backend untuk produksi
cd ../backend
npm ci --only=production

# 4. Lakukan migrasi database jika ada
# npx drizzle-kit migrate

# 5. Jalankan aplikasi
# pm2 start src/index.js --name "diara-cookies"