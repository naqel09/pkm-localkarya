"use client";
import Image from "next/image";
import {useParams, useRouter} from "next/navigation";
import {useState, useEffect} from "react";
import RichTextEditor from "@/components/admin/RichTextEditor";

export default function Page() {
    const {id} = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        judul: "",
        isiArtikel: "",
        penulis: "",
        gambar: "",
    });

    useEffect(() => {
        async function fetchArtikel() {
            try {
                const response = await fetch(`/api/blog/${id}`);
                const data = await response.json();
                
                if (response.ok && data.data) {
                    setFormData({
                        judul: data.data.judul || "",
                        isiArtikel: data.data.isiArtikel || "",
                        penulis: data.data.penulis || "",
                        gambar: data.data.gambar || "",
                    });
                } else {
                    alert("Artikel tidak ditemukan");
                    router.push("/dashboard/Blog");
                }
            } catch (error) {
                console.error("Gagal mengambil data:", error);
                alert("Gagal mengambil data artikel");
            } finally {
                setLoading(false);
            }
        }
        if (id) {
            fetchArtikel();
        }
    }, [id, router]);

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            console.log('🖼️ [EDIT-BLOG] Starting image upload:', {
                fileName: file.name,
                fileSize: file.size,
                fileType: file.type
            });
            
            setUploading(true);
            try {
                const formDataUpload = new FormData();
                formDataUpload.append('file', file);
                
                console.log('📤 [EDIT-BLOG] Sending upload request...');
                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formDataUpload,
                });
                
                console.log('📥 [EDIT-BLOG] Upload response:', {
                    status: response.status,
                    statusText: response.statusText,
                    ok: response.ok
                });
                
                const data = await response.json();
                console.log('📄 [EDIT-BLOG] Upload response data:', data);
                
                if (response.ok && data.success) {
                    const filename = data.filename;
                    setFormData({...formData, gambar: filename});
                    console.log('✅ [EDIT-BLOG] Upload successful:', filename);
                } else {
                    console.error('❌ [EDIT-BLOG] Upload failed:', data);
                    alert(`Gagal mengupload gambar: ${data.message || 'Unknown error'}`);
                }
            } catch (error) {
                console.error('❌ [EDIT-BLOG] Upload error:', error);
                alert(`Gagal mengupload gambar: ${error instanceof Error ? error.message : 'Network error'}`);
            } finally {
                setUploading(false);
            }
        }
    };

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    const handleEditorChange = (content: string) => {
        setFormData({...formData, isiArtikel: content});
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        
        // Validate required fields
        if (!formData.judul.trim()) {
            alert('Judul artikel harus diisi');
            return;
        }
        if (!formData.isiArtikel.trim()) {
            alert('Isi artikel harus diisi');
            return;
        }
        if (!formData.penulis.trim()) {
            alert('Penulis artikel harus diisi');
            return;
        }
        
        try {
            const response = await fetch(`/api/blog/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            
            const data = await response.json();
            
            if (response.ok) {
                alert("Artikel berhasil diperbarui!");
                router.push("/dashboard/Blog");
            } else {
                alert(data.message || "Gagal memperbarui artikel");
            }
        } catch (error) {
            console.error("Terjadi kesalahan saat melakukan update artikel:", error);
            alert("Terjadi kesalahan saat memperbarui artikel");
        }
    }

    if (loading) {
        return (
            <div className="max-w-8xl bg-white shadow-lg rounded-lg border border-gray-200 p-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-300 rounded mb-4"></div>
                    <div className="h-64 bg-gray-300 rounded mb-4"></div>
                    <div className="space-y-4">
                        <div className="h-4 bg-gray-300 rounded"></div>
                        <div className="h-4 bg-gray-300 rounded"></div>
                        <div className="h-32 bg-gray-300 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-8xl bg-white shadow-lg rounded-lg border border-gray-200 p-6">
            <h2 className="text-3xl font-semibold mb-6 border-b-2 pb-2">
                Edit Artikel
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
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
                            ) : formData.gambar ? (
                                <Image
                                    src={`/uploads/${formData.gambar}`}
                                    alt="artikel"
                                    width={500}
                                    height={300}
                                    className="object-cover w-full h-full rounded-md hover:ring-2 hover:ring-blue-400"
                                />
                            ) : (
                                <div className="text-center">
                                    <p className="text-white">Klik untuk upload gambar baru</p>
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

                <div className="space-y-4">
                    <div className="flex justify-between gap-8">
                        <div className="w-1/2">
                            <label htmlFor="title" className="capitalize block my-2 font-semibold">
                                Judul Artikel *
                            </label>
                            <input
                                type="text"
                                name="judul"
                                className="w-full border border-gray-400 shadow-md rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:ring-blue-500 hover:ring-2"
                                placeholder="Masukkan judul artikel"
                                value={formData.judul}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="w-1/2">
                            <label htmlFor="author" className="capitalize block my-2 font-semibold">
                                Penulis *
                            </label>
                            <input
                                type="text"
                                name="penulis"
                                className="w-full border border-gray-400 shadow-md rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:ring-blue-500 hover:ring-2"
                                placeholder="Nama penulis"
                                value={formData.penulis}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label htmlFor="isiArtikel" className="capitalize text-xl font-semibold block mb-2">
                            Isi Artikel *
                        </label>
                        <RichTextEditor
                            value={formData.isiArtikel}
                            onChange={handleEditorChange}
                            placeholder="Tulis isi artikel di sini..."
                            className="min-h-[400px]"
                        />
                    </div>
                </div>
                
                <div className="flex justify-end pt-6">
                    <button
                        type="submit"
                        className="inline-flex justify-center cursor-pointer px-6 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 disabled:opacity-50"
                        disabled={uploading}
                    >
                        Update Artikel
                    </button>
                </div>
            </form>
        </div>
    );
}
