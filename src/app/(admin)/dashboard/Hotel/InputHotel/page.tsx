"use client";
import React, {useState} from "react";
import {ImageIcon, Trash2, Eye} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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

const Page = () => {
    // --- STATE (Tidak berubah) ---
    const [hotel, setHotel] = useState({
        image: "",
        slug: "",
        title: "",
        location: "",
        price: "",
        description: "",
        galeri1: "",
        galeri2: "",
        galeri3: "",
    });
    const [savedHotelId, setSavedHotelId] = useState<number | null>(null);
    const [rooms, setRooms] = useState<RoomType[]>([]);
    const [currentRoom, setCurrentRoom] = useState<RoomType>(initialRoomState);
    const [modalOpen, setModalOpen] = useState(false);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    // State preview gambar... (tidak berubah)
    const [gambarHotelPreview, setGambarHotelPreview] = useState<string | null>(
        null
    );
    const [galeri1Preview, setGaleri1Preview] = useState<string | null>(null);
    const [galeri2Preview, setGaleri2Preview] = useState<string | null>(null);
    const [galeri3Preview, setGaleri3Preview] = useState<string | null>(null);
    const [gambarKamarUtamaPreview, setGambarKamarUtamaPreview] = useState<
        string | null
    >(null);
    const [kamarGaleri1Preview, setKamarGaleri1Preview] = useState<
        string | null
    >(null);
    const [kamarGaleri2Preview, setKamarGaleri2Preview] = useState<
        string | null
    >(null);

    // --- HANDLER INPUT (Tidak berubah) ---
    const handleHotelChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const {name, value} = e.target;
        setHotel((prev) => ({
            ...prev,
            [name]: value,
            ...(name === "title" && {
                slug: value.toLowerCase().replace(/\s+/g, "-"),
            }),
        }));
    };
    const handleRoomChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const {name, value} = e.target;
        setCurrentRoom((prev) => ({...prev, [name]: value}));
    };
    // Handler gambar... (tidak berubah)
    const handleImageChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        field: "image" | "galeri1" | "galeri2" | "galeri3"
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            const imgUrl = reader.result as string;
            setHotel({...hotel, [field]: imgUrl});
            if (field === "image") setGambarHotelPreview(imgUrl);
            if (field === "galeri1") setGaleri1Preview(imgUrl);
            if (field === "galeri2") setGaleri2Preview(imgUrl);
            if (field === "galeri3") setGaleri3Preview(imgUrl);
        };
        reader.readAsDataURL(file);
    };
    const handleImageKamar = (
        e: React.ChangeEvent<HTMLInputElement>,
        field: "image" | "galeri1" | "galeri2"
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            const imgUrl = reader.result as string;
            setCurrentRoom({...currentRoom, [field]: imgUrl});
            if (field === "image") setGambarKamarUtamaPreview(imgUrl);
            if (field === "galeri1") setKamarGaleri1Preview(imgUrl);
            if (field === "galeri2") setKamarGaleri2Preview(imgUrl);
        };
        reader.readAsDataURL(file);
    };

    // --- LOGIKA UTAMA (BAGIAN YANG DIPERBAIKI) ---

    const handleSaveHotel = async () => {
        if (!hotel.title || !hotel.location) {
            alert("Nama hotel dan lokasi wajib diisi.");
            return;
        }
        setIsLoading(true);
        try {
            const res = await fetch("/api/hotel", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(hotel),
            });

            // Periksa header untuk memastikan respons adalah JSON
            const contentType = res.headers.get("content-type");
            if (res.ok) {
                const savedData = await res.json();
                setSavedHotelId(savedData.id);
                alert(
                    "Data hotel berhasil disimpan! Sekarang Anda bisa menambahkan kamar."
                );
            } else {
                // Jika gagal, cek apakah responsnya JSON sebelum di-parse
                if (
                    contentType &&
                    contentType.indexOf("application/json") !== -1
                ) {
                    const errorData = await res.json();
                    alert(
                        `Gagal menyimpan data hotel: ${
                            errorData.message || "Error tidak diketahui"
                        }`
                    );
                } else {
                    // Jika bukan JSON, tampilkan pesan error umum dari status text
                    const errorText = await res.text();
                    console.error(
                        "Server returned non-JSON response:",
                        errorText
                    );
                    alert(
                        `Gagal menyimpan data hotel. Server merespons dengan status: ${res.status} ${res.statusText}`
                    );
                }
            }
        } catch (error) {
            console.error("Error saat menyimpan hotel:", error);
            alert("Terjadi kesalahan pada server saat menyimpan hotel.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddKamar = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!savedHotelId) return alert("Simpan data hotel terlebih dahulu.");
        if (!currentRoom.name || !currentRoom.price)
            return alert("Nama kamar dan harga wajib diisi!");

        setIsLoading(true);
        try {
            const res = await fetch(`/api/hotel`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    ...currentRoom,
                    hotelId: savedHotelId,
                }),
            });

            const contentType = res.headers.get("content-type");
            if (res.ok) {
                const newRoom = await res.json();
                setRooms([...rooms, newRoom]);
                setCurrentRoom(initialRoomState);
                setModalOpen(false);
                setGambarKamarUtamaPreview(null);
                setKamarGaleri1Preview(null);
                setKamarGaleri2Preview(null);
                alert("Kamar berhasil ditambahkan!");
            } else {
                if (
                    contentType &&
                    contentType.indexOf("application/json") !== -1
                ) {
                    const errorData = await res.json();
                    alert(
                        `Gagal menambah kamar: ${
                            errorData.message || "Error tidak diketahui"
                        }`
                    );
                } else {
                    const errorText = await res.text();
                    console.error(
                        "Server returned non-JSON response:",
                        errorText
                    );
                    alert(
                        `Gagal menambah kamar. Server merespons dengan status: ${res.status} ${res.statusText}`
                    );
                }
            }
        } catch (error) {
            console.error("Error saat menambah kamar:", error);
            alert("Terjadi kesalahan pada server saat menambah kamar.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteRoom = async (roomId: number) => {
        if (!window.confirm("Apakah anda yakin ingin menghapus kamar ini?")) {
            return;
        }

        try {
            const res = await fetch(`/api/room/${roomId}`, {
                method: "DELETE",
            });
            if (res.ok) {
                setRooms(rooms.filter((room) => room.id !== roomId));
                alert("kamar berhasil dihapus.");
            }
        } catch (error) {
            console.error("Error saat menghapus kamar:", error);
            alert("terjadi kesalahan pada server saat menghapus kamar.");
        }
    };

    const handleViewRoom = (room: RoomType) => {
        setCurrentRoom(room);
        setViewModalOpen(true);
    };

    // --- TAMPILAN JSX (Tidak berubah) ---
    return (
        <div>
            {/* ... Seluruh kode JSX Anda tetap sama ... */}
            <div className="max-w-8xl mx-auto bg-white p-8 rounded-xl shadow-lg my-10">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">
                    {savedHotelId
                        ? `Edit Hotel: ${hotel.title}`
                        : "Input Data Hotel Baru"}
                </h1>

                <fieldset disabled={!!savedHotelId}>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <div className="grid md:grid-cols-2 gap-10">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Nama Hotel
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={hotel.title}
                                        onChange={handleHotelChange}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm read-only:bg-gray-100"
                                        required
                                    />
                                </div>
                                <div>
                                    <label>Lokasi</label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={hotel.location}
                                        onChange={handleHotelChange}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm read-only:bg-gray-100"
                                        required
                                    />
                                </div>
                                <div>
                                    <label>Harga Mulai Dari</label>
                                    <input
                                        type="text"
                                        name="price"
                                        value={hotel.price}
                                        onChange={handleHotelChange}
                                        placeholder="Contoh: Rp 350.000"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm read-only:bg-gray-100"
                                    />
                                </div>
                                <div>
                                    <label>Deskripsi</label>
                                    <textarea
                                        name="description"
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
                                            {gambarHotelPreview ? (
                                                <Image
                                                    src={gambarHotelPreview}
                                                    alt="Preview"
                                                    width={500}
                                                    height={192}
                                                    className="object-cover w-full h-full rounded-md"
                                                />
                                            ) : (
                                                <div className="text-center text-gray-500">
                                                    {" "}
                                                    <ImageIcon className="mx-auto h-12 w-12" />{" "}
                                                    <span>Gambar Utama</span>{" "}
                                                </div>
                                            )}
                                        </div>
                                    </label>
                                    <input
                                        id="gambarUtama"
                                        type="file"
                                        className="hidden"
                                        onChange={(e) =>
                                            handleImageChange(e, "image")
                                        }
                                    />
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label
                                            htmlFor="galeri1"
                                            className="cursor-pointer"
                                        >
                                            <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded-md border-2 border-gray-300 border-dashed hover:border-indigo-500">
                                                {galeri1Preview ? (
                                                    <Image
                                                        src={galeri1Preview}
                                                        alt="Preview"
                                                        width={150}
                                                        height={112}
                                                        className="object-cover w-full h-full rounded-md"
                                                    />
                                                ) : (
                                                    <ImageIcon className="h-8 w-8 text-gray-400" />
                                                )}
                                            </div>
                                        </label>
                                        <input
                                            id="galeri1"
                                            type="file"
                                            className="hidden"
                                            onChange={(e) =>
                                                handleImageChange(e, "galeri1")
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="galeri2"
                                            className="cursor-pointer"
                                        >
                                            <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded-md border-2 border-gray-300 border-dashed hover:border-indigo-500">
                                                {galeri2Preview ? (
                                                    <Image
                                                        src={galeri2Preview}
                                                        alt="Preview"
                                                        width={150}
                                                        height={112}
                                                        className="object-cover w-full h-full rounded-md"
                                                    />
                                                ) : (
                                                    <ImageIcon className="h-8 w-8 text-gray-400" />
                                                )}
                                            </div>
                                        </label>
                                        <input
                                            id="galeri2"
                                            type="file"
                                            className="hidden"
                                            onChange={(e) =>
                                                handleImageChange(e, "galeri2")
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="galeri3"
                                            className="cursor-pointer"
                                        >
                                            <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded-md border-2 border-gray-300 border-dashed hover:border-indigo-500">
                                                {galeri3Preview ? (
                                                    <Image
                                                        src={galeri3Preview}
                                                        alt="Preview"
                                                        width={150}
                                                        height={112}
                                                        className="object-cover w-full h-full rounded-md"
                                                    />
                                                ) : (
                                                    <ImageIcon className="h-8 w-8 text-gray-400" />
                                                )}
                                            </div>
                                        </label>
                                        <input
                                            id="galeri3"
                                            type="file"
                                            className="hidden"
                                            onChange={(e) =>
                                                handleImageChange(e, "galeri3")
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </fieldset>

                {!savedHotelId && (
                    <div className="mt-8 flex justify-end">
                        <button
                            onClick={handleSaveHotel}
                            disabled={isLoading}
                            className="bg-green-600 px-6 py-3 rounded-md text-white font-bold cursor-pointer hover:bg-green-700 disabled:bg-gray-400"
                        >
                            {isLoading ? "Menyimpan..." : "Simpan Data Hotel"}
                        </button>
                    </div>
                )}

                {savedHotelId && (
                    <div className="mt-10 border-t pt-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-800">
                                Daftar Kamar ({rooms.length})
                            </h2>
                            <button
                                onClick={() => setModalOpen(true)}
                                className="bg-indigo-600 px-4 py-2 rounded-md text-white font-semibold cursor-pointer hover:bg-indigo-700"
                            >
                                + Tambah Kamar
                            </button>
                        </div>
                        <div className="mt-4 space-y-3">
                            {rooms.length > 0 ? (
                                rooms.map((room) => (
                                    <div
                                        key={room.id}
                                        className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border"
                                    >
                                        <p className="font-medium text-gray-700">
                                            {room.name} - ({room.price})
                                        </p>
                                        <div>
                                            <button
                                                onClick={() =>
                                                    handleViewRoom(room)
                                                }
                                                className="text-blue-500 hover:text-blue-700"
                                            >
                                                <Eye size={20} />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    room.id &&
                                                    handleDeleteRoom(room.id)
                                                }
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-500 py-4">
                                    Belum ada kamar yang ditambahkan.
                                </p>
                            )}
                        </div>
                        <div className="flex justify-end my-3">
                            <Link href="/Dashboard/Hotel">
                                <button className="border p-2 rounded-md text-white bg-gray-500 cursor-pointer">
                                    kembali
                                </button>
                            </Link>
                        </div>
                    </div>
                )}

                {modalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                            <h2 className="text-2xl font-bold mb-6 text-center">
                                Tambah Detail Kamar
                            </h2>
                            <form onSubmit={handleAddKamar}>
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <div>
                                            <label>Nama Kamar</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={currentRoom.name}
                                                onChange={handleRoomChange}
                                                placeholder="Contoh: Deluxe Room"
                                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label>Harga per Malam</label>
                                            <input
                                                type="text"
                                                name="price"
                                                value={currentRoom.price}
                                                onChange={handleRoomChange}
                                                placeholder="Contoh: Rp 500.000"
                                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label>Deskripsi Kamar</label>
                                            <textarea
                                                name="description"
                                                value={currentRoom.description}
                                                onChange={handleRoomChange}
                                                rows={5}
                                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                            ></textarea>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-gray-700 text-lg">
                                            Gambar Kamar
                                        </h3>
                                        <div>
                                            <label
                                                htmlFor="kamarUtama"
                                                className="cursor-pointer"
                                            >
                                                <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-md border-2 border-gray-300 border-dashed hover:border-indigo-500">
                                                    {gambarKamarUtamaPreview ? (
                                                        <Image
                                                            src={
                                                                gambarKamarUtamaPreview
                                                            }
                                                            alt="Preview"
                                                            width={500}
                                                            height={192}
                                                            className="object-cover w-full h-full rounded-md"
                                                        />
                                                    ) : (
                                                        <div className="text-center text-gray-500">
                                                            <ImageIcon className="mx-auto h-12 w-12" />
                                                            <span>
                                                                Gambar Utama
                                                                Kamar
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </label>
                                            <input
                                                id="kamarUtama"
                                                type="file"
                                                className="hidden"
                                                onChange={(e) =>
                                                    handleImageKamar(e, "image")
                                                }
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label
                                                    htmlFor="gambarkamar1"
                                                    className="cursor-pointer"
                                                >
                                                    <div className="w-full h-28 bg-gray-200 flex items-center justify-center rounded-md border-2 border-gray-300 border-dashed hover:border-indigo-500">
                                                        {kamarGaleri1Preview ? (
                                                            <Image
                                                                src={
                                                                    kamarGaleri1Preview
                                                                }
                                                                alt="Preview"
                                                                width={150}
                                                                height={112}
                                                                className="object-cover w-full h-full rounded-md"
                                                            />
                                                        ) : (
                                                            <ImageIcon className="h-8 w-8 text-gray-400" />
                                                        )}
                                                    </div>
                                                </label>
                                                <input
                                                    id="gambarkamar1"
                                                    type="file"
                                                    className="hidden"
                                                    onChange={(e) =>
                                                        handleImageKamar(
                                                            e,
                                                            "galeri1"
                                                        )
                                                    }
                                                />
                                            </div>
                                            <div>
                                                <label
                                                    htmlFor="kamargaleri2"
                                                    className="cursor-pointer"
                                                >
                                                    <div className="w-full h-28 bg-gray-200 flex items-center justify-center rounded-md border-2 border-gray-300 border-dashed hover:border-indigo-500">
                                                        {kamarGaleri2Preview ? (
                                                            <Image
                                                                src={
                                                                    kamarGaleri2Preview
                                                                }
                                                                alt="Preview"
                                                                width={150}
                                                                height={112}
                                                                className="object-cover w-full h-full rounded-md"
                                                            />
                                                        ) : (
                                                            <ImageIcon className="h-8 w-8 text-gray-400" />
                                                        )}
                                                    </div>
                                                </label>
                                                <input
                                                    id="kamargaleri2"
                                                    type="file"
                                                    className="hidden"
                                                    onChange={(e) =>
                                                        handleImageKamar(
                                                            e,
                                                            "galeri2"
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-8 flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setModalOpen(false)}
                                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
                                    >
                                        {isLoading
                                            ? "Menambahkan..."
                                            : "Tambahkan Kamar Ini"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {viewModalOpen && currentRoom && (
                    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 border-b pb-4">
                                Detail Kamar: {currentRoom.name}
                            </h2>
                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-semibold text-lg text-gray-700 mb-2">
                                        Gambar Utama
                                    </h3>
                                    <div className="w-full h-64 bg-gray-200 rounded-md overflow-hidden">
                                        {currentRoom.image ? (
                                            <Image
                                                src={currentRoom.image}
                                                alt={currentRoom.name}
                                                width={700}
                                                height={256}
                                                className="object-cover w-full h-full"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-gray-500">
                                                Gambar tidak tersedia
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-lg text-gray-700 mb-2">
                                        Galeri Tambahan
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="w-full h-40 bg-gray-200 rounded-md overflow-hidden">
                                            {currentRoom.galeri1 ? (
                                                <Image
                                                    src={currentRoom.galeri1}
                                                    alt="Galeri 1"
                                                    width={400}
                                                    height={160}
                                                    className="object-cover w-full h-full"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-gray-500">
                                                    Gambar 1 tidak tersedia
                                                </div>
                                            )}
                                        </div>
                                        <div className="w-full h-40 bg-gray-200 rounded-md overflow-hidden">
                                            {currentRoom.galeri2 ? (
                                                <Image
                                                    src={currentRoom.galeri2}
                                                    alt="Galeri 2"
                                                    width={400}
                                                    height={160}
                                                    className="object-cover w-full h-full"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-gray-500">
                                                    Gambar 2 tidak tersedia
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
                                    <div>
                                        <p className="font-semibold">
                                            Harga per Malam:
                                        </p>
                                        <p className="text-lg">
                                            {currentRoom.price}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="font-semibold">
                                            Deskripsi:
                                        </p>
                                        <p className="whitespace-pre-wrap">
                                            {currentRoom.description || "-"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8 flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setViewModalOpen(false)}
                                    className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                                >
                                    Tutup
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Page;
