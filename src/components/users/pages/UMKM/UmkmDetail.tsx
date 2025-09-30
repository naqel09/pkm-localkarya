"use client"
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, MessageCircle, ShoppingBag, ArrowLeft, Clock } from 'lucide-react'

interface ProdukUmkm {
  id: number;
  namaProduk: string;
  deskripsiProduk: string;
  hargaProduk: number;
  gambarProduk?: string;
  linkShopee?: string;
  linkTokopedia?: string;
}

interface Umkm {
  id: number;
  namaUmkm: string;
  alamatUmkm: string;
  deskripsiUmkm: string;
  linkGmaps?: string;
  nomorWhatsapp?: string;
  gambar?: string;
  produk: ProdukUmkm[];
  createdAt: string;
}

interface UmkmDetailProps {
  id: string;
}

const UmkmDetail: React.FC<UmkmDetailProps> = ({ id }) => {
  const [umkm, setUmkm] = useState<Umkm | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProdukUmkm | null>(null);

  useEffect(() => {
    fetchUmkmDetail();
  }, [id]);

  const fetchUmkmDetail = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/umkm/${id}`);
      const data = await response.json();
      
      if (data.success) {
        setUmkm(data.data);
      } else {
        setError('UMKM tidak ditemukan');
      }
    } catch (err) {
      setError('Error loading UMKM data');
      console.error('Error fetching UMKM detail:', err);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (filename?: string, fallback = '/cultural.jpg') => {
    if (!filename) return fallback;
    if (filename.startsWith('http') || filename.startsWith('/')) return filename;
    return `/uploads/${filename}`;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Memuat detail UMKM...</p>
        </div>
      </div>
    );
  }

  if (error || !umkm) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-600 mb-4">{error}</p>
          <Link
            href="/UMKM"
            className="inline-flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Daftar UMKM
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="relative h-64 md:h-80 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <Image
          src={getImageUrl(umkm.gambar)}
          alt={umkm.namaUmkm}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <Link
              href="/UMKM"
              className="inline-flex items-center text-white mb-4 hover:text-green-200 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Kembali ke Daftar UMKM
            </Link>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">
              {umkm.namaUmkm}
            </h1>
            <div className="flex items-center text-white">
              <MapPin className="h-5 w-5 mr-2" />
              <span className="text-lg">{umkm.alamatUmkm}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* UMKM Info */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Tentang UMKM</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                {umkm.deskripsiUmkm}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center text-gray-600">
                  <ShoppingBag className="h-5 w-5 mr-3 text-green-600" />
                  <span>{umkm.produk.length} Produk Tersedia</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="h-5 w-5 mr-3 text-blue-600" />
                  <span>Bergabung {new Date(umkm.createdAt).toLocaleDateString('id-ID')}</span>
                </div>
              </div>
            </div>

            {/* Products Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Produk Tersedia</h2>
              
              {umkm.produk.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="mx-auto h-24 w-24 text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">Belum Ada Produk</h3>
                  <p className="text-gray-500">Produk akan segera ditambahkan</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {umkm.produk.map((produk) => (
                    <div
                      key={produk.id}
                      className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
                      onClick={() => setSelectedProduct(produk)}
                    >
                      <div className="relative h-48 bg-gray-200">
                        <Image
                          src={getImageUrl(produk.gambarProduk, '/cultural.jpg')}
                          alt={produk.namaProduk}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-lg text-gray-800 mb-2">{produk.namaProduk}</h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{produk.deskripsiProduk}</p>
                        <div className="space-y-3">
                          <div className="text-xl font-bold text-green-600">
                            {formatPrice(Number(produk.hargaProduk))}
                          </div>
                          
                          {/* E-commerce Buttons */}
                          {(produk.linkShopee || produk.linkTokopedia) && (
                            <div className="flex space-x-2">
                              {produk.linkShopee && (
                                <a
                                  href={produk.linkShopee}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex-1 bg-orange-500 text-white py-2 px-3 rounded-md text-center text-sm font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <ShoppingBag className="h-4 w-4 mr-1" />
                                  Shopee
                                </a>
                              )}
                              {produk.linkTokopedia && (
                                <a
                                  href={produk.linkTokopedia}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex-1 bg-green-500 text-white py-2 px-3 rounded-md text-center text-sm font-semibold hover:bg-green-600 transition-colors flex items-center justify-center"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <ShoppingBag className="h-4 w-4 mr-1" />
                                  Tokopedia
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Contact Info */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6 sticky top-4">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Kontak & Lokasi</h3>
              
              <div className="space-y-4">
                {umkm.nomorWhatsapp && (
                  <a
                    href={`https://wa.me/${umkm.nomorWhatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <MessageCircle className="h-5 w-5 mr-3" />
                    <div>
                      <div className="font-semibold">Chat WhatsApp</div>
                      <div className="text-sm opacity-90">{umkm.nomorWhatsapp}</div>
                    </div>
                  </a>
                )}

                {umkm.linkGmaps && (
                  <a
                    href={umkm.linkGmaps}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <MapPin className="h-5 w-5 mr-3" />
                    <div>
                      <div className="font-semibold">Lihat di Maps</div>
                      <div className="text-sm opacity-90">Google Maps</div>
                    </div>
                  </a>
                )}

                <div className="border-t pt-4">
                  <div className="flex items-start text-gray-600">
                    <MapPin className="h-5 w-5 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-gray-800">Alamat</div>
                      <div className="text-sm">{umkm.alamatUmkm}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Statistik</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Produk</span>
                  <span className="font-bold text-green-600">{umkm.produk.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Bergabung</span>
                  <span className="font-bold text-gray-800">
                    {new Date(umkm.createdAt).toLocaleDateString('id-ID')}
                  </span>
                </div>
                {umkm.produk.length > 0 && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Harga Terendah</span>
                      <span className="font-bold text-blue-600">
                        {formatPrice(Math.min(...umkm.produk.map(p => Number(p.hargaProduk))))}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Harga Tertinggi</span>
                      <span className="font-bold text-purple-600">
                        {formatPrice(Math.max(...umkm.produk.map(p => Number(p.hargaProduk))))}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="relative">
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
              >
                ✕
              </button>
              <div className="relative h-64 bg-gray-200">
                <Image
                  src={getImageUrl(selectedProduct.gambarProduk, '/cultural.jpg')}
                  alt={selectedProduct.namaProduk}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedProduct.namaProduk}</h2>
                <p className="text-gray-600 mb-4">{selectedProduct.deskripsiProduk}</p>
                <div className="text-2xl font-bold text-green-600 mb-6">
                  {formatPrice(Number(selectedProduct.hargaProduk))}
                </div>
                <div className="flex space-x-4">
                  {selectedProduct.linkShopee && (
                    <a
                      href={selectedProduct.linkShopee}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-orange-500 text-white py-3 px-4 rounded-lg text-center font-semibold hover:bg-orange-600 transition-colors"
                    >
                      Beli di Shopee
                    </a>
                  )}
                  {selectedProduct.linkTokopedia && (
                    <a
                      href={selectedProduct.linkTokopedia}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-green-500 text-white py-3 px-4 rounded-lg text-center font-semibold hover:bg-green-600 transition-colors"
                    >
                      Beli di Tokopedia
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UmkmDetail;