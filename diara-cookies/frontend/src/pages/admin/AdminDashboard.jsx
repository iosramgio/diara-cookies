import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../config';

const AdminDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardSummary();
  }, []);

  const fetchDashboardSummary = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/dashboard-summary`, {
        withCredentials: true
      });

      setSummary(response.data.summary);
      setLoading(false);
    } catch (err) {
      setError('Gagal memuat ringkasan dashboard');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard loading p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat data dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard error p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <div className="text-red-500 text-2xl mb-2">⚠️</div>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard Admin</h1>
          <p className="text-gray-600 mt-2">Statistik dan ringkasan aktivitas terbaru</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <h3 className="text-gray-600 text-sm font-medium mb-1">Total Produk</h3>
            <p className="text-3xl font-bold text-gray-800">{summary?.totalProducts || 0}</p>
            <Link 
              to="/admin/products" 
              className="text-blue-600 hover:text-blue-800 font-medium mt-2 inline-block text-sm hover:underline"
            >
              Lihat Produk
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <h3 className="text-gray-600 text-sm font-medium mb-1">Produk Aktif</h3>
            <p className="text-3xl font-bold text-gray-800">{summary?.activeProducts || 0}</p>
            <Link 
              to="/admin/products" 
              className="text-green-600 hover:text-green-800 font-medium mt-2 inline-block text-sm hover:underline"
            >
              Lihat Produk
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
            <h3 className="text-gray-600 text-sm font-medium mb-1">Blog Posts</h3>
            <p className="text-3xl font-bold text-gray-800">{summary?.totalBlogPosts || 0}</p>
            <Link 
              to="/admin/blog" 
              className="text-purple-600 hover:text-purple-800 font-medium mt-2 inline-block text-sm hover:underline"
            >
              Lihat Blog
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
            <h3 className="text-gray-600 text-sm font-medium mb-1">Blog Terpublikasi</h3>
            <p className="text-3xl font-bold text-gray-800">{summary?.publishedBlogPosts || 0}</p>
            <Link 
              to="/admin/blog" 
              className="text-yellow-600 hover:text-yellow-800 font-medium mt-2 inline-block text-sm hover:underline"
            >
              Lihat Blog
            </Link>
          </div>
        </div>

        {/* Recent Items */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">📦</span> Produk Terbaru
            </h2>
            <div className="space-y-4">
              {summary?.latestProducts && summary.latestProducts.length > 0 ? (
                summary.latestProducts.map(product => (
                  <div key={product.id} className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                    <div className="ml-4 flex-1">
                      <h4 className="font-medium text-gray-800">{product.name}</h4>
                      <p className="text-sm text-gray-600">
                        Dibuat: {new Date(product.createdAt).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 py-4 text-center">Tidak ada produk baru</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">✍️</span> Blog Terbaru
            </h2>
            <div className="space-y-4">
              {summary?.latestBlogPosts && summary.latestBlogPosts.length > 0 ? (
                summary.latestBlogPosts.map(post => (
                  <div key={post.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    <h4 className="font-medium text-gray-800">{post.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Dibuat: {new Date(post.createdAt).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 py-4 text-center">Tidak ada blog baru</p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">⚡</span> Tindakan Cepat
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link 
              to="/admin/products/new" 
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-6 text-center font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Tambah Produk Baru
            </Link>
            <Link 
              to="/admin/blog/new" 
              className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-6 text-center font-medium hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Tambah Blog Baru
            </Link>
            <Link 
              to="/admin/promos" 
              className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-6 text-center font-medium hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Kelola Promosi
            </Link>
            <Link 
              to="/admin/orders" 
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg p-6 text-center font-medium hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Lihat Pesanan
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;