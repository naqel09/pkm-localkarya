"use client";
import Image from "next/image";
import { useParams,useRouter } from "next/navigation";
import { useState,useEffect } from "react";

export default function Page() {
    const {id} = useParams();
    const router = useRouter();

    const [formData,setFormData] = useState({
        Judul:"",
        Kategori:"",
        Lokasi:"",
        Tanggal:"",
        Deskripsi:"",
        Gambar:"",
    });

    useEffect(()=>{
        async function fetchArtikel(){
            try{
                const response =await fetch(`/api/blog/${id}`)
                const data=await response.json();
                setFormData({
                    Judul:data.Judul || " ",
                    Kategori:data.Kategori || " ",
                    Lokasi:data.Lokasi || " ",
                    Tanggal:data.Tanggal||" ",
                    Deskripsi:data.Judul || " ",
                    Gambar:data.Judul || " ",
                });
            }catch(error){
                throw new Error("gagal mengambil data");
            }
        }
        fetchArtikel();
    },[id]);

    function handleChange(e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)
    {
        setFormData(
            {
                ...formData,[e.target.name]:e.target.value
            })
    }
    
    async function handleSubmit(e:React.FormEvent){
        e.preventDefault();
        try{
            const response = await fetch(`/api/blog/${id}`,
            {
                method:"PUT",
                headers:
                {
                    "Content-Type":"application/json",
                },
                body: JSON.stringify(formData)
            });
            if(!response.ok) throw new Error("gagal melakukan update");
            alert("Artikel berhasil di update!");
            router.push("/Dashboard/Blog");
        }catch(error){
            console.error("terjadi kesalahan saat melakukan update artikel",error);
        }
    }

    return (
        <div className="max-w-8xl bg-white shadow-lg rounded-lg">
            <h2 className="text-3xl font-semibold mb-10 border-b-2">
                Edit Artikel
            </h2>
            <form onSubmit={handleSubmit} className="">
                <div>
                    <h3>gambar Artikel</h3>
                    <label htmlFor="fileUpload" className="cursor-pointer">
                        <div className="w-full h-[17rem] bg-gray-300 rounded-md flex items-center hover:bg-gray-400 transition shadow-sm border-gray-400">
                            <Image
                                src="/Images/artikel/artikel.jpg"
                                alt="artikel"
                                width={122}
                                height={122}
                                className="object-cover object-center w-full h-full rounded-md hover:ring-2 hover:ring-blue-400"
                            />
                        </div>
                    </label>
                    <input type="file" className="hidden" />
                </div>

                {/* Inputan Edit Artikel */}
                <div>
                    <div>
                        <div>
                            <label htmlFor="">judul artikel</label>
                            <input
                                type="text"
                                className=""
                                placeholder="title"
                                value={formData.Judul}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="">kategory artikel</label>
                            <input type="text" className="" value={formData.Kategori} />
                        </div>
                    </div>
                    <div>
                        <div>
                            <label htmlFor="">lokasi</label>
                            <input type="text" value={formData.Lokasi} />
                        </div>
                        <div>
                            <label htmlFor="">tanggal</label>
                            <input type="date" value={formData.Tanggal} />
                        </div>
                    </div>
                    <label htmlFor="deskripsiArtikel">deskripsi artikel</label>
                    <textarea name="" id="deskripsiArtikel" value={formData.Deskripsi}></textarea>
                </div>
                <div className="flex justify-end pt-6">
                    <button type="submit" className="inline-flex justify-center cursor-pointer p-2 bg-blue-600 rounded-lg text-white m-4 hover:bg-blue-700">
                        Update Artikel
                    </button>
                </div>
            </form>
        </div>
    );
}
