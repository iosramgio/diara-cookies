import express from 'express';
import multer from 'multer';
import { 
  importBankRecon,
  getImportPreview,
  applyAutoMatches,
  getBankReconImports
} from '../controllers/bankReconController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
const router = express.Router();

// Konfigurasi multer untuk upload file CSV
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Pastikan direktori uploads/ ada
  },
  filename: (req, file, cb) => {
    // Buat nama file unik
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'bank-recon-' + uniqueSuffix + '.csv');
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    // Hanya izinkan file CSV
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'), false);
    }
  }
});

// Semua route ini memerlukan otentikasi admin
router.use(authenticateToken);
router.use(requireAdmin);

// Routes untuk rekonsiliasi pembayaran
router.post('/import', upload.single('csvFile'), importBankRecon);
router.get('/imports', getBankReconImports);
router.get('/import/:importId/preview', getImportPreview);
router.post('/import/:importId/apply', applyAutoMatches);

export default router;