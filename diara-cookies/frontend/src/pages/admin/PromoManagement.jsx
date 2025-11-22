import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import './PromoManagement.css';

const PromoManagement = () => {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPromos();
  }, []);

  const fetchPromos = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/promos`, {
        withCredentials: true
      });
      
      setPromos(response.data.promos);
      setLoading(false);
    } catch (err) {
      setError('Gagal memuat promosi');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="promo-management loading">
        <div className="container">
          <p>Memuat promosi...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="promo-management error">
        <div className="container">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="promo-management">
      <div className="container">
        <div className="page-header">
          <h1>Manajemen Promosi</h1>
          <Link to="/admin/promos/new" className="btn-primary">
            Tambah Promosi Baru
          </Link>
        </div>
        
        <div className="promos-table">
          <table>
            <thead>
              <tr>
                <th>Kode</th>
                <th>Nama</th>
                <th>Tipe</th>
                <th>Nilai</th>
                <th>Status</th>
                <th>Berlaku</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {promos.length > 0 ? (
                promos.map(promo => (
                  <tr key={promo.id}>
                    <td><strong>{promo.code}</strong></td>
                    <td>{promo.name}</td>
                    <td>
                      <span className={`type ${promo.type}`}>
                        {promo.type === 'percentage' ? 'Persentase' : 
                         promo.type === 'nominal' ? 'Nominal' : 
                         promo.type === 'free_shipping' ? 'Gratis Ongkir' : promo.type}
                      </span>
                    </td>
                    <td>
                      {promo.type === 'percentage' ? 
                        `${promo.value}%` : 
                        `Rp ${parseInt(promo.value).toLocaleString()}`}
                    </td>
                    <td>
                      <span className={`status ${promo.isActive ? 'active' : 'inactive'}`}>
                        {promo.isActive ? 'Aktif' : 'Tidak Aktif'}
                      </span>
                    </td>
                    <td>
                      {new Date(promo.startDate).toLocaleDateString('id-ID')} - 
                      {new Date(promo.endDate).toLocaleDateString('id-ID')}
                    </td>
                    <td>
                      <Link to={`/admin/promos/edit/${promo.id}`} className="btn-edit">
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">Tidak ada promosi ditemukan</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PromoManagement;