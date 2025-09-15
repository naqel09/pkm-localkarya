"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, Star, Wifi, Car, Coffee, Users, Bed, ArrowRight, Calendar, Phone, Mail, X } from 'lucide-react';
import Image from 'next/image';
import TourHeader from "@/components/TourHeader";

interface Hotel {
  id: number;
  namaHotel: string;
  alamatHotel: string;
  googleMapsHotel?: string;
  deskripsiHotel: string;
  fasilitas: string[];
  gambar1?: string;
  gambar2?: string;
  gambar3?: string;
  rooms: Room[];
}

interface Room {
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

const HotelDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const hotelId = params.id as string;

  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showRoomModal, setShowRoomModal] = useState(false);

  const facilityIcons: Record<string, any> = {
    'WiFi': Wifi,
    'Parkir': Car,
    'Sarapan': Coffee,
    'AC': Coffee,
    'TV': Coffee,
  };

  // Fetch hotel data
  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/hotel/${hotelId}`, {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache',
          },
        });
        
        if (!res.ok) {
          throw new Error('Hotel tidak ditemukan');
        }
        
        const response = await res.json();
        if (response.success && response.data) {
          setHotel(response.data);
        } else {
          throw new Error('Data hotel tidak valid');
        }
      } catch (error) {
        console.error('Error fetching hotel:', error);
        alert('Gagal memuat data hotel');
        router.push('/Hotel');
      } finally {
        setLoading(false);
      }
    };

    if (hotelId) {
      fetchHotelData();
    }
  }, [hotelId, router]);

  if (loading) {
    return (
      <>
        <TourHeader
          title="Hotel"
          halaman="Beranda"
          bagian="Detail Hotel"
          image="/bedroom.jpg"
        />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat detail hotel...</p>
          </div>
        </div>
      </>
    );
  }

  if (!hotel) {
    return (
      <>
        <TourHeader
          title="Hotel"
          halaman="Beranda"
          bagian="Hotel Tidak Ditemukan"
          image="/bedroom.jpg"
        />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Hotel Tidak Ditemukan</h2>
            <p className="text-gray-600 mb-6">Hotel yang Anda cari tidak tersedia</p>
            <button
              onClick={() => router.push('/Hotel')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Kembali ke Daftar Hotel
            </button>
          </div>
        </div>
      </>
    );
  }

  // Get hotel images
  const hotelImages = [hotel.gambar1, hotel.gambar2, hotel.gambar3].filter(Boolean) as string[];

  const openRoomDetail = (room: Room) => {
    setSelectedRoom(room);
    setShowRoomModal(true);
  };

  const closeRoomModal = () => {
    setShowRoomModal(false);
    setSelectedRoom(null);
  };

  return (
    <>
      <TourHeader
        title={hotel.namaHotel}
        halaman="Beranda"
        bagian={`Hotel | ${hotel.namaHotel}`}
        image="/bedroom.jpg"
      />
      
      <div className="min-h-screen bg-gray-50">
        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <div className="mb-6">
            <button
              onClick={() => router.push('/Hotel')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 bg-white px-4 py-2 rounded-lg shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" />
              Kembali ke Daftar Hotel
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Hotel Images & Description */}
            <div className="lg:col-span-2 space-y-6">
              {/* Hotel Images */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {hotelImages.length > 0 ? (
                  <div className="relative">
                    <div className="relative h-[400px]">
                      <Image
                        src={hotelImages[activeImageIndex]?.startsWith('data:image') 
                          ? hotelImages[activeImageIndex]
                          : `/uploads/${hotelImages[activeImageIndex]}`
                        }
                        alt={hotel.namaHotel}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 66vw"
                      />
                    </div>
                    
                    {/* Image Gallery Thumbnails */}
                    {hotelImages.length > 1 && (
                      <div className="absolute bottom-4 left-4 flex gap-2">
                        {hotelImages.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setActiveImageIndex(index)}
                            className={`relative w-16 h-12 rounded overflow-hidden border-2 transition-all ${
                              activeImageIndex === index ? 'border-white' : 'border-white/50 hover:border-white'
                            }`}
                          >
                            <Image
                              src={image?.startsWith('data:image') ? image : `/uploads/${image}`}
                              alt={`${hotel.namaHotel} ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-[400px] bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                    <div className="text-center text-white">
                      <h3 className="text-2xl font-bold mb-2">{hotel.namaHotel}</h3>
                      <p>Gambar akan segera tersedia</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Hotel Info */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="mb-4">
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">{hotel.namaHotel}</h1>
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="w-5 h-5 mr-2" />
                    <span>{hotel.alamatHotel}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-yellow-500 fill-current" />
                      <span className="ml-1 text-gray-700 font-medium">4.5</span>
                      <span className="text-gray-500 ml-1">(124 ulasan)</span>
                    </div>
                    {hotel.googleMapsHotel && (
                      <a
                        href={hotel.googleMapsHotel}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Lihat di Maps
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Tentang Hotel</h2>
                <p className="text-gray-600 leading-relaxed">{hotel.deskripsiHotel}</p>
              </div>

              {/* Google Maps */}
              {hotel.googleMapsHotel && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold text-gray-800">Lokasi Hotel</h2>
                    <a
                      href={hotel.googleMapsHotel}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      <MapPin className="w-4 h-4" />
                      Buka di Google Maps
                    </a>
                  </div>
                  
                  {/* Embedded Google Maps */}
                  <div className="relative h-80 rounded-lg overflow-hidden border border-gray-200">
                    <iframe
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(hotel.alamatHotel)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`Lokasi ${hotel.namaHotel}`}
                      className="w-full h-full"
                    />
                  </div>
                  
                  <div className="mt-4 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => window.open(hotel.googleMapsHotel, '_blank')}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                    >
                      <MapPin className="w-4 h-4" />
                      Buka di Google Maps
                    </button>
                    <button
                      onClick={() => {
                        const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(hotel.alamatHotel)}`;
                        window.open(mapsUrl, '_blank');
                      }}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                    >
                      <ArrowRight className="w-4 h-4" />
                      Petunjuk Arah
                    </button>
                  </div>
                  
                  <p className="text-sm text-gray-500 mt-3 text-center">
                    Peta interaktif - Anda dapat zoom, drag, dan berinteraksi dengan peta
                  </p>
                </div>
              )}

              {/* Facilities */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Fasilitas Hotel</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {hotel.fasilitas.map((fasilitas, index) => {
                    const IconComponent = facilityIcons[fasilitas] || Coffee;
                    return (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <IconComponent className="w-5 h-5 text-blue-600" />
                        <span className="text-gray-700">{fasilitas}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Available Rooms */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Kamar Tersedia</h2>
                <div className="space-y-4">
                  {hotel.rooms.map((room) => (
                    <div key={room.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xl font-semibold text-gray-800">{room.jenisKamar}</h3>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-green-600">
                                Rp {room.hargaPerMalam.toLocaleString('id-ID')}
                              </div>
                              <div className="text-sm text-gray-500">per malam</div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-2">
                              <Bed className="w-4 h-4" />
                              <span>{room.luasKamar}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4" />
                              <span>{room.banyaknyaTamu} tamu</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Coffee className="w-4 h-4" />
                              <span>{room.fasilitasKamar.length} fasilitas</span>
                            </div>
                          </div>
                          
                          <p className="text-gray-600 mb-4">{room.deskripsiKamar}</p>
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                            {room.fasilitasKamar.slice(0, 4).map((fasilitas, index) => (
                              <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                                {fasilitas}
                              </span>
                            ))}
                            {room.fasilitasKamar.length > 4 && (
                              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-sm">
                                +{room.fasilitasKamar.length - 4} lainnya
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-3 pt-4 border-t border-gray-100">
                        <button
                          onClick={() => openRoomDetail(room)}
                          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                        >
                          Lihat Detail
                          <ArrowRight className="w-4 h-4" />
                        </button>
                        <button className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition-colors">
                          Pesan Sekarang
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Booking Form & Contact */}
            <div className="space-y-6">
              {/* Booking Widget */}
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Pesan Kamar</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Check-in
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <Calendar className="absolute right-3 top-2.5 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Check-out
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <Calendar className="absolute right-3 top-2.5 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tamu
                    </label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="1">1 Tamu</option>
                      <option value="2">2 Tamu</option>
                      <option value="3">3 Tamu</option>
                      <option value="4">4 Tamu</option>
                    </select>
                  </div>
                </div>
                
                <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors mt-6 font-medium">
                  Cek Ketersediaan
                </button>
              </div>

              {/* Contact Info */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Informasi Kontak</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-700">+62 812-3456-7890</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-700">info@hotel.com</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                    <span className="text-gray-700">{hotel.alamatHotel}</span>
                  </div>
                </div>
                
                {hotel.googleMapsHotel && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => window.open(hotel.googleMapsHotel, '_blank')}
                      className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                    >
                      <MapPin className="w-4 h-4" />
                      Lihat Lokasi di Maps
                    </button>
                  </div>
                )}
              </div>

              {/* Hotel Stats */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Info Hotel</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Kamar</span>
                    <span className="font-medium">{hotel.rooms.length} kamar</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fasilitas</span>
                    <span className="font-medium">{hotel.fasilitas.length} item</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Harga Mulai</span>
                    <span className="font-medium text-green-600">
                      Rp {Math.min(...hotel.rooms.map(r => r.hargaPerMalam)).toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Room Detail Modal */}
        {showRoomModal && selectedRoom && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-semibold text-gray-800">{selectedRoom.jenisKamar}</h3>
                  <button
                    onClick={closeRoomModal}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Room Images */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {[selectedRoom.gambar1, selectedRoom.gambar2, selectedRoom.gambar3].filter(Boolean).map((image, index) => (
                    <div key={index} className="relative h-48 rounded-lg overflow-hidden">
                      <Image
                        src={image?.startsWith('data:image') ? image : `/uploads/${image}`}
                        alt={`${selectedRoom.jenisKamar} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>

                {/* Room Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Detail Kamar</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Luas Kamar</span>
                        <span className="font-medium">{selectedRoom.luasKamar}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Kapasitas</span>
                        <span className="font-medium">{selectedRoom.banyaknyaTamu} tamu</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Harga per Malam</span>
                        <span className="font-medium text-green-600">
                          Rp {selectedRoom.hargaPerMalam.toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Fasilitas Kamar</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedRoom.fasilitasKamar.map((fasilitas, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                          {fasilitas}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Deskripsi</h4>
                  <p className="text-gray-600">{selectedRoom.deskripsiKamar}</p>
                </div>

                <div className="flex gap-4 mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={closeRoomModal}
                    className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Tutup
                  </button>
                  <button className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors">
                    Pesan Kamar Ini
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default HotelDetailPage;