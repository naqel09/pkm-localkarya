"use client";

import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Pagination from "./ui/Pagination/Pagination";

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

export default function CarouselTable() {
  const [search, setSearch] = useState("");
  const [carouselItems, setCarouselItems] = useState<CarouselItem[]>([]);
  const [loading, setLoading] = useState(true);

  // State pop-up konfirmasi
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Ambil data dari API
  useEffect(() => {
    const fetchCarouselItems = async () => {
      try {
        const res = await fetch(`/api/carousel`, {
          method: "GET"
        });
        if (!res.ok) throw new Error("Gagal mengambil data");
        const response = await res.json();
        setCarouselItems(response.data || []);
      } catch (error) {
        console.error("Error fetching carousel items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCarouselItems();
  }, []);

  // Filter data berdasarkan pencarian
  const filtered = Array.isArray(carouselItems) ? carouselItems.filter(item =>
    item.title?.toLowerCase().includes(search.toLowerCase()) ||
    item.subtitle?.toLowerCase().includes(search.toLowerCase()) ||
    item.description?.toLowerCase().includes(search.toLowerCase())
  ) : [];

  // Pagination calculation
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/carousel/${id}`, {
        method: "DELETE"
      });

      if (res.ok) {
        setCarouselItems(carouselItems.filter(item => item.id !== id));
        alert("✅ Carousel item berhasil dihapus!");
      } else {
        alert("❌ Gagal menghapus carousel item");
      }
    } catch (error) {
      console.error("Error deleting carousel item:", error);
      alert("❌ Terjadi kesalahan saat menghapus");
    }
    setShowConfirm(false);
    setSelectedId(null);
  };

  const handleDeleteConfirm = (id: number) => {
    setSelectedId(id);
    setShowConfirm(true);
  };

  const handleConfirmResponse = (answer: boolean) => {
    if (answer && selectedId) {
      handleDelete(selectedId);
    } else {
      setShowConfirm(false);
      setSelectedId(null);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Data Carousel</h2>
        <Link
          href="/dashboard/Carousel/InputCarousel"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          <Plus size={20} />
          Tambah Carousel Item
        </Link>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Cari judul, subtitle, atau deskripsi..."
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="text-center py-8">
            <p className="text-lg">Loading data carousel...</p>
          </div>
        ) : (
          <table className="w-full text-left border rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Gambar</th>
                <th className="p-3">Judul</th>
                <th className="p-3">Subtitle</th>
                <th className="p-3">Deskripsi</th>
                <th className="p-3">Status</th>
                <th className="p-3">Order</th>
                <th className="p-3">Tanggal</th>
                <th className="p-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-20 h-12 object-cover rounded-md"
                          width={80}
                          height={48}
                        />
                      ) : (
                        <div className="w-20 h-12 bg-gray-300 mx-auto rounded-md flex items-center justify-center">
                          <span className="text-gray-500 text-xs">No Image</span>
                        </div>
                      )}
                    </td>
                    <td className="p-3 font-medium">{item.title}</td>
                    <td className="p-3">{item.subtitle || "-"}</td>
                    <td className="p-3 text-left max-w-xs">
                      {item.description.length > 50 
                        ? item.description.substring(0, 50) + "..." 
                        : item.description}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        item.isActive 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {item.isActive ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td className="p-3">{item.orderIndex}</td>
                    <td className="p-3">
                      {new Date(item.createdAt).toLocaleDateString('id-ID')}
                    </td>
                    <td className="p-3">
                      <div className="flex justify-center items-center gap-2">
                        <Link
                          href={`/dashboard/Carousel/Edit/${item.id}`}
                          className="flex items-center gap-1 text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 text-sm rounded-md"
                        >
                          <Pencil size={14} />
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteConfirm(item.id)}
                          className="flex items-center gap-1 text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 text-sm rounded-md"
                        >
                          <Trash2 size={14} />
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-500">
                    {search ? "Tidak ada data yang sesuai dengan pencarian" : "Belum ada data carousel"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {!loading && filtered.length > itemsPerPage && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Pop-up konfirmasi hapus */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] text-center">
            <p className="text-lg font-medium mb-4">
              Apakah Anda yakin ingin menghapus item carousel ini?
            </p>
            <p className="text-sm text-gray-600 mb-6">
              Data yang dihapus tidak dapat dikembalikan.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => handleConfirmResponse(true)}
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-md"
              >
                Ya, Hapus
              </button>
              <button
                onClick={() => handleConfirmResponse(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-6 rounded-md"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}