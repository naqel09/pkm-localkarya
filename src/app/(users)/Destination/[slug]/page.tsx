"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, MapPin, Calendar, Users, Star, Share2, Heart, X, ChevronLeft, ChevronRight, Map } from "lucide-react";

// Fungsi untuk mengecek dan membersihkan path gambar
const getImageSrc = (imagePath: string | null | undefined, fallback: string = '/images/mountain2.jpg') => {
  if (!imagePath || imagePath.trim() === '') {
    return fallback;
  }
  
  // Jika path sudah dimulai dengan /, gunakan langsung
  if (imagePath.startsWith('/')) {
    return imagePath;
  }
  
  // Jika path adalah data URL, gunakan langsung
  if (imagePath.startsWith('data:')) {
    return imagePath;
  }
  
  // Jika tidak, anggap sebagai file upload
  return `/uploads/${imagePath}`;
};

// Type definition untuk Destination
interface Destination {
  id: number;
  namaLokasi: string;
  alamat: string;
  deskripsi: string;
  gambar1: string;
  gambar2?: string | null;
  gambar3?: string | null;
  jamOperasional: string;
  tiketMasuk?: string | null;
  kontakPerson?: string | null;
  linkGmaps: string;
  createdAt: string;
  updatedAt: string;
}

export default function DestinationDetailPage() {
  const params = useParams();
  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        // Extract ID from slug (format: nama-lokasi-123)
        const slug = params.slug as string;
        const id = slug.split('-').pop();
        
        const res = await fetch(`/api/admin/${id}`);
        if (!res.ok) throw new Error("Destination not found");
        
        const response = await res.json();
        setDestination(response.data);
      } catch (error) {
        console.error("Error fetching destination:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchDestination();
    }
  }, [params.slug]);

  // Handle keyboard events for modal
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (showImageModal) {
        if (e.key === 'Escape') {
          closeModal();
        } else if (e.key === 'ArrowLeft' && modalImageIndex > 0) {
          setModalImageIndex(modalImageIndex - 1);
        } else if (e.key === 'ArrowRight' && modalImageIndex < images.length - 1) {
          setModalImageIndex(modalImageIndex + 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showImageModal, modalImageIndex, destination?.gambar1, destination?.gambar2, destination?.gambar3]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Skeleton Loading */}
        <div className="animate-pulse">
          <div className="h-96 bg-gray-300"></div>
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-8 bg-gray-300 rounded mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="h-6 bg-gray-300 rounded mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Destinasi Tidak Ditemukan
          </h1>
          <p className="text-gray-600 mb-6">
            Maaf, destinasi yang Anda cari tidak tersedia.
          </p>
          <Link
            href="/Destination"
            className="inline-flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Destinasi
          </Link>
        </div>
      </div>
    );
  }

  // Collect all available images with better filtering
  const images = destination ? [
    destination.gambar1,
    destination.gambar2,
    destination.gambar3
  ].filter(img => img && img.trim() !== '') : [];

  // Handle image click to open modal
  const handleImageClick = (index: number) => {
    setModalImageIndex(index);
    setShowImageModal(true);
  };

  // Handle modal close
  const closeModal = () => {
    setShowImageModal(false);
  };

  // Share function
  const shareDestination = async () => {
    if (navigator.share && destination) {
      try {
        await navigator.share({
          title: destination.namaLokasi,
          text: `Kunjungi ${destination.namaLokasi} - ${destination.alamat}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link berhasil disalin!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Image Independent Design */}
      <div className="relative h-96 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white bg-opacity-10 rounded-full animate-pulse"></div>
            <div className="absolute top-40 right-20 w-24 h-24 bg-white bg-opacity-10 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
            <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-white bg-opacity-5 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
          </div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center text-white px-4">
            <div className="text-7xl mb-6 animate-bounce">🏔️</div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-2xl">
              {destination.namaLokasi}
            </h1>
            <p className="text-xl md:text-2xl font-light mb-2 drop-shadow-lg opacity-95">
              Destinasi Wisata
            </p>
            <p className="text-lg opacity-90 drop-shadow-md">
              Desa Karyawangi, Parongpong
            </p>
            <div className="mt-6 flex items-center justify-center gap-4 text-sm">
              <div className="text-black bg-white bg-opacity-20 px-3 py-1 rounded-full backdrop-blur-sm">
                🌅 Pemandangan Indah
              </div>
              <div className="text-black bg-white bg-opacity-20 px-3 py-1 rounded-full backdrop-blur-sm">
                📸 Spot Foto
              </div>
            </div>
          </div>
        </div>
        
        {/* Back Button */}
        <div className="absolute top-6 left-6 z-20">
          <Link
            href="/Destination"
            className="inline-flex items-center gap-2 bg-white bg-opacity-90 text-gray-800 px-4 py-2 rounded-lg hover:bg-opacity-100 transition-all shadow-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Link>
        </div>
        
        {/* Action Buttons */}
        <div className="absolute top-6 right-6 z-20 flex gap-2">
          {images.length > 0 && (
            <button 
              onClick={() => handleImageClick(0)}
              className="inline-flex items-center gap-2 bg-blue-500 bg-opacity-90 text-white px-3 py-2 rounded-lg hover:bg-opacity-100 transition-all shadow-lg"
            >
              📷 Galeri ({images.length})
            </button>
          )}
          <button 
            onClick={shareDestination}
            className="inline-flex items-center gap-2 bg-green-500 bg-opacity-90 text-white px-3 py-2 rounded-lg hover:bg-opacity-100 transition-all shadow-lg"
          >
            <Share2 className="w-4 h-4" />
            Bagikan
          </button>
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`p-2 rounded-full transition-all shadow-lg ${
              isLiked ? "bg-red-500 text-white" : "bg-white bg-opacity-90 text-gray-800 hover:bg-opacity-100"
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
          </button>
          <button className="p-2 bg-white bg-opacity-90 text-gray-800 rounded-full hover:bg-opacity-100 transition-all shadow-lg">
            <Share2 className="w-5 h-5" />
          </button>
        </div>



        {/* Image Indicator */}
        {images.length > 0 && (
          <div className="absolute bottom-6 right-6 z-20">
            <div className="bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-xs backdrop-blur-sm">
              {images.length} Foto Tersedia
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-8">
              {/* Title and Rating */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    {destination.namaLokasi}
                  </h1>
                  <div className="flex items-center gap-4 text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{destination.alamat || "Indonesia"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Tersedia sepanjang tahun</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description with Clickable Images */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Tentang Destinasi Ini
                </h2>
                
                {/* Hero Image for Content */}
                {images.length > 0 && (
                  <div className="mb-6">
                    <div 
                      className="relative h-64 rounded-lg overflow-hidden cursor-pointer hover:opacity-95 transition-all duration-300 group bg-white shadow-sm"
                      onClick={() => handleImageClick(0)}
                    >
                      {images[0]?.startsWith('data:image') ? (
                        <div 
                          className="w-full h-full bg-cover bg-center"
                          style={{ 
                            backgroundImage: `url(${images[0]})`,
                            filter: 'brightness(1) contrast(1.1)'
                          }}
                        />
                      ) : (
                        <Image
                          src={getImageSrc(images[0])}
                          alt={`${destination.namaLokasi} - Main View`}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          style={{ filter: 'brightness(1) contrast(1.1)' }}
                          onError={(e) => {
                            console.error('Content image failed to load:', getImageSrc(images[0]));
                            const target = e.target as HTMLImageElement;
                            target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjI1NiIgdmlld0JveD0iMCAwIDYwMCAyNTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHJlY3Qgd2lkdGg9IjYwMCIgaGVpZ2h0PSIyNTYiIGZpbGw9IiNmM2Y0ZjYiLz4KICA8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM2Yjc5ODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBOb3QgRm91bmQ8L3RleHQ+Cjwvc3ZnPgo=';
                          }}
                        />
                      )}
                      {/* Enhanced click indicator */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-4">
                        <div className="bg-white bg-opacity-95 text-gray-800 px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                          🖼️ Klik untuk melihat galeri lengkap
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div 
                  className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: destination.deskripsi }}
                />
              </div>

              {/* Image Gallery */}
              {images.length > 1 && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Galeri Foto
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {images.map((image, index) => (
                      <div
                        key={index}
                        className="relative h-32 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-all duration-300 group bg-white border border-gray-200 shadow-sm hover:shadow-md"
                        onClick={() => handleImageClick(index)}
                      >
                        {image?.startsWith('data:image') ? (
                          <div 
                            className="w-full h-full bg-cover bg-center"
                            style={{ 
                              backgroundImage: `url(${image})`,
                              filter: 'brightness(1) contrast(1.1)'
                            }}
                          />
                        ) : (
                          <Image
                            src={getImageSrc(image)}
                            alt={`${destination.namaLokasi} - ${index + 1}`}
                            fill
                            className="object-cover transition-all duration-300 group-hover:scale-105"
                            style={{ filter: 'brightness(1) contrast(1.1)' }}
                            onError={(e) => {
                              console.error('Gallery thumbnail failed to load:', getImageSrc(image));
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              // Show fallback div
                              const parent = target.parentElement;
                              if (parent && !parent.querySelector('.fallback-content')) {
                                const fallback = document.createElement('div');
                                fallback.className = 'fallback-content absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 text-sm border border-blue-200';
                                fallback.innerHTML = `
                                  <div class="text-center">
                                    <div class="text-2xl mb-2">🖼️</div>
                                    <div class="text-xs font-medium">Image ${index + 1}</div>
                                  </div>
                                `;
                                parent.appendChild(fallback);
                              }
                            }}
                          />
                        )}
                        {/* Enhanced hover overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-3">
                          <div className="bg-white bg-opacity-90 text-gray-800 px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                            🔍 Lihat Detail
                          </div>
                        </div>
                        
                        {/* Image number indicator */}
                        <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full">
                          {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Info Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Informasi Kunjungan
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Jam Operasional</span>
                  <span className="font-medium">{destination.jamOperasional || "24 Jam"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tiket Masuk</span>
                  <span className="font-medium text-green-600">{destination.tiketMasuk || "Gratis"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estimasi Waktu</span>
                  <span className="font-medium">2-4 Jam</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {Math.floor(Math.random() * 500) + 100}+ pengunjung bulan ini
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Butuh Informasi Lebih?
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                {destination.kontakPerson ? 
                  `Hubungi ${destination.kontakPerson} untuk informasi lebih detail tentang destinasi ini.` :
                  "Hubungi kami untuk informasi lebih detail tentang destinasi ini."
                }
              </p>
              {destination.kontakPerson ? (
                <a 
                  href={`https://wa.me/${destination.kontakPerson.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                >
                  📱 Hubungi via WhatsApp
                </a>
              ) : (
                <button className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors">
                  Hubungi Kami
                </button>
              )}
            </div>

            {/* Location Card */}
            {destination.linkGmaps && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-gray-800 flex items-center space-x-2">
                    <Map className="w-5 h-5 text-blue-600" />
                    <span>Lokasi Destinasi</span>
                  </h3>
                  <a
                    href={destination.linkGmaps}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    <Map className="w-4 h-4" />
                    Buka di Maps
                  </a>
                </div>
                
                {/* Embedded Google Maps */}
                <div className="relative h-48 rounded-lg overflow-hidden border border-gray-200">
                  <iframe
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(destination.alamat || destination.namaLokasi)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`Lokasi ${destination.namaLokasi}`}
                    className="w-full h-full"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2 text-center">
                  Peta interaktif - Anda dapat zoom, drag, dan berinteraksi dengan peta
                </p>
                {destination.linkGmaps && (
                  <p className="text-sm text-gray-600 mt-2">
                    📍 {destination.linkGmaps}
                  </p>
                )}
              </div>
            )}

            {/* Weather Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Cuaca Hari Ini
              </h3>
              <div className="text-center">
                <div className="text-3xl mb-2">☀️</div>
                <div className="text-2xl font-bold text-gray-800 mb-1">
                  28°C
                </div>
                <div className="text-sm text-gray-600">
                  Cerah berawan
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div className="relative max-w-4xl max-h-full w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 bg-black bg-opacity-60 backdrop-blur-sm text-white p-4 rounded-full hover:bg-opacity-80 transition-all shadow-lg group"
            >
              <X className="w-8 h-8 group-hover:scale-110 transition-transform" />
            </button>

            {/* Navigation Buttons */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (modalImageIndex > 0) {
                      setModalImageIndex(modalImageIndex - 1);
                    }
                  }}
                  disabled={modalImageIndex === 0}
                  className="absolute left-4 z-10 bg-black bg-opacity-60 backdrop-blur-sm text-white p-4 rounded-full hover:bg-opacity-80 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg group"
                >
                  <ChevronLeft className="w-8 h-8 group-hover:scale-110 transition-transform" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (modalImageIndex < images.length - 1) {
                      setModalImageIndex(modalImageIndex + 1);
                    }
                  }}
                  disabled={modalImageIndex === images.length - 1}
                  className="absolute right-4 z-10 bg-black bg-opacity-60 backdrop-blur-sm text-white p-4 rounded-full hover:bg-opacity-80 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg group"
                >
                  <ChevronRight className="w-8 h-8 group-hover:scale-110 transition-transform" />
                </button>
              </>
            )}

            {/* Image Container */}
            <div 
              className="relative w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {images[modalImageIndex]?.startsWith('data:image') ? (
                <img 
                  src={images[modalImageIndex]}
                  alt={`${destination.namaLokasi} - ${modalImageIndex + 1}`}
                  className="max-w-full max-h-full object-contain rounded-lg"
                  style={{ filter: 'brightness(1)' }}
                />
              ) : (
                <div className="relative w-full h-full flex items-center justify-center">
                  <Image
                    src={getImageSrc(images[modalImageIndex])}
                    alt={`${destination.namaLokasi} - ${modalImageIndex + 1}`}
                    fill
                    className="object-contain"
                    style={{ filter: 'brightness(1)' }}
                    onError={(e) => {
                      console.error('Modal image failed to load:', getImageSrc(images[modalImageIndex]));
                      const target = e.target as HTMLImageElement;
                      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDgwMCA2MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHJlY3Qgd2lkdGg9IjgwMCIgaGVpZ2h0PSI2MDAiIGZpbGw9IiNmM2Y0ZjYiLz4KICA8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMzYiIGZpbGw9IiM2Yjc5ODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBOb3QgRm91bmQ8L3RleHQ+Cjwvc3ZnPgo=';
                    }}
                  />
                </div>
              )}
            </div>

            {/* Image Counter */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm">
                {modalImageIndex + 1} / {images.length}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}