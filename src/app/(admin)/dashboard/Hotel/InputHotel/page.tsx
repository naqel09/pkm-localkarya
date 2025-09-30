"use client";
import React, { useState } from "react";
import { Plus, Save, ArrowLeft, X, ImageIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface RoomFormData {
  jenisKamar: string;
  luasKamar: string;
  fasilitasKamar: string[];
  hargaPerMalam: string;
  banyaknyaTamu: string;
  deskripsiKamar: string;
  gambar1?: string;
  gambar2?: string;
  gambar3?: string;
  gambar360?: string;
}

interface HotelFormData {
  namaHotel: string;
  alamatHotel: string;
  googleMapsHotel: string;
  noWa: string;
  deskripsiHotel: string;
  fasilitas: string[];
  gambar1?: string;
  gambar2?: string;
  gambar3?: string;
}

const InputHotelPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Form data states
  const [hotelData, setHotelData] = useState<HotelFormData>({
    namaHotel: "",
    alamatHotel: "",
    googleMapsHotel: "",
    noWa: "",
    deskripsiHotel: "",
    fasilitas: [],
    gambar1: "",
    gambar2: "",
    gambar3: ""
  });

  // Preview states for Hotel images
  const [hotelPreviews, setHotelPreviews] = useState({
    gambar1: null as string | null,
    gambar2: null as string | null,
    gambar3: null as string | null
  });
  
  const [rooms, setRooms] = useState<RoomFormData[]>([]);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [editingRoomIndex, setEditingRoomIndex] = useState<number | null>(null);
  
  // Form states
  const [newFasilitas, setNewFasilitas] = useState("");
  const [currentRoom, setCurrentRoom] = useState<RoomFormData>({
    jenisKamar: "",
    luasKamar: "",
    fasilitasKamar: [],
    hargaPerMalam: "",
    banyaknyaTamu: "",
    deskripsiKamar: "",
    gambar1: "",
    gambar2: "",
    gambar3: "",
    gambar360: ""
  });
  const [newRoomFasilitas, setNewRoomFasilitas] = useState("");

  // Preview states for Room images
  const [roomPreviews, setRoomPreviews] = useState({
    gambar1: null as string | null,
    gambar2: null as string | null,
    gambar3: null as string | null,
    gambar360: null as string | null
  });

  // Handle hotel form input changes
  const handleHotelChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setHotelData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle hotel image change with preview
  const handleHotelImageChange = async (e: React.ChangeEvent<HTMLInputElement>, imageType: 'gambar1' | 'gambar2' | 'gambar3') => {
    const file = e.target.files?.[0];
    if (file) {
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
            [imageType]: uploadResult.filename
          }));
          
          // Update preview with full path
          setHotelPreviews(prev => ({
            ...prev,
            [imageType]: `/uploads/${uploadResult.filename}`
          }));
        } else {
          alert('Gagal mengupload gambar: ' + uploadResult.message);
          // Reset preview on error
          setHotelPreviews(prev => ({
            ...prev,
            [imageType]: null
          }));
        }
      } catch (error) {
        console.error('Upload error:', error);
        alert('Gagal mengupload gambar. Silakan coba lagi.');
        // Reset preview on error
        setHotelPreviews(prev => ({
          ...prev,
          [imageType]: null
        }));
      }
    }
  };

  // Handle fasilitas hotel
  const addFasilitas = () => {
    if (newFasilitas.trim() && !hotelData.fasilitas.includes(newFasilitas.trim())) {
      setHotelData(prev => ({
        ...prev,
        fasilitas: [...prev.fasilitas, newFasilitas.trim()]
      }));
      setNewFasilitas("");
    }
  };

  const removeFasilitas = (index: number) => {
    setHotelData(prev => ({
      ...prev,
      fasilitas: prev.fasilitas.filter((_, i) => i !== index)
    }));
  };

  // Handle room form
  const handleRoomChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentRoom(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle room image change with preview
  const handleRoomImageChange = async (e: React.ChangeEvent<HTMLInputElement>, imageType: 'gambar1' | 'gambar2' | 'gambar3' | 'gambar360') => {
    const file = e.target.files?.[0];
    if (file) {
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
            [imageType]: uploadResult.filename
          }));
          
          // Update preview with full path
          setRoomPreviews(prev => ({
            ...prev,
            [imageType]: `/uploads/${uploadResult.filename}`
          }));
        } else {
          alert('Gagal mengupload gambar: ' + uploadResult.message);
          // Reset preview on error
          setRoomPreviews(prev => ({
            ...prev,
            [imageType]: null
          }));
        }
      } catch (error) {
        console.error('Upload error:', error);
        alert('Gagal mengupload gambar. Silakan coba lagi.');
        // Reset preview on error
        setRoomPreviews(prev => ({
          ...prev,
          [imageType]: null
        }));
      }
    }
  };

  const addRoomFasilitas = () => {
    if (newRoomFasilitas.trim() && !currentRoom.fasilitasKamar.includes(newRoomFasilitas.trim())) {
      setCurrentRoom(prev => ({
        ...prev,
        fasilitasKamar: [...prev.fasilitasKamar, newRoomFasilitas.trim()]
      }));
      setNewRoomFasilitas("");
    }
  };

  const removeRoomFasilitas = (index: number) => {
    setCurrentRoom(prev => ({
      ...prev,
      fasilitasKamar: prev.fasilitasKamar.filter((_, i) => i !== index)
    }));
  };

  const openRoomModal = (roomIndex?: number) => {
    if (roomIndex !== undefined && roomIndex >= 0) {
      const room = rooms[roomIndex];
      setCurrentRoom(room);
      setEditingRoomIndex(roomIndex);
      // Set preview images for editing
      setRoomPreviews({
        gambar1: room.gambar1 || null,
        gambar2: room.gambar2 || null,
        gambar3: room.gambar3 || null,
        gambar360: room.gambar360 || null
      });
    } else {
      setCurrentRoom({
        jenisKamar: "",
        luasKamar: "",
        fasilitasKamar: [],
        hargaPerMalam: "",
        banyaknyaTamu: "",
        deskripsiKamar: "",
        gambar1: "",
        gambar2: "",
        gambar3: "",
        gambar360: ""
      });
      setEditingRoomIndex(null);
      // Reset preview images for new room
      setRoomPreviews({
        gambar1: null,
        gambar2: null,
        gambar3: null,
        gambar360: null
      });
    }
    setShowRoomModal(true);
  };

  const closeRoomModal = () => {
    setShowRoomModal(false);
    setEditingRoomIndex(null);
    setNewRoomFasilitas("");
    // Reset room preview images
    setRoomPreviews({
      gambar1: null,
      gambar2: null,
      gambar3: null,
      gambar360: null
    });
  };

  const saveRoom = () => {
    // Validasi
    if (!currentRoom.jenisKamar || !currentRoom.luasKamar || !currentRoom.hargaPerMalam || 
        !currentRoom.banyaknyaTamu || !currentRoom.deskripsiKamar) {
      alert("Semua field kamar wajib diisi!");
      return;
    }

    if (editingRoomIndex !== null) {
      // Update room
      const updatedRooms = [...rooms];
      updatedRooms[editingRoomIndex] = currentRoom;
      setRooms(updatedRooms);
    } else {
      // Add new room
      setRooms(prev => [...prev, currentRoom]);
    }
    
    closeRoomModal();
  };

  const deleteRoom = (index: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus kamar ini?")) {
      setRooms(prev => prev.filter((_, i) => i !== index));
    }
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi
    if (!hotelData.namaHotel || !hotelData.alamatHotel || !hotelData.deskripsiHotel) {
      alert("Nama hotel, alamat, dan deskripsi wajib diisi!");
      return;
    }

    if (hotelData.fasilitas.length === 0) {
      alert("Minimal satu fasilitas hotel harus diisi!");
      return;
    }

    setLoading(true);
    
    try {
      // Submit hotel first
      const hotelResponse = await fetch("/api/hotel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(hotelData)
      });

      const hotelResult = await hotelResponse.json();

      if (!hotelResult.success) {
        throw new Error(hotelResult.message || "Gagal menyimpan hotel");
      }

      const hotelId = hotelResult.data.id;

      // Submit rooms if any
      if (rooms.length > 0) {
        for (const room of rooms) {
          const roomResponse = await fetch("/api/admin/room", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              ...room,
              hotelId: hotelId,
              hargaPerMalam: parseFloat(room.hargaPerMalam),
              banyaknyaTamu: parseInt(room.banyaknyaTamu)
            })
          });

          const roomResult = await roomResponse.json();
          if (!roomResult.success) {
            console.error("Error creating room:", roomResult.message);
          }
        }
      }

      alert("Hotel berhasil ditambahkan!");
      router.push("/dashboard/Hotel");
      
    } catch (error) {
      console.error("Error submitting hotel:", error);
      alert("Error: " + (error instanceof Error ? error.message : "Terjadi kesalahan"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/Hotel"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-5 h-5" />
            Kembali
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Tambah Hotel Baru</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Hotel Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Informasi Hotel</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nama Hotel */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Hotel *
              </label>
              <input
                type="text"
                name="namaHotel"
                value={hotelData.namaHotel}
                onChange={handleHotelChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Masukkan nama hotel"
                required
              />
            </div>

            {/* Alamat Hotel */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alamat Hotel *
              </label>
              <input
                type="text"
                name="alamatHotel"
                value={hotelData.alamatHotel}
                onChange={handleHotelChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Masukkan alamat lengkap hotel"
                required
              />
            </div>

            {/* Google Maps */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Link Google Maps (Opsional)
              </label>
              <input
                type="url"
                name="googleMapsHotel"
                value={hotelData.googleMapsHotel}
                onChange={handleHotelChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://maps.google.com/..."
              />
            </div>

            {/* WhatsApp */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nomor WhatsApp (Opsional)
              </label>
              <input
                type="tel"
                name="noWa"
                value={hotelData.noWa}
                onChange={handleHotelChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="628xxxxxxxxxx (dimulai dengan 62)"
                pattern="^62\d{9,13}$"
              />
              <p className="text-gray-500 text-xs mt-1">
                Format: 628xxxxxxxxxx (dimulai dengan 62)
              </p>
            </div>

            {/* Deskripsi */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deskripsi Hotel *
              </label>
              <textarea
                name="deskripsiHotel"
                value={hotelData.deskripsiHotel}
                onChange={handleHotelChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Jelaskan tentang hotel ini..."
                required
              />
            </div>

            {/* Fasilitas Hotel */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fasilitas Hotel *
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newFasilitas}
                  onChange={(e) => setNewFasilitas(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tambah fasilitas (contoh: WiFi Gratis, Parkir, Kolam Renang)"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFasilitas())}
                />
                <button
                  type="button"
                  onClick={addFasilitas}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Tambah
                </button>
              </div>
              
              {/* List Fasilitas */}
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
              {hotelData.fasilitas.length === 0 && (
                <p className="text-sm text-gray-500 mt-2">Belum ada fasilitas yang ditambahkan</p>
              )}
            </div>

            {/* Upload Gambar Hotel */}
            <div className="md:col-span-2">
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

          {/* Room List */}
          {rooms.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Belum ada kamar yang ditambahkan</p>
              <p className="text-sm">Klik tombol &quot;Tambah Kamar&quot; untuk menambahkan kamar</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rooms.map((room, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-gray-800">{room.jenisKamar}</h3>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => openRoomModal(index)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteRoom(index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><span className="font-medium">Luas:</span> {room.luasKamar}</p>
                    <p><span className="font-medium">Harga:</span> Rp {parseFloat(room.hargaPerMalam).toLocaleString('id-ID')}/malam</p>
                    <p><span className="font-medium">Tamu:</span> {room.banyaknyaTamu} orang</p>
                    
                    {room.fasilitasKamar.length > 0 && (
                      <div>
                        <p className="font-medium">Fasilitas:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {room.fasilitasKamar.slice(0, 2).map((fasilitas, fIndex) => (
                            <span key={fIndex} className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs">
                              {fasilitas}
                            </span>
                          ))}
                          {room.fasilitasKamar.length > 2 && (
                            <span className="text-xs text-gray-500">+{room.fasilitasKamar.length - 2} lagi</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Link
            href="/dashboard/Hotel"
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Simpan Hotel
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
  );
};

export default InputHotelPage;
