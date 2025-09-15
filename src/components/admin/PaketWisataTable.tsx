"use client";

import React, {useEffect, useState} from "react";
import {Plus, Pencil, Trash2} from "lucide-react";
import Pagination from "@/components/admin/ui/Pagination/Pagination";
import Link from "next/link";
import Image from "next/image";

// Type definition untuk PaketWisata
interface PaketWisata {
    id: number;
    namaPaket: string;
    alamat: string;
    deskripsi: string;
    harga: number;
    gambar1: string;
    gambar2?: string | null;
    gambar3?: string | null;
    gambar4?: string | null;
    gambar360?: string | null;
    createdAt: string;
    updatedAt: string;
}

// Fungsi potong kata
const truncateWords = (text: string, maxWords: number) => {
    if (!text) return "";
    const words = text.split(" ");
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(" ") + "...";
};

// Fungsi untuk membersihkan HTML tags dari rich text
const stripHtmlTags = (html: string) => {
    if (!html) return "";
    // Buat temporary div element untuk parsing HTML
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
};

// Format harga ke Rupiah
const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
};

export default function PaketWisataTable() {
    const [search, setSearch] = useState("");
    const [dataPaketWisata, setDataPaketWisata] = useState<PaketWisata[]>([]);
    const [loading, setLoading] = useState(true);

    // State pop-up konfirmasi
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Fetch data dari API
    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/admin/paket-wisata");
            if (response.ok) {
                const data = await response.json();
                setDataPaketWisata(data.data || []);
            } else {
                console.error("Failed to fetch paket wisata");
            }
        } catch (error) {
            console.error("Error fetching paket wisata:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Filter data berdasarkan search
    const filteredData = dataPaketWisata.filter((item) => {
        const searchTerm = search.toLowerCase();
        const plainDescription = stripHtmlTags(item.deskripsi).toLowerCase();
        
        return (
            item.namaPaket.toLowerCase().includes(searchTerm) ||
            item.alamat.toLowerCase().includes(searchTerm) ||
            plainDescription.includes(searchTerm) ||
            formatPrice(item.harga).toLowerCase().includes(searchTerm)
        );
    });

    // Pagination
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    // Handle konfirmasi hapus
    const handleDeleteClick = (id: number) => {
        setSelectedId(id);
        setShowConfirm(true);
    };

    // Konfirmasi hapus
    const handleConfirmDelete = async (answer: boolean) => {
        if (answer && selectedId) {
            try {
                const response = await fetch(`/api/admin/paket-wisata/${selectedId}`, {
                    method: "DELETE",
                });
                
                if (response.ok) {
                    alert("Paket wisata berhasil dihapus!");
                    fetchData(); // Refresh data
                } else {
                    alert("Gagal menghapus paket wisata.");
                }
            } catch (error) {
                console.error("Error deleting paket wisata:", error);
                alert("Terjadi kesalahan saat menghapus paket wisata.");
            }
        }
        setShowConfirm(false);
        setSelectedId(null);
    };

    const onPageChange = (page: number) => {
        setCurrentPage(page);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Management Paket Wisata
                    </h1>
                    <Link
                        href="/dashboard/PaketWisata/InputPaketWisata"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
                    >
                        <Plus size={20} />
                        Tambah Paket Wisata
                    </Link>
                </div>

                {/* Search Bar */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <div className="w-full sm:w-auto">
                            <input
                                type="text"
                                placeholder="Cari nama paket, alamat, deskripsi, atau harga..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full sm:w-96 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="text-sm text-gray-600">
                            Total: {filteredData.length} paket wisata
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Paket Wisata
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Alamat
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Harga
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Deskripsi
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Gambar
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentItems.length > 0 ? (
                                    currentItems.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {item.namaPaket}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        ID: {item.id}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900 max-w-xs">
                                                    {truncateWords(item.alamat, 8)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-semibold text-green-600">
                                                    {formatPrice(item.harga)}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    per orang
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900 max-w-xs">
                                                    {truncateWords(stripHtmlTags(item.deskripsi), 10)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex gap-1">
                                                    <Image
                                                        src={item.gambar1}
                                                        alt={item.namaPaket}
                                                        width={50}
                                                        height={40}
                                                        className="rounded object-cover"
                                                    />
                                                    {item.gambar360 && (
                                                        <div className="relative">
                                                            <Image
                                                                src={item.gambar360}
                                                                alt="360°"
                                                                width={50}
                                                                height={40}
                                                                className="rounded object-cover"
                                                            />
                                                            <div className="absolute bottom-0 left-0 bg-orange-500 text-white text-xs px-1 rounded-tr">
                                                                360°
                                                            </div>
                                                        </div>
                                                    )}
                                                    <div className="text-xs text-gray-500 self-center">
                                                        +{[item.gambar2, item.gambar3, item.gambar4].filter(Boolean).length}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex gap-2">
                                                    <Link
                                                        href={`/dashboard/PaketWisata/Edit/${item.id}`}
                                                        className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-100"
                                                        title="Edit"
                                                    >
                                                        <Pencil size={16} />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDeleteClick(item.id)}
                                                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-100"
                                                        title="Hapus"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                                            {search ? `Tidak ditemukan paket wisata dengan kata kunci "${search}"` : "Belum ada paket wisata"}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="px-6 py-4 border-t border-gray-200">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={onPageChange}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Konfirmasi Hapus
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Apakah Anda yakin ingin menghapus paket wisata ini? Tindakan ini tidak dapat dibatalkan.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => handleConfirmDelete(false)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                                Batal
                            </button>
                            <button
                                onClick={() => handleConfirmDelete(true)}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                Ya, Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}