"use client"
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Pagination from '../../pagination/Pagination'
import { MapPin, Phone, ShoppingBag, ExternalLink, MessageCircle } from 'lucide-react'

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

const UmkmList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [umkmList, setUmkmList] = useState<Umkm[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const itemsPerPage = 8;

  useEffect(() => {
    fetchUmkm();
  }, []);

  const fetchUmkm = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/umkm');
      const data = await response.json();
      
      if (data.success) {
        setUmkmList(data.data);
      } else {
        setError('Failed to fetch UMKM data');
      }
    } catch (err) {
      setError('Error loading UMKM data');
      console.error('Error fetching UMKM:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter UMKM based on search term
  const filteredUmkm = umkmList.filter(umkm =>
    umkm.namaUmkm.toLowerCase().includes(searchTerm.toLowerCase()) ||
    umkm.alamatUmkm.toLowerCase().includes(searchTerm.toLowerCase()) ||
    umkm.deskripsiUmkm.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUmkm.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredUmkm.slice(startIndex, endIndex);

  const getImageUrl = (filename?: string) => {
    if (!filename) return '/cultural.jpg'; // Use existing image as placeholder
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
          <p className="mt-4 text-lg text-gray-600">Memuat data UMKM...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-600">{error}</p>
          <button 
            onClick={fetchUmkm}
            className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Search Section */}
        <div className="mb-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                Temukan UMKM Lokal Terbaik
              </h2>
              <p className="text-gray-600 text-center mb-6">
                Dukung produk lokal dan temukan berbagai produk unik dari UMKM sekitar
              </p>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari UMKM, produk, atau lokasi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <ShoppingBag className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{umkmList.length}</div>
              <div className="text-gray-600">UMKM Terdaftar</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {umkmList.reduce((acc, umkm) => acc + umkm.produk.length, 0)}
              </div>
              <div className="text-gray-600">Produk Tersedia</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {filteredUmkm.length}
              </div>
              <div className="text-gray-600">Hasil Pencarian</div>
            </div>
          </div>
        </div>

        {/* UMKM Grid */}
        {currentItems.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="mx-auto h-24 w-24 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {searchTerm ? 'Tidak ada UMKM yang ditemukan' : 'Belum ada data UMKM'}
            </h3>
            <p className="text-gray-500">
              {searchTerm ? 'Coba kata kunci yang berbeda' : 'Data UMKM akan segera ditambahkan'}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {currentItems.map((umkm) => (
                <div key={umkm.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  {/* Image */}
                  <div className="relative h-48 bg-gray-200">
                    <Image
                      src={getImageUrl(umkm.gambar)}
                      alt={umkm.namaUmkm}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                    <div className="absolute top-2 right-2">
                      <div className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        {umkm.produk.length} Produk
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-1">
                      {umkm.namaUmkm}
                    </h3>
                    
                    <div className="flex items-start text-gray-600 text-sm mb-2">
                      <MapPin className="h-4 w-4 mt-0.5 mr-1 flex-shrink-0" />
                      <span className="line-clamp-2">{umkm.alamatUmkm}</span>
                    </div>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {umkm.deskripsiUmkm}
                    </p>

                    {/* Products Preview */}
                    {umkm.produk.length > 0 && (
                      <div className="mb-3">
                        <h4 className="text-xs font-semibold text-gray-700 mb-2">Produk Unggulan:</h4>
                        <div className="space-y-1">
                          {umkm.produk.slice(0, 2).map((produk) => (
                            <div key={produk.id} className="flex justify-between items-center text-xs">
                              <span className="text-gray-600 truncate">{produk.namaProduk}</span>
                              <span className="font-semibold text-green-600 ml-2">
                                {formatPrice(Number(produk.hargaProduk))}
                              </span>
                            </div>
                          ))}
                          {umkm.produk.length > 2 && (
                            <div className="text-xs text-gray-500">
                              +{umkm.produk.length - 2} produk lainnya
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col space-y-2">
                      <Link
                        href={`/UMKM/${umkm.id}`}
                        className="w-full bg-green-600 text-white py-2 px-4 rounded-lg text-center text-sm font-semibold hover:bg-green-700 transition-colors duration-200"
                      >
                        Lihat Detail & Produk
                      </Link>
                      
                      <div className="flex space-x-2">
                        {umkm.nomorWhatsapp && (
                          <a
                            href={`https://wa.me/${umkm.nomorWhatsapp.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 bg-green-500 text-white py-2 px-3 rounded-lg text-center text-xs font-semibold hover:bg-green-600 transition-colors duration-200 flex items-center justify-center"
                          >
                            <MessageCircle className="h-4 w-4 mr-1" />
                            WhatsApp
                          </a>
                        )}
                        
                        {umkm.linkGmaps && (
                          <a
                            href={umkm.linkGmaps}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 bg-blue-500 text-white py-2 px-3 rounded-lg text-center text-xs font-semibold hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center"
                          >
                            <MapPin className="h-4 w-4 mr-1" />
                            Maps
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UmkmList;