'use client'
import React, { useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import TourHeader from '@/components/TourHeader'
import { MapPin, Phone, Clock, Users, Star, ChefHat, X, Map, MessageCircle } from 'lucide-react'

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
  gmaps?: string;
  noWa?: string;
  operatingHours?: string;
  capacity?: string;
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

const RestaurantDetailPage = ({ params }: { params: Promise<{ slug: string }> }) => {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [resolvedParams, setResolvedParams] = useState<{ slug: string } | null>(null);

  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params;
      setResolvedParams(resolved);
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (resolvedParams) {
      fetchRestaurant();
    }
  }, [resolvedParams]);

  const fetchRestaurant = async () => {
    if (!resolvedParams) return;
    
    try {
      setLoading(true);
      const response = await fetch(`/api/restaurant/${resolvedParams.slug}`);
      const data = await response.json();
      
      if (data.success) {
        setRestaurant(data.data);
      } else {
        setError('Restaurant not found');
      }
    } catch (err) {
      setError('Error loading restaurant');
      console.error('Error fetching restaurant:', err);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (filename?: string) => {
    if (!filename) return '/images/artikel/artikel.jpg'; // Use existing image as placeholder
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

  const openImageModal = (imageUrl: string) => {
    setModalImage(imageUrl);
  };

  const closeImageModal = () => {
    setModalImage(null);
  };

  // Handle keyboard ESC to close modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeImageModal();
      }
    };

    if (modalImage) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [modalImage]);

  if (loading) {
    return (
      <>
        <TourHeader title='Restaurant Detail' halaman='Home' bagian="Restaurant | Loading..." image="/makanan1.webp"/>
        <section className='max-w-7xl mx-auto p-6'>
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading restaurant details...</p>
          </div>
        </section>
      </>
    );
  }

  if (error || !restaurant) {
    return notFound();
  }

  // Get all available images for the gallery
  const restaurantImages = [
    restaurant.gambar1,
    restaurant.gambar2,
    restaurant.gambar3,
    restaurant.gambar4,
    restaurant.gambar5,
    restaurant.gambar6,
  ].filter(Boolean);

  const menuPhotos = [
    restaurant.fotoMenu1,
    restaurant.fotoMenu2,
    restaurant.fotoMenu3,
  ].filter(Boolean);

  return (
    <>
      <TourHeader 
        title={restaurant.namaRestaurant} 
        halaman='Home' 
        bagian={`Restaurant | ${restaurant.namaRestaurant}`} 
        image="/makanan1.webp"
      />
      
      <section className='max-w-7xl mx-auto p-6'>
        {/* Image Gallery */}
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8'>
          {/* Main Image */}
          <div className='lg:col-span-3'>
            <div 
              className='relative w-full h-[500px] rounded-2xl overflow-hidden shadow-lg cursor-pointer group'
              onClick={() => openImageModal(getImageUrl(restaurantImages[selectedImageIndex]))}
            >
              <Image 
                src={getImageUrl(restaurantImages[selectedImageIndex])} 
                alt={restaurant.namaRestaurant} 
                fill 
                className='object-cover transition-all duration-300 group-hover:scale-105'
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              
              {/* Zoom indicator */}
              <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-white/90 rounded-full p-2 shadow-lg">
                  <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              
              {/* Image Navigation */}
              {restaurantImages.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImageIndex(prev => prev > 0 ? prev - 1 : restaurantImages.length - 1)}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setSelectedImageIndex(prev => prev < restaurantImages.length - 1 ? prev + 1 : 0)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
            </div>
          </div>
          
          {/* Thumbnail Gallery */}
          <div className='space-y-4'>
            {restaurantImages.slice(0, 4).map((image, index) => (
              <div 
                key={index}
                className={`relative h-28 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 group ${
                  selectedImageIndex === index ? 'ring-4 ring-blue-500 shadow-lg' : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedImageIndex(index)}
                onDoubleClick={() => openImageModal(getImageUrl(image))}
              >
                <Image 
                  src={getImageUrl(image)} 
                  alt={`${restaurant.namaRestaurant} ${index + 1}`} 
                  fill 
                  className='object-cover group-hover:scale-105 transition-transform duration-300'
                />
                {/* Double-click hint */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/90 rounded-full p-1">
                      <svg className="w-3 h-3 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {restaurantImages.length > 4 && (
              <div className="text-center text-sm text-gray-600 font-medium">
                +{restaurantImages.length - 4} more photos
              </div>
            )}
          </div>
        </div>

        {/* Restaurant Info */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Main Content */}
          <div className='lg:col-span-2'>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className='text-4xl font-bold mb-2 text-gray-800'>{restaurant.namaRestaurant}</h1>
                <div className="flex items-center space-x-4 text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="font-medium">4.5</span>
                    <span className="text-sm">(128 reviews)</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{restaurant.alamatRestaurant}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className='mb-8'>
              <h2 className='text-2xl font-bold mb-4 text-gray-800'>Tentang Restaurant</h2>
              <p className="text-gray-700 leading-relaxed">{restaurant.deskripsiRestaurant}</p>
            </div>

            {/* Menu Photos */}
            {menuPhotos.length > 0 && (
              <div className='mb-8'>
                <h2 className='text-2xl font-bold mb-4 text-gray-800'>Foto Menu</h2>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  {menuPhotos.map((photo, index) => (
                    <div 
                      key={index} 
                      className='relative h-48 rounded-lg overflow-hidden shadow-md cursor-pointer group'
                      onClick={() => openImageModal(getImageUrl(photo))}
                    >
                      <Image 
                        src={getImageUrl(photo)} 
                        alt={`Menu Photo ${index + 1}`} 
                        fill 
                        className='object-cover group-hover:scale-105 transition-transform duration-300'
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="bg-white/90 rounded-full p-3">
                            <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Menu Items */}
            <div className='mb-8'>
              <h2 className='text-2xl font-bold mb-6 text-gray-800 flex items-center space-x-2'>
                <ChefHat className="w-6 h-6" />
                <span>Menu ({restaurant.menus?.length || 0} items)</span>
              </h2>
              
              {restaurant.menus && restaurant.menus.length > 0 ? (
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  {restaurant.menus.map((menu) => (
                    <div key={menu.id} className='bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow'>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className='text-lg font-semibold text-gray-800'>{menu.namaMenu}</h3>
                        <span className='text-lg font-bold text-blue-600'>{formatPrice(menu.harga)}</span>
                      </div>
                      
                      {/* Menu Images */}
                      {(menu.fotoMakanan1 || menu.fotoMakanan2) && (
                        <div className='flex space-x-2 mt-3'>
                          {menu.fotoMakanan1 && (
                            <div 
                              className='relative w-16 h-16 rounded-md overflow-hidden cursor-pointer group'
                              onClick={() => openImageModal(getImageUrl(menu.fotoMakanan1))}
                            >
                              <Image 
                                src={getImageUrl(menu.fotoMakanan1)} 
                                alt={menu.namaMenu} 
                                fill 
                                className='object-cover group-hover:scale-110 transition-transform duration-300'
                                sizes="64px"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          )}
                          {menu.fotoMakanan2 && (
                            <div 
                              className='relative w-16 h-16 rounded-md overflow-hidden cursor-pointer group'
                              onClick={() => openImageModal(getImageUrl(menu.fotoMakanan2))}
                            >
                              <Image 
                                src={getImageUrl(menu.fotoMakanan2)} 
                                alt={menu.namaMenu} 
                                fill 
                                className='object-cover group-hover:scale-110 transition-transform duration-300'
                                sizes="64px"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">Menu items will be updated soon</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className='lg:col-span-1'>
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Quick Info</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-800">Address</p>
                    <p className="text-gray-600 text-sm">{restaurant.alamatRestaurant}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-800">Operating Hours</p>
                    <p className="text-gray-600 text-sm">{restaurant.operatingHours || 'Coming Soon'}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Users className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-800">Capacity</p>
                    <p className="text-gray-600 text-sm">{restaurant.capacity || 'Please contact for details'}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <ChefHat className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-800">Menu Items</p>
                    <p className="text-gray-600 text-sm">{restaurant.menus?.length || 0} dishes available</p>
                  </div>
                </div>
              </div>

              {/* Google Maps Section */}
              {restaurant.gmaps && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium text-gray-800 flex items-center space-x-2">
                      <Map className="w-5 h-5 text-blue-600" />
                      <span>Lokasi Restaurant</span>
                    </h3>
                    <a
                      href={restaurant.gmaps}
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
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(restaurant.alamatRestaurant)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`Lokasi ${restaurant.namaRestaurant}`}
                      className="w-full h-full"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-2 text-center">
                    Peta interaktif - Anda dapat zoom, drag, dan berinteraksi dengan peta
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                {/* WhatsApp Button */}
                {restaurant.noWa && (
                  <button 
                    onClick={() => window.open(`https://wa.me/${restaurant.noWa}?text=Halo, saya ingin bertanya tentang ${restaurant.namaRestaurant}`, '_blank')}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center space-x-2"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Chat WhatsApp</span>
                  </button>
                )}
                
                {/* Maps and Direction Buttons */}
                {restaurant.gmaps && (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button 
                      onClick={() => window.open(restaurant.gmaps, '_blank')}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2 text-sm"
                    >
                      <Map className="w-4 h-4" />
                      <span>Buka di Google Maps</span>
                    </button>
                    <button
                      onClick={() => {
                        const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(restaurant.alamatRestaurant)}`;
                        window.open(mapsUrl, '_blank');
                      }}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                    >
                      <MapPin className="w-4 h-4" />
                      Petunjuk Arah
                    </button>
                  </div>
                )}
                
                {/* Call Button */}
                {restaurant.noWa && (
                  <button 
                    onClick={() => window.open(`tel:+${restaurant.noWa}`, '_self')}
                    className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center space-x-2"
                  >
                    <Phone className="w-5 h-5" />
                    <span>Call Restaurant</span>
                  </button>
                )}
                
                <button className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                  Share Restaurant
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Image Modal */}
        {modalImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center p-4">
              {/* Close Button */}
              <button
                onClick={closeImageModal}
                className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200"
              >
                <X className="w-6 h-6 text-gray-800" />
              </button>
              
              {/* Modal Image */}
              <div className="relative w-full h-full">
                <Image
                  src={modalImage}
                  alt="Enlarged view"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                  priority
                />
              </div>
              
              {/* Click outside to close */}
              <div 
                className="absolute inset-0 -z-10" 
                onClick={closeImageModal}
              />
            </div>
          </div>
        )}
      </section>
    </>
  )
}

export default RestaurantDetailPage
