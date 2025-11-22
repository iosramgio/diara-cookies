import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { adminLogout } from '../../services/adminAuth';

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = async () => {
    try {
      await adminLogout();
      // Redirect ke halaman login
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Definisikan menu admin
  const adminMenu = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/admin/products', label: 'Produk', icon: '📦' },
    { path: '/admin/orders', label: 'Pesanan', icon: '🛍️' },
    { path: '/admin/blog', label: 'Blog', icon: '✍️' },
    { path: '/admin/promos', label: 'Promosi', icon: '🏷️' },
    { path: '/admin/settings', label: 'Pengaturan', icon: '⚙️' }
  ];

  return (
    <div className="admin-layout flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`
        fixed lg:relative z-50 h-full bg-gradient-to-b from-gray-800 to-gray-900 text-white
        w-64 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
      `}>
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold flex items-center">
            <span className="mr-2">🍪</span>
            Admin Panel
          </h2>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {adminMenu.map((item) => (
              <li key={item.path}>
                <Link 
                  to={item.path}
                  className={`
                    flex items-center p-3 rounded-lg transition-all duration-300
                    ${isActive(item.path) 
                      ? 'bg-primary-600 text-white shadow-md' 
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }
                  `}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Overlay untuk mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <button 
                className="lg:hidden mr-4 p-2 rounded-md text-gray-700 hover:bg-gray-100"
                onClick={toggleSidebar}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-xl font-semibold text-gray-800">
                {location.pathname.split('/').pop().charAt(0).toUpperCase() + location.pathname.split('/').pop().slice(1)}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="hidden md:block text-gray-700">Selamat Datang, Admin</span>
              <button 
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-all duration-300"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;