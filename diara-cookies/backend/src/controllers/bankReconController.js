import { db } from '../db/connection.js';
import { 
  bankReconImports, 
  bankReconRows, 
  orders,
  orderItems
} from '../db/schema.js';
import { eq, and, sql, asc, desc } from 'drizzle-orm';
import csv from 'csv-parser';
import { createReadStream } from 'fs';
import { v4 as uuidv4 } from 'uuid';

// Fungsi untuk mengimpor file CSV mutasi bank
export const importBankRecon = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'CSV file is required' });
    }

    // Buat entri impor baru
    const [importRecord] = await db
      .insert(bankReconImports)
      .values({
        fileName: req.file.originalname,
        importedBy: req.user.name,
        totalRows: 0, // Akan diperbarui setelah parsing selesai
        importDate: new Date(),
        status: 'Processing'
      })
      .returning();

    const importId = importRecord.id;
    const filePath = req.file.path;
    const rows = [];

    // Parsing file CSV
    return new Promise((resolve, reject) => {
      createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
          // Format CSV yang diharapkan: Tanggal, Waktu, Keterangan, Jumlah
          // Sesuaikan dengan format CSV bank Anda
          const txnTime = new Date(`${row.Tanggal} ${row.Waktu || '00:00:00'}`);
          const amount = parseFloat(row.Jumlah?.toString().replace(/[^\d.-]/g, '')) || 0;
          
          rows.push({
            importId,
            txnTime,
            amount: Math.abs(amount).toString(), // Ambil nilai mutlak
            description: row.Keterangan || '',
            createdAt: new Date()
          });
        })
        .on('end', async () => {
          try {
            // Simpan semua baris ke database
            if (rows.length > 0) {
              await db.insert(bankReconRows).values(rows);
            }

            // Update jumlah baris di entri impor
            await db
              .update(bankReconImports)
              .set({ 
                totalRows: rows.length,
                status: 'Completed'
              })
              .where(eq(bankReconImports.id, importId));

            res.json({
              message: 'Bank reconciliation data imported successfully',
              importId,
              totalRows: rows.length
            });

            resolve();
          } catch (error) {
            console.error('Error saving bank recon data:', error);
            
            // Update status menjadi error
            await db
              .update(bankReconImports)
              .set({ status: 'Error', notes: error.message })
              .where(eq(bankReconImports.id, importId));
              
            reject(error);
          }
        })
        .on('error', (error) => {
          console.error('Error parsing CSV:', error);
          
          // Update status menjadi error
          db.update(bankReconImports)
            .set({ status: 'Error', notes: error.message })
            .where(eq(bankReconImports.id, importId));
            
          reject(error);
        });
    });
  } catch (error) {
    console.error('Import bank reconciliation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Fungsi untuk mendapatkan pratinjau hasil impor
export const getImportPreview = async (req, res) => {
  try {
    const { importId } = req.params;

    // Dapatkan informasi impor
    const [importInfo] = await db
      .select()
      .from(bankReconImports)
      .where(eq(bankReconImports.id, importId));

    if (!importInfo) {
      return res.status(404).json({ error: 'Import record not found' });
    }

    // Dapatkan baris mutasi yang belum cocok
    const unmatchedRows = await db
      .select()
      .from(bankReconRows)
      .where(and(
        eq(bankReconRows.importId, importId),
        sql`${bankReconRows.matchStatus} = 'Unmatched'`
      ))
      .orderBy(asc(bankReconRows.txnTime));

    // Coba cocokkan dengan pesanan yang belum dibayar
    const unprocessedOrders = await db
      .select({
        id: orders.id,
        orderNumber: orders.orderNumber,
        payableAmount: orders.payableAmount,
        expiresAt: orders.expiresAt,
        createdAt: orders.createdAt
      })
      .from(orders)
      .where(and(
        sql`${orders.paymentStatus} = 'unpaid'`,
        sql`${orders.orderStatus} = 'PendingPayment'`,
        sql`${orders.expiresAt} > NOW()` // Tidak termasuk yang sudah kadaluarsa
      ));

    // Cari potensi kecocokan
    const potentialMatches = [];
    for (const row of unmatchedRows) {
      const amount = parseFloat(row.amount);
      
      for (const order of unprocessedOrders) {
        const orderAmount = parseFloat(order.payableAmount);
        const timeDiff = Math.abs(new Date(row.txnTime).getTime() - new Date(order.createdAt).getTime());
        // Cek apakah jumlah cocok dan waktu pembuatan pesanan sekitar waktu transaksi (dalam 48 jam)
        if (Math.abs(amount - orderAmount) < 0.01 && timeDiff < 48 * 60 * 60 * 1000) {
          potentialMatches.push({
            rowId: row.id,
            orderId: order.id,
            orderNumber: order.orderNumber,
            txnTime: row.txnTime,
            amount: row.amount,
            description: row.description,
            payableAmount: order.payableAmount,
            potentialMatch: true
          });
        }
      }
    }

    res.json({
      importInfo,
      unmatchedRows,
      potentialMatches,
      totalUnmatched: unmatchedRows.length
    });
  } catch (error) {
    console.error('Get import preview error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Fungsi untuk menerapkan kecocokan secara otomatis
export const applyAutoMatches = async (req, res) => {
  try {
    const { importId } = req.params;

    // Dapatkan baris mutasi yang belum dicocokkan
    const unmatchedRows = await db
      .select({
        id: bankReconRows.id,
        txnTime: bankReconRows.txnTime,
        amount: bankReconRows.amount
      })
      .from(bankReconRows)
      .where(and(
        eq(bankReconRows.importId, importId),
        sql`${bankReconRows.matchStatus} = 'Unmatched'`
      ));

    let matchedCount = 0;

    // Cocokkan dengan pesanan yang belum dibayar
    for (const row of unmatchedRows) {
      const amount = parseFloat(row.amount);
      
      // Cari pesanan dengan jumlah pembayaran yang cocok dan belum kadaluarsa
      const [order] = await db
        .select({
          id: orders.id,
          payableAmount: orders.payableAmount,
          expiresAt: orders.expiresAt,
          createdAt: orders.createdAt
        })
        .from(orders)
        .where(and(
          sql`${orders.paymentStatus} = 'unpaid'`,
          sql`${orders.orderStatus} = 'PendingPayment'`,
          sql`${orders.expiresAt} > NOW()`,
          sql`ABS(CAST(${orders.payableAmount} AS DECIMAL) - ${amount}) < 0.01` // Jumlah cocok
        ));

      if (order) {
        const timeDiff = Math.abs(new Date(row.txnTime).getTime() - new Date(order.createdAt).getTime());
        // Cek apakah waktu transaksi dalam rentang waktu yang masuk akal (misalnya 48 jam)
        if (timeDiff < 48 * 60 * 60 * 1000) {
          // Update status baris rekonsiliasi
          await db
            .update(bankReconRows)
            .set({
              matchedOrderId: order.id,
              matchStatus: 'Auto'
            })
            .where(eq(bankReconRows.id, row.id));

          // Update status pesanan
          await db
            .update(orders)
            .set({
              paymentStatus: 'paid',
              orderStatus: 'Paid',
              paidAt: new Date(),
              updatedAt: new Date()
            })
            .where(eq(orders.id, order.id));

          matchedCount++;
        }
      }
    }

    res.json({
      message: `Auto-matching completed. ${matchedCount} orders matched.`,
      matchedCount
    });
  } catch (error) {
    console.error('Apply auto matches error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Fungsi untuk mendapatkan semua impor rekonsiliasi
export const getBankReconImports = async (req, res) => {
  try {
    const imports = await db
      .select()
      .from(bankReconImports)
      .orderBy(desc(bankReconImports.importDate));

    res.json({ imports });
  } catch (error) {
    console.error('Get bank recon imports error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};