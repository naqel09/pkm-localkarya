"use client";

import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

// Type definition untuk PilihKami Feature
interface PilihKamiFeature {
  id: number;
  title: string;
  description: string;
  orderIndex: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function PilihKamiTable() {
  const [search, setSearch] = useState("");
  const [features, setFeatures] = useState<PilihKamiFeature[]>([]);
  const [loading, setLoading] = useState(true);

  // State pop-up konfirmasi
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Ambil data dari API
  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const res = await fetch(`/api/pilih-kami`, {
          method: "GET"
        });
        if (!res.ok) throw new Error("Gagal mengambil data");
        const response = await res.json();
        setFeatures(response.data || []);
      } catch (error) {
        console.error("Error fetching features:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatures();
  }, []);

  // Filter data berdasarkan pencarian
  const filtered = Array.isArray(features) ? features.filter(feature =>
    feature.title?.toLowerCase().includes(search.toLowerCase()) ||
    feature.description?.toLowerCase().includes(search.toLowerCase())
  ) : [];

  // Pagination calculation
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/pilih-kami/${id}`, {
        method: "DELETE"
      });

      if (res.ok) {
        setFeatures(features.filter(feature => feature.id !== id));
        alert("✅ Fitur berhasil dihapus!");
      } else {
        alert("❌ Gagal menghapus fitur");
      }
    } catch (error) {
      console.error("Error deleting feature:", error);
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
        <h2 className="text-2xl font-bold text-gray-800">Data Fitur Pilih Kami</h2>
        <Link
          href="/dashboard/PilihKami/InputPilihKami"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          <Plus size={20} />
          Tambah Fitur
        </Link>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Cari judul atau deskripsi..."
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="text-center py-8">
            <p className="text-lg">Loading data fitur...</p>
          </div>
        ) : (
          <table className="w-full text-left border rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Judul</th>
                <th className="p-3">Deskripsi</th>
                <th className="p-3">Status</th>
                <th className="p-3">Order</th>
                <th className="p-3">Tanggal</th>
                <th className="p-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((feature) => (
                  <tr key={feature.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{feature.title}</td>
                    <td className="p-3 text-left max-w-xs">
                      {feature.description.length > 50 
                        ? feature.description.substring(0, 50) + "..." 
                        : feature.description}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        feature.isActive 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {feature.isActive ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td className="p-3">{feature.orderIndex}</td>
                    <td className="p-3">
                      {new Date(feature.createdAt).toLocaleDateString('id-ID')}
                    </td>
                    <td className="p-3">
                      <div className="flex justify-center items-center gap-2">
                        <Link
                          href={`/dashboard/PilihKami/Edit/${feature.id}`}
                          className="flex items-center gap-1 text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 text-sm rounded-md"
                        >
                          <Pencil size={14} />
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteConfirm(feature.id)}
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
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    {search ? "Tidak ada data yang sesuai dengan pencarian" : "Belum ada data fitur"}
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
          {/* Pagination component would go here if needed */}
        </div>
      )}

      {/* Pop-up konfirmasi hapus */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] text-center">
            <p className="text-lg font-medium mb-4">
              Apakah Anda yakin ingin menghapus fitur ini?
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