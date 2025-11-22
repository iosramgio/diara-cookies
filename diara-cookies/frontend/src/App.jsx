import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import ProductCatalog from './pages/ProductCatalog';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderStatus from './pages/OrderStatus';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProductManagement from './pages/admin/ProductManagement';
import ProductForm from './pages/admin/ProductForm';
import OrderManagement from './pages/admin/OrderManagement';
import BlogManagement from './pages/admin/BlogManagement';
import BlogForm from './pages/admin/BlogForm';
import PromoManagement from './pages/admin/PromoManagement';
import PromoForm from './pages/admin/PromoForm';
import AdminLayout from './components/admin/AdminLayout';
import AdminRoute from './components/admin/AdminRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Rute publik */}
            <Route path="/" element={
              <Layout>
                <Home />
              </Layout>
            } />
            <Route path="/products" element={
              <Layout>
                <ProductCatalog />
              </Layout>
            } />
            <Route path="/products/:slug" element={
              <Layout>
                <ProductDetail />
              </Layout>
            } />
            <Route path="/cart" element={
              <Layout>
                <Cart />
              </Layout>
            } />
            <Route path="/checkout" element={
              <Layout>
                <Checkout />
              </Layout>
            } />
            <Route path="/order-status/:orderId" element={
              <Layout>
                <OrderStatus />
              </Layout>
            } />
            <Route path="/login" element={
              <Layout>
                <Login />
              </Layout>
            } />
            <Route path="/register" element={
              <Layout>
                <Register />
              </Layout>
            } />

            {/* Rute admin - hanya satu login page yang digunakan */}
            <Route path="/admin" element={
              <AdminRoute>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </AdminRoute>
            } />
            <Route path="/admin/dashboard" element={
              <AdminRoute>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </AdminRoute>
            } />
            <Route path="/admin/products" element={
              <AdminRoute>
                <AdminLayout>
                  <ProductManagement />
                </AdminLayout>
              </AdminRoute>
            } />
            <Route path="/admin/products/new" element={
              <AdminRoute>
                <AdminLayout>
                  <ProductForm />
                </AdminLayout>
              </AdminRoute>
            } />
            <Route path="/admin/products/edit/:id" element={
              <AdminRoute>
                <AdminLayout>
                  <ProductForm />
                </AdminLayout>
              </AdminRoute>
            } />
            <Route path="/admin/orders" element={
              <AdminRoute>
                <AdminLayout>
                  <OrderManagement />
                </AdminLayout>
              </AdminRoute>
            } />
            <Route path="/admin/blog" element={
              <AdminRoute>
                <AdminLayout>
                  <BlogManagement />
                </AdminLayout>
              </AdminRoute>
            } />
            <Route path="/admin/blog/new" element={
              <AdminRoute>
                <AdminLayout>
                  <BlogForm />
                </AdminLayout>
              </AdminRoute>
            } />
            <Route path="/admin/blog/edit/:id" element={
              <AdminRoute>
                <AdminLayout>
                  <BlogForm />
                </AdminLayout>
              </AdminRoute>
            } />
            <Route path="/admin/promos" element={
              <AdminRoute>
                <AdminLayout>
                  <PromoManagement />
                </AdminLayout>
              </AdminRoute>
            } />
            <Route path="/admin/promos/new" element={
              <AdminRoute>
                <AdminLayout>
                  <PromoForm />
                </AdminLayout>
              </AdminRoute>
            } />
            <Route path="/admin/promos/edit/:id" element={
              <AdminRoute>
                <AdminLayout>
                  <PromoForm />
                </AdminLayout>
              </AdminRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
