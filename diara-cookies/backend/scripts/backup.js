const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Konfigurasi backup
const config = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || '5432',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'diara_cookies',
  backupDir: './backups',
};

// Buat direktori backup jika belum ada
if (!fs.existsSync(config.backupDir)) {
  fs.mkdirSync(config.backupDir, { recursive: true });
}

// Nama file backup dengan timestamp
const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
const filename = `diara_cookies_backup_${timestamp}.sql`;
const filepath = path.join(config.backupDir, filename);

// Perintah pg_dump untuk membuat backup
const command = `pg_dump -h ${config.host} -p ${config.port} -U ${config.user} -d ${config.database} > ${filepath}`;

// Set password ke environment
process.env.PGPASSWORD = config.password;

console.log(`Memulai backup database ke ${filepath}...`);

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  
  if (stderr) {
    console.error(`Stderr: ${stderr}`);
    return;
  }
  
  console.log(`Backup berhasil disimpan di ${filepath}`);
  
  // Hapus backup yang lebih lama dari 7 hari
  cleanupOldBackups();
});

// Fungsi untuk membersihkan backup lama
function cleanupOldBackups() {
  const files = fs.readdirSync(config.backupDir);
  const now = Date.now();
  const oneWeek = 7 * 24 * 60 * 60 * 1000; // 7 hari dalam milidetik
  
  files.forEach(file => {
    const filepath = path.join(config.backupDir, file);
    const stat = fs.statSync(filepath);
    const fileAge = now - stat.mtime.getTime();
    
    if (fileAge > oneWeek) {
      fs.unlinkSync(filepath);
      console.log(`Backup lama dihapus: ${file}`);
    }
  });
}