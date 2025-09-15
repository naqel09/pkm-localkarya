"use client";
import React, {useState} from "react";
import Image from "next/image";
import {ImageIcon} from "lucide-react";
import Link from "next/link";

export default function Page() {
    const [preview, setPreview] = useState<string | null>(null);
    const [artikel, setArtikel] = useState({
        Judul: "",
        Kategory: "",
        Lokasi: "",
        Tanggal: "",
        Deskripsi: "",
        Gambar: "",
    });
    const [confirm,setConfirm]=useState(false)

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
                setArtikel({...artikel, Gambar: reader.result as string});
            };
            reader.readAsDataURL(file);
        }
    };

    const handleChange =(e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)=>{
        setArtikel({...artikel,[e.target.name]:e.target.value});
    }

    const handleConfirm = async()=>{
        const res = await fetch("/api/blog",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(artikel)
        });
        const data = await res.json();
        console.log(data);
        alert(data.message);
    }

    async function handleSubmit(e:React.FormEvent){
        e.preventDefault()
        setConfirm(true);
    }

    return (
        <div className="max-w-8xl mx-auto p-6 bg-white shadow-md border border-gray-400 rounded-lg">
            <h2 className="text-3xl font-semibold mb-10 border-b-2">
                Input Artikel
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <h3 className="capitalize text-xl font-semibold py-3">
                        gambar Artikel
                    </h3>
                    <label htmlFor="fileUpload" className="cursor-pointer">
                        <div className="w-full h-[30rem] bg-gray-300 rounded-md flex items-center justify-center hover:bg-gray-400 transition shadow-sm border-gray-400">
                            {preview ? (
                                <Image
                                    src={preview}
                                    alt="artikel"
                                    className="object-center w-full h-full rounded-md hover:ring-2 hover:ring-blue-400"
                                    width={122}
                                    height={122}
                                />
                            ) : (
                                <ImageIcon className="w-full h-full text-white hover:ring-2 hover:ring-blue-400 rounded-md" />
                            )}
                        </div>
                    </label>
                    <input
                        type="file"
                        id="fileUpload"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                    />
                </div>

                {/* inputan artikel */}
                <div className="space-y-4">
                    <div className="flex justify-between gap-8">
                        <div className="w-1/2">
                            <label
                                htmlFor="title"
                                className="capitalize block my-2 font-semibold"
                            >
                                judul artikel
                            </label>
                            <input
                                id="title"
                                type="text"
                                name="Judul"
                                placeholder="title"
                                onChange={handleChange}
                                className="w-full border border-gray-400 shadow-md rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:ring-blue-500 hover:ring-2"
                            />
                        </div>
                        <div className="w-1/2">
                            <label
                                htmlFor="category"
                                className="capitalize block my-2 font-semibold"
                            >
                                kategory artikel
                            </label>
                            <input
                                id="category"
                                type="text"
                                name="Kategori"
                                placeholder="kategory"
                                onChange={handleChange}
                                className="w-full border border-gray-400 shadow-md rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:ring-blue-500 hover:ring-2"
                            />
                        </div>
                    </div>
                    <div className="flex justify-between gap-8">
                        <div className="w-1/2">
                            <label
                                htmlFor="location"
                                className="capitalize block my-2 font-semibold"
                            >
                                lokasi
                            </label>
                            <input
                                id="location"
                                type="text"
                                name="Lokasi"
                                placeholder="lokasi"
                                onChange={handleChange}
                                className="w-full border border-gray-400 shadow-md rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:ring-blue-500 hover:ring-2"
                            />
                        </div>
                        <div className="w-1/2">
                            <label
                                htmlFor="tanggal"
                                className="capitalize block my-2 font-semibold"
                            >
                                tanggal
                            </label>
                            <input
                                id="tanggal"
                                type="date"
                                placeholder="Tanggal"
                                onChange={handleChange}
                                className="w-full border border-gray-400 shadow-md rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:ring-blue-500 hover:ring-2"
                            />
                        </div>
                    </div>
                    <label
                        htmlFor="deskripsiArtikel"
                        className="capitalize text-xl font-semibold block"
                    >
                        deskripsi artikel
                    </label>
                    <textarea
                        name="Deskripsi"
                        id="deskripsiArtikel"
                        placeholder="masukkan deskripsi anda"
                        onChange={handleChange}
                        className="border border-gray-400 w-full rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:ring-blue-500 hover:ring-2"
                    ></textarea>
                    <div className="flex justify-end pt-6">
                        <button
                            type="submit"
                            className="inline-flex justify-center rounded-md bg-indigo-600 py-2 px-6 text-white hover:bg-indigo-700 cursor-pointer"
                        >
                            Simpan Artikel
                        </button>
                    </div>
                </div>
            </form>

            {/* Konfirmasi Pop-up */}
            {confirm&&(
                <div className="fixed inset-0 bg-opacity-10 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-md w-[300px] text-center">
                        <p className="text-lg font-medium mb-4">
                            apakah anda yakin submit data artikel?
                        </p>
                        <div className="flex justify-around">
                            <Link href="/Dashboard/Blog">
                            <button onClick={handleConfirm} className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md cursor-pointer">
                                Ya
                            </button>
                            </Link>
                            <button onClick={()=>setConfirm(false)} className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md cursor-pointer"> Tidak</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
