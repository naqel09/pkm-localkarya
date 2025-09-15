"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, MapPin, Calendar, Users, Star, Share2, Heart, Clock, CreditCard, CheckCircle, X, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";

// Type definition untuk PaketWisata
interface PaketWisata {
  id: number;
  namaPaket: string;
  alamat: string;
  deskripsi: string;
  harga: number;
  gambar1: string;
  gambar2?: string | null;
  gambar3?: string | null;
  gambar4?: string | null;
  gambar360?: string | null;
  createdAt: string;
  updatedAt: string;
}

// Format harga ke Rupiah
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

export default function PaketWisataDetailPage() {
  const params = useParams();
  const [paketWisata, setPaketWisata] = useState<PaketWisata | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [galleryActiveIndex, setGalleryActiveIndex] = useState(0);
  const [show360Viewer, setShow360Viewer] = useState(false);
  const [rotation360, setRotation360] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouseX, setLastMouseX] = useState(0);
  const viewer360Ref = useRef<HTMLDivElement>(null);

  // Enhanced 360° viewer with spherical mapping
  const handle360MouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setLastMouseX(e.clientX);
    if (viewer360Ref.current) {
      viewer360Ref.current.style.cursor = 'grabbing';
    }
  };

  const handle360MouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const deltaX = e.clientX - lastMouseX;
    const sensitivity = 0.3; // Reduced sensitivity for smoother control
    setRotation360(prev => {
      const newRotation = prev + deltaX * sensitivity;
      // Normalize rotation to prevent overflow
      return newRotation % 360;
    });
    setLastMouseX(e.clientX);
  };

  const handle360MouseUp = () => {
    setIsDragging(false);
    if (viewer360Ref.current) {
      viewer360Ref.current.style.cursor = 'grab';
    }
  };

  // Enhanced touch events for mobile with better sensitivity
  const handle360TouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setLastMouseX(e.touches[0].clientX);
  };

  const handle360TouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const deltaX = e.touches[0].clientX - lastMouseX;
    const sensitivity = 0.4; // Slightly higher for mobile
    setRotation360(prev => {
      const newRotation = prev + deltaX * sensitivity;
      return newRotation % 360;
    });
    setLastMouseX(e.touches[0].clientX);
  };

  const handle360TouchEnd = () => {
    setIsDragging(false);
  };

  // Handle gallery navigation
  const nextGalleryImage = () => {
    setGalleryActiveIndex(prev => (prev + 1) % images.length);
  };

  const prevGalleryImage = () => {
    setGalleryActiveIndex(prev => (prev - 1 + images.length) % images.length);
  };

  // Open 360° viewer
  const open360Viewer = () => {
    setShow360Viewer(true);
    setRotation360(0);
  };

  useEffect(() => {
    const fetchPaketWisata = async () => {
      try {
        // Extract ID from slug (format: nama-paket-123)
        const slug = params.slug as string;
        const id = slug.split('-').pop();
        
        const res = await fetch(`/api/admin/paket-wisata/${id}`);
        if (!res.ok) throw new Error("Paket wisata not found");
        
        const response = await res.json();
        setPaketWisata(response.data);
      } catch (error) {
        console.error("Error fetching paket wisata:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchPaketWisata();
    }
  }, [params.slug]);

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

  if (!paketWisata) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Paket Wisata Tidak Ditemukan
          </h1>
          <p className="text-gray-600 mb-6">
            Maaf, paket wisata yang Anda cari tidak tersedia.
          </p>
          <Link
            href="/Tours"
            className="inline-flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Paket Wisata
          </Link>
        </div>
      </div>
    );
  }

  // Collect all available images
  const images = [
    paketWisata.gambar1,
    paketWisata.gambar2,
    paketWisata.gambar3,
    paketWisata.gambar4,
    paketWisata.gambar360
  ].filter(Boolean) as string[];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Image Gallery */}
      <div 
        className="relative h-96 bg-gray-900 cursor-pointer"
        onDoubleClick={() => {
          if (images[activeImageIndex] === paketWisata.gambar360) {
            open360Viewer();
          } else {
            setGalleryActiveIndex(activeImageIndex);
            setShowGalleryModal(true);
          }
        }}
      >
        {images[activeImageIndex]?.startsWith('data:image') ? (
          <div 
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${images[activeImageIndex]})` }}
          />
        ) : (
          <img
            src={`/uploads/${images[activeImageIndex]}`}
            alt={paketWisata.namaPaket}
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error('Hero image failed to load:', `/uploads/${images[activeImageIndex]}`);
              const target = e.target as HTMLImageElement;
              target.src = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI0MDAiIHZpZXdCb3g9IjAgMCAxMjAwIDQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiNmM2Y0ZjYiLz4KICA8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMzYiIGZpbGw9IiM2Yjc5ODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBOb3QgRm91bmQ8L3RleHQ+Cjwvc3ZnPgo=`;
              target.style.backgroundColor = '#f3f4f6';
            }}
          />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        
        {/* Navigation */}
        <div className="absolute top-6 left-6 z-10">
          <Link
            href="/Tours"
            className="inline-flex items-center gap-2 bg-white bg-opacity-90 text-gray-800 px-4 py-2 rounded-lg hover:bg-opacity-100 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Link>
        </div>

        {/* Actions */}
        <div className="absolute top-6 right-6 z-10 flex gap-2">
          <button 
            onClick={() => {
              setGalleryActiveIndex(activeImageIndex);
              setShowGalleryModal(true);
            }}
            className="inline-flex items-center gap-2 bg-blue-500 bg-opacity-90 text-white px-3 py-2 rounded-lg hover:bg-opacity-100 transition-all"
          >
            📷 Galeri
          </button>
          <button 
            onClick={() => setIsLiked(!isLiked)}
            className={`p-2 rounded-full transition-colors ${
              isLiked ? 'bg-red-500 text-white' : 'bg-white bg-opacity-90 text-gray-800 hover:bg-opacity-100'
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
          </button>
          <button className="p-2 bg-white bg-opacity-90 text-gray-800 rounded-full hover:bg-opacity-100 transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        {/* Double-click hint */}
        <div className="absolute bottom-20 right-6 z-10 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-xs">
          Double-click untuk melihat foto besar
        </div>

        {/* Image Navigation Thumbnails */}
        {images.length > 1 && (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setActiveImageIndex(index)}
                className={`relative w-16 h-12 rounded overflow-hidden border-2 transition-all bg-gray-200 ${
                  activeImageIndex === index ? 'border-white' : 'border-transparent opacity-70'
                }`}
              >
                {image?.startsWith('data:image') ? (
                  <div 
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${image})` }}
                  />
                ) : (
                  <img
                    src={`/uploads/${image}`}
                    alt={`${paketWisata.namaPaket} - Thumbnail ${index + 1}`}
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      console.error('Thumbnail failed to load:', `/uploads/${image}`);
                      const target = e.target as HTMLImageElement;
                      target.src = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA2NCA0OCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNDgiIGZpbGw9IiNlNWU3ZWIiLz4KICA8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTAiIGZpbGw9IiM2Yjc5ODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7wn5O3PC90ZXh0Pgo8L3N2Zz4K`;
                    }}
                  />
                )}
                {/* 360° indicator */}
                {image === paketWisata.gambar360 && (
                  <div className="absolute inset-0 bg-orange-500 bg-opacity-80 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">360°</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                {paketWisata.namaPaket}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{paketWisata.alamat}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span>4.8 (124 ulasan)</span>
                </div>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>Maks 20 orang</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>1 Hari penuh</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Tersedia setiap hari</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Tentang Paket Wisata Ini
              </h2>
              <div 
                className="prose prose-gray max-w-none"
                dangerouslySetInnerHTML={{ __html: paketWisata.deskripsi }}
              />
            </div>

            {/* Gallery Section - FIXED */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Galeri Foto
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-square overflow-hidden rounded-lg cursor-pointer group bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-200"
                    onClick={() => {
                      if (image === paketWisata.gambar360) {
                        open360Viewer();
                      } else {
                        setGalleryActiveIndex(index);
                        setShowGalleryModal(true);
                      }
                    }}
                  >
                    <Image
                      src={`/uploads/${image}`}
                      alt={`${paketWisata.namaPaket} - Photo ${index + 1}`}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover transition-all duration-300 group-hover:scale-110"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                      priority={index < 2}
                      onError={(e) => {
                        console.error('Image failed to load:', `/uploads/${image}`);
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        // Show fallback div
                        const parent = target.parentElement;
                        if (parent && !parent.querySelector('.fallback-content')) {
                          const fallback = document.createElement('div');
                          fallback.className = 'fallback-content absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-500 text-sm';
                          fallback.innerHTML = `
                            <div class="text-center">
                              <div class="text-2xl mb-2">🖼️</div>
                              <div>Image not found</div>
                            </div>
                          `;
                          parent.appendChild(fallback);
                        }
                      }}
                      onLoadStart={() => {
                        console.log('Loading image:', `/uploads/${image}`);
                      }}
                      onLoad={() => {
                        console.log('Image loaded successfully:', `/uploads/${image}`);
                      }}
                    />
                    
                    {/* Loading placeholder while image loads */}
                    <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-400">
                      <div className="animate-pulse">
                        <div className="text-2xl mb-2">📷</div>
                        <div className="text-xs">Loading...</div>
                      </div>
                    </div>
                    
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        {image === paketWisata.gambar360 ? (
                          <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                            360° View
                          </div>
                        ) : (
                          <div className="bg-white bg-opacity-90 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                            Lihat Foto
                          </div>
                        )}
                      </div>
                    </div>
                    {/* 360° Badge */}
                    {image === paketWisata.gambar360 && (
                      <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded text-xs font-bold z-10">
                        360°
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Package Includes */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Yang Termasuk dalam Paket
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Guide profesional",
                  "Transportasi AC",
                  "Makan siang",
                  "Tiket masuk lokasi",
                  "Dokumentasi",
                  "Asuransi perjalanan",
                  "Air mineral",
                  "Souvenir"
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Itinerary */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Jadwal Perjalanan
              </h2>
              <div className="space-y-4">
                {[
                  { time: "08:00", activity: "Penjemputan di titik kumpul" },
                  { time: "09:00", activity: "Tiba di lokasi wisata pertama" },
                  { time: "12:00", activity: "Makan siang di restoran lokal" },
                  { time: "14:00", activity: "Eksplorasi lokasi wisata kedua" },
                  { time: "16:00", activity: "Sesi foto dan dokumentasi" },
                  { time: "17:30", activity: "Perjalanan kembali" },
                  { time: "18:30", activity: "Tiba di titik drop off" }
                ].map((schedule, index) => (
                  <div key={index} className="flex gap-4 pb-4 border-b border-gray-100 last:border-b-0">
                    <div className="flex-shrink-0 w-16 text-sm font-medium text-blue-600">
                      {schedule.time}
                    </div>
                    <div className="flex-1 text-gray-700">
                      {schedule.activity}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {formatPrice(paketWisata.harga)}
                </div>
                <div className="text-gray-500">per orang</div>
              </div>

              {/* Booking Form */}
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tanggal Keberangkatan
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Jumlah Peserta
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>1 orang</option>
                    <option>2 orang</option>
                    <option>3 orang</option>
                    <option>4 orang</option>
                    <option>5+ orang</option>
                  </select>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Subtotal (1 orang)</span>
                    <span className="font-semibold">{formatPrice(paketWisata.harga)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-600">Biaya admin</span>
                    <span className="font-semibold">Gratis</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold border-t pt-2">
                    <span>Total</span>
                    <span className="text-green-600">{formatPrice(paketWisata.harga)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-5 h-5" />
                  Pesan Sekarang
                </button>
              </form>

              {/* Contact Info */}
              <div className="mt-6 pt-6 border-t text-center">
                <p className="text-sm text-gray-600 mb-2">
                  Butuh bantuan? Hubungi kami
                </p>
                <a 
                  href="tel:+6281234567890"
                  className="text-blue-500 hover:text-blue-600 font-medium"
                >
                  +62 812-3456-7890
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Modal */}
      {showGalleryModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
          <div className="relative max-w-4xl max-h-full p-4">
            <button
              onClick={() => setShowGalleryModal(false)}
              className="absolute top-4 right-4 z-10 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            {/* Navigation Buttons */}
            <button
              onClick={prevGalleryImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextGalleryImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <div className="relative">
              {images[galleryActiveIndex]?.startsWith('data:image') ? (
                <div 
                  className="max-h-[80vh] max-w-full bg-contain bg-center bg-no-repeat"
                  style={{ 
                    backgroundImage: `url(${images[galleryActiveIndex]})`,
                    minHeight: '400px',
                    minWidth: '600px'
                  }}
                />
              ) : (
                <img
                  src={`/uploads/${images[galleryActiveIndex]}`}
                  alt={`${paketWisata.namaPaket} - Gallery ${galleryActiveIndex + 1}`}
                  className="object-contain max-h-[80vh] max-w-full"
                  onError={(e) => {
                    console.error('Gallery modal image failed to load:', `/uploads/${images[galleryActiveIndex]}`);
                    const target = e.target as HTMLImageElement;
                    target.src = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNlNWU3ZWIiLz4KICA8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM2Yjc5ODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBOb3QgRm91bmQ8L3RleHQ+Cjwvc3ZnPgo=`;
                  }}
                />
              )}
              
              {/* Image Counter */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                {galleryActiveIndex + 1} / {images.length}
              </div>
            </div>

            {/* Thumbnail Navigation */}
            <div className="flex justify-center mt-4 gap-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setGalleryActiveIndex(index)}
                  className={`w-16 h-12 rounded overflow-hidden border-2 transition-all ${
                    galleryActiveIndex === index ? 'border-white' : 'border-transparent opacity-70'
                  }`}
                >
                  {image?.startsWith('data:image') ? (
                    <div 
                      className="w-full h-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${image})` }}
                    />
                  ) : (
                    <img
                      src={`/uploads/${image}`}
                      alt={`${paketWisata.namaPaket} - Thumbnail ${index + 1}`}
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        console.error('Modal thumbnail failed to load:', `/uploads/${image}`);
                        const target = e.target as HTMLImageElement;
                        target.src = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA2NCA0OCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNDgiIGZpbGw9IiNlNWU3ZWIiLz4KICA8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTAiIGZpbGw9IiM2Yjc5ODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7wn5O3PC90ZXh0Pgo8L3N2Zz4K`;
                      }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Professional VR 360° Panorama Viewer */}
      {show360Viewer && paketWisata.gambar360 && (
        <div className="fixed inset-0 z-50 bg-black">
          {/* Top Control Bar */}
          <div className="absolute top-0 left-0 right-0 z-30 bg-gradient-to-b from-black/80 to-transparent">
            <div className="flex justify-between items-center p-4">
              <div className="flex items-center gap-3">
                <div className="bg-orange-500 text-white px-4 py-2 rounded-full font-bold text-sm">
                  360° PANORAMA VR
                </div>
                <button
                  onClick={() => setRotation360(0)}
                  className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-200"
                  title="Reset View"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>
              <button
                onClick={() => setShow360Viewer(false)}
                className="bg-red-500/80 hover:bg-red-500 text-white p-3 rounded-full transition-all duration-200"
                title="Close Viewer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Main Panorama Viewer Container */}
          <div 
            ref={viewer360Ref}
            className="relative w-full h-full cursor-grab select-none"
            onMouseDown={handle360MouseDown}
            onMouseMove={handle360MouseMove}
            onMouseUp={handle360MouseUp}
            onMouseLeave={handle360MouseUp}
            onTouchStart={handle360TouchStart}
            onTouchMove={handle360TouchMove}
            onTouchEnd={handle360TouchEnd}
            style={{
              background: 'radial-gradient(circle at center, #1a1a1a 0%, #000000 100%)'
            }}
          >
            {/* Spherical Panorama Container - VR Style */}
            <div 
              className="absolute inset-0 w-full h-full"
              style={{ 
                transform: `perspective(1200px) rotateY(${rotation360}deg)`,
                transformOrigin: 'center center',
                transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
                transformStyle: 'preserve-3d'
              }}
            >
              {/* VR Panoramic Image Container */}
              <div
                className="absolute inset-0 w-full h-full rounded-full overflow-hidden"
                style={{
                  transform: 'scale(1.8)', 
                  transformOrigin: 'center center'
                }}
              >
                {paketWisata.gambar360?.startsWith('data:image') ? (
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${paketWisata.gambar360})`,
                      filter: 'brightness(1.2) contrast(1.1) saturate(1.05)',
                    }}
                  />
                ) : (
                  <Image
                    src={`/uploads/${paketWisata.gambar360}`}
                    alt={`${paketWisata.namaPaket} - 360° VR Panoramic View`}
                    fill
                    sizes="100vw"
                    className="object-cover"
                    draggable={false}
                    priority
                    style={{
                      filter: 'brightness(1.2) contrast(1.1) saturate(1.05)',
                      objectPosition: 'center center',
                      imageRendering: 'auto'
                    }}
                    onError={() => {
                      console.error('360° image failed to load:', `/uploads/${paketWisata.gambar360}`);
                    }}
                  />
                )}
              </div>
            </div>

            {/* VR Immersive Effects */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(circle at center, transparent 35%, rgba(0,0,0,0.15) 75%)`,
                mixBlendMode: 'multiply'
              }}
            />

            {/* VR Grid Overlay */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-3"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
                `,
                backgroundSize: '60px 60px'
              }}
            />
          </div>

          {/* Bottom VR Control Panel */}
          <div className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black/80 to-transparent p-6">
            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-6 bg-black/40 rounded-full px-6 py-3 text-white/90 text-sm">
                <span className="flex items-center gap-2">
                  <span>🖱️</span>
                  <span className="hidden sm:inline">Drag to Rotate</span>
                </span>
                <span className="text-white/40">|</span>
                <span className="flex items-center gap-2">
                  <span>📱</span>
                  <span className="hidden sm:inline">Swipe Mobile</span>
                </span>
                <span className="text-white/40">|</span>
                <span className="flex items-center gap-2">
                  <span>🔄</span>
                  <span className="hidden sm:inline">Reset</span>
                </span>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4">
              <div className="bg-black/40 rounded-full px-4 py-2 text-white text-sm">
                <span className="font-mono">Rotation: {Math.round(rotation360)}°</span>
              </div>
              <div className="bg-orange-500/80 rounded-full px-4 py-2 text-white text-sm font-medium">
                VR Mode Active
              </div>
            </div>
          </div>

          {/* VR Crosshair */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
            <div className="w-8 h-8 border-2 border-white/30 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white/50 rounded-full"></div>
            </div>
          </div>

          {/* Rotation Status */}
          {isDragging && (
            <div className="absolute top-1/2 right-8 transform -translate-y-1/2 z-20 pointer-events-none">
              <div className="bg-orange-500/90 text-white px-3 py-2 rounded-lg font-bold text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                  Rotating...
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}