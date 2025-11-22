import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import './ProductForm.css';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(!!id);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    composition: '',
    allergens: '',
    shelfLife: '',
    image: '',
    thumbnail: '',
    isFeatured: false,
    isActive: true,
    variants: []
  });
  
  const [newVariant, setNewVariant] = useState({
    name: '',
    sku: '',
    price: '',
    stock: 0,
    weight: '',
    dimensions: '',
    image: '',
    isActive: true
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditing) {
      loadProductData();
    }
  }, [id, isEditing]);

  const loadProductData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/products/${id}`, {
        withCredentials: true
      });
      
      setFormData(response.data.product);
    } catch (err) {
      setError('Gagal memuat data produk');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleVariantChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewVariant({
      ...newVariant,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const addVariant = () => {
    if (!newVariant.name || !newVariant.sku || !newVariant.price) {
      alert('Nama, SKU, dan harga varian wajib diisi');
      return;
    }
    
    setFormData({
      ...formData,
      variants: [...formData.variants, { ...newVariant, price: parseFloat(newVariant.price), stock: parseInt(newVariant.stock) || 0 }]
    });
    
    setNewVariant({
      name: '',
      sku: '',
      price: '',
      stock: 0,
      weight: '',
      dimensions: '',
      image: '',
      isActive: true
    });
  };

  const removeVariant = (index) => {
    setFormData({
      ...formData,
      variants: formData.variants.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isEditing) {
        await axios.put(`${API_BASE_URL}/admin/products/${id}`, formData, {
          withCredentials: true
        });
      } else {
        await axios.post(`${API_BASE_URL}/admin/products`, formData, {
          withCredentials: true
        });
      }
      
      navigate('/admin/products');
    } catch (err) {
      setError(err.response?.data?.error || (isEditing ? 'Gagal memperbarui produk' : 'Gagal menambah produk'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-form">
      <div className="container">
        <div className="page-header">
          <h1>{isEditing ? 'Edit Produk' : 'Tambah Produk Baru'}</h1>
          <Link to="/admin/products" className="btn-back">Kembali ke Daftar</Link>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="product-form-content">
          <div className="form-section">
            <h2>Informasi Produk</h2>
            
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name">Nama Produk *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="slug">Slug</label>
                <input
                  type="text"
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group full-width">
                <label htmlFor="description">Deskripsi</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="composition">Komposisi</label>
                <input
                  type="text"
                  id="composition"
                  name="composition"
                  value={formData.composition}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="allergens">Alergen</label>
                <input
                  type="text"
                  id="allergens"
                  name="allergens"
                  value={formData.allergens}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="shelfLife">Masa Simpan</label>
                <input
                  type="text"
                  id="shelfLife"
                  name="shelfLife"
                  value={formData.shelfLife}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="image">URL Gambar</label>
                <input
                  type="text"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="thumbnail">URL Thumbnail</label>
                <input
                  type="text"
                  id="thumbnail"
                  name="thumbnail"
                  value={formData.thumbnail}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="form-check-group">
              <label>
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                />
                Produk Unggulan
              </label>
              
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
          </div>
          
          <div className="form-section">
            <h2>Varian Produk</h2>
            
            <div className="variant-form">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="variantName">Nama Varian *</label>
                  <input
                    type="text"
                    id="variantName"
                    name="name"
                    value={newVariant.name}
                    onChange={handleVariantChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="sku">SKU *</label>
                  <input
                    type="text"
                    id="sku"
                    name="sku"
                    value={newVariant.sku}
                    onChange={handleVariantChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="price">Harga *</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={newVariant.price}
                    onChange={handleVariantChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="stock">Stok</label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    value={newVariant.stock}
                    onChange={handleVariantChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="weight">Berat (gram)</label>
                  <input
                    type="number"
                    step="0.01"
                    id="weight"
                    name="weight"
                    value={newVariant.weight}
                    onChange={handleVariantChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="variantImage">URL Gambar Varian</label>
                  <input
                    type="text"
                    id="variantImage"
                    name="image"
                    value={newVariant.image}
                    onChange={handleVariantChange}
                  />
                </div>
              </div>
              
              <div className="form-check-group">
                <label>
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={newVariant.isActive}
                    onChange={handleVariantChange}
                  />
                  Aktif
                </label>
              </div>
              
              <button type="button" onClick={addVariant} className="btn-add-variant">
                Tambah Varian
              </button>
            </div>
            
            {formData.variants && formData.variants.length > 0 && (
              <div className="variants-list">
                <h3>Daftar Varian</h3>
                <div className="variants-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Nama</th>
                        <th>SKU</th>
                        <th>Harga</th>
                        <th>Stok</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.variants.map((variant, index) => (
                        <tr key={index}>
                          <td>{variant.name}</td>
                          <td>{variant.sku}</td>
                          <td>Rp {parseInt(variant.price).toLocaleString()}</td>
                          <td>{variant.stock}</td>
                          <td>
                            <button 
                              type="button" 
                              onClick={() => removeVariant(index)}
                              className="btn-remove"
                            >
                              Hapus
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
          
          <div className="form-actions">
            <button type="submit" disabled={loading} className="btn-submit">
              {loading ? 'Menyimpan...' : (isEditing ? 'Perbarui Produk' : 'Simpan Produk')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;