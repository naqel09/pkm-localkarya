"use client"
import React, {useEffect, useState} from "react";
import Link from "next/link";
import {Plus, Pencil, Trash2} from "lucide-react";
import Pagination from "./ui/Pagination/Pagination";

// Fungsi Potong kata
const potongkata =(text:string ,maxWords:number)=>{
    if(!text) return "";
    const words = text.split(" ");
    if(words.length <= maxWords) return text;
    return words.slice(0,maxWords).join(" ") + "...";
}

const HotelTable = () => {
    const [search,setSearch]= useState("");
    const [hotels, setHotels] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showConfirm,setShowConfirm]= useState(false);
    const [selectedId,setSelectedId] = useState <number | null>(null);
    const [currentPage,setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // useEffect(() => {
    //     async function fetchhotels() {
    //         try {
    //             const response = await fetch("/api/blog");
    //             if (!response.ok) throw new Error("Gagal Mengambil data");
    //             const data = await response.json();
    //             sethotels(Array.isArray(data) ? data : data.data || []);
    //         } catch (error) {
    //             console.error("tidak terkoneksi ke database",error);
    //         } finally {
    //             setLoading(false);
    //         }
    //     }
    //     fetchhotels();
    // }, []);

    const handleDelete = async () => {
        if(!selectedId) return;
        try{
            const res = await fetch(`/api/blog/${selectedId}`,{
                method: "DELETE",
            });
            if(!res.ok) throw new Error ("Gagal mengambil data");
            setHotels((prev)=> 
                prev.filter((hotel)=>hotel.id !== selectedId)
            );
            console.log("data hotel berhasil di hapus");
        } catch (error){
            console.error("data tidak ditemukan",error);
        }finally{
            setSelectedId(null)
            setShowConfirm(false);
        }
    }

    const filteredHotel = hotels.filter(
        (hotel)=> hotel.Judul.toLowerCase().includes(search.toLowerCase())
    )
    
    // hitung data yang akan ditampilkna
    const lastItem = currentPage * itemsPerPage;
    const firstItem = lastItem - itemsPerPage;
    const currentItems = filteredHotel.slice(firstItem,lastItem);

    const totalPages =Math.ceil(filteredHotel.length/itemsPerPage);

    return (
        <section>
            <div className="flex items-center justify-between mb-4 border-b-2">
                <h2 className="text-xl font-semibold">Daftar Hotel</h2>
            </div>
            <div className="flex justify-between mb-4">
                <Link
                    href="/Dashboard/Blog/InputBlog"
                    className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700 cursor-pointer"
                >
                    <Plus size={18} /> Input hotel
                </Link>
                <input
                    type="text"
                    value={search}
                    placeholder="Cari judul atau kategori aritkel..."
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-1/4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 px-4 py-2"
                />
            </div>
            <div className="overflow-x-auto">
                {loading?(
                    <p>loading data...</p>
                ):(
                    <table className="w-full text-center rounded-lg border overflow-hidden">
                    <thead className="bg-green-500 text-gray-700 text-center">
                        <tr>
                            <th className="p-3">Gambar</th>
                            <th className="p-3">Judul hotel</th>
                            <th className="p-3">Kategori</th>
                            <th className="p-3">Lokasi</th>
                            <th className="p-3">Tanggal</th>
                            <th className="p-3">Deskripsi</th>
                            <th className="p-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredHotel.length===0 ? (
                            <tr>
                                <td colSpan={6} className="text-center p-4">
                                    data Hotel belum di input
                                </td>
                            </tr>
                        ):(
                            currentItems.map((hotel : any) => (
                            <tr key={hotel.id} className="border-t hover:bg-gray-50">
                                <td className="p-2">
                                    <img
                                        src={hotel.Gambar}
                                        alt={hotel.Judul}
                                        className="w-20 h-12 object-cover mx-auto"
                                    />
                                </td>
                                <td className="p-3">{potongkata(hotel.Judul,2)}</td>
                                <td className="p-3">{hotel.Kategori}</td>
                                <td className="p-3">{hotel.Lokasi}</td>
                                <td className="p-3">{hotel.Tanggal}</td>
                                <td className="p-3">{potongkata(hotel.Deskripsi,2)}</td>
                                <td className="p-3 ">
                                    <div className="flex justify-center items-center gap-3 mx-auto">
                                        <Link
                                            href={`/Dashboard/Blog/Edit/${hotel.id}`}
                                            className="flex items-center text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 text-sm rounded-md"
                                        >
                                            <Pencil size={16} />
                                            Edit
                                        </Link>
                                        <button onClick={()=>{
                                            setSelectedId(hotel.id);
                                            setShowConfirm(true);
                                        }} 
                                        className="flex items-center text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 text-sm rounded-md cursor-pointer">
                                            <Trash2 size={16} />
                                            Hapus
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                        )}
                    </tbody>
                    </table>
                )}
            </div>

            {totalPages > 1 && (
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage}/>
            )}

            {/* Tampilan Konfirmasi */}
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
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer"
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
