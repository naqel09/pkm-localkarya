"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Users, Star } from "lucide-react";

// Type definition untuk Destination
interface Destination {
  id: number;
  namaLokasi: string;
  alamat: string;
  deskripsi: string;
  gambar1: string;
  gambar2?: string | null;
  gambar3?: string | null;
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

// Fungsi untuk generate slug dari nama lokasi
const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

export default function DestinationPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  
  const filters = ["All", "Best Seller", "Nature", "City", "Seasonal"];
  const itemsPerPage = 6; // Menampilkan 6 destinasi per halaman

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await fetch("/api/destinations");
        if (!res.ok) throw new Error("Failed to fetch destinations");
        const response = await res.json();
        setDestinations(response.data || []);
      } catch (error) {
        console.error("Error fetching destinations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden bg-gradient-to-br from-lime-400 via-green-500 to-emerald-600">
        {/* Decorative Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/20 rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-16 h-16 bg-white/15 rounded-full animate-bounce"></div>
          <div className="absolute top-32 right-32 w-12 h-12 bg-white/25 rounded-full animate-ping"></div>
          <div className="absolute bottom-32 left-32 w-8 h-8 bg-white/30 rounded-full animate-pulse"></div>
        </div>
        
        {/* Content */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center text-white px-4">
            <div className="mb-4">
              <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                🌿 Desa Karyawangi, Parongpong
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-wider drop-shadow-2xl">
              NYABA WISATA
            </h1>
            <p className="text-lg md:text-2xl opacity-95 max-w-2xl mx-auto">
              Ulin Bareng, Nikmati Keseruan di Alam Bandung Barat
            </p>
            <div className="mt-8">
              <span className="px-8 py-3 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-full backdrop-blur-sm border border-white/30 transition-all duration-300 hover:scale-105">
                Jelajahi Destinasi ✨
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
            DESTINASI POPULER
          </h2>
          
          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => {
                  setActiveFilter(filter);
                  setCurrentPage(1); // Reset to first page when filter changes
                }}
                className={`px-4 py-2 rounded-full transition-all duration-300 ${
                  activeFilter === filter
                    ? "bg-blue-500 text-white shadow-lg"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Destinations Grid */}
        {destinations.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">
              Belum ada destinasi yang tersedia
            </div>
            <p className="text-gray-400 mt-2">
              Admin sedang menambahkan destinasi menarik untuk Anda
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {destinations
                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                .map((destination) => (
              <Link
                key={destination.id}
                href={`/Destination/${generateSlug(destination.namaLokasi)}-${destination.id}`}
                className="group block"
              >
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={getImageSrc(destination.gambar1)}
                      alt={destination.namaLokasi}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/river.jpg';
                      }}
                    />
                    
                    {/* Overlay Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Popular
                      </span>
                    </div>
                    
                    {/* Rating Badge */}
                    <div className="absolute top-3 right-3 bg-white bg-opacity-90 rounded-full px-2 py-1 flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span className="text-xs font-medium">4.{Math.floor(Math.random() * 5) + 5}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                      {destination.namaLokasi}
                    </h3>
                    
                    {/* Location */}
                    <div className="flex items-center text-gray-500 text-sm mb-3">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{destination.alamat || "Indonesia"}</span>
                    </div>
                    
                    {/* Description */}
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {truncateText(destination.deskripsi)}
                    </p>
                    
                    {/* Footer */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-500">
                        <Users className="w-4 h-4 mr-1" />
                        <span>{Math.floor(Math.random() * 500) + 100}+ Pengunjung</span>
                      </div>
                      <span className="text-blue-500 font-medium group-hover:text-blue-700">
                        Lihat Detail →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
                ))}
            </div>
            
            {/* Pagination */}
            {destinations.length > itemsPerPage && (
              <div className="flex justify-center mt-12">
                <div className="flex gap-2">
                  {/* Previous Button */}
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 border rounded-md ${
                      currentPage === 1
                        ? "border-gray-200 text-gray-400 cursor-not-allowed"
                        : "border-gray-300 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    ←
                  </button>
                  
                  {/* Page Numbers */}
                  {(() => {
                    const totalPages = Math.ceil(destinations.length / itemsPerPage);
                    const pages = [];
                    
                    for (let i = 1; i <= totalPages; i++) {
                      if (
                        i === 1 || // First page
                        i === totalPages || // Last page
                        (i >= currentPage - 1 && i <= currentPage + 1) // Current page ± 1
                      ) {
                        pages.push(
                          <button
                            key={i}
                            onClick={() => setCurrentPage(i)}
                            className={`px-4 py-2 rounded-md ${
                              currentPage === i
                                ? "bg-blue-500 text-white"
                                : "border border-gray-300 text-gray-600 hover:bg-gray-50"
                            }`}
                          >
                            {i.toString().padStart(2, '0')}
                          </button>
                        );
                      } else if (
                        i === currentPage - 2 ||
                        i === currentPage + 2
                      ) {
                        pages.push(
                          <span key={i} className="px-4 py-2 text-gray-400">
                            ...
                          </span>
                        );
                      }
                    }
                    
                    return pages;
                  })()}
                  
                  {/* Next Button */}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(destinations.length / itemsPerPage)))}
                    disabled={currentPage === Math.ceil(destinations.length / itemsPerPage)}
                    className={`px-4 py-2 border rounded-md ${
                      currentPage === Math.ceil(destinations.length / itemsPerPage)
                        ? "border-gray-200 text-gray-400 cursor-not-allowed"
                        : "border-gray-300 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    →
                  </button>
                </div>
              </div>
            )}
          </>
        )}


      </div>
    </div>
  );
}