import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import './AuthPages.css';

const Login = () => {
  const { login, user } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setError('');

    // Validasi sederhana
    if (!formData.email || !formData.password) {
      setError('Email dan password wajib diisi');
      setIsLoggingIn(false);
      return;
    }

    try {
      // Login sekali saja - backend akan menentukan role pengguna
      const result = await login(formData.email, formData.password);

      if (result.success && result.user) {
        if (result.user.role === 'admin') {
          // Jika admin, arahkan ke dashboard admin
          navigate('/admin/dashboard');
        } else {
          // Jika customer, arahkan ke halaman utama
          navigate('/');
        }
      }
    } catch (err) {
      setError(err.message || 'Login gagal. Email atau password salah.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Jika sudah login, redirect berdasarkan role
  if (user) {
    if (user.role === 'admin') {
      navigate('/admin/dashboard', { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>Masuk ke Akun</h1>
          <p>Masukkan email dan password Anda</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="contoh@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="btn-login" disabled={isLoggingIn}>
            {isLoggingIn ? 'Masuk...' : 'Masuk'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Belum punya akun? <Link to="/register">Daftar di sini</Link></p>
          <p><Link to="/">Kembali ke beranda</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;