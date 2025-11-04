"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ImageIcon, Upload } from "lucide-react";
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
    // Store actual File objects for upload
    const [files, setFiles] = useState({
        gambar1: null as File | null,
        gambar2: null as File | null,
        gambar3: null as File | null,
        gambar4: null as File | null,
        gambar360: null as File | null
    });
    const [formData, setFormData] = useState({
        namaPaket: "",
        alamat: "",
        deskripsi: "",
        harga: "",
        yangTermasuk: [] as string[],
        jadwal: [] as { waktu: string; kegiatan: string }[],
        noWa: "",
        gambar1: "",
        gambar2: "",
        gambar3: "",
        gambar4: "",
        gambar360: ""
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, imageType: 'gambar1' | 'gambar2' | 'gambar3' | 'gambar4' | 'gambar360') => {
        const file = e.target.files?.[0];
        if (file) {
            // Store the actual file for upload
            setFiles(prev => ({ ...prev, [imageType]: file }));
            
            // Generate preview
            const reader = new FileReader();
            reader.onloadend = () => {
                const imageData = reader.result as string;
                setPreviews(prev => ({ ...prev, [imageType]: imageData }));
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
        if (!files.gambar1) {
            alert("Gambar utama wajib diupload!");
            return;
        }
        
        setShowConfirm(true);
    };

    const handleConfirm = async (answer: boolean) => {
        if (answer) {
            try {
                // Create FormData for proper file upload
                const formDataToSend = new FormData();
                
                // Add text fields
                formDataToSend.append("namaPaket", formData.namaPaket);
                formDataToSend.append("alamat", formData.alamat);
                formDataToSend.append("deskripsi", formData.deskripsi);
                formDataToSend.append("harga", formData.harga);
                formDataToSend.append("noWa", formData.noWa);
                
                // Add arrays as JSON strings
                formDataToSend.append("yangTermasuk", JSON.stringify(formData.yangTermasuk));
                formDataToSend.append("jadwal", JSON.stringify(formData.jadwal));
                
                // Add image files
                if (files.gambar1) formDataToSend.append("gambar1", files.gambar1);
                if (files.gambar2) formDataToSend.append("gambar2", files.gambar2);
                if (files.gambar3) formDataToSend.append("gambar3", files.gambar3);
                if (files.gambar4) formDataToSend.append("gambar4", files.gambar4);
                if (files.gambar360) formDataToSend.append("gambar360", files.gambar360);
                
                const res = await fetch("/api/admin/paket-wisata", {
                    method: "POST",
                    body: formDataToSend, // Send FormData instead of JSON
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

                        {/* Yang Termasuk dalam Paket */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Yang Termasuk dalam Paket (Opsional)
                            </label>
                            <div className="space-y-2">
                                {formData.yangTermasuk.map((item, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <div className="flex items-center text-green-600">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <input
                                            type="text"
                                            value={item}
                                            onChange={(e) => {
                                                const newItems = [...formData.yangTermasuk];
                                                newItems[index] = e.target.value;
                                                setFormData({ ...formData, yangTermasuk: newItems });
                                            }}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Contoh: Guide profesional"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newItems = formData.yangTermasuk.filter((_, i) => i !== index);
                                                setFormData({ ...formData, yangTermasuk: newItems });
                                            }}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setFormData({ ...formData, yangTermasuk: [...formData.yangTermasuk, ""] });
                                    }}
                                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Tambah Item
                                </button>
                            </div>
                        </div>

                        {/* Jadwal Perjalanan */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Jadwal Perjalanan (Opsional)
                            </label>
                            <div className="space-y-3">
                                {formData.jadwal.map((item, index) => (
                                    <div key={index} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                                        <input
                                            type="text"
                                            value={item.waktu}
                                            onChange={(e) => {
                                                const newJadwal = [...formData.jadwal];
                                                newJadwal[index].waktu = e.target.value;
                                                setFormData({ ...formData, jadwal: newJadwal });
                                            }}
                                            className="w-20 px-2 py-1 text-center text-blue-600 font-medium border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="08:00"
                                        />
                                        <input
                                            type="text"
                                            value={item.kegiatan}
                                            onChange={(e) => {
                                                const newJadwal = [...formData.jadwal];
                                                newJadwal[index].kegiatan = e.target.value;
                                                setFormData({ ...formData, jadwal: newJadwal });
                                            }}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Contoh: Penjemputan di titik kumpul"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newJadwal = formData.jadwal.filter((_, i) => i !== index);
                                                setFormData({ ...formData, jadwal: newJadwal });
                                            }}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setFormData({ ...formData, jadwal: [...formData.jadwal, { waktu: "", kegiatan: "" }] });
                                    }}
                                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Tambah Jadwal
                                </button>
                            </div>
                        </div>

                        {/* Nomor WhatsApp */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nomor WhatsApp (Opsional)
                            </label>
                            <input
                                type="tel"
                                name="noWa"
                                value={formData.noWa}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="628xxxxxxxxxx (dimulai dengan 62)"
                                pattern="^62\d{9,13}$"
                            />
                            <p className="text-gray-500 text-xs mt-1">
                                Format: 628xxxxxxxxxx (dimulai dengan 62)
                            </p>
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
                                        !files.gambar1 ? 'border-red-300 hover:border-red-500' : 'border-green-300 hover:border-green-500'
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
                                                        setFiles(prev => ({ ...prev, gambar1: null }));
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
                                                <label className="mt-2 flex items-center justify-center px-3 py-1 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700 text-sm">
                                                    <Upload size={14} className="mr-1" />
                                                    Pilih File
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleImageChange(e, 'gambar1')}
                                                        className="hidden"
                                                    />
                                                </label>
                                            </div>
                                        )}
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
                                                        setFiles(prev => ({ ...prev, gambar2: null }));
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
                                                <label className="mt-2 flex items-center justify-center px-3 py-1 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700 text-sm">
                                                    <Upload size={14} className="mr-1" />
                                                    Pilih File
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleImageChange(e, 'gambar2')}
                                                        className="hidden"
                                                    />
                                                </label>
                                            </div>
                                        )}
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
                                                        setFiles(prev => ({ ...prev, gambar3: null }));
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
                                                <label className="mt-2 flex items-center justify-center px-3 py-1 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700 text-sm">
                                                    <Upload size={14} className="mr-1" />
                                                    Pilih File
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleImageChange(e, 'gambar3')}
                                                        className="hidden"
                                                    />
                                                </label>
                                            </div>
                                        )}
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
                                                        setFiles(prev => ({ ...prev, gambar4: null }));
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
                                                <label className="mt-2 flex items-center justify-center px-3 py-1 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700 text-sm">
                                                    <Upload size={14} className="mr-1" />
                                                    Pilih File
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleImageChange(e, 'gambar4')}
                                                        className="hidden"
                                                    />
                                                </label>
                                            </div>
                                        )}
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
                                                        setFiles(prev => ({ ...prev, gambar360: null }));
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
                                                <label className="mt-2 flex items-center justify-center px-3 py-1 bg-orange-600 text-white rounded-md cursor-pointer hover:bg-orange-700 text-sm">
                                                    <Upload size={14} className="mr-1" />
                                                    Pilih File
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleImageChange(e, 'gambar360')}
                                                        className="hidden"
                                                    />
                                                </label>
                                            </div>
                                        )}
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