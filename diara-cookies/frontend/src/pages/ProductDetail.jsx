import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  // Data produk (akan diambil dari API di implementasi nyata)
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Simulasi data produk
  useEffect(() => {
    // Dalam implementasi nyata, kita akan mengambil data dari API berdasarkan slug
    const mockProducts = [
      {
        id: 1,
        name: 'Cookies Coklat',
        slug: 'cookies-coklat',
        image: 'https://placehold.co/600x600/d2691e/ffffff?text=Cookies+Coklat',
        description: 'Cookies lembut dengan potongan coklat premium yang memberikan cita rasa yang nikmat dan tekstur yang renyah.',
        composition: 'Tepung terigu, mentega, gula, coklat premium, telur, susu bubuk',
        allergens: 'Mengandung susu, telur, dan gluten',
        shelfLife: '1 bulan',
        isFeatured: true,
        variants: [
          { id: 1, name: 'Kecil (10 pcs)', sku: 'COKE-001', price: 45000, stock: 50 },
          { id: 2, name: 'Sedang (20 pcs)', sku: 'COKE-002', price: 80000, stock: 30 },
          { id: 3, name: 'Besar (50 pcs)', sku: 'COKE-003', price: 180000, stock: 20 }
        ]
      },
      {
        id: 2,
        name: 'Cookies Kacang',
        slug: 'cookies-kacang',
        image: 'https://placehold.co/600x600/d2691e/ffffff?text=Cookies+Kacang',
        description: 'Cookies gurih dengan campuran kacang tanah yang memberikan rasa gurih dan tekstur yang renyah.',
        composition: 'Tepung terigu, mentega, gula, kacang tanah, telur, susu bubuk',
        allergens: 'Mengandung susu, telur, gluten, dan kacang',
        shelfLife: '1 bulan',
        isFeatured: false,
        variants: [
          { id: 4, name: 'Kecil (10 pcs)', sku: 'COKA-001', price: 40000, stock: 40 },
          { id: 5, name: 'Sedang (20 pcs)', sku: 'COKA-002', price: 75000, stock: 25 },
          { id: 6, name: 'Besar (50 pcs)', sku: 'COKA-003', price: 170000, stock: 15 }
        ]
      },
      {
        id: 3,
        name: 'Cookies Kering',
        slug: 'cookies-kering',
        image: 'https://placehold.co/600x600/d2691e/ffffff?text=Cookies+Kering',
        description: 'Cookies renyah dengan cita rasa klasik yang gurih dan nikmat.',
        composition: 'Tepung terigu, mentega, gula, telur, susu bubuk',
        allergens: 'Mengandung susu, telur, dan gluten',
        shelfLife: '2 minggu',
        isFeatured: true,
        variants: [
          { id: 7, name: 'Kecil (10 pcs)', sku: 'COKR-001', price: 35000, stock: 60 },
          { id: 8, name: 'Sedang (20 pcs)', sku: 'COKR-002', price: 65000, stock: 35 },
          { id: 9, name: 'Besar (50 pcs)', sku: 'COKR-003', price: 150000, stock: 10 }
        ]
      }
    ];

    const foundProduct = mockProducts.find(p => p.slug === slug);
    setProduct(foundProduct);

    if (foundProduct && foundProduct.variants.length > 0) {
      setSelectedVariant(foundProduct.variants[0]); // Pilih varian pertama secara default
    }
  }, [slug]);

  // Fungsi untuk menambah ke keranjang
  const addToCart = () => {
    if (!selectedVariant) {
      alert('Silakan pilih varian terlebih dahulu');
      return;
    }

    // Dalam implementasi nyata, kita akan mengirim data ke API
    console.log('Menambahkan ke keranjang:', {
      productId: product.id,
      variantId: selectedVariant.id,
      quantity: quantity
    });

    alert(`Berhasil menambahkan ${quantity} ${product.name} (${selectedVariant.name}) ke keranjang!`);
  };

  if (!product) {
    return (
      <div className="product-detail loading w-full bg-gray-50 min-h-screen py-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat produk...</p>
          </div>
        </div>
      </div>
    );
  }

  // Membuat structured data untuk produk
  const productStructuredData = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": [product.image],
    "description": product.description,
    "sku": product.variants && product.variants.length > 0 ? product.variants[0].sku : "",
    "offers": {
      "@type": "Offer",
      "price": product.variants && product.variants.length > 0 ? product.variants[0].price : "0",
      "priceCurrency": "IDR",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "Diara Cookies"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.5",
      "reviewCount": "100"
    }
  };

  return (
    <div className="product-detail w-full bg-gray-50 min-h-screen py-8">
      <SEO
        title={`${product.name} - Diara Cookies`}
        description={product.description}
        url={`https://www.diaracookies.com/products/${product.slug}`}
        image={product.image}
        keywords={`${product.name}, cookies, kue kering, produk`}
        structuredData={productStructuredData}
      />
      
      <div className="container mx-auto px-4 py-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-primary-600 hover:text-primary-800 mb-6 transition-colors duration-300"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Kembali
        </button>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 p-8">
            <div className="flex justify-center">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full max-w-md rounded-xl shadow-md object-cover"
              />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>

              <div className="product-description mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Deskripsi</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>

              <div className="product-specs mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Spesifikasi</h3>
                <ul className="space-y-2">
                  <li className="flex">
                    <span className="font-medium text-gray-700 w-32">Komposisi:</span>
                    <span className="text-gray-600">{product.composition}</span>
                  </li>
                  <li className="flex">
                    <span className="font-medium text-gray-700 w-32">Alergen:</span>
                    <span className="text-gray-600">{product.allergens}</span>
                  </li>
                  <li className="flex">
                    <span className="font-medium text-gray-700 w-32">Masa Simpan:</span>
                    <span className="text-gray-600">{product.shelfLife}</span>
                  </li>
                </ul>
              </div>

              <div className="product-variants mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Pilih Varian</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {product.variants.map(variant => (
                    <div
                      key={variant.id}
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                        selectedVariant && selectedVariant.id === variant.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-primary-300'
                      }`}
                      onClick={() => setSelectedVariant(variant)}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{variant.name}</span>
                        <span className="font-bold text-primary-600">Rp {parseInt(variant.price).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center mt-2 text-sm">
                        <span className="text-gray-500">SKU: {variant.sku}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          variant.stock > 10 
                            ? 'bg-green-100 text-green-800' 
                            : variant.stock > 0 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-red-100 text-red-800'
                        }`}>
                          Stok: {variant.stock}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="product-quantity mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Jumlah</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 text-xl font-bold text-gray-600 hover:bg-gray-100 rounded-l-lg transition-colors duration-300"
                    >
                      -
                    </button>
                    <span className="px-6 py-2 text-lg font-medium min-w-[60px] text-center">
                      {quantity}
                    </span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-2 text-xl font-bold text-gray-600 hover:bg-gray-100 rounded-r-lg transition-colors duration-300"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="product-price mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Harga</h3>
                <div className="text-3xl font-bold text-primary-600 mb-2">
                  Rp {selectedVariant ? parseInt(selectedVariant.price).toLocaleString() : '0'}
                </div>
                <div className="text-xl font-semibold text-gray-700">
                  Total: Rp {selectedVariant ? (parseInt(selectedVariant.price) * quantity).toLocaleString() : '0'}
                </div>
              </div>

              <div className="product-actions flex flex-wrap gap-4">
                <button
                  className="btn-primary px-8 py-4 text-lg flex-1 min-w-[200px] transition-all duration-300 transform hover:scale-105"
                  onClick={addToCart}
                >
                  Tambah ke Keranjang
                </button>
                <button className="btn-secondary px-8 py-4 text-lg flex-1 min-w-[200px] transition-all duration-300 transform hover:scale-105">
                  Beli Sekarang
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;