"use client";

import React, {useEffect, useState} from "react";
import {Plus, Pencil, Trash2} from "lucide-react";
import Pagination from "./ui/Pagination/Pagination";
import Link from "next/link";
import Image from "next/image";

// Type definition untuk Destination
interface Destination {
    id: number;
    namaLokasi: string;
    alamat: string;
    deskripsi: string;
    gambar1: string;
    gambar2?: string | null;
    gambar3?: string | null;
    jamOperasional: string;
    tiketMasuk?: string | null;
    kontakPerson?: string | null;
    linkGmaps: string;
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

export default function DestinationTable() {
    const [search, setSearch] = useState("");
    const [dataDestinations, setDataDestinations] = useState<Destination[]>([]);
    const [loading, setLoading] = useState(true);

    // State pop-up konfirmasi
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Ambil data dari API
    useEffect(() => {
        const fetchDestinations = async () => {
            try {
                const res = await fetch(`/api/admin`,{
                    method: "GET"
                });
                if (!res.ok) throw new Error("Gagal mengambil data");
                const response = await res.json();
                setDataDestinations(response.data || []);
            } catch (error) {
                console.error("Error fetching destinations:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDestinations();
    }, []);

    // Filter data berdasarkan pencarian
    const filtered = Array.isArray(dataDestinations) ? dataDestinations.filter(d =>
        d.namaLokasi?.toLowerCase().includes(search.toLowerCase()) ||
        d.alamat?.toLowerCase().includes(search.toLowerCase()) ||
        d.deskripsi?.toLowerCase().includes(search.toLowerCase())
    ) : [];

    // Pagination calculation
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filtered.length / itemsPerPage);

    const handleDelete = async (id: number) => {
        try {
            const res = await fetch(`/api/admin/${id}`, {
                method: "DELETE"
            });

            if (res.ok) {
                setDataDestinations(dataDestinations.filter(d => d.id !== id));
                alert("✅ Destinasi berhasil dihapus!");
            } else {
                alert("❌ Gagal menghapus destinasi");
            }
        } catch (error) {
            console.error("Error deleting destination:", error);
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
                <h2 className="text-2xl font-bold text-gray-800">Data Destinasi Wisata</h2>
                <Link
                    href="/dashboard/Destinasi/InputDestinasi"
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                    <Plus size={20} />
                    Tambah Destinasi
                </Link>
            </div>

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Cari nama lokasi, alamat, atau deskripsi..."
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="overflow-x-auto">
                {loading ? (
                    <div className="text-center py-8">
                        <p className="text-lg">Loading data destinasi...</p>
                    </div>
                ) : (
                    <table className="w-full text-left border rounded-lg overflow-hidden">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3">Gambar</th>
                                <th className="p-3">Nama Lokasi</th>
                                <th className="p-3">Alamat</th>
                                <th className="p-3">Deskripsi</th>
                                <th className="p-3">Tanggal</th>
                                <th className="p-3">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.length > 0 ? (
                                currentItems.map((d) => (
                                    <tr key={d.id} className="border-b hover:bg-gray-50">
                                        <td className="p-3">
                                            {d.gambar1 ? (
                                                <Image
                                                    src={d.gambar1}
                                                    alt={d.namaLokasi}
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
                                        <td className="p-3 font-medium">{truncateWords(d.namaLokasi, 3)}</td>
                                        <td className="p-3 text-left max-w-xs">
                                            {truncateWords(d.alamat, 5)}
                                        </td>
                                        <td className="p-3 text-left max-w-xs">
                                            {truncateWords(stripHtmlTags(d.deskripsi), 8)}
                                        </td>
                                        <td className="p-3">
                                            {new Date(d.createdAt).toLocaleDateString('id-ID')}
                                        </td>
                                        <td className="p-3">
                                            <div className="flex justify-center items-center gap-2">
                                                <Link
                                                    href={`/dashboard/Destinasi/Edit/${d.id}`}
                                                    className="flex items-center gap-1 text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 text-sm rounded-md"
                                                >
                                                    <Pencil size={14} />
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDeleteConfirm(d.id)}
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
                                        {search ? "Tidak ada data yang sesuai dengan pencarian" : "Belum ada data destinasi"}
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
                            Apakah Anda yakin ingin menghapus destinasi ini?
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