"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, MapPin, Star } from "lucide-react";
import HotelCard from "./HotelCard";
import Pagination from "../../pagination/Pagination"; // ganti sesuai path file Pagination.tsx

interface HotelType {
  id: number;
  namaHotel: string;
  alamatHotel: string;
  googleMapsHotel?: string;
  deskripsiHotel: string;
  fasilitas: string[];
  gambar1?: string;
  gambar2?: string;
  gambar3?: string;
  rooms?: RoomType[];
  createdAt: string;
  updatedAt: string;
}

interface RoomType {
  id: number;
  jenisKamar: string;
  luasKamar: string;
  fasilitasKamar: string[];
  hargaPerMalam: number;
  banyaknyaTamu: number;
  deskripsiKamar: string;
  gambar1?: string;
  gambar2?: string;
  gambar3?: string;
  gambar360?: string;
}

const PopularHotels: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hotels, setHotels] = useState<HotelType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredHotels, setFilteredHotels] = useState<HotelType[]>([]);
  const itemsPerPage = 6; // jumlah hotel per halaman

  // Fetch hotels from API
  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/hotel', {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        
        if (!res.ok) throw new Error('Gagal mengambil data hotel');
        
        const response = await res.json();
        if (response.success && Array.isArray(response.data)) {
          setHotels(response.data);
          setFilteredHotels(response.data);
        } else {
          console.error('Error:', response.message);
          setHotels([]);
          setFilteredHotels([]);
        }
      } catch (error) {
        console.error('Error fetching hotels:', error);
        setHotels([]);
        setFilteredHotels([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  // Filter hotels based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredHotels(hotels);
    } else {
      const filtered = hotels.filter(hotel =>
        hotel.namaHotel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hotel.alamatHotel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hotel.deskripsiHotel.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredHotels(filtered);
    }
    setCurrentPage(1); // Reset to first page when searching
  }, [searchTerm, hotels]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredHotels.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentHotels = filteredHotels.slice(startIndex, startIndex + itemsPerPage);

  // Get minimum room price for each hotel
  const getMinPrice = (hotel: HotelType): string => {
    if (!hotel.rooms || hotel.rooms.length === 0) {
      return "Hubungi kami";
    }
    const minPrice = Math.min(...hotel.rooms.map(room => room.hargaPerMalam));
    return `Mulai Rp ${minPrice.toLocaleString('id-ID')}/malam`;
  };

  return (
    <section className="max-w-8xl mx-auto px-6 py-12 space-y-5">
      <h3 className="text-5xl font-semibold capitalize underline">
        Penginapan Populer
      </h3>

      <div className="flex flex-wrap justify-between">
        <p>
          Pesan kamar yang anda inginkan untuk memulai petualangan baru lagi
        </p>
        <div className="w-full md:w-1/4 relative">
          <input
            type="text"
            placeholder="Cari hotel..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border rounded-full py-2 px-4 pl-10 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, idx) => (
            <div key={idx} className="rounded-2xl overflow-hidden shadow-xl bg-gray-200 animate-pulse">
              <div className="w-full h-80 bg-gray-300"></div>
              <div className="p-4 space-y-2">
                <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                <div className="h-4 bg-gray-300 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredHotels.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Hotel tidak ditemukan</h3>
          <p className="text-gray-500">
            {searchTerm ? `Tidak ada hotel yang cocok dengan "${searchTerm}"` : 'Belum ada hotel yang tersedia'}
          </p>
        </div>
      ) : (
        <>
          {/* Grid Hotel */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentHotels.map((hotel) => (
              <Link
                key={hotel.id}
                href={`/Hotel/${hotel.id}`}
                className="cursor-pointer"
              >
                <HotelCard
                  image={hotel.gambar1 || '/hotel1.jpg'}
                  title={hotel.namaHotel}
                  location={hotel.alamatHotel}
                  price={getMinPrice(hotel)}
                  facilities={hotel.fasilitas.slice(0, 3)}
                  roomsCount={hotel.rooms?.length || 0}
                />
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          )}
        </>
      )}
    </section>
  );
};

export default PopularHotels;
