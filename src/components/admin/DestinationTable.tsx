"use client";

import React, {useEffect, useState} from "react";
import {Plus, Pencil, Trash2} from "lucide-react";
import Pagination from "./ui/Pagination/Pagination";
import Link from "next/link";

// Fungsi potong kata
const truncateWords = (text: string, maxWords: number) => {
    if (!text) return "";
    const words = text.split(" ");
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(" ") + "...";
};

export default function DestinationTable() {
    const [search, setSearch] = useState("");
    const [dataDestinations, setDataDestinations] = useState<any[]>([]);
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
                const data = await res.json();
                setDataDestinations(Array.isArray(data) ? data : data.data || []);
            } catch (err) {
                console.error("Error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDestinations();
    }, []);

    const filtered = dataDestinations.filter((d: any) =>
        d.title.toLowerCase().includes(search.toLowerCase())
    );

    // Hitung data yang akan ditampilkan
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filtered.length / itemsPerPage);

    // Fungsi hapus
    const handleDelete = async () => {
        if (!selectedId) return;
        try {
            const res = await fetch(`/api/admin/${selectedId}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Gagal menghapus data");
            setDataDestinations((prev) =>
                prev.filter((d) => d.id !== selectedId)
            );
        } catch (error) {
            console.error(error);
        } finally {
            setShowConfirm(false);
            setSelectedId(null);
        }
    };

    return (
        <section>
            <div className="flex items-center justify-between mb-4 border-b-2">
                <h2 className="text-xl font-semibold">Daftar Wisata</h2>
            </div>

            <div className="flex justify-between mb-4">
                <Link
                    href="/Dashboard/Destinasi/InputDestinasi"
                    className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700 cursor-pointer"
                >
                    <Plus size={18} /> Input Destinasi
                </Link>
                <input
                    type="text"
                    placeholder="Cari destinasi..."
                    className="w-1/4 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setCurrentPage(1);
                    }}
                />
            </div>

            <div className="overflow-x-auto">
                {loading ? (
                    <p>Loading data...</p>
                ) : (
                    <table className="w-full text-left border rounded-lg overflow-hidden">
                        <thead className="bg-green-500 text-gray-700 text-center">
                            <tr>
                                <th className="p-3">Gambar</th>
                                <th className="p-3">Judul</th>
                                <th className="p-3">Lokasi</th>
                                <th className="p-3">Deskripsi</th>
                                <th className="p-3">Hari</th>
                                <th className="p-3">Harga</th>
                                <th className="p-3">Telepon</th>
                                <th className="p-3">Action</th>
                            </tr>
                        </thead>
                        <tbody className="xl:text-lg text-sm text-center">
                            {currentItems.map((d: any) => (
                                <tr
                                    key={d.id}
                                    className="border-t hover:bg-gray-50"
                                >
                                    <td className="p-2">
                                            <img
                                                src={d.image}
                                                alt={d.title}
                                                className="w-20 h-12 object-cover mx-auto"
                                            />
                                    </td>
                                    <td>{truncateWords(d.title, 2)}</td>
                                    <td className="p-3">{d.location}</td>
                                    <td className="p-3">
                                        {truncateWords(d.description, 5)}
                                    </td>
                                    <td className="p-3">{d.days}</td>
                                    <td className="p-3">{d.price}</td>
                                    <td className="p-3">{d.phone}</td>
                                    <td className="p-3">
                                        <div className="flex justify-center items-center gap-3 mx-auto">
                                            <Link
                                                href={`/Dashboard/Destinasi/Edit/${d.id}`}
                                                className="flex items-center text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 text-sm rounded-md"
                                            >
                                                <Pencil size={16} />
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    setSelectedId(d.id);
                                                    setShowConfirm(true);
                                                }}
                                                className="flex items-center text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 text-sm rounded-md"
                                            >
                                                <Trash2 size={16} />
                                                Hapus
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}

            {/* Pop-up Konfirmasi */}
            {showConfirm && (
                <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 w-96 text-center">
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
}
