"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import RichTextEditor from "@/components/admin/RichTextEditor";

const Page = () => {
    const [showConfirm, setShowConfirm] = useState(false);
    const [previews, setPreviews] = useState({
        gambar1: null as string | null,
        gambar2: null as string | null,
        gambar3: null as string | null,
        gambar4: null as string | null,
        gambar360: null as string | null
    });
    const [formData, setFormData] = useState({
        namaPaket: "",
        alamat: "",
        deskripsi: "",
        harga: "",
        gambar1: "",
        gambar2: "",
        gambar3: "",
        gambar4: "",
        gambar360: ""
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, imageType: 'gambar1' | 'gambar2' | 'gambar3' | 'gambar4' | 'gambar360') => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const imageData = reader.result as string;
                setPreviews(prev => ({ ...prev, [imageType]: imageData }));
                setFormData(prev => ({ ...prev, [imageType]: imageData }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validasi gambar utama wajib
        if (!formData.gambar1) {
            alert("Gambar utama wajib diupload!");
            return;
        }
        
        setShowConfirm(true);
    };

    const handleConfirm = async (answer: boolean) => {
        if (answer) {
            try {
                const res = await fetch("/api/admin/paket-wisata", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                });
                
                if (res.ok) {
                    alert("Paket wisata berhasil ditambahkan!");
                    window.location.href = "/dashboard/PaketWisata";
                } else {
                    const errorData = await res.json();
                    alert(`Gagal menambahkan paket wisata: ${errorData.message || 'Unknown error'}`);
                }
            } catch (error) {
                console.error("Error:", error);
                alert("Terjadi kesalahan saat menyimpan data. Pastikan semua field wajib sudah diisi.");
            }
        }
        setShowConfirm(false);
    };

    const handleDescriptionChange = (htmlContent: string) => {
        setFormData(prev => ({ ...prev, deskripsi: htmlContent }));
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center mb-6">
                    <Link
                        href="/dashboard/PaketWisata"
                        className="text-blue-600 hover:text-blue-800 mr-4"
                    >
                        ← Kembali
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Input Paket Wisata
                    </h1>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <form onSubmit={handleSubmit}>
                        {/* Nama Paket */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nama Paket Wisata *
                            </label>
                            <input
                                type="text"
                                name="namaPaket"
                                value={formData.namaPaket}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Masukkan nama paket wisata"
                                required
                            />
                        </div>

                        {/* Alamat */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Alamat/Lokasi *
                            </label>
                            <input
                                type="text"
                                name="alamat"
                                value={formData.alamat}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Masukkan alamat atau lokasi paket wisata"
                                required
                            />
                        </div>

                        {/* Harga */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Harga per Orang *
                            </label>
                            <input
                                type="number"
                                name="harga"
                                value={formData.harga}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Masukkan harga dalam rupiah"
                                required
                                min="0"
                                step="1000"
                            />
                        </div>

                        {/* Deskripsi dengan Rich Text Editor */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Deskripsi Paket Wisata *
                            </label>
                            <RichTextEditor
                                value={formData.deskripsi}
                                onChange={handleDescriptionChange}
                                placeholder="Masukkan deskripsi lengkap paket wisata..."
                            />
                        </div>

                        {/* Upload Images */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-4">
                                Upload Gambar
                            </label>
                            
                            {/* Gambar 1 - Required */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <label className="block text-sm text-gray-600">
                                        Gambar Utama *
                                    </label>
                                    <div className={`relative border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                                        !formData.gambar1 ? 'border-red-300 hover:border-red-500' : 'border-green-300 hover:border-green-500'
                                    }`}>
                                        {previews.gambar1 ? (
                                            <div className="relative">
                                                <Image
                                                    src={previews.gambar1}
                                                    alt="Preview 1"
                                                    width={200}
                                                    height={150}
                                                    className="mx-auto rounded-lg object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setPreviews(prev => ({ ...prev, gambar1: null }));
                                                        setFormData(prev => ({ ...prev, gambar1: "" }));
                                                    }}
                                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ) : (
                                            <div>
                                                <ImageIcon className="mx-auto h-12 w-12 text-red-400" />
                                                <p className="mt-2 text-sm text-red-600 font-medium">
                                                    Gambar Wajib!
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Klik untuk upload
                                                </p>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleImageChange(e, 'gambar1')}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                    </div>
                                </div>

                                {/* Gambar 2 - Optional */}
                                <div className="space-y-2">
                                    <label className="block text-sm text-gray-600">
                                        Gambar 2 (Opsional)
                                    </label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors relative">
                                        {previews.gambar2 ? (
                                            <div className="relative">
                                                <Image
                                                    src={previews.gambar2}
                                                    alt="Preview 2"
                                                    width={200}
                                                    height={150}
                                                    className="mx-auto rounded-lg object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setPreviews(prev => ({ ...prev, gambar2: null }));
                                                        setFormData(prev => ({ ...prev, gambar2: "" }));
                                                    }}
                                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ) : (
                                            <div>
                                                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                                                <p className="mt-2 text-sm text-gray-600">
                                                    Klik untuk upload
                                                </p>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleImageChange(e, 'gambar2')}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                    </div>
                                </div>

                                {/* Gambar 3 - Optional */}
                                <div className="space-y-2">
                                    <label className="block text-sm text-gray-600">
                                        Gambar 3 (Opsional)
                                    </label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors relative">
                                        {previews.gambar3 ? (
                                            <div className="relative">
                                                <Image
                                                    src={previews.gambar3}
                                                    alt="Preview 3"
                                                    width={200}
                                                    height={150}
                                                    className="mx-auto rounded-lg object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setPreviews(prev => ({ ...prev, gambar3: null }));
                                                        setFormData(prev => ({ ...prev, gambar3: "" }));
                                                    }}
                                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ) : (
                                            <div>
                                                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                                                <p className="mt-2 text-sm text-gray-600">
                                                    Klik untuk upload
                                                </p>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleImageChange(e, 'gambar3')}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                    </div>
                                </div>

                                {/* Gambar 4 - Optional */}
                                <div className="space-y-2">
                                    <label className="block text-sm text-gray-600">
                                        Gambar 4 (Opsional)
                                    </label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors relative">
                                        {previews.gambar4 ? (
                                            <div className="relative">
                                                <Image
                                                    src={previews.gambar4}
                                                    alt="Preview 4"
                                                    width={200}
                                                    height={150}
                                                    className="mx-auto rounded-lg object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setPreviews(prev => ({ ...prev, gambar4: null }));
                                                        setFormData(prev => ({ ...prev, gambar4: "" }));
                                                    }}
                                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ) : (
                                            <div>
                                                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                                                <p className="mt-2 text-sm text-gray-600">
                                                    Klik untuk upload
                                                </p>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleImageChange(e, 'gambar4')}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                    </div>
                                </div>

                                {/* Gambar 360 - Optional */}
                                <div className="space-y-2">
                                    <label className="block text-sm text-gray-600">
                                        Gambar 360° (Opsional)
                                    </label>
                                    <div className="border-2 border-dashed border-orange-300 rounded-lg p-4 text-center hover:border-orange-500 transition-colors relative">
                                        {previews.gambar360 ? (
                                            <div className="relative">
                                                <Image
                                                    src={previews.gambar360}
                                                    alt="Preview 360"
                                                    width={200}
                                                    height={150}
                                                    className="mx-auto rounded-lg object-cover"
                                                />
                                                <div className="absolute top-1 left-1 bg-orange-500 text-white px-2 py-1 rounded text-xs">
                                                    360°
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setPreviews(prev => ({ ...prev, gambar360: null }));
                                                        setFormData(prev => ({ ...prev, gambar360: "" }));
                                                    }}
                                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ) : (
                                            <div>
                                                <ImageIcon className="mx-auto h-12 w-12 text-orange-400" />
                                                <p className="mt-2 text-sm text-orange-600">
                                                    Upload foto 360°
                                                </p>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleImageChange(e, 'gambar360')}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end gap-4">
                            <Link
                                href="/dashboard/PaketWisata"
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Simpan Paket Wisata
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Konfirmasi Simpan
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Apakah Anda yakin ingin menyimpan paket wisata ini?
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => handleConfirm(false)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                                Batal
                            </button>
                            <button
                                onClick={() => handleConfirm(true)}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Ya, Simpan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Page;