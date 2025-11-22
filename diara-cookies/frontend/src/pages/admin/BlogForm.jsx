import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import './BlogForm.css';

const BlogForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(!!id);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    featuredImage: '',
    isPublished: false,
    author: '',
    metaTitle: '',
    metaDescription: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditing) {
      loadBlogData();
    }
  }, [id, isEditing]);

  const loadBlogData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/blog-posts/${id}`, {
        withCredentials: true
      });
      
      setFormData(response.data.blogPost);
    } catch (err) {
      setError('Gagal memuat data blog');
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

    try {
      if (isEditing) {
        await axios.put(`${API_BASE_URL}/admin/blog-posts/${id}`, formData, {
          withCredentials: true
        });
      } else {
        await axios.post(`${API_BASE_URL}/admin/blog-posts`, formData, {
          withCredentials: true
        });
      }
      
      navigate('/admin/blog');
    } catch (err) {
      setError(err.response?.data?.error || (isEditing ? 'Gagal memperbarui blog' : 'Gagal menambah blog'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="blog-form">
      <div className="container">
        <div className="page-header">
          <h1>{isEditing ? 'Edit Blog Post' : 'Tambah Blog Post Baru'}</h1>
          <Link to="/admin/blog" className="btn-back">Kembali ke Daftar</Link>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="blog-form-content">
          <div className="form-grid">
            <div className="form-group full-width">
              <label htmlFor="title">Judul *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group full-width">
              <label htmlFor="content">Konten *</label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                rows="12"
              />
            </div>
            
            <div className="form-group full-width">
              <label htmlFor="excerpt">Kutipan</label>
              <textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                rows="3"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="featuredImage">URL Gambar Utama</label>
              <input
                type="text"
                id="featuredImage"
                name="featuredImage"
                value={formData.featuredImage}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="author">Penulis</label>
              <input
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group full-width">
              <label htmlFor="metaTitle">Meta Title (SEO)</label>
              <input
                type="text"
                id="metaTitle"
                name="metaTitle"
                value={formData.metaTitle}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group full-width">
              <label htmlFor="metaDescription">Meta Description (SEO)</label>
              <textarea
                id="metaDescription"
                name="metaDescription"
                value={formData.metaDescription}
                onChange={handleChange}
                rows="3"
              />
            </div>
          </div>
          
          <div className="form-check-group">
            <label>
              <input
                type="checkbox"
                name="isPublished"
                checked={formData.isPublished}
                onChange={handleChange}
              />
              Publikasikan Blog
            </label>
          </div>
          
          <div className="form-actions">
            <button type="submit" disabled={loading} className="btn-submit">
              {loading ? 'Menyimpan...' : (isEditing ? 'Perbarui Blog' : 'Simpan Blog')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogForm;