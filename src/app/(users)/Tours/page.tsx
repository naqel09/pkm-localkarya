"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Users, Star, Clock } from "lucide-react";

// Type definition untuk PaketWisata
interface PaketWisata {
  id: number;
  namaPaket: string;
  alamat: string;
  deskripsi: string;
  harga: number;
  yangTermasuk?: string[];
  jadwal?: { waktu: string; kegiatan: string }[];
  noWa?: string | null;
  gambar1: string;
  gambar2?: string | null;
  gambar3?: string | null;
  gambar4?: string | null;
  gambar360?: string | null;
  createdAt: string;
  updatedAt: string;
}

// Type definition untuk Carousel
interface CarouselItem {
  id: number;
  title: string;
  subtitle?: string;
  description: string;
  imageUrl: string;
  orderIndex: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Fungsi untuk membersihkan HTML tags dari rich text
const stripHtmlTags = (html: string) => {
  if (!html) return "";
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  return tempDiv.textContent || tempDiv.innerText || "";
};

// Fungsi untuk truncate text
const truncateText = (text: string, maxLength: number = 120) => {
  if (!text) return "";
  const cleanText = stripHtmlTags(text);
  if (cleanText.length <= maxLength) return cleanText;
  return cleanText.slice(0, maxLength) + "...";
};

// Fungsi untuk mengecek dan membersihkan path gambar
const getImageSrc = (imagePath: string | null | undefined, fallback: string = '/river.jpg') => {
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

// Fungsi untuk generate slug dari nama paket
const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

// Format harga ke Rupiah
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

export default function ToursPage() {
  const [paketWisata, setPaketWisata] = useState<PaketWisata[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [carouselImage, setCarouselImage] = useState<string>("/nyaba2.jpg"); // Default carousel image for tours
  
  const itemsPerPage = 6; // Menampilkan 6 paket per halaman

  // Fetch carousel images
  useEffect(() => {
    const fetchCarouselImages = async () => {
      try {
        const res = await fetch("/api/carousel");
        if (!res.ok) throw new Error("Failed to fetch carousel images");
        const response = await res.json();
        const carousels = response.data || [];
        
        // Use the second carousel image if available, or first if only one exists
        if (carousels.length > 1) {
          setCarouselImage(carousels[1].imageUrl);
        } else if (carousels.length > 0) {
          setCarouselImage(carousels[0].imageUrl);
        }
      } catch (error) {
        console.error("Error fetching carousel images:", error);
        // Keep default image if fetch fails
      }
    };

    fetchCarouselImages();
  }, []);

  useEffect(() => {
    const fetchPaketWisata = async () => {
      try {
        const res = await fetch("/api/paket-wisata");
        if (!res.ok) throw new Error("Failed to fetch paket wisata");
        const response = await res.json();
        setPaketWisata(response.data || []);
      } catch (error) {
        console.error("Error fetching paket wisata:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPaketWisata();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section Skeleton */}
        <div className="relative h-96 bg-gray-300 animate-pulse">
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="h-16 w-64 bg-gray-400 rounded"></div>
          </div>
        </div>
        
        {/* Content Skeleton */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md animate-pulse">
                <div className="h-48 bg-gray-300 rounded-t-lg"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Filter paket wisata berdasarkan search query
  const filteredPaket = paketWisata.filter(paket => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      paket.namaPaket.toLowerCase().includes(query) ||
      paket.alamat.toLowerCase().includes(query) ||
      paket.deskripsi.toLowerCase().includes(query)
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredPaket.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPaket = filteredPaket.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <Image
          src={carouselImage}
          alt="Paket Wisata Background"
          fill
          className="object-cover object-center absolute z-0"
          priority
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/30 z-10" />
        
        {/* Content */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center text-white px-4">
            <div className="mb-4">
              <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                🏞️ Paket Wisata Desa Karyawangi
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-wider drop-shadow-2xl">
              PAKET NYABA
            </h1>
            <p className="text-lg md:text-2xl opacity-95 max-w-2xl mx-auto">
              Jelajahi Keindahan Alam dengan Paket Wisata Lengkap di Parongpong
            </p>
            <div className="mt-8">
              <button className="px-8 py-3 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-full backdrop-blur-sm border border-white/30 transition-all duration-300 hover:scale-105">
                Pilih Paket Wisata ✨
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
            PAKET WISATA TERPOPULER
          </h2>
          
          {/* Search Bar */}
          <div className="relative max-w-md w-full md:w-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Cari paket wisata..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset to first page when search changes
              }}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setCurrentPage(1);
                }}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <svg className="w-4 h-4 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-6 text-gray-600">
          Menampilkan {currentPaket.length} dari {filteredPaket.length} paket wisata
          {searchQuery && (
            <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
              Hasil pencarian: &quot;{searchQuery}&quot;
            </span>
          )}
        </div>

        {/* Paket Wisata Grid */}
        {currentPaket.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {currentPaket.map((paket) => (
              <div key={paket.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group">
                {/* Image Container */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={getImageSrc(paket.gambar1)}
                    alt={paket.namaPaket}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/river.jpg';
                    }}
                  />
                  {/* Price Badge */}
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full shadow-lg">
                    <span className="text-sm font-semibold">{formatPrice(paket.harga)}</span>
                  </div>
                  {/* 360° Badge */}
                  {paket.gambar360 && (
                    <div className="absolute top-4 left-4 bg-orange-500 text-white px-2 py-1 rounded text-xs">
                      360°
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
                    {paket.namaPaket}
                  </h3>
                  
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm truncate">{paket.alamat}</span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {truncateText(paket.deskripsi)}
                  </p>

                  {/* Features */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      <span>Keluarga</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>1 Hari</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Link
                    href={`/Tours/${generateSlug(paket.namaPaket)}-${paket.id}`}
                    className="block w-full bg-blue-500 hover:bg-blue-600 text-white text-center py-2 rounded-lg transition-colors"
                  >
                    Lihat Detail
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Users className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-500 mb-2">
              Tidak ada paket wisata
            </h3>
            <p className="text-gray-400">
              {searchQuery.trim() 
                ? `Tidak ada paket wisata yang cocok dengan pencarian "${searchQuery}"`
                : "Belum ada paket wisata yang tersedia"
              }
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2">
            {/* Previous Button */}
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
              }`}
            >
              Previous
            </button>

            {/* Page Numbers */}
            {[...Array(totalPages)].map((_, index) => {
              const pageNumber = index + 1;
              
              // Show ellipsis logic
              if (totalPages > 7) {
                if (
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`px-4 py-2 rounded-lg ${
                        currentPage === pageNumber
                          ? "bg-blue-500 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                } else if (
                  pageNumber === currentPage - 2 ||
                  pageNumber === currentPage + 2
                ) {
                  return (
                    <span key={pageNumber} className="px-2 py-2 text-gray-400">
                      ...
                    </span>
                  );
                }
                return null;
              }

              return (
                <button
                  key={pageNumber}
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === pageNumber
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}

            {/* Next Button */}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}