"use client";
import React, {useState} from "react";
import Image from "next/image";
import {ImageIcon} from "lucide-react";
import Link from "next/link";
import RichTextEditor from "@/components/admin/RichTextEditor";

export default function Page() {
    const [preview, setPreview] = useState<string | null>(null);
    const [artikel, setArtikel] = useState({
        judul: "",
        isiArtikel: "",
        penulis: "",
        gambar: "",
    });
    const [confirm,setConfirm]=useState(false);
    const [uploading, setUploading] = useState(false);

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            console.log('🖼️ [INPUT-BLOG] Starting image upload:', {
                fileName: file.name,
                fileSize: file.size,
                fileType: file.type
            });
            
            setUploading(true);
            try {
                const formData = new FormData();
                formData.append('file', file);
                
                console.log('📤 [INPUT-BLOG] Sending upload request...');
                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });
                
                console.log('📥 [INPUT-BLOG] Upload response:', {
                    status: response.status,
                    statusText: response.statusText,
                    ok: response.ok
                });
                
                const data = await response.json();
                console.log('📄 [INPUT-BLOG] Upload response data:', data);
                
                if (response.ok && data.success) {
                    const filename = data.filename;
                    setPreview(`/uploads/${filename}`);
                    setArtikel({...artikel, gambar: filename});
                    console.log('✅ [INPUT-BLOG] Upload successful:', filename);
                } else {
                    console.error('❌ [INPUT-BLOG] Upload failed:', data);
                    alert(`Gagal mengupload gambar: ${data.message || 'Unknown error'}`);
                }
            } catch (error) {
                console.error('❌ [INPUT-BLOG] Upload error:', error);
                alert(`Gagal mengupload gambar: ${error instanceof Error ? error.message : 'Network error'}`);
            } finally {
                setUploading(false);
            }
        }
    };

    const handleChange =(e:React.ChangeEvent<HTMLInputElement>)=>{
        setArtikel({...artikel,[e.target.name]:e.target.value});
    };

    const handleEditorChange = (content: string) => {
        setArtikel({...artikel, isiArtikel: content});
    };

    const handleConfirm = async()=>{
        try {
            const res = await fetch("/api/blog",{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify(artikel)
            });
            const data = await res.json();
            
            if (res.ok) {
                alert(data.message);
                // Redirect after successful creation
                window.location.href = '/dashboard/Blog';
            } else {
                alert(data.message || 'Gagal menyimpan artikel');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Terjadi kesalahan saat menyimpan artikel');
        }
    };

    async function handleSubmit(e:React.FormEvent){
        e.preventDefault();
        
        // Validate required fields
        if (!artikel.judul.trim()) {
            alert('Judul artikel harus diisi');
            return;
        }
        if (!artikel.isiArtikel.trim()) {
            alert('Isi artikel harus diisi');
            return;
        }
        if (!artikel.penulis.trim()) {
            alert('Penulis artikel harus diisi');
            return;
        }
        
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
                        Gambar Artikel
                    </h3>
                    <label htmlFor="fileUpload" className="cursor-pointer">
                        <div className="w-full h-[30rem] bg-gray-300 rounded-md flex items-center justify-center hover:bg-gray-400 transition shadow-sm border-gray-400">
                            {uploading ? (
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                                    <p className="mt-2 text-gray-600">Mengupload gambar...</p>
                                </div>
                            ) : preview ? (
                                <Image
                                    src={preview}
                                    alt="artikel"
                                    className="object-cover w-full h-full rounded-md hover:ring-2 hover:ring-blue-400"
                                    width={500}
                                    height={300}
                                />
                            ) : (
                                <div className="text-center">
                                    <ImageIcon className="w-24 h-24 text-white mx-auto mb-2" />
                                    <p className="text-white">Klik untuk upload gambar</p>
                                </div>
                            )}
                        </div>
                    </label>
                    <input
                        type="file"
                        id="fileUpload"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                        disabled={uploading}
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
                                Judul Artikel *
                            </label>
                            <input
                                id="title"
                                type="text"
                                name="judul"
                                value={artikel.judul}
                                placeholder="Masukkan judul artikel"
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-400 shadow-md rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:ring-blue-500 hover:ring-2"
                            />
                        </div>
                        <div className="w-1/2">
                            <label
                                htmlFor="author"
                                className="capitalize block my-2 font-semibold"
                            >
                                Penulis *
                            </label>
                            <input
                                id="author"
                                type="text"
                                name="penulis"
                                value={artikel.penulis}
                                placeholder="Nama penulis"
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-400 shadow-md rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:ring-blue-500 hover:ring-2"
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label
                            htmlFor="isiArtikel"
                            className="capitalize text-xl font-semibold block mb-2"
                        >
                            Isi Artikel *
                        </label>
                        <RichTextEditor
                            value={artikel.isiArtikel}
                            onChange={handleEditorChange}
                            placeholder="Tulis isi artikel di sini..."
                            className="min-h-[400px]"
                        />
                    </div>
                    
                    <div className="flex justify-end pt-6">
                        <button
                            type="submit"
                            className="inline-flex justify-center rounded-md bg-indigo-600 py-2 px-6 text-white hover:bg-indigo-700 cursor-pointer disabled:opacity-50"
                            disabled={uploading}
                        >
                            Simpan Artikel
                        </button>
                    </div>
                </div>
            </form>

            {/* Konfirmasi Pop-up */}
            {confirm&&(
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-md w-[400px] text-center">
                        <p className="text-lg font-medium mb-4">
                            Apakah Anda yakin ingin menyimpan artikel ini?
                        </p>
                        <div className="flex justify-around">
                            <button 
                                onClick={handleConfirm} 
                                className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md cursor-pointer"
                            >
                                Ya, Simpan
                            </button>
                            <button 
                                onClick={()=>setConfirm(false)} 
                                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md cursor-pointer"
                            >
                                Batal
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
