"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ImageIcon } from "lucide-react";
import Image from "next/image";

const Page = () => {
    const [showConfirm, setShowConfirm] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        location: "",
        title: "",
        days: "",
        price: "",
        phone: "",
        description: "",
        image: ""
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
                setFormData({ ...formData, image: reader.result as string });
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
                setFormData({
                    location: "",
                    title: "",
                    days: "",
                    price: "",
                    phone: "",
                    description: "",
                    image: ""
                });
                setPreview(null);
            } else {
                alert("❌ Gagal mengirim data");
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
                {/* Gambar */}
                <div className="flex justify-between gap-3">
                    <div className="w-1/3">
                        <label htmlFor="fileUpload" className="cursor-pointer">
                            <div className="w-full h-[17rem] bg-gray-300 rounded-md flex items-center justify-center hover:bg-gray-400 transition shadow-sm border border-gray-400">
                                {preview ? (
                                    <Image
                                        src={preview}
                                        alt="Preview"
                                        className="object-cover object-center w-full h-full rounded-md hover:ring-2 hover:ring-blue-400"
                                        width={122}
                                        height={122}
                                    />
                                ) : (
                                    <ImageIcon className="w-full h-full text-white" />
                                )}
                            </div>
                        </label>
                        <input
                            id="fileUpload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                    </div>

                    {/* Input Kanan */}
                    <div className="w-2/3 space-y-4">
                        <div>
                            <label className="block font-medium mb-1">
                                Lokasi
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className="w-full shadow-sm border border-gray-400 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Contoh: Bali, Indonesia"
                            />
                        </div>
                        <div>
                            <label className="block font-medium mb-1">
                                Judul
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full shadow-sm border border-gray-400 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Contoh: Liburan ke Pantai"
                            />
                        </div>
                        <div>
                            <label className="block font-medium mb-1">
                                Hari
                            </label>
                            <input
                                type="text"
                                name="days"
                                value={formData.days}
                                onChange={handleChange}
                                className="w-full shadow-sm border border-gray-400 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Contoh: Senin - Jumat"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-between gap-10">
                    <div className="w-full">
                        <label className="block font-medium mb-1">Harga</label>
                        <input
                            type="text"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            className="w-full shadow-sm border border-gray-400 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Contoh: 500.000"
                        />
                    </div>
                    <div className="w-full">
                        <label className="block font-medium mb-1">
                            Nomor Telepon
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full shadow-sm border border-gray-400 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Contoh: 081234567890"
                        />
                    </div>
                </div>

                <div>
                    <label className="block font-medium mb-1">Deskripsi</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full shadow-sm border border-gray-400 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={4}
                        placeholder="Tulis deskripsi di sini..."
                    ></textarea>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="w-1/3 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md cursor-pointer"
                    >
                        Tambah
                    </button>
                </div>
            </form>

            {/* Konfirmasi Pop-Up */}
            {showConfirm && (
                <div className="fixed inset-0 bg-opacity-10 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-md w-[300px] text-center">
                        <p className="text-lg font-medium mb-4">
                            Apakah Anda yakin ingin submit data?
                        </p>
                        <div className="flex justify-around">
                            <Link href="/Dashboard/Destinasi">
                                <button
                                    onClick={() => handleConfirm(true)}
                                    className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md cursor-pointer"
                                >
                                    Ya
                                </button>
                            </Link>
                            <button
                                onClick={() => handleConfirm(false)}
                                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md cursor-pointer"
                            >
                                Tidak
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Page;
