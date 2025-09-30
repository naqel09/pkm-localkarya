"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, Plus, X, ImageIcon, Edit, Trash2 } from 'lucide-react';
import Image from 'next/image';

interface HotelFormData {
  namaHotel: string;
  alamatHotel: string;
  googleMapsHotel: string;
  noWa: string;
  deskripsiHotel: string;
  fasilitas: string[];
  gambar1: string | null;
  gambar2: string | null;
  gambar3: string | null;
}

interface RoomFormData {
  id?: number;
  jenisKamar: string;
  luasKamar: string;
  fasilitasKamar: string[];
  hargaPerMalam: number;
  banyaknyaTamu: number;
  deskripsiKamar: string;
  gambar1: string | null;
  gambar2: string | null;
  gambar3: string | null;
  gambar360: string | null;
}

interface HotelPreviewState {
  gambar1: string | null;
  gambar2: string | null;
  gambar3: string | null;
}

interface RoomPreviewState {
  gambar1: string | null;
  gambar2: string | null;
  gambar3: string | null;
  gambar360: string | null;
}

const EditHotelPage = () => {
  const params = useParams();
  const router = useRouter();
  const hotelId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [hotelData, setHotelData] = useState<HotelFormData>({
    namaHotel: '',
    alamatHotel: '',
    googleMapsHotel: '',
    noWa: '',
    deskripsiHotel: '',
    fasilitas: [],
    gambar1: null,
    gambar2: null,
    gambar3: null,
  });

  const [hotelPreviews, setHotelPreviews] = useState<HotelPreviewState>({
    gambar1: null,
    gambar2: null,
    gambar3: null,
  });

  const [roomPreviews, setRoomPreviews] = useState<RoomPreviewState>({
    gambar1: null,
    gambar2: null,
    gambar3: null,
    gambar360: null,
  });

  const [newFasilitas, setNewFasilitas] = useState('');
  const [rooms, setRooms] = useState<RoomFormData[]>([]);
  
  // Room Modal State
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [editingRoomIndex, setEditingRoomIndex] = useState<number | null>(null);
  const [currentRoom, setCurrentRoom] = useState<RoomFormData>({
    jenisKamar: '',
    luasKamar: '',
    fasilitasKamar: [],
    hargaPerMalam: 0,
    banyaknyaTamu: 1,
    deskripsiKamar: '',
    gambar1: null,
    gambar2: null,
    gambar3: null,
    gambar360: null,
  });
  const [newRoomFasilitas, setNewRoomFasilitas] = useState('');

  // Fetch hotel data
  useEffect(() => {
    const fetchHotelData = async () => {
      if (!hotelId) return;
      
      setLoading(true);
      try {
        const res = await fetch(`/api/hotel/${hotelId}`, {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache',
          },
        });
        
        if (!res.ok) {
          throw new Error('Gagal mengambil data hotel');
        }
        
        const response = await res.json();
        if (response.success && response.data) {
          const hotel = response.data;
          
          // Set hotel data
          setHotelData({
            namaHotel: hotel.namaHotel || '',
            alamatHotel: hotel.alamatHotel || '',
            googleMapsHotel: hotel.googleMapsHotel || '',
            noWa: hotel.noWa || '',
            deskripsiHotel: hotel.deskripsiHotel || '',
            fasilitas: Array.isArray(hotel.fasilitas) ? hotel.fasilitas : [],
            gambar1: hotel.gambar1 || null,
            gambar2: hotel.gambar2 || null,
            gambar3: hotel.gambar3 || null,
          });

          // Set existing image previews with full URL path
          setHotelPreviews({
            gambar1: hotel.gambar1 ? `/uploads/${hotel.gambar1}` : null,
            gambar2: hotel.gambar2 ? `/uploads/${hotel.gambar2}` : null,
            gambar3: hotel.gambar3 ? `/uploads/${hotel.gambar3}` : null,
          });

          // Set rooms data
          if (hotel.rooms && Array.isArray(hotel.rooms)) {
            const roomsData = hotel.rooms.map((room: any) => ({
              id: room.id,
              jenisKamar: room.jenisKamar || '',
              luasKamar: room.luasKamar || '',
              fasilitasKamar: Array.isArray(room.fasilitasKamar) ? room.fasilitasKamar : [],
              hargaPerMalam: room.hargaPerMalam || 0,
              banyaknyaTamu: room.banyaknyaTamu || 1,
              deskripsiKamar: room.deskripsiKamar || '',
              gambar1: room.gambar1 || null,
              gambar2: room.gambar2 || null,
              gambar3: room.gambar3 || null,
              gambar360: room.gambar360 || null,
            }));
            setRooms(roomsData);
          }
        } else {
          throw new Error(response.message || 'Gagal mengambil data hotel');
        }
      } catch (error) {
        console.error('Error fetching hotel data:', error);
        alert('Gagal mengambil data hotel. Silakan coba lagi.');
        router.push('/dashboard/Hotel');
      } finally {
        setLoading(false);
      }
    };

    fetchHotelData();
  }, [hotelId, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setHotelData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addFasilitas = () => {
    if (newFasilitas.trim() && !hotelData.fasilitas.includes(newFasilitas.trim())) {
      setHotelData(prev => ({
        ...prev,
        fasilitas: [...prev.fasilitas, newFasilitas.trim()]
      }));
      setNewFasilitas('');
    }
  };

  const removeFasilitas = (index: number) => {
    setHotelData(prev => ({
      ...prev,
      fasilitas: prev.fasilitas.filter((_, i) => i !== index)
    }));
  };

  const handleHotelImageChange = async (e: React.ChangeEvent<HTMLInputElement>, field: keyof HotelPreviewState) => {
    const file = e.target.files?.[0];
    if (file) {
      // Show preview immediately
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setHotelPreviews(prev => ({
          ...prev,
          [field]: result
        }));
      };
      reader.readAsDataURL(file);

      // Upload file to server
      try {
        const formData = new FormData();
        formData.append('file', file);

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const uploadResult = await uploadResponse.json();
        
        if (uploadResult.success) {
          // Store the actual filename in hotel data
          setHotelData(prev => ({
            ...prev,
            [field]: uploadResult.filename
          }));
          
          // Update preview with full path
          setHotelPreviews(prev => ({
            ...prev,
            [field]: `/uploads/${uploadResult.filename}`
          }));
        } else {
          alert('Gagal mengupload gambar: ' + uploadResult.message);
          // Reset preview on error
          setHotelPreviews(prev => ({
            ...prev,
            [field]: null
          }));
        }
      } catch (error) {
        console.error('Upload error:', error);
        alert('Gagal mengupload gambar. Silakan coba lagi.');
        // Reset preview on error
        setHotelPreviews(prev => ({
          ...prev,
          [field]: null
        }));
      }
    }
  };

  const handleRoomImageChange = async (e: React.ChangeEvent<HTMLInputElement>, field: keyof RoomPreviewState) => {
    const file = e.target.files?.[0];
    if (file) {
      // Show preview immediately
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setRoomPreviews(prev => ({
          ...prev,
          [field]: result
        }));
      };
      reader.readAsDataURL(file);

      // Upload file to server
      try {
        const formData = new FormData();
        formData.append('file', file);

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const uploadResult = await uploadResponse.json();
        
        if (uploadResult.success) {
          // Store the actual filename in room data
          setCurrentRoom(prev => ({
            ...prev,
            [field]: uploadResult.filename
          }));
          
          // Update preview with full path
          setRoomPreviews(prev => ({
            ...prev,
            [field]: `/uploads/${uploadResult.filename}`
          }));
        } else {
          alert('Gagal mengupload gambar: ' + uploadResult.message);
          // Reset preview on error
          setRoomPreviews(prev => ({
            ...prev,
            [field]: null
          }));
        }
      } catch (error) {
        console.error('Upload error:', error);
        alert('Gagal mengupload gambar. Silakan coba lagi.');
        // Reset preview on error
        setRoomPreviews(prev => ({
          ...prev,
          [field]: null
        }));
      }
    }
  };

  // Room management functions
  const handleRoomChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentRoom(prev => ({
      ...prev,
      [name]: name === 'hargaPerMalam' || name === 'banyaknyaTamu' ? Number(value) : value
    }));
  };

  const addRoomFasilitas = () => {
    if (newRoomFasilitas.trim() && !currentRoom.fasilitasKamar.includes(newRoomFasilitas.trim())) {
      setCurrentRoom(prev => ({
        ...prev,
        fasilitasKamar: [...prev.fasilitasKamar, newRoomFasilitas.trim()]
      }));
      setNewRoomFasilitas('');
    }
  };

  const removeRoomFasilitas = (index: number) => {
    setCurrentRoom(prev => ({
      ...prev,
      fasilitasKamar: prev.fasilitasKamar.filter((_, i) => i !== index)
    }));
  };

  const openRoomModal = (roomIndex?: number) => {
    if (roomIndex !== undefined) {
      const room = rooms[roomIndex];
      setCurrentRoom(room);
      setEditingRoomIndex(roomIndex);
      
      // Set preview images for existing room with full URL path
      setRoomPreviews({
        gambar1: room.gambar1 ? `/uploads/${room.gambar1}` : null,
        gambar2: room.gambar2 ? `/uploads/${room.gambar2}` : null,
        gambar3: room.gambar3 ? `/uploads/${room.gambar3}` : null,
        gambar360: room.gambar360 ? `/uploads/${room.gambar360}` : null,
      });
    } else {
      setCurrentRoom({
        jenisKamar: '',
        luasKamar: '',
        fasilitasKamar: [],
        hargaPerMalam: 0,
        banyaknyaTamu: 1,
        deskripsiKamar: '',
        gambar1: null,
        gambar2: null,
        gambar3: null,
        gambar360: null,
      });
      setEditingRoomIndex(null);
      setRoomPreviews({
        gambar1: null,
        gambar2: null,
        gambar3: null,
        gambar360: null,
      });
    }
    setShowRoomModal(true);
  };

  const closeRoomModal = () => {
    setShowRoomModal(false);
    setCurrentRoom({
      jenisKamar: '',
      luasKamar: '',
      fasilitasKamar: [],
      hargaPerMalam: 0,
      banyaknyaTamu: 1,
      deskripsiKamar: '',
      gambar1: null,
      gambar2: null,
      gambar3: null,
      gambar360: null,
    });
    setEditingRoomIndex(null);
    setNewRoomFasilitas('');
    setRoomPreviews({
      gambar1: null,
      gambar2: null,
      gambar3: null,
      gambar360: null,
    });
  };

  const saveRoom = () => {
    if (!currentRoom.jenisKamar || !currentRoom.luasKamar || !currentRoom.deskripsiKamar) {
      alert('Mohon lengkapi data kamar yang diperlukan');
      return;
    }

    if (editingRoomIndex !== null) {
      const updatedRooms = [...rooms];
      updatedRooms[editingRoomIndex] = currentRoom;
      setRooms(updatedRooms);
    } else {
      setRooms(prev => [...prev, currentRoom]);
    }

    closeRoomModal();
  };

  const removeRoom = (index: number) => {
    if (confirm('Yakin ingin menghapus kamar ini?')) {
      setRooms(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!hotelData.namaHotel || !hotelData.alamatHotel || !hotelData.deskripsiHotel) {
      alert('Mohon lengkapi data hotel yang diperlukan');
      return;
    }

    if (rooms.length === 0) {
      alert('Mohon tambahkan minimal satu kamar');
      return;
    }

    setSubmitting(true);

    try {
      const requestData = {
        ...hotelData,
        rooms: rooms,
      };

      const res = await fetch(`/api/hotel/${hotelId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!res.ok) {
        throw new Error('Gagal memperbarui data hotel');
      }

      const response = await res.json();
      if (response.success) {
        alert('Hotel berhasil diperbarui!');
        router.push('/dashboard/Hotel');
      } else {
        throw new Error(response.message || 'Gagal memperbarui hotel');
      }
    } catch (error) {
      console.error('Error updating hotel:', error);
      alert('Gagal memperbarui hotel. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data hotel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.push('/dashboard/Hotel')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-5 h-5" />
            Kembali
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Edit Hotel</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Hotel Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Informasi Hotel</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Hotel *
                </label>
                <input
                  type="text"
                  name="namaHotel"
                  value={hotelData.namaHotel}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Masukkan nama hotel"
                />
              </div>

              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alamat Hotel *
                </label>
                <input
                  type="text"
                  name="alamatHotel"
                  value={hotelData.alamatHotel}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Masukkan alamat hotel"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link Google Maps
                </label>
                <input
                  type="url"
                  name="googleMapsHotel"
                  value={hotelData.googleMapsHotel}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://maps.google.com/..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nomor WhatsApp (Opsional)
                </label>
                <input
                  type="tel"
                  name="noWa"
                  value={hotelData.noWa}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="628xxxxxxxxxx (dimulai dengan 62)"
                  pattern="^62\d{9,13}$"
                />
                <p className="text-gray-500 text-xs mt-1">
                  Format: 628xxxxxxxxxx (dimulai dengan 62)
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi Hotel *
                </label>
                <textarea
                  name="deskripsiHotel"
                  value={hotelData.deskripsiHotel}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Jelaskan tentang hotel ini..."
                />
              </div>
            </div>

            {/* Fasilitas Management */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fasilitas Hotel
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newFasilitas}
                  onChange={(e) => setNewFasilitas(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tambah fasilitas (WiFi, Parkir, Kolam Renang, dll)"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFasilitas())}
                />
                <button
                  type="button"
                  onClick={addFasilitas}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {hotelData.fasilitas.map((fasilitas, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {fasilitas}
                    <button
                      type="button"
                      onClick={() => removeFasilitas(index)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Upload Gambar Hotel */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Gambar Hotel
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Gambar 1 */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Gambar Utama *
                  </label>
                  <label htmlFor="hotelGambar1Upload" className="cursor-pointer">
                    <div className="w-full h-[200px] bg-gray-300 rounded-md flex items-center justify-center hover:bg-gray-400 transition shadow-sm border border-gray-400">
                      {hotelPreviews.gambar1 ? (
                        <Image
                          src={hotelPreviews.gambar1}
                          alt="Preview Gambar Hotel 1"
                          className="object-cover object-center w-full h-full rounded-md hover:ring-2 hover:ring-blue-400"
                          width={200}
                          height={200}
                        />
                      ) : (
                        <div className="text-center">
                          <ImageIcon className="w-12 h-12 text-white mx-auto mb-2" />
                          <span className="text-white text-sm">Gambar Utama</span>
                        </div>
                      )}
                    </div>
                  </label>
                  <input
                    id="hotelGambar1Upload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleHotelImageChange(e, 'gambar1')}
                    className="hidden"
                  />
                </div>

                {/* Gambar 2 */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Gambar Tambahan 1
                  </label>
                  <label htmlFor="hotelGambar2Upload" className="cursor-pointer">
                    <div className="w-full h-[200px] bg-gray-300 rounded-md flex items-center justify-center hover:bg-gray-400 transition shadow-sm border border-gray-400">
                      {hotelPreviews.gambar2 ? (
                        <Image
                          src={hotelPreviews.gambar2}
                          alt="Preview Gambar Hotel 2"
                          className="object-cover object-center w-full h-full rounded-md hover:ring-2 hover:ring-blue-400"
                          width={200}
                          height={200}
                        />
                      ) : (
                        <div className="text-center">
                          <ImageIcon className="w-12 h-12 text-white mx-auto mb-2" />
                          <span className="text-white text-sm">Opsional</span>
                        </div>
                      )}
                    </div>
                  </label>
                  <input
                    id="hotelGambar2Upload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleHotelImageChange(e, 'gambar2')}
                    className="hidden"
                  />
                </div>

                {/* Gambar 3 */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Gambar Tambahan 2
                  </label>
                  <label htmlFor="hotelGambar3Upload" className="cursor-pointer">
                    <div className="w-full h-[200px] bg-gray-300 rounded-md flex items-center justify-center hover:bg-gray-400 transition shadow-sm border border-gray-400">
                      {hotelPreviews.gambar3 ? (
                        <Image
                          src={hotelPreviews.gambar3}
                          alt="Preview Gambar Hotel 3"
                          className="object-cover object-center w-full h-full rounded-md hover:ring-2 hover:ring-blue-400"
                          width={200}
                          height={200}
                        />
                      ) : (
                        <div className="text-center">
                          <ImageIcon className="w-12 h-12 text-white mx-auto mb-2" />
                          <span className="text-white text-sm">Opsional</span>
                        </div>
                      )}
                    </div>
                  </label>
                  <input
                    id="hotelGambar3Upload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleHotelImageChange(e, 'gambar3')}
                    className="hidden"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Upload hingga 3 gambar hotel. Format yang didukung: JPG, PNG, GIF
              </p>
            </div>
          </div>

          {/* Room Management */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Manajemen Kamar</h2>
              <button
                type="button"
                onClick={() => openRoomModal()}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                <Plus className="w-4 h-4" />
                Tambah Kamar
              </button>
            </div>

            {/* Rooms List */}
            <div className="space-y-4">
              {rooms.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Belum ada kamar yang ditambahkan
                </div>
              ) : (
                rooms.map((room, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <h4 className="font-semibold text-lg text-gray-800">{room.jenisKamar}</h4>
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                            Rp {room.hargaPerMalam.toLocaleString('id-ID')}/malam
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Luas: </span>{room.luasKamar}
                          </div>
                          <div>
                            <span className="font-medium">Kapasitas: </span>{room.banyaknyaTamu} tamu
                          </div>
                          <div>
                            <span className="font-medium">Fasilitas: </span>
                            {room.fasilitasKamar.slice(0, 2).join(', ')}
                            {room.fasilitasKamar.length > 2 && ` +${room.fasilitasKamar.length - 2} lagi`}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">{room.deskripsiKamar}</p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          type="button"
                          onClick={() => openRoomModal(index)}
                          className="flex items-center gap-1 text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 text-sm rounded-md"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => removeRoom(index)}
                          className="flex items-center gap-1 text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 text-sm rounded-md"
                        >
                          <Trash2 className="w-4 h-4" />
                          Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Memperbarui...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Perbarui Hotel
                </>
              )}
            </button>
          </div>
        </form>

        {/* Room Modal */}
        {showRoomModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {editingRoomIndex !== null ? 'Edit Kamar' : 'Tambah Kamar Baru'}
                  </h3>
                  <button
                    type="button"
                    onClick={closeRoomModal}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Jenis Kamar */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jenis Kamar *
                    </label>
                    <input
                      type="text"
                      name="jenisKamar"
                      value={currentRoom.jenisKamar}
                      onChange={handleRoomChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Contoh: Deluxe Room, Standard Room, Suite"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Luas Kamar */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Luas Kamar *
                      </label>
                      <input
                        type="text"
                        name="luasKamar"
                        value={currentRoom.luasKamar}
                        onChange={handleRoomChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Contoh: 25 m², 30 m²"
                      />
                    </div>

                    {/* Harga per Malam */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Harga per Malam *
                      </label>
                      <input
                        type="number"
                        name="hargaPerMalam"
                        value={currentRoom.hargaPerMalam}
                        onChange={handleRoomChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Contoh: 500000"
                        min="0"
                      />
                    </div>

                    {/* Banyaknya Tamu */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kapasitas Tamu *
                      </label>
                      <input
                        type="number"
                        name="banyaknyaTamu"
                        value={currentRoom.banyaknyaTamu}
                        onChange={handleRoomChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Contoh: 2"
                        min="1"
                      />
                    </div>
                  </div>

                  {/* Deskripsi Kamar */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Deskripsi Kamar *
                    </label>
                    <textarea
                      name="deskripsiKamar"
                      value={currentRoom.deskripsiKamar}
                      onChange={handleRoomChange}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Jelaskan tentang kamar ini..."
                    />
                  </div>

                  {/* Fasilitas Kamar */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fasilitas Kamar
                    </label>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={newRoomFasilitas}
                        onChange={(e) => setNewRoomFasilitas(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Tambah fasilitas kamar (AC, TV, WiFi, dll)"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRoomFasilitas())}
                      />
                      <button
                        type="button"
                        onClick={addRoomFasilitas}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {/* List Fasilitas Kamar */}
                    <div className="flex flex-wrap gap-2">
                      {currentRoom.fasilitasKamar.map((fasilitas, index) => (
                        <span
                          key={index}
                          className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                        >
                          {fasilitas}
                          <button
                            type="button"
                            onClick={() => removeRoomFasilitas(index)}
                            className="text-green-600 hover:text-green-800"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Upload Gambar Kamar */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Gambar Kamar
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Gambar 1 */}
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          Gambar Utama *
                        </label>
                        <label htmlFor="roomGambar1Upload" className="cursor-pointer">
                          <div className="w-full h-[150px] bg-gray-300 rounded-md flex items-center justify-center hover:bg-gray-400 transition shadow-sm border border-gray-400">
                            {roomPreviews.gambar1 ? (
                              <Image
                                src={roomPreviews.gambar1}
                                alt="Preview Gambar Room 1"
                                className="object-cover object-center w-full h-full rounded-md hover:ring-2 hover:ring-blue-400"
                                width={150}
                                height={150}
                              />
                            ) : (
                              <div className="text-center">
                                <ImageIcon className="w-8 h-8 text-white mx-auto mb-1" />
                                <span className="text-white text-xs">Utama</span>
                              </div>
                            )}
                          </div>
                        </label>
                        <input
                          id="roomGambar1Upload"
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleRoomImageChange(e, 'gambar1')}
                          className="hidden"
                        />
                      </div>

                      {/* Gambar 2 */}
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          Gambar 2
                        </label>
                        <label htmlFor="roomGambar2Upload" className="cursor-pointer">
                          <div className="w-full h-[150px] bg-gray-300 rounded-md flex items-center justify-center hover:bg-gray-400 transition shadow-sm border border-gray-400">
                            {roomPreviews.gambar2 ? (
                              <Image
                                src={roomPreviews.gambar2}
                                alt="Preview Gambar Room 2"
                                className="object-cover object-center w-full h-full rounded-md hover:ring-2 hover:ring-blue-400"
                                width={150}
                                height={150}
                              />
                            ) : (
                              <div className="text-center">
                                <ImageIcon className="w-8 h-8 text-white mx-auto mb-1" />
                                <span className="text-white text-xs">Opsional</span>
                              </div>
                            )}
                          </div>
                        </label>
                        <input
                          id="roomGambar2Upload"
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleRoomImageChange(e, 'gambar2')}
                          className="hidden"
                        />
                      </div>

                      {/* Gambar 3 */}
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          Gambar 3
                        </label>
                        <label htmlFor="roomGambar3Upload" className="cursor-pointer">
                          <div className="w-full h-[150px] bg-gray-300 rounded-md flex items-center justify-center hover:bg-gray-400 transition shadow-sm border border-gray-400">
                            {roomPreviews.gambar3 ? (
                              <Image
                                src={roomPreviews.gambar3}
                                alt="Preview Gambar Room 3"
                                className="object-cover object-center w-full h-full rounded-md hover:ring-2 hover:ring-blue-400"
                                width={150}
                                height={150}
                              />
                            ) : (
                              <div className="text-center">
                                <ImageIcon className="w-8 h-8 text-white mx-auto mb-1" />
                                <span className="text-white text-xs">Opsional</span>
                              </div>
                            )}
                          </div>
                        </label>
                        <input
                          id="roomGambar3Upload"
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleRoomImageChange(e, 'gambar3')}
                          className="hidden"
                        />
                      </div>

                      {/* Gambar 360 */}
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          Gambar 360° (Khusus)
                        </label>
                        <label htmlFor="roomGambar360Upload" className="cursor-pointer">
                          <div className="w-full h-[150px] bg-gradient-to-r from-blue-300 to-purple-300 rounded-md flex items-center justify-center hover:from-blue-400 hover:to-purple-400 transition shadow-sm border border-blue-400">
                            {roomPreviews.gambar360 ? (
                              <Image
                                src={roomPreviews.gambar360}
                                alt="Preview Gambar 360°"
                                className="object-cover object-center w-full h-full rounded-md hover:ring-2 hover:ring-purple-400"
                                width={150}
                                height={150}
                              />
                            ) : (
                              <div className="text-center">
                                <ImageIcon className="w-8 h-8 text-white mx-auto mb-1" />
                                <span className="text-white text-xs">360°</span>
                              </div>
                            )}
                          </div>
                        </label>
                        <input
                          id="roomGambar360Upload"
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleRoomImageChange(e, 'gambar360')}
                          className="hidden"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Upload hingga 3 gambar kamar dan 1 gambar 360°. Format yang didukung: JPG, PNG, GIF. Gambar 360° khusus untuk virtual tour.
                    </p>
                  </div>
                </div>

                {/* Modal Actions */}
                <div className="flex justify-end gap-4 mt-6 pt-6 border-t">
                  <button
                    type="button"
                    onClick={closeRoomModal}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={saveRoom}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Simpan Kamar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditHotelPage;
