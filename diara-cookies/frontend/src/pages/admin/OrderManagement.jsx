import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import './OrderManagement.css';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

  const fetchOrders = async () => {
    try {
      let url = `${API_BASE_URL}/orders`;
      if (filterStatus !== 'all') {
        url += `?status=${filterStatus}`;
      }
      
      const response = await axios.get(url, {
        withCredentials: true
      });
      
      setOrders(response.data.orders);
      setLoading(false);
    } catch (err) {
      setError('Gagal memuat pesanan');
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.patch(`${API_BASE_URL}/orders/${orderId}/status`, {
        status: newStatus
      }, {
        withCredentials: true
      });
      
      // Refresh data
      fetchOrders();
    } catch (err) {
      setError('Gagal memperbarui status pesanan');
    }
  };

  const markAsPaid = async (orderId) => {
    try {
      await axios.patch(`${API_BASE_URL}/orders/${orderId}/mark-paid`, {}, {
        withCredentials: true
      });
      
      // Refresh data
      fetchOrders();
    } catch (err) {
      setError('Gagal memperbarui status pembayaran');
    }
  };

  if (loading) {
    return (
      <div className="order-management loading">
        <div className="container">
          <p>Memuat pesanan...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-management error">
        <div className="container">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="order-management">
      <div className="container">
        <div className="page-header">
          <h1>Manajemen Pesanan</h1>
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="status-filter"
          >
            <option value="all">Semua Status</option>
            <option value="PendingPayment">Menunggu Pembayaran</option>
            <option value="Paid">Sudah Dibayar</option>
            <option value="Processing">Diproses</option>
            <option value="Shipped">Dikirim</option>
            <option value="ReadyForPickup">Siap Diambil</option>
            <option value="Completed">Selesai</option>
            <option value="Cancelled">Dibatalkan</option>
          </select>
        </div>
        
        <div className="orders-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nomor Order</th>
                <th>Nama Pelanggan</th>
                <th>Total</th>
                <th>Status Pembayaran</th>
                <th>Status Pesanan</th>
                <th>Dibuat</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map(order => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.orderNumber}</td>
                    <td>{order.customerData.name}</td>
                    <td>Rp {parseInt(order.grandTotal).toLocaleString()}</td>
                    <td>
                      <span className={`status payment ${order.paymentStatus}`}>
                        {order.paymentStatus === 'paid' ? 'Lunas' : 'Belum Dibayar'}
                      </span>
                    </td>
                    <td>
                      <span className={`status order ${order.orderStatus.toLowerCase()}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString('id-ID')}</td>
                    <td>
                      <div className="action-buttons">
                        {order.paymentStatus !== 'paid' && (
                          <button 
                            onClick={() => markAsPaid(order.id)}
                            className="btn-mark-paid"
                          >
                            Tandai Lunas
                          </button>
                        )}
                        <select
                          value={order.orderStatus}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="status-dropdown"
                        >
                          <option value="PendingPayment">Menunggu Pembayaran</option>
                          <option value="Paid">Sudah Dibayar</option>
                          <option value="Processing">Diproses</option>
                          <option value="Shipped">Dikirim</option>
                          <option value="ReadyForPickup">Siap Diambil</option>
                          <option value="Completed">Selesai</option>
                          <option value="Cancelled">Dibatalkan</option>
                        </select>
                        <Link to={`/admin/orders/${order.id}`} className="btn-view">
                          Lihat
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8">Tidak ada pesanan ditemukan</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;