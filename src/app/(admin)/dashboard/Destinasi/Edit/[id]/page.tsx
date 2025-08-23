"use client";

import {useEffect, useState} from "react";
import {useRouter, useParams} from "next/navigation";
import Image from "next/image";

export default function Page() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const [formData, setFormData] = useState({
        title: "",
        location: "",
        days: "",
        phone: "",
        price: "",
        description: "",
        image: "",
    });

    useEffect(() => {
        if (!id) return;
        fetch(`/api/admin/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setFormData({
                    title: data.title || "",
                    location: data.location || "",
                    price: data.price || "",
                    description: data.description || "",
                    phone: data.phone || "",
                    days: data.days || "",
                    image: data.image,
                });
            })
            .catch((err) => console.error("Gagal mengambil data", err));
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch(`/api/admin/${id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(formData),
        });

        if (res.ok) {
            alert("Data berhasil diperbarui");
            router.push("/Dashboard/Destinasi");
        } else {
            alert("Gagal memperbarui data");
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setFormData({ ...formData, image: reader.result as string });
                };
                reader.readAsDataURL(file);
            }
        };

    return (
        <div className="max-w-8xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-3xl font-semibold mb-10 border-b-2">
                Edit Destinasi
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Bagian Gambar & Field Kanan */}
                <div className="flex justify-between gap-3">
                    {/* Gambar */}
                    <div className="w-1/3">
                        <label htmlFor="fileupload">
                            <div className="w-full h-[17rem] bg-gray-300 rounded-md flex items-center justify-center hover:bg-gray-400 transition shadow-sm border border-gray-400">
                                {formData.image && (
                                    <Image
                                                                            src={formData.image}
                                                                            alt="Preview"
                                                                            className="object-cover object-center w-full h-full rounded-md hover:ring-2 hover:ring-blue-400"
                                                                            width={122}
                                                                            height={122}
                                                                        />
                                )}
                            </div>
                        </label>
                        <input
                            id="fileupload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                    </div>

                    {/* Input Fields */}
                    <div className="w-2/3 space-y-3">
                        <div>
                            <label className="block font-semibold">
                                Lokasi
                            </label>
                            <input
                                type="text"
                                value={formData.location}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        location: e.target.value,
                                    })
                                }
                                className="border rounded w-full px-3 py-2 bg-blue-50"
                            />
                        </div>
                        <div>
                            <label className="block font-semibold">Judul</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        title: e.target.value,
                                    })
                                }
                                className="border rounded w-full px-3 py-2 bg-blue-50"
                            />
                        </div>
                        <div>
                            <label className="block font-semibold">Hari</label>
                            <input
                                type="text"
                                value={formData.days}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        days: e.target.value,
                                    })
                                }
                                className="border rounded w-full px-3 py-2 bg-blue-50"
                            />
                        </div>
                    </div>
                </div>

                {/* Harga & Nomor Telepon */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block font-semibold">Harga</label>
                        <input
                            type="text"
                            value={formData.price}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    price: e.target.value,
                                })
                            }
                            className="border rounded w-full px-3 py-2 bg-blue-50"
                        />
                    </div>
                    <div>
                        <label className="block font-semibold">
                            Nomor Telepon
                        </label>
                        <input
                            type="text"
                            value={formData.phone}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    phone: e.target.value,
                                })
                            }
                            className="border rounded w-full px-3 py-2 bg-blue-50"
                        />
                    </div>
                </div>

                {/* Deskripsi */}
                <div>
                    <label className="block font-semibold">Deskripsi</label>
                    <textarea
                        value={formData.description}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                description: e.target.value,
                            })
                        }
                        className="border rounded w-full px-3 py-2 bg-white"
                        rows={4}
                    />
                </div>

                {/* Tombol */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-8 py-2 rounded hover:bg-blue-700"
                    >
                        updated
                    </button>
                </div>
            </form>
        </div>
    );
}
