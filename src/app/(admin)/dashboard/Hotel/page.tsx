"use client";
import React, {useEffect, useState} from "react";
import {Plus,Pencil} from "lucide-react";
import Link from "next/link";
import Pagination from "@/components/admin/ui/Pagination/Pagination";

export default function HotelsPage() {
    const [hotels, setHotels] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    // Pagination state
        const [currentPage, setCurrentPage] = useState(1);
        const itemsPerPage = 5;

    useEffect(() => {
        async function  fetchHotels(){
            try{
                const response = await fetch("/api/hotel");
                if(!response.ok) throw new Error("Gagal Mengambil data");
                const data = await response.json();
                setHotels(Array.isArray(data) ? data : data.data || [])
            }catch(error){
                console.error("tidak terkoneksi ke dalam database",error);
            }
        }
        fetchHotels();
    }, []);
    const potongkata = (text: string, maxWords: number) => {
        if (!text) return "";
        const words = text.split(" ");
        if (words.length <= maxWords) return text;
        return words.slice(0, maxWords).join(" ") + "...";
    };

    const filteredHotels = hotels.filter(
        (hotel) =>
            hotel.title.toLowerCase().includes(search.toLowerCase()) ||
            hotel.location.toLowerCase().includes(search.toLowerCase())
    );


    // Hitung data yang akan ditampilkan
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredHotels.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredHotels.length / itemsPerPage);

    return (
        <section>
            <div className="flex items-center justify-between mb-4 border-b-2">
                <h2 className="text-xl font-semibold">Daftar Penginapan</h2>
            </div>

            <div className="flex justify-between mb-4">
                <Link
                    href="/Dashboard/Hotel/InputHotel"
                    className="bg-blue-600 text-white px-4 py-2 rounded flex items-center hover:bg-blue-700 cursor-pointer"
                >
                    <Plus size={18} /> Tambah Hotel
                </Link>
                <input
                    type="text"
                    placeholder="Cari hotel berdasarkan nama atau lokasi..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border p-2 w-1/4 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>

            <table className="w-full border border-gray-300 text-center">
                <thead>
                    <tr className="bg-green-500 text-gray-700">
                        <th className="p-2">GAMBAR</th>
                        <th className="p-2">NAMA HOTEL</th>
                        <th className="p-2">LOKASI</th>
                        <th className="p-2">HARGA</th>
                        <th className="p-2">ROOM</th>
                        <th className="p-2">AKSI</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredHotels.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="text-center p-4">
                                Hotel tidak ditemukan.
                            </td>
                        </tr>
                    ) : (
                        filteredHotels.map((hotel) => (
                            <tr key={hotel.id} className="border-t">
                                <td className="p-2">
                                    <img
                                        src={hotel.image}
                                        alt={hotel.title}
                                        className="w-20 h-12 object-cover rounded mx-auto"
                                    />
                                </td>
                                <td className="p-2">
                                    {potongkata(hotel.title, 4)}
                                </td>
                                <td className="p-2">{hotel.location}</td>
                                <td className="p-2">{hotel.price}</td>
                                <td className="p-2">
                                    {hotel.rooms?.length || 0}
                                </td>
                                <td className="p-2 text-center">
                                    <div className="flex w-full justify-center items-center gap-3">
                                        <Link
                                        href={`/Dashboard/Hotel/Edit/${hotel.id}`}
                                        className=" flex items-center bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                                    >
                                        <Pencil size={16} />
                                        Edit
                                    </Link>
                                    <button
                                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 cursor-pointer"
                                    >
                                        Hapus
                                    </button>
                                    </div>
                                    
                                    
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </section>
    );
}
