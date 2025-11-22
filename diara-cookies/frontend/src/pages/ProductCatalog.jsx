import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const ProductCatalog = () => {
  // Data produk (akan diambil dari API di implementasi nyata)
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Cookies Coklat',
      slug: 'cookies-coklat',
      image: 'https://placehold.co/400x400/d2691e/ffffff?text=Cookies+Coklat',
      price: '45000',
      description: 'Cookies lembut dengan potongan coklat premium',
      isFeatured: true
    },
    {
      id: 2,
      name: 'Cookies Kacang',
      slug: 'cookies-kacang',
      image: 'https://placehold.co/400x400/d2691e/ffffff?text=Cookies+Kacang',
      price: '40000',
      description: 'Cookies gurih dengan campuran kacang tanah',
      isFeatured: false
    },
    {
      id: 3,
      name: 'Cookies Kering',
      slug: 'cookies-kering',
      image: 'https://placehold.co/400x400/d2691e/ffffff?text=Cookies+Kering',
      price: '35000',
      description: 'Cookies renyah dengan cita rasa klasik',
      isFeatured: true
    },
    {
      id: 4,
      name: 'Cookies Keju',
      slug: 'cookies-keju',
      image: 'https://placehold.co/400x400/d2691e/ffffff?text=Cookies+Keju',
      price: '42000',
      description: 'Cookies gurih dengan rasa keju yang lezat',
      isFeatured: false
    },
    {
      id: 5,
      name: 'Cookies Tiramisu',
      slug: 'cookies-tiramisu',
      image: 'https://placehold.co/400x400/d2691e/ffffff?text=Cookies+Tiramisu',
      price: '50000',
      description: 'Cookies lembut dengan cita rasa tiramisu',
      isFeatured: true
    },
    {
      id: 6,
      name: 'Cookies Kurma',
      slug: 'cookies-kurma',
      image: 'https://placehold.co/400x400/d2691e/ffffff?text=Cookies+Kurma',
      price: '48000',
      description: 'Cookies legit dengan isian kurma pilihan',
      isFeatured: false
    }
  ]);

  // Filter produk
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products);

  // Fungsi untuk filter berdasarkan pencarian
  useEffect(() => {
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  return (
    <div className="product-catalog w-full bg-gray-50 min-h-screen py-16">
      <SEO
        title="Katalog Produk - Diara Cookies"
        description="Lihat berbagai pilihan kue kering premium dari Diara Cookies. Temukan cookies favorit Anda dengan berbagai varian."
        url="https://www.diaracookies.com/products"
        image="https://placehold.co/1200x600/d2691e/ffffff?text=Katalog+Produk"
        keywords="katalog produk, cookies, kue kering, varian cookies"
      />
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Katalog Produk</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Temukan berbagai pilihan cookies premium yang kami sediakan untuk Anda
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari produk..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-full focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 shadow-sm transition-all duration-300"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map(product => (
              <div 
                key={product.id} 
                className="product-card group transition-all duration-500 relative overflow-hidden bg-white rounded-2xl shadow-md hover:shadow-xl"
              >
                {product.isFeatured && (
                  <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-primary-500 to-primary-700 text-white px-4 py-2 rounded-full text-sm font-bold">
                    Unggulan
                  </div>
                )}
                <Link to={`/products/${product.slug}`} className="block">
                  <div className="overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-primary-600 transition-colors duration-300">
                      {product.name}
                    </h3>
                    <p className="text-2xl font-bold text-primary-600 mb-3">Rp {parseInt(product.price).toLocaleString()}</p>
                    <p className="text-gray-600">{product.description}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Produk Tidak Ditemukan</h3>
            <p className="text-gray-600 mb-6">Coba gunakan kata kunci yang berbeda</p>
            <button 
              onClick={() => setSearchTerm('')}
              className="btn-outline px-6 py-3 rounded-lg"
            >
              Reset Pencarian
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCatalog;