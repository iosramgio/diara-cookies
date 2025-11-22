import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  
  // Data keranjang (akan diambil dari API atau state management di implementasi nyata)
  const [cartItems] = useState([
    {
      id: 1,
      productName: 'Cookies Coklat',
      variantName: 'Kecil (10 pcs)',
      price: 45000,
      quantity: 2,
      subtotal: 90000
    },
    {
      id: 2,
      productName: 'Cookies Kacang',
      variantName: 'Sedang (20 pcs)',
      price: 75000,
      quantity: 1,
      subtotal: 75000
    }
  ]);
  
  // State form pelanggan
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  
  // State alamat pengiriman
  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    province: '',
    postalCode: ''
  });
  
  // Kode promosi
  const [promoCode, setPromoCode] = useState('');
  
  // Catatan tambahan
  const [note, setNote] = useState('');
  
  // Informasi pesanan (akan diisi setelah checkout berhasil)
  const [orderInfo, setOrderInfo] = useState(null);
  
  // Subtotal, biaya pengiriman, total (akan dihitung berdasarkan data keranjang dan kode promosi)
  const subtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
  const discount = promoCode.toLowerCase() === 'diskon10' ? Math.round(subtotal * 0.1) : 0;
  const shippingFee = 0; // Dalam implementasi nyata, ini akan dihitung berdasarkan alamat
  const total = subtotal - discount + shippingFee;
  
  // Fungsi untuk menangani submit form checkout
  const handleCheckout = async (e) => {
    e.preventDefault();
    
    // Validasi form
    if (!customerData.name || !customerData.email || !customerData.phone) {
      alert('Nama, email, dan nomor telepon wajib diisi');
      return;
    }
    
    if (!shippingAddress.address || !shippingAddress.city || !shippingAddress.province || !shippingAddress.postalCode) {
      alert('Alamat pengiriman lengkap wajib diisi');
      return;
    }
    
    // Simulasi permintaan checkout
    // Dalam implementasi nyata, ini akan mengirim data ke API backend
    try {
      // Generate kode pembayaran unik (sudah dihitung di backend)
      const paymentCode = Math.floor(Math.random() * 900) + 100;
      const payableAmount = total + paymentCode;
      
      // Simulasi data pesanan
      const orderData = {
        orderNumber: `ORD-${Date.now()}`,
        payableAmount: payableAmount,
        paymentCode: paymentCode,
        bankAccountLabel: 'BCA 1234567890 a.n. Diara Cookies',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 jam dari sekarang
        grandTotal: total
      };
      
      setOrderInfo(orderData);
      
      // Di sini Anda akan mengarahkan ke halaman konfirmasi atau menampilkan detail pembayaran
      // navigate(`/order-status/${orderData.id}`);
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Terjadi kesalahan saat checkout, silakan coba lagi');
    }
  };
  
  if (orderInfo) {
    return (
      <div className="checkout success">
        <div className="container">
          <h1>Pesanan Berhasil Dibuat</h1>
          
          <div className="order-success-info">
            <div className="payment-info">
              <h2>Informasi Pembayaran</h2>
              <p><strong>Nomor Order:</strong> {orderInfo.orderNumber}</p>
              <p><strong>Rekening Tujuan:</strong> {orderInfo.bankAccountLabel}</p>
              <p><strong>Jumlah yang Harus Dibayar:</strong></p>
              <p className="payable-amount">Rp {parseInt(orderInfo.payableAmount).toLocaleString()}</p>
              <p className="payment-breakdown">
                (Total Pesanan: Rp {parseInt(orderInfo.grandTotal).toLocaleString()} + Kode Unik: {orderInfo.paymentCode})
              </p>
              <p><strong>Batas Waktu Pembayaran:</strong> {new Date(orderInfo.expiresAt).toLocaleString('id-ID')}</p>
            </div>
            
            <div className="payment-instructions">
              <h3>Langkah-langkah Pembayaran:</h3>
              <ol>
                <li>Transfer jumlah <strong>Rp {parseInt(orderInfo.payableAmount).toLocaleString()}</strong> ke rekening <strong>{orderInfo.bankAccountLabel}</strong></li>
                <li>Lakukan transfer sebelum tanggal <strong>{new Date(orderInfo.expiresAt).toLocaleString('id-ID')}</strong></li>
                <li>Admin akan memverifikasi pembayaran, dan status pesanan akan diperbarui setelah pembayaran dikonfirmasi</li>
              </ol>
            </div>
            
            <div className="whatsapp-cta">
              <p>Butuh bantuan? Hubungi kami melalui WhatsApp:</p>
              <a 
                href={`https://wa.me/${import.meta.env.VITE_WA_NUMBER || '6281234567890'}?text=Halo, saya baru saja melakukan pemesanan dengan nomor order ${orderInfo.orderNumber}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-whatsapp"
              >
                <span>💬</span> Chat WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="checkout">
      <div className="container">
        <h1>Checkout</h1>
        
        <div className="checkout-content">
          <div className="checkout-form">
            <form onSubmit={handleCheckout}>
              <div className="form-section">
                <h2>Informasi Pelanggan</h2>
                <div className="form-group">
                  <label htmlFor="name">Nama Lengkap *</label>
                  <input
                    type="text"
                    id="name"
                    value={customerData.name}
                    onChange={(e) => setCustomerData({...customerData, name: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    value={customerData.email}
                    onChange={(e) => setCustomerData({...customerData, email: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="phone">Nomor Telepon *</label>
                  <input
                    type="tel"
                    id="phone"
                    value={customerData.phone}
                    onChange={(e) => setCustomerData({...customerData, phone: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="form-section">
                <h2>Alamat Pengiriman</h2>
                <div className="form-group">
                  <label htmlFor="address">Alamat Lengkap *</label>
                  <textarea
                    id="address"
                    value={shippingAddress.address}
                    onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city">Kota/Kabupaten *</label>
                    <input
                      type="text"
                      id="city"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="province">Provinsi *</label>
                    <input
                      type="text"
                      id="province"
                      value={shippingAddress.province}
                      onChange={(e) => setShippingAddress({...shippingAddress, province: e.target.value})}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="postalCode">Kode Pos *</label>
                    <input
                      type="text"
                      id="postalCode"
                      value={shippingAddress.postalCode}
                      onChange={(e) => setShippingAddress({...shippingAddress, postalCode: e.target.value})}
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="form-section">
                <h2>Promo & Catatan</h2>
                <div className="form-group">
                  <label htmlFor="promo">Kode Promo</label>
                  <input
                    type="text"
                    id="promo"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Masukkan kode promosi jika ada"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="note">Catatan Tambahan</label>
                  <textarea
                    id="note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Catatan tambahan untuk pesanan Anda"
                  />
                </div>
              </div>
              
              <button type="submit" className="btn-primary checkout-btn">
                Proses Checkout
              </button>
            </form>
          </div>
          
          <div className="checkout-summary">
            <h2>Ringkasan Pesanan</h2>
            
            <div className="order-items">
              {cartItems.map(item => (
                <div key={item.id} className="order-item">
                  <div className="item-info">
                    <h4>{item.productName}</h4>
                    <p>{item.variantName}</p>
                    <p>Qty: {item.quantity}</p>
                  </div>
                  <div className="item-price">
                    Rp {parseInt(item.subtotal).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="order-summary">
              <div className="summary-item">
                <span>Subtotal</span>
                <span>Rp {parseInt(subtotal).toLocaleString()}</span>
              </div>
              
              {discount > 0 && (
                <div className="summary-item discount">
                  <span>Diskon</span>
                  <span>- Rp {parseInt(discount).toLocaleString()}</span>
                </div>
              )}
              
              <div className="summary-item">
                <span>Biaya Pengiriman</span>
                <span>Rp {parseInt(shippingFee).toLocaleString()}</span>
              </div>
              
              <div className="summary-total">
                <span>Total</span>
                <span>Rp {parseInt(total).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;