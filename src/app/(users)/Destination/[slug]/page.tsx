"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, MapPin, Calendar, Users, Star, Share2, Heart } from "lucide-react";

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

export default function DestinationDetailPage() {
  const params = useParams();
  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

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

  // Collect all available images
  const images = [
    destination.gambar1,
    destination.gambar2,
    destination.gambar3
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image Gallery */}
      <div className="relative h-96 overflow-hidden">
        {images.length > 0 && (
          <>
            {images[activeImageIndex]?.startsWith('data:image') ? (
              <div 
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${images[activeImageIndex]})` }}
              />
            ) : (
              <Image
                src={images[activeImageIndex] || "/images/mountain2.jpg"}
                alt={destination.namaLokasi}
                fill
                className="object-cover"
                priority
              />
            )}
          </>
        )}
        
        {/* Image Navigation */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveImageIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  activeImageIndex === index ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-30" />
        
        {/* Back Button */}
        <div className="absolute top-6 left-6">
          <Link
            href="/Destination"
            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Link>
        </div>
        
        {/* Action Buttons */}
        <div className="absolute top-6 right-6 flex gap-2">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`p-3 rounded-full backdrop-blur-sm transition-colors ${
              isLiked ? "bg-red-500 text-white" : "bg-white/20 text-white hover:bg-white/30"
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
          </button>
          <button className="p-3 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
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
                <div className="text-right">
                  <div className="flex items-center gap-1 mb-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-lg font-semibold">4.{Math.floor(Math.random() * 5) + 5}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    ({Math.floor(Math.random() * 200) + 50} reviews)
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Tentang Destinasi Ini
                </h2>
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
                        className="relative h-32 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => setActiveImageIndex(index)}
                      >
                        {image?.startsWith('data:image') ? (
                          <div 
                            className="w-full h-full bg-cover bg-center"
                            style={{ backgroundImage: `url(${image})` }}
                          />
                        ) : (
                          <Image
                            src={image || "/images/mountain2.jpg"}
                            alt={`${destination.namaLokasi} - ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Fasilitas
                  </h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Area parkir luas
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Toilet dan mushola
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Warung makan
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Area foto instagramable
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Aktivitas
                  </h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Trekking & hiking
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Photography
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Piknik keluarga
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Wisata budaya
                    </li>
                  </ul>
                </div>
              </div>
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
                  <span className="font-medium">24 Jam</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tiket Masuk</span>
                  <span className="font-medium text-green-600">Gratis</span>
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
                Hubungi kami untuk informasi lebih detail tentang destinasi ini.
              </p>
              <button className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors">
                Hubungi Kami
              </button>
            </div>

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
    </div>
  );
}