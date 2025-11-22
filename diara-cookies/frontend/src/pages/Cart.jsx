import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
  // Mock data keranjang (akan diambil dari API atau state management di implementasi nyata)
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      productId: 1,
      variantId: 1,
      productName: 'Cookies Coklat',
      variantName: 'Kecil (10 pcs)',
      price: 45000,
      quantity: 2,
      image: 'https://via.placeholder.com/100x100',
      subtotal: 90000
    },
    {
      id: 2,
      productId: 2,
      variantId: 5,
      productName: 'Cookies Kacang',
      variantName: 'Sedang (20 pcs)',
      price: 75000,
      quantity: 1,
      image: 'https://via.placeholder.com/100x100',
      subtotal: 75000
    }
  ]);

  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);

  // Fungsi untuk mengupdate kuantitas
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === id 
          ? { 
              ...item, 
              quantity: newQuantity,
              subtotal: item.price * newQuantity
            } 
          : item
      )
    );
  };

  // Fungsi untuk menghapus item dari keranjang
  const removeItem = (id) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  // Hitung total
  const subtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
  const shippingFee = 0; // Dalam implementasi nyata, ini akan dihitung berdasarkan alamat dan berat
  const total = subtotal - promoDiscount + shippingFee;

  // Fungsi untuk menerapkan kode promosi
  const applyPromo = (e) => {
    e.preventDefault();
    // Dalam implementasi nyata, ini akan memanggil API untuk memvalidasi kode promosi
    if (promoCode.toLowerCase() === 'diskon10') {
      setPromoDiscount(Math.round(subtotal * 0.1)); // Diskon 10%
      alert('Kode promosi berhasil diterapkan!');
    } else {
      alert('Kode promosi tidak valid');
    }
  };

  return (
    <div className="cart">
      <div className="container">
        <h1>Keranjang Belanja</h1>
        
        {cartItems.length > 0 ? (
          <div className="cart-content">
            <div className="cart-items">
              <h2>Produk dalam Keranjang</h2>
              {cartItems.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="item-image">
                    <img src={item.image} alt={item.productName} />
                  </div>
                  <div className="item-details">
                    <h3>{item.productName}</h3>
                    <p className="variant">{item.variantName}</p>
                    <p className="price">Rp {parseInt(item.price).toLocaleString()}</p>
                  </div>
                  <div className="item-quantity">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="quantity-btn"
                    >
                      -
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="quantity-btn"
                    >
                      +
                    </button>
                  </div>
                  <div className="item-subtotal">
                    <p className="subtotal">Rp {parseInt(item.subtotal).toLocaleString()}</p>
                  </div>
                  <div className="item-actions">
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="remove-btn"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="cart-summary">
              <h2>Ringkasan Belanja</h2>
              
              <div className="summary-item">
                <span>Subtotal</span>
                <span>Rp {parseInt(subtotal).toLocaleString()}</span>
              </div>
              
              {promoDiscount > 0 && (
                <div className="summary-item discount">
                  <span>Potongan Promo</span>
                  <span>- Rp {parseInt(promoDiscount).toLocaleString()}</span>
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
              
              <form onSubmit={applyPromo} className="promo-form">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Masukkan kode promosi"
                />
                <button type="submit" className="btn-primary">Terapkan</button>
              </form>
              
              <Link to="/checkout" className="btn-primary checkout-btn">
                Checkout
              </Link>
            </div>
          </div>
        ) : (
          <div className="empty-cart">
            <p>Keranjang belanja Anda kosong</p>
            <Link to="/products" className="btn-primary">Lihat Produk</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;