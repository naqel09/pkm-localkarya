"use client"
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Pagination from '../../pagination/Pagination'
import { MapPin, Phone, Clock, Star } from 'lucide-react'

interface Menu {
  id: number;
  namaMenu: string;
  harga: number;
  fotoMakanan1?: string;
  fotoMakanan2?: string;
}

interface Restaurant {
  id: number;
  namaRestaurant: string;
  alamatRestaurant: string;
  deskripsiRestaurant: string;
  gambar1?: string;
  gambar2?: string;
  gambar3?: string;
  gambar4?: string;
  gambar5?: string;
  gambar6?: string;
  fotoMenu1?: string;
  fotoMenu2?: string;
  fotoMenu3?: string;
  menus: Menu[];
  createdAt: string;
}

const RestaurantList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const itemsPerPage = 6;

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/restaurant');
      const data = await response.json();
      
      if (data.success) {
        setRestaurants(data.data);
      } else {
        setError('Failed to fetch restaurants');
      }
    } catch (err) {
      setError('Error loading restaurants');
      console.error('Error fetching restaurants:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter restaurants based on search term
  const filteredRestaurants = restaurants.filter(restaurant =>
    restaurant.namaRestaurant.toLowerCase().includes(searchTerm.toLowerCase()) ||
    restaurant.alamatRestaurant.toLowerCase().includes(searchTerm.toLowerCase()) ||
    restaurant.deskripsiRestaurant.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRestaurants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredRestaurants.slice(startIndex, endIndex);

  const getImageUrl = (filename?: string) => {
    if (!filename) return '/images/artikel/artikel.jpg'; // Use existing image as placeholder
    if (filename.startsWith('http') || filename.startsWith('/')) return filename;
    return `/uploads/${filename}`;
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto p-6">
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading restaurants...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="max-w-7xl mx-auto p-6">
        <div className="text-center py-20">
          <p className="text-red-600 text-lg">{error}</p>
          <button 
            onClick={fetchRestaurants}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-gray-800">Daftar Restaurant</h1>
            <p className="text-gray-600 max-w-2xl">
              Temukan pengalaman kuliner terbaik di destinasi wisata kami. 
              Nikmati cita rasa lokal yang autentik dan suasana yang menawan.
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="w-full md:w-80 mt-4 md:mt-0">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Cari restaurant..." 
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset to first page when searching
                }}
                className="w-full border border-gray-300 rounded-full py-3 px-4 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Menampilkan {currentItems.length} dari {filteredRestaurants.length} restaurant
            {searchTerm && ` untuk "${searchTerm}"`}
          </p>
        </div>

        {/* Restaurant Grid */}
        {currentItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No restaurants found</h3>
            <p className="text-gray-500">
              {searchTerm 
                ? `No restaurants match "${searchTerm}". Try a different search term.`
                : 'No restaurants available at the moment.'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentItems.map((restaurant) => (
              <div key={restaurant.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                {/* Restaurant Image */}
                <div className="relative h-56 w-full">
                  <Image 
                    src={getImageUrl(restaurant.gambar1)}
                    alt={restaurant.namaRestaurant}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <div className="absolute top-4 right-4">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">4.5</span>
                    </div>
                  </div>
                </div>

                {/* Restaurant Content */}
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
                    {restaurant.namaRestaurant}
                  </h2>
                  
                  <div className="flex items-start space-x-2 mb-3">
                    <MapPin className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {restaurant.alamatRestaurant}
                    </p>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {truncateText(restaurant.deskripsiRestaurant, 120)}
                  </p>

                  {/* Menu Count */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                        {restaurant.menus?.length || 0} Menu Items
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(restaurant.createdAt).toLocaleDateString('id-ID')}
                    </div>
                  </div>

                  {/* Action Button */}
                  <Link 
                    href={`/Restaurant/${restaurant.id}`}
                    className="w-full inline-block text-center bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                  >
                    Lihat Detail Restaurant
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12">
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </section>
  )
}

export default RestaurantList
