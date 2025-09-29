"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import RichTextEditor from "@/components/admin/RichTextEditor";

const Page = () => {
    const router = useRouter();
    const [showConfirm, setShowConfirm] = useState(false);
    const [previews, setPreviews] = useState({
        gambar1: null as string | null,
        gambar2: null as string | null,
        gambar3: null as string | null
    });
    const [formData, setFormData] = useState({
        namaLokasi: "",
        alamat: "",
        deskripsi: "",
        gambar1: "",
        gambar2: "",
        gambar3: ""
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, imageType: 'gambar1' | 'gambar2' | 'gambar3') => {
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
        setShowConfirm(true);
    };

    const handleConfirm = async (answer: boolean) => {
        if (answer) {
            const res = await fetch("/api/admin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                alert("✅ Data berhasil dikirim!");
                // Redirect to destination list page
                router.push("/dashboard/Destinasi");
            } else {
                const errorData = await res.json();
                alert(`❌ Gagal mengirim data: ${errorData.message || "Unknown error"}`);
            }
        }
        setShowConfirm(false);
    };

    return (
        <div className="max-w-8xl mx-auto p-6 bg-white shadow-md border border-gray-200 rounded-lg">
            <h2 className="text-3xl font-semibold mb-10 border-b-2">
                Input Data Destinasi
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Upload Gambar */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Gambar 1 - Required */}
                    <div>
                        <label className="block font-medium mb-1">
                            Gambar Utama *
                        </label>
                        <label htmlFor="gambar1Upload" className="cursor-pointer">
                            <div className="w-full h-[200px] bg-gray-300 rounded-md flex items-center justify-center hover:bg-gray-400 transition shadow-sm border border-gray-400">
                                {previews.gambar1 ? (
                                    <Image
                                        src={previews.gambar1}
                                        alt="Preview Gambar 1"
                                        className="object-cover object-center w-full h-full rounded-md hover:ring-2 hover:ring-blue-400"
                                        width={200}
                                        height={200}
                                    />
                                ) : (
                                    <div className="text-center">
                                        <ImageIcon className="w-12 h-12 text-white mx-auto mb-2" />
                                        <span className="text-white text-sm">Gambar Utama</span>
                                    </div>
                                )}
                            </div>
                        </label>
                        <input
                            id="gambar1Upload"
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageChange(e, 'gambar1')}
                            className="hidden"
                            required
                        />
                    </div>

                    {/* Gambar 2 - Optional */}
                    <div>
                        <label className="block font-medium mb-1">
                            Gambar Tambahan 1
                        </label>
                        <label htmlFor="gambar2Upload" className="cursor-pointer">
                            <div className="w-full h-[200px] bg-gray-300 rounded-md flex items-center justify-center hover:bg-gray-400 transition shadow-sm border border-gray-400">
                                {previews.gambar2 ? (
                                    <Image
                                        src={previews.gambar2}
                                        alt="Preview Gambar 2"
                                        className="object-cover object-center w-full h-full rounded-md hover:ring-2 hover:ring-blue-400"
                                        width={200}
                                        height={200}
                                    />
                                ) : (
                                    <div className="text-center">
                                        <ImageIcon className="w-12 h-12 text-white mx-auto mb-2" />
                                        <span className="text-white text-sm">Opsional</span>
                                    </div>
                                )}
                            </div>
                        </label>
                        <input
                            id="gambar2Upload"
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageChange(e, 'gambar2')}
                            className="hidden"
                        />
                    </div>

                    {/* Gambar 3 - Optional */}
                    <div>
                        <label className="block font-medium mb-1">
                            Gambar Tambahan 2
                        </label>
                        <label htmlFor="gambar3Upload" className="cursor-pointer">
                            <div className="w-full h-[200px] bg-gray-300 rounded-md flex items-center justify-center hover:bg-gray-400 transition shadow-sm border border-gray-400">
                                {previews.gambar3 ? (
                                    <Image
                                        src={previews.gambar3}
                                        alt="Preview Gambar 3"
                                        className="object-cover object-center w-full h-full rounded-md hover:ring-2 hover:ring-blue-400"
                                        width={200}
                                        height={200}
                                    />
                                ) : (
                                    <div className="text-center">
                                        <ImageIcon className="w-12 h-12 text-white mx-auto mb-2" />
                                        <span className="text-white text-sm">Opsional</span>
                                    </div>
                                )}
                            </div>
                        </label>
                        <input
                            id="gambar3Upload"
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageChange(e, 'gambar3')}
                            className="hidden"
                        />
                    </div>
                </div>

                {/* Form Data */}
                <div className="space-y-4">
                    {/* Nama Lokasi */}
                    <div>
                        <label className="block font-medium mb-1">
                            Nama Lokasi Wisata *
                        </label>
                        <input
                            type="text"
                            name="namaLokasi"
                            value={formData.namaLokasi}
                            onChange={handleChange}
                            className="w-full shadow-sm border border-gray-400 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Contoh: Pantai Kuta Bali"
                            required
                        />
                    </div>

                    {/* Alamat */}
                    <div>
                        <label className="block font-medium mb-1">
                            Alamat Lengkap *
                        </label>
                        <input
                            type="text"
                            name="alamat"
                            value={formData.alamat}
                            onChange={handleChange}
                            className="w-full shadow-sm border border-gray-400 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Contoh: Jl. Pantai Kuta, Badung, Bali 80361"
                            required
                        />
                    </div>

                    {/* Deskripsi */}
                    <div>
                        <label className="block font-medium mb-1">
                            Deskripsi Tempat Wisata *
                        </label>
                        <RichTextEditor
                            value={formData.deskripsi}
                            onChange={(val: string) => setFormData(prev => ({ ...prev, deskripsi: val }))}
                            placeholder="Tulis deskripsi lengkap tentang tempat wisata ini..."
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <Link href="/dashboard/Destinasi">
                        <button
                            type="button"
                            className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-md"
                        >
                            Batal
                        </button>
                    </Link>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md"
                    >
                        Tambah Destinasi
                    </button>
                </div>
            </form>

            {/* Konfirmasi Pop-Up */}
            {showConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] text-center">
                        <p className="text-lg font-medium mb-4">
                            Apakah Anda yakin ingin menambahkan destinasi ini?
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => handleConfirm(true)}
                                className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-md"
                            >
                                Ya, Tambahkan
                            </button>
                            <button
                                onClick={() => handleConfirm(false)}
                                className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-md"
                            >
                                Batal
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Page;