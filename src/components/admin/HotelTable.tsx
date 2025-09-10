"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image"; // Gunakan Image dari Next.js untuk optimisasi
import { Plus, Pencil, Trash2 } from "lucide-react";
import Pagination from "./ui/Pagination/Pagination";

// Definisikan tipe data untuk Hotel agar lebih aman dan mudah dibaca
interface HotelType {
  id: number;
  image: string;
  title: string;
  location: string;
  price: string;
  description: string;
  rooms?: any[]; // Opsional jika data kamar disertakan
}

// Fungsi Potong kata
const potongkata = (text: string, maxWords: number) => {
  if (!text) return "";
  const words = text.split(" ");
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(" ") + "...";
};

const HotelTable = () => {
  const [search, setSearch] = useState("");
  const [hotels, setHotels] = useState<HotelType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // 1. useEffect diperbaiki dengan dependency array `[]`
  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true); // Set loading ke true sebelum fetch
      try {
        const res = await fetch("/api/hotel", {
          method: "GET",
          headers: {
            'Cache-Control': 'no-cache' // Menghindari caching agresif dari Next.js
          }
        });
        if (!res.ok) throw new Error("Gagal mengambil data hotel");
        const data = await res.json();
        setHotels(Array.isArray(data) ? data : []); // Pastikan data adalah array
      } catch (error) {
        console.error("Error fetching hotels:", error);
        setHotels([]); // Jika error, set data ke array kosong
      } finally {
        setLoading(false); // Set loading ke false setelah selesai (baik sukses maupun gagal)
      }
    };
    fetchHotels();
  }, []); // <-- Array kosong ini penting agar fetch hanya berjalan sekali

  const handleDelete = async () => {
    if (!selectedId) return;
    try {
      // 2. Endpoint API untuk delete diperbaiki
      const res = await fetch(`/api/hotel/${selectedId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Gagal menghapus data");
      
      // Update state untuk menghapus hotel dari UI
      setHotels((prev) => prev.filter((hotel) => hotel.id !== selectedId));
      console.log("Data hotel berhasil dihapus");
    } catch (error) {
      console.error("Gagal menghapus data:", error);
    } finally {
      setSelectedId(null);
      setShowConfirm(false);
    }
  };

  // 3. Filter menggunakan properti `title` (huruf kecil)
  const filteredHotel = hotels.filter((hotel) =>
    hotel.title.toLowerCase().includes(search.toLowerCase())
  );

  // Kalkulasi untuk pagination
  const lastItemIndex = currentPage * itemsPerPage;
  const firstItemIndex = lastItemIndex - itemsPerPage;
  const currentItems = filteredHotel.slice(firstItemIndex, lastItemIndex);
  const totalPages = Math.ceil(filteredHotel.length / itemsPerPage);

  return (
    <section>
      <div className="flex items-center justify-between mb-4 border-b-2 pb-2">
        <h2 className="text-xl font-semibold">Daftar Hotel</h2>
      </div>
      <div className="flex justify-between mb-4">
        <Link
          href="/Dashboard/Hotel/InputHotel"
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700 cursor-pointer"
        >
          <Plus size={18} /> Input hotel
        </Link>
        <input
          type="text"
          value={search}
          placeholder="Cari nama hotel..."
          onChange={(e) => setSearch(e.target.value)}
          className="w-1/3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 px-4 py-2"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left rounded-lg border overflow-hidden">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3">Gambar</th>
              <th className="p-3">Nama Hotel</th>
              <th className="p-3">Lokasi</th>
              <th className="p-3">Harga</th>
              <th className="p-3">Deskripsi</th>
              <th className="p-3 text-center">Kamar</th>
              <th className="p-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center p-4">Memuat data...</td>
              </tr>
            ) : currentItems.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center p-4">
                  Data hotel tidak ditemukan atau belum diinput.
                </td>
              </tr>
            ) : (
              currentItems.map((hotel: HotelType) => (
                <tr key={hotel.id} className="border-t hover:bg-gray-50">
                  <td className="p-2">
                    {/* 4. Properti `image` dan `title` (huruf kecil) */}
                    <Image
                      src={hotel.image || '/placeholder.png'} // Fallback jika image null
                      alt={hotel.title}
                      width={80}
                      height={48}
                      className="w-20 h-12 object-cover rounded"
                    />
                  </td>
                  <td className="p-3 font-medium">{potongkata(hotel.title, 4)}</td>
                  <td className="p-3">{hotel.location}</td>
                  <td className="p-3">{hotel.price}</td>
                  <td className="p-3 text-sm text-gray-600">{potongkata(hotel.description, 5)}</td>
                  <td className="p-3 text-center">{hotel.rooms?.length || 0}</td>
                  <td className="p-3">
                    <div className="flex justify-center items-center gap-2">
                      {/* 5. Link Edit diperbaiki */}
                      <Link
                        href={`/Dashboard/Hotel/Edit/${hotel.id}`}
                        className="flex items-center gap-1 text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 text-sm rounded-md"
                      >
                        <Pencil size={16} /> Edit
                      </Link>
                      <button
                        onClick={() => {
                          setSelectedId(hotel.id);
                          setShowConfirm(true);
                        }}
                        className="flex items-center gap-1 text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 text-sm rounded-md cursor-pointer"
                      >
                        <Trash2 size={16} /> Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      )}

      {/* Tampilan Konfirmasi Hapus */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg border p-6 w-96 text-center">
            <h3 className="text-lg font-semibold mb-4">
              Yakin ingin menghapus data ini?
            </h3>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default HotelTable;