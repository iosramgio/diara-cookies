import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './OrderStatus.css';

const OrderStatus = () => {
  const { orderId } = useParams();
  
  // Simulasi data pesanan (akan diambil dari API di implementasi nyata)
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Simulasi pengambilan data dari API
    const fetchOrder = async () => {
      try {
        // Simulasi delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Data pesanan mock
        const mockOrder = {
          id: orderId,
          orderNumber: 'ORD-1234567890',
          paymentStatus: 'paid', // 'unpaid', 'paid'
          orderStatus: 'Processing', // 'PendingPayment', 'Paid', 'Processing', 'Shipped', 'ReadyForPickup', 'Completed', 'Cancelled'
          grandTotal: '165000',
          payableAmount: '165123',
          paymentCode: 123,
          bankAccountLabel: 'BCA 1234567890 a.n. Diara Cookies',
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 jam dari sekarang
          paidAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 jam yang lalu
          createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 jam yang lalu
          customerData: {
            name: 'John Doe',
            email: 'john@example.com',
            phone: '081234567890',
            shippingAddress: 'Jl. Contoh No. 123, Kota Contoh, Provinsi Contoh'
          },
          items: [
            {
              id: 1,
              productName: 'Cookies Coklat',
              variantName: 'Kecil (10 pcs)',
              price: '45000',
              quantity: 2,
              lineTotal: '90000'
            },
            {
              id: 2,
              productName: 'Cookies Kacang',
              variantName: 'Sedang (20 pcs)',
              price: '75000',
              quantity: 1,
              lineTotal: '75000'
            }
          ]
        };
        
        setOrder(mockOrder);
      } catch (err) {
        setError('Gagal memuat informasi pesanan');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrder();
  }, [orderId]);
  
  if (loading) {
    return (
      <div className="order-status loading">
        <div className="container">
          <p>Memuat informasi pesanan...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="order-status error">
        <div className="container">
          <p>{error}</p>
        </div>
      </div>
    );
  }
  
  if (!order) {
    return (
      <div className="order-status not-found">
        <div className="container">
          <p>Pesanan tidak ditemukan</p>
        </div>
      </div>
    );
  }
  
  // Warna status
  const statusColors = {
    PendingPayment: '#ffc107',
    Paid: '#28a745',
    Processing: '#17a2b8',
    Shipped: '#007bff',
    ReadyForPickup: '#6f42c1',
    Completed: '#28a745',
    Cancelled: '#dc3545'
  };
  
  return (
    <div className="order-status">
      <div className="container">
        <h1>Status Pesanan</h1>
        
        <div className="order-details">
          <div className="order-header">
            <div className="order-info">
              <p><strong>Nomor Order:</strong> {order.orderNumber}</p>
              <p><strong>Tanggal Pemesanan:</strong> {new Date(order.createdAt).toLocaleString('id-ID')}</p>
            </div>
            <div className="order-status-badge" style={{ backgroundColor: statusColors[order.orderStatus] }}>
              {order.orderStatus}
            </div>
          </div>
          
          <div className="order-payment-info">
            <h2>Informasi Pembayaran</h2>
            <div className="payment-detail">
              <p><strong>Status Pembayaran:</strong> 
                <span className={`payment-status ${order.paymentStatus}`}>
                  {order.paymentStatus === 'paid' ? 'Lunas' : 'Belum Dibayar'}
                </span>
              </p>
              
              {order.paidAt && (
                <p><strong>Tanggal Pembayaran:</strong> {new Date(order.paidAt).toLocaleString('id-ID')}</p>
              )}
              
              <p><strong>Total yang Dibayar:</strong> Rp {parseInt(order.payableAmount).toLocaleString()}</p>
              <p><strong>Rekening Tujuan:</strong> {order.bankAccountLabel}</p>
              
              {order.paymentStatus !== 'paid' && (
                <div className="payment-reminder">
                  <p>Segera lakukan pembayaran sebelum:</p>
                  <p className="expires-at">{new Date(order.expiresAt).toLocaleString('id-ID')}</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="order-items">
            <h2>Daftar Produk</h2>
            <div className="items-list">
              {order.items.map(item => (
                <div key={item.id} className="item-row">
                  <div className="item-info">
                    <h4>{item.productName}</h4>
                    <p>{item.variantName}</p>
                  </div>
                  <div className="item-qty">
                    Qty: {item.quantity}
                  </div>
                  <div className="item-price">
                    Rp {parseInt(item.price).toLocaleString()}
                  </div>
                  <div className="item-total">
                    Rp {parseInt(item.lineTotal).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
            <div className="order-total">
              <div className="total-row">
                <span>Subtotal</span>
                <span>Rp {parseInt(order.grandTotal).toLocaleString()}</span>
              </div>
              <div className="total-row final">
                <span>Total</span>
                <span>Rp {parseInt(order.grandTotal).toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          <div className="customer-info">
            <h2>Informasi Pelanggan</h2>
            <div className="info-grid">
              <div className="info-item">
                <label>Nama</label>
                <p>{order.customerData.name}</p>
              </div>
              <div className="info-item">
                <label>Email</label>
                <p>{order.customerData.email}</p>
              </div>
              <div className="info-item">
                <label>Telepon</label>
                <p>{order.customerData.phone}</p>
              </div>
              <div className="info-item full-width">
                <label>Alamat Pengiriman</label>
                <p>{order.customerData.shippingAddress}</p>
              </div>
            </div>
          </div>
          
          <div className="order-actions">
            {order.orderStatus !== 'Completed' && order.orderStatus !== 'Cancelled' && (
              <a 
                href={`https://wa.me/${import.meta.env.VITE_WA_NUMBER || '6281234567890'}?text=Halo, saya ingin menanyakan status pesanan ${order.orderNumber}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-whatsapp"
              >
                <span>💬</span> Hubungi Kami
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderStatus;