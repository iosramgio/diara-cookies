import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const Home = () => {
  // Data produk unggulan (akan diambil dari API di implementasi nyata)
  const [featuredProducts, setFeaturedProducts] = useState([
    {
      id: 1,
      name: 'Cookies Coklat',
      slug: 'cookies-coklat',
      image: 'https://placehold.co/400x400/d2691e/ffffff?text=Cookies+Coklat',
      price: '45000',
      description: 'Cookies lembut dengan potongan coklat premium'
    },
    {
      id: 2,
      name: 'Cookies Kacang',
      slug: 'cookies-kacang',
      image: 'https://placehold.co/400x400/d2691e/ffffff?text=Cookies+Kacang',
      price: '40000',
      description: 'Cookies gurih dengan campuran kacang tanah'
    },
    {
      id: 3,
      name: 'Cookies Kering',
      slug: 'cookies-kering',
      image: 'https://placehold.co/400x400/d2691e/ffffff?text=Cookies+Kering',
      price: '35000',
      description: 'Cookies renyah dengan cita rasa klasik'
    }
  ]);

  // Data testimoni
  const [testimonials] = useState([
    {
      id: 1,
      customerName: 'Siti Aminah',
      content: 'Cookiesnya enak dan tahan lama, cocok untuk oleh-oleh!',
      rating: 5
    },
    {
      id: 2,
      customerName: 'Budi Santoso',
      content: 'Pelayanannya cepat dan rasa cookiesnya juara!',
      rating: 5
    },
    {
      id: 3,
      customerName: 'Ani Lestari',
      content: 'Kemasannya menarik, cocok untuk hadiah.',
      rating: 4
    }
  ]);

  // Data banner (akan diambil dari API di implementasi nyata)
  const [banners] = useState([
    {
      id: 1,
      title: 'Lebaran Spesial',
      subtitle: 'Dapatkan diskon hingga 30% untuk semua produk!',
      imageUrl: 'https://placehold.co/1200x500/d2691e/ffffff?text=Promo+Spesial',
      targetUrl: '/products'
    }
  ]);

  return (
    <div className="home w-full">
      <SEO
        title="Diara Cookies - Kue Kering Premium"
        description="Temukan berbagai pilihan kue kering premium dari Diara Cookies. Cocok untuk oleh-oleh, hampers, dan hadiah spesial."
        url="https://www.diaracookies.com/"
        image="https://placehold.co/1200x600/d2691e/ffffff?text=Diara+Cookies"
        keywords="cookies, kue kering, oleh-oleh, hampers, kue lebaran"
      />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-900 to-primary-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://placehold.co/1200x600/e6d8c0/ffffff?text=Background')] bg-cover bg-center opacity-20"></div>
        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
              Selamat Datang di Diara Cookies
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-primary-100 animate-fade-in">
              Kue kering premium dengan bahan pilihan, cocok untuk segala suasana
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in">
              <Link 
                to="/products" 
                className="btn-primary px-8 py-4 text-lg transition-all duration-300 transform hover:scale-105"
              >
                Lihat Produk
              </Link>
              <a 
                href={`https://wa.me/${import.meta.env.VITE_WA_NUMBER || '6281234567890'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary px-8 py-4 text-lg transition-all duration-300 transform hover:scale-105"
              >
                Chat WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 relative inline-block">
              Produk Unggulan
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-primary-500 to-primary-700 rounded-full"></div>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Temukan berbagai pilihan cookies premium yang kami sediakan untuk Anda
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredProducts.map(product => (
              <div 
                key={product.id} 
                className="product-card group transition-all duration-500"
              >
                <Link to={`/products/${product.slug}`} className="block">
                  <div className="overflow-hidden rounded-lg mb-4">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h3>
                  <p className="text-2xl font-bold text-primary-600 mb-3">Rp {parseInt(product.price).toLocaleString()}</p>
                  <p className="text-gray-600">{product.description}</p>
                </Link>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Link to="/products" className="btn-outline px-6 py-3">
              Lihat Semua Produk
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 relative inline-block">
              Apa Kata Mereka
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-primary-500 to-primary-700 rounded-full"></div>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Pendapat pelanggan kami tentang kualitas dan layanan kami
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map(testimonial => (
              <div 
                key={testimonial.id} 
                className="bg-white p-8 rounded-xl shadow-card hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex justify-center mb-4">
                  <div className="text-2xl">
                    {'★'.repeat(testimonial.rating)}
                    {'☆'.repeat(5 - testimonial.rating)}
                  </div>
                </div>
                <p className="text-gray-700 text-lg italic mb-4 text-center">"{testimonial.content}"</p>
                <p className="text-center font-semibold text-primary-600">- {testimonial.customerName}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="py-16 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Butuh Bantuan?</h2>
          <p className="text-xl mb-8 text-secondary-100 max-w-2xl mx-auto">
            Chat kami melalui WhatsApp untuk konsultasi produk atau pesanan khusus
          </p>
          <a 
            href={`https://wa.me/${import.meta.env.VITE_WA_NUMBER || '6281234567890'}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-secondary-600 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors duration-300 shadow-lg"
          >
            <span className="text-2xl">💬</span> Chat WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
};

export default Home;