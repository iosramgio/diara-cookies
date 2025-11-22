import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import './BlogManagement.css';

const BlogManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/blog-posts`, {
        withCredentials: true
      });
      
      setBlogs(response.data.blogPosts);
      setLoading(false);
    } catch (err) {
      setError('Gagal memuat blog posts');
      setLoading(false);
    }
  };

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="blog-management loading">
        <div className="container">
          <p>Memuat blog posts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="blog-management error">
        <div className="container">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-management">
      <div className="container">
        <div className="page-header">
          <h1>Manajemen Blog</h1>
          <Link to="/admin/blog/new" className="btn-primary">
            Tambah Blog Baru
          </Link>
        </div>
        
        <div className="search-bar">
          <input
            type="text"
            placeholder="Cari blog..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="blogs-table">
          <table>
            <thead>
              <tr>
                <th>Judul</th>
                <th>Slug</th>
                <th>Dipublikasi</th>
                <th>Dibuat</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredBlogs.length > 0 ? (
                filteredBlogs.map(blog => (
                  <tr key={blog.id}>
                    <td>
                      <div className="blog-title">
                        <strong>{blog.title}</strong>
                        <br />
                        <small>{blog.excerpt || 'No excerpt'}</small>
                      </div>
                    </td>
                    <td>{blog.slug}</td>
                    <td>
                      <span className={`status ${blog.isPublished ? 'published' : 'draft'}`}>
                        {blog.isPublished ? 'Terpublikasi' : 'Draft'}
                      </span>
                    </td>
                    <td>{new Date(blog.createdAt).toLocaleDateString('id-ID')}</td>
                    <td>
                      <Link to={`/admin/blog/edit/${blog.id}`} className="btn-edit">
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">Tidak ada blog ditemukan</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BlogManagement;