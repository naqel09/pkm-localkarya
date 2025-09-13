"use client";

import {useEffect, useState} from "react";
import {useParams, useRouter} from "next/navigation";
import Image from "next/image";

// Tipe data untuk kamar

interface RoomType {
    id?: number;
    image: string;
    name: string;
    price: string;
    description: string;
    galeri1: string;
    galeri2: string;
}

const initialRoomState: RoomType = {
    image: "",
    name: "",
    price: "",
    description: "",
    galeri1: "",
    galeri2: "",
};

export default function Page() {
    const Router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const [hotel, setHotel] = useState({
        image: "",
        slug: "",
        price: "",
        location: "",
        title: "",
        description: "",
        galeri1: "",
        galeri2: "",
        galeri3: "",
    });

    const [rooms, setRooms] = useState<RoomType[]>([]);
    const [currentRoom, setCurrentRoom] = useState<RoomType[]>([]);
    const [gambarHotelPreview, setGambarHotelPreview] = useState<string | null>(
        null
    );
    const [editRoom, setEditRoom] = useState(false);

    useEffect(() => {
        async function fetchHotel() {
            try {
                const res = await fetch(`/api/hotel/${id}`);
                const data = await res.json();
                setHotel({
                    image: data.image || "",
                    slug: data.slug || "",
                    price: data.price || "",
                    location: data.location || "",
                    title: data.title || "",
                    description: data.description || "",
                    galeri1: data.galeri1 || "",
                    galeri2: data.galeri2 || "",
                    galeri3: data.galeri3 || "",
                });
            } catch (error) {
                throw new Error("gagal mengambil data");
            }
        }
        fetchHotel();
    }, [id]);



    const handleHotelChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const {name, value} = e.target;
        setHotel((prev) => ({
            ...prev,
            [name]: value,
            ...(name === "title" && {
                slug: value.toLocaleLowerCase().replace(/\s+/g, "-"),
            }),
        }));
    };

    return (
        <div>
            <div className="max-w-8xl mx-auto bg-white p-8 rounded-xl shadow-lg my-10">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">
                    Edit hotel: {hotel.title}
                </h1>

                <form action="">
                    <div className="grid md:grid-cols-2 gap-10">
                        <div className="space-y-4">
                            <div>
                                <label
                                    htmlFor=""
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Nama Hotel
                                </label>
                                <input
                                    type="text"
                                    onChange={handleHotelChange}
                                    name="title"
                                    value={hotel.title}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm read_only:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="">Lokasi</label>
                                <input
                                    type="text"
                                    onChange={handleHotelChange}
                                    name="location"
                                    value={hotel.location}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm read-only:bg-gray-100"
                                />
                            </div>
                            <div>
                                <label htmlFor="">Harga Mulai Dari</label>
                                <input
                                    type="text"
                                    onChange={handleHotelChange}
                                    name="price"
                                    value={hotel.price}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm read-only:bg-gray-100"
                                />
                            </div>
                            <div>
                                <label htmlFor="">Deskripsi</label>
                                <textarea
                                    name=""
                                    id=""
                                    value={hotel.description}
                                    onChange={handleHotelChange}
                                    rows={12}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm read-only:bg-gray-100"
                                ></textarea>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-700 text-lg">
                                Gambar Hotel
                            </h3>
                            <div>
                                <label
                                    htmlFor="gambarUtama"
                                    className="cursor-pointer"
                                >
                                    <div className="w-full h-48 xl:h-90 bg-gray-200 flex items-center justify-center rounded-md border-2 border-gray-300 border-dashed hover:border-indigo-500">
                                        {hotel.image && (
                                            <Image
                                                src={hotel.image}
                                                alt="preview"
                                                width={500}
                                                height={192}
                                                className="object-cover w-full h-full rounded-md"
                                            />
                                        )}
                                    </div>
                                </label>
                                <input
                                    type="file"
                                    className="hidden"
                                    id="gambarUtama"
                                />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label
                                        htmlFor="galeri1"
                                        className="cursor-pointer"
                                    >
                                        <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded-md border-2 border-gray-300 border-dashed hover:border-indigo-500">
                                            {hotel.galeri1 && (
                                                <Image
                                                    src={hotel.galeri1}
                                                    alt="preview"
                                                    width={150}
                                                    height={112}
                                                    className="w-full h-full rounded-md"
                                                />
                                            )}
                                        </div>
                                    </label>
                                    <input
                                        type="file"
                                        className="hidden"
                                        id="galeri1"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="galeri1"
                                        className="cursor-pointer"
                                    >
                                        <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded-md border-2 border-gray-300 border-dashed hover:border-indigo-500">
                                            {hotel.galeri2 && (
                                                <Image
                                                    src={hotel.galeri2}
                                                    alt="preview"
                                                    width={150}
                                                    height={112}
                                                    className="w-full h-full rounded-md"
                                                />
                                            )}
                                        </div>
                                    </label>
                                    <input
                                        type="file"
                                        className="hidden"
                                        id="galeri1"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="galeri1"
                                        className="cursor-pointer"
                                    >
                                        <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded-md border-2 border-gray-300 border-dashed hover:border-indigo-500">
                                            {hotel.galeri3 && (
                                                <Image
                                                    src={hotel.galeri3}
                                                    alt="preview"
                                                    width={150}
                                                    height={112}
                                                    className="w-full h-full rounded-md"
                                                />
                                            )}
                                        </div>
                                    </label>
                                    <input
                                        type="file"
                                        className="hidden"
                                        id="galeri1"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div className="mt-10 border-t pt-6">
              <div className="flex justify-between items-center">
                <h2>Daftar Kamar {rooms.length}</h2>
                <button>
                  + Tambah Kamar
                </button>
              </div>
              <div className="mt-4 space-y-3">
                {rooms.length>0?(
                  rooms.map((room)=>(
                    <div>
                      <p>{room.name}-({room.price})</p>
                    </div>
                  ))
                ):(
                  <p>
                    belum ada kamar yang ditambahkan
                  </p>
                )}
              </div>
            </div>
        </div>
    );
}
