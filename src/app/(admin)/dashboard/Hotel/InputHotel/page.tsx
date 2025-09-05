"use client";
import React, {useState} from "react";
import Link from "next/link";
import {ImageIcon} from "lucide-react";
import Image from "next/image";

const page = () => {
    const [gambarHotelPreview, setgambarHotelPreview] = useState<string | null>(
        null
    );
    const [SupportHotel, setSupportHotel] = useState<string | null>(null);
    const [gambarKamarUtama, setgambarKamarUtama] = useState<string | null>(
        null
    );
    const [supportKamar, setSupportKamar] = useState<string | null>(null);
    const [Kamar,setKamar]= useState(0)

    const [modalOpen, setModalOpen] = useState(false);

    // input data hotel
    const handleHotel = (e: React.FormEvent) => {
        e.preventDefault();
        setModalOpen(true);
    };

    // input data Kamar
    const handleAddKamar = (e: React.FormEvent) => {
        e.preventDefault();
    };

    return (
        <div>
            <div className="max-w-8xl mx-auto bg-white p-8 rounded-xl shadow-lg">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">
                    Input Data Hotel Baru
                </h1>
                {/* FORM INPUT HOTEL */}
                <form onSubmit={handleHotel}>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-5">
                            <div>
                                <label
                                    htmlFor=""
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Nama Hotel
                                </label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none  focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="">Lokasi</label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="">harga per malam</label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="">Deskripsi</label>
                                <textarea
                                    name=""
                                    id=""
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500"
                                ></textarea>
                            </div>
                        </div>

                        {/* kolom kanan Input gambar */}
                        <div className="space-y-1">
                            <h3 className="font-bold text-gray-700 text-center text-md underline">
                                Gambar Hotel
                            </h3>
                            <div>
                                <label
                                    htmlFor="gambarUtama"
                                    className="cursor-pointer"
                                >
                                    <div className="w-full h-[17rem] bg-gray-300 hover:bg-gray-400 rounded-md border-3 border-gray-500 border-dashed">
                                        {gambarHotelPreview ? (
                                            <Image
                                                src={gambarHotelPreview}
                                                alt="Preview"
                                                width={122}
                                                height={122}
                                                className="object-cover object-center w-full h-full rounded-md hover:ring-3 hover:ring-blue-500"
                                            />
                                        ) : (
                                            <ImageIcon className="w-full h-full text-white rounded-md hover:ring-2 hover:ring-blue-400" />
                                        )}
                                    </div>
                                </label>
                                <input
                                    id="gambarUtama"
                                    type="file"
                                    className="hidden"
                                />
                                <div className=" my-3 grid grid-cols-3 gap-4">
                                    <div>
                                        <label
                                            htmlFor="galeri1"
                                            className="cursor-pointer"
                                        >
                                            <div className="w-full h-[10rem] bg-gray-300 rounded-md border-2 border-gray-400 border-dashed">
                                                {SupportHotel ? (
                                                    <Image
                                                        src={SupportHotel}
                                                        alt="Preview"
                                                        width={122}
                                                        height={122}
                                                        className="object-cover object-center w-full h-full rounded-md  hover:border-blue-500"
                                                    />
                                                ) : (
                                                    <ImageIcon className="w-full h-full bg-gray-300 text-white rounded-md hover:bg-gray-400 hover:ring-2 hover:ring-blue-400" />
                                                )}
                                            </div>
                                        </label>
                                        <input
                                            id="galeri1"
                                            type="file"
                                            className="hidden"
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="galeri2"
                                            className="cursor-pointer"
                                        >
                                            <div className="w-full h-[10rem] bg-gray-300 rounded-md border-2 border-gray-400 border-dashed">
                                                {SupportHotel ? (
                                                    <Image
                                                        src={SupportHotel}
                                                        alt="Preview"
                                                        width={122}
                                                        height={122}
                                                        className="object-cover object-center w-full h-full rounded-md hover:border-blue-500"
                                                    />
                                                ) : (
                                                    <ImageIcon className="w-full h-full bg-gray-300 text-white rounded-md hover:bg-gray-400 hover:ring-2 hover:ring-blue-400" />
                                                )}
                                            </div>
                                        </label>
                                        <input
                                            id="galeri2"
                                            type="file"
                                            className="hidden"
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="galeri3"
                                            className="cursor-pointer"
                                        >
                                            <div className="w-full h-[10rem] bg-gray-300 rounded-md border-2 border-gray-400 border-dashed">
                                                {SupportHotel ? (
                                                    <Image
                                                        src={SupportHotel}
                                                        alt="Preview"
                                                        width={122}
                                                        height={122}
                                                        className="object-cover object-center w-full h-full rounded-md hover:border-blue-500"
                                                    />
                                                ) : (
                                                    <ImageIcon className="w-full h-full bg-gray-300 text-white rounded-md hover:bg-gray-400 hover:ring-2 hover:ring-blue-400" />
                                                )}
                                            </div>
                                        </label>
                                        <input
                                            id="galeri3"
                                            type="file"
                                            className="hidden"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 flex justify-end space-x-4">
                        <button className="bg-indigo-500 px-2 py-3 rounded-md text-white cursor-pointer hover:bg-indigo-600">
                            simpan
                        </button>
                    </div>
                </form>

                {/* Modal Untuk Input Kamar */}
                {modalOpen && (
                    <div className=" max-w-8xl fixed inset-0 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-xl p-6">
                            <h2 className="text-2xl font-bold mb-4 text-center">
                                Tambah Kamar
                            </h2>
                            <form onSubmit={handleAddKamar}>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-6">
                                        <label htmlFor="">Nama Kamar</label>
                                        <input
                                            type="text"
                                            placeholder="Nama Kamar"
                                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500"
                                            required
                                        />
                                        <label htmlFor="">Harga</label>
                                        <input
                                            type="text"
                                            name="price"
                                            placeholder="harga kamar (Contoh: Rp. 200.000"
                                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500"
                                        />
                                        <label htmlFor="">Deskripsi</label>
                                        <textarea
                                            name=""
                                            id=""
                                            placeholder="Deksripsi tentang kamar"
                                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500"
                                        ></textarea>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-700 text-center text-md underline">
                                            Gambar Kamar
                                        </h3>
                                        <label
                                            htmlFor="kamarUtama"
                                            className="cursor-pointer"
                                        >
                                            <div className="w-full h-[17rem] bg-gray-300 hover:bg-gray-400 rounded-md border-2 border-gray-500 border-dashed">
                                                {gambarKamarUtama ? (
                                                    <Image
                                                        src={gambarKamarUtama}
                                                        alt="Preview"
                                                        width={122}
                                                        height={122}
                                                        className="object-cover object-center w-full h-full rounded-md hover:ring-3 hover:ring-blue-500"
                                                    />
                                                ) : (
                                                    <ImageIcon className="w-full h-full text-white rounded-md hover:ring-2 hover:ring-blue-400" />
                                                )}
                                            </div>
                                        </label>
                                        <input
                                            id="kamarUtama"
                                            type="file"
                                            className="hidden"
                                        />
                                        <div className="my-3">
                                            <h2 className="font-semibold">
                                                tambahan gambar kamar
                                            </h2>
                                            <div className="my-1 grid grid-cols-2 gap-4">
                                                <div>
                                                    <label
                                                        htmlFor="galeri1"
                                                        className="cursor-pointer"
                                                    >
                                                        <div className="w-full h-[10rem] bg-gray-300 rounded-md border-2 border-gray-400 border-dashed">
                                                            {supportKamar ? (
                                                                <Image
                                                                    src={
                                                                        supportKamar
                                                                    }
                                                                    alt="Preview"
                                                                    width={122}
                                                                    height={122}
                                                                    className="object-cover object-center w-full h-full rounded-md  hover:border-blue-500"
                                                                />
                                                            ) : (
                                                                <ImageIcon className="w-full h-full bg-gray-300 text-white rounded-md hover:bg-gray-400 hover:ring-2 hover:ring-blue-400" />
                                                            )}
                                                        </div>
                                                    </label>
                                                    <input
                                                        id="galeri1"
                                                        type="file"
                                                        className="hidden"
                                                    />
                                                </div>
                                                <div>
                                                    <label
                                                        htmlFor="galeri2"
                                                        className="cursor-pointer"
                                                    >
                                                        <div className="w-full h-[10rem] bg-gray-300 rounded-md border-2 border-gray-400 border-dashed">
                                                            {supportKamar ? (
                                                                <Image
                                                                    src={
                                                                        supportKamar
                                                                    }
                                                                    alt="Preview"
                                                                    width={122}
                                                                    height={122}
                                                                    className="object-cover object-center w-full h-full rounded-md hover:border-blue-500"
                                                                />
                                                            ) : (
                                                                <ImageIcon className="w-full h-full bg-gray-300 text-white rounded-md hover:bg-gray-400 hover:ring-2 hover:ring-blue-400" />
                                                            )}
                                                        </div>
                                                    </label>
                                                    <input
                                                        id="galeri2"
                                                        type="file"
                                                        className="hidden"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-5 flex justify-end space-x-3">
                                    <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                                        Batal
                                    </button>
                                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                                        Tambahkan
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
            {/* Daftar Kamar Yang Ditambahkan */}
            {Kamar > 0 && (
                <div className="mt-10 border-t pt-6">
                    <h2 className="text-xl font-bolde text-gray-800 mb-4">Daftar Kamar</h2>
                    <div></div>
                </div>
            )}
            <div>

            </div>
        </div>
    );
};

export default page;
