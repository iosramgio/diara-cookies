import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import './PromoForm.css';

const PromoForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(!!id);
  
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    type: 'percentage', // percentage, nominal, free_shipping
    value: '',
    minOrderValue: '',
    maxDiscountValue: '',
    isActive: true,
    startDate: '',
    endDate: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditing) {
      loadPromoData();
    }
  }, [id, isEditing]);

  const loadPromoData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/promos/${id}`, {
        withCredentials: true
      });
      
      setFormData(response.data.promo);
    } catch (err) {
      setError('Gagal memuat data promosi');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Konversi nilai ke tipe data yang sesuai
    const submitData = {
      ...formData,
      value: formData.type !== 'free_shipping' ? parseFloat(formData.value) : null,
      minOrderValue: formData.minOrderValue ? parseFloat(formData.minOrderValue) : null,
      maxDiscountValue: formData.maxDiscountValue ? parseFloat(formData.maxDiscountValue) : null
    };

    try {
      if (isEditing) {
        await axios.put(`${API_BASE_URL}/admin/promos/${id}`, submitData, {
          withCredentials: true
        });
      } else {
        await axios.post(`${API_BASE_URL}/admin/promos`, submitData, {
          withCredentials: true
        });
      }
      
      navigate('/admin/promos');
    } catch (err) {
      setError(err.response?.data?.error || (isEditing ? 'Gagal memperbarui promosi' : 'Gagal menambah promosi'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="promo-form">
      <div className="container">
        <div className="page-header">
          <h1>{isEditing ? 'Edit Promosi' : 'Tambah Promosi Baru'}</h1>
          <Link to="/admin/promos" className="btn-back">Kembali ke Daftar</Link>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="promo-form-content">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="code">Kode Promosi *</label>
              <input
                type="text"
                id="code"
                name="code"
                value={formData.code}
                onChange={handleChange}
                required
                placeholder="Contoh: DISKON10"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="name">Nama Promosi *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Contoh: Diskon 10%"
              />
            </div>
            
            <div className="form-group full-width">
              <label htmlFor="description">Deskripsi</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="type">Tipe Promosi *</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <option value="percentage">Persentase</option>
                <option value="nominal">Nominal</option>
                <option value="free_shipping">Gratis Ongkir</option>
              </select>
            </div>
            
            {formData.type !== 'free_shipping' && (
              <>
                <div className="form-group">
                  <label htmlFor="value">
                    {formData.type === 'percentage' ? 'Nilai Persentase (%)' : 'Nilai Nominal (Rp)'}
                  </label>
                  <input
                    type="number"
                    id="value"
                    name="value"
                    value={formData.value}
                    onChange={handleChange}
                    step={formData.type === 'percentage' ? '0.01' : '1'}
                    min="0"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="minOrderValue">Minimal Pembelian (Rp)</label>
                  <input
                    type="number"
                    id="minOrderValue"
                    name="minOrderValue"
                    value={formData.minOrderValue}
                    onChange={handleChange}
                    min="0"
                  />
                </div>
                
                {formData.type === 'percentage' && (
                  <div className="form-group">
                    <label htmlFor="maxDiscountValue">Maksimal Potongan (Rp)</label>
                    <input
                      type="number"
                      id="maxDiscountValue"
                      name="maxDiscountValue"
                      value={formData.maxDiscountValue}
                      onChange={handleChange}
                      min="0"
                    />
                  </div>
                )}
              </>
            )}
            
            <div className="form-group">
              <label htmlFor="startDate">Tanggal Mulai *</label>
              <input
                type="datetime-local"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="endDate">Tanggal Berakhir *</label>
              <input
                type="datetime-local"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="form-check-group">
            <label>
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
              />
              Aktif
            </label>
          </div>
          
          <div className="form-actions">
            <button type="submit" disabled={loading} className="btn-submit">
              {loading ? 'Menyimpan...' : (isEditing ? 'Perbarui Promosi' : 'Simpan Promosi')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PromoForm;