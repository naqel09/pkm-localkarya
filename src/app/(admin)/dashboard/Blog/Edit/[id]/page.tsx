"use client";
import Image from "next/image";
import {useParams, useRouter} from "next/navigation";
import {useState, useEffect} from "react";

export default function Page() {
    const {id} = useParams();
    const router = useRouter();

    const [formData, setFormData] = useState({
        Judul: "",
        Kategori: "",
        Lokasi: "",
        Tanggal: "",
        Deskripsi: "",
        Gambar: "",
    });

    useEffect(() => {
        async function fetchArtikel() {
            try {
                const response = await fetch(`/api/blog/${id}`);
                const data = await response.json();
                setFormData({
                    Judul: data.Judul || " ",
                    Kategori: data.Kategori || " ",
                    Lokasi: data.Lokasi || " ",
                    Tanggal: data.Tanggal || " ",
                    Deskripsi: data.Deskripsi || " ",
                    Gambar: data.Gambar
                });
            } catch (error) {
                throw new Error("gagal mengambil data");
            }
        }
        fetchArtikel();
    }, [id]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setFormData({ ...formData, Gambar: reader.result as string });
                };
                reader.readAsDataURL(file);
            }
        };

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            const response = await fetch(`/api/blog/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            if (!response.ok) throw new Error("gagal melakukan update");
            
            alert("Artikel berhasil di update!");
            router.push("/Dashboard/Blog");
        } catch (error) {
            console.error(
                "terjadi kesalahan saat melakukan update artikel",
                error
            );
        }
    }

    return (
        <div className="max-w-8xl bg-white shadow-lg rounded-lg border border-gray-200">
            <h2 className="text-3xl font-semibold my-5 mx-2 border-b-2">
                Edit Artikel
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="mx-2">
                    <h3 className="capitalize text-xl font-semibold py-3">
                        gambar Artikel
                    </h3>
                    <label htmlFor="fileUpload" className="cursor-pointer">
                        <div className="w-full h-[30rem] bg-gray-300 rounded-md flex items-center hover:bg-gray-400 transition shadow-sm border-gray-400">
                            <Image
                                src={formData.Gambar||"/images/artikel/artikel.jpg"}
                                alt="artikel"
                                width={122}
                                height={122}
                                className=" object-center w-full h-full rounded-md hover:ring-2 hover:ring-blue-400"
                            />
                        </div>
                    </label>
                    <input type="file" id="fileUpload" accept="image/*" className="hidden" onChange={handleImageChange}/>
                </div>

                {/* Inputan Edit Artikel */}
                <div className="space-y-4 mx-2">
                    <div className="flex justify-between gap-8">
                        <div className="w-1/2">
                            <label htmlFor="title" className="capitalize block my-2 font-semibold" >judul artikel</label>
                            <input
                                type="text"
                                name="Judul"
                                className="w-full border border-gray-400 shadow-md rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:ring-blue-500 hover:ring-2"
                                placeholder="title"
                                value={formData.Judul}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="w-1/2">
                            <label htmlFor="category" className="capitalize block my-2 font-semibold">kategory artikel</label>
                            <input
                                type="text"
                                name="Kategori"
                                className="w-full border border-gray-400 shadow-md rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:ring-blue-500 hover:ring-2"
                                value={formData.Kategori}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="flex justify-between gap-8">
                        <div className="w-1/2">
                            <label htmlFor="" className="capitalize block my-2 font-semibold">lokasi</label>
                            <input
                                type="text"
                                name="Lokasi"
                                value={formData.Lokasi}
                                onChange={handleChange}
                                className="w-full border border-gray-400 shadow-md rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:ring-blue-500 hover:ring-2"
                            />
                        </div>
                        <div className="w-1/2">
                            <label htmlFor="" className="capitalize block my-2 font-semibold">tanggal</label>
                            <input
                                type="date"
                                name="Tanggal"
                                value={formData.Tanggal}
                                onChange={handleChange}
                                className="w-full border border-gray-400 shadow-md rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:ring-blue-500 hover:ring-2"
                            />
                        </div>
                    </div>
                    <label htmlFor="deskripsiArtikel" className="capitalize text-xl font-semibold block">deskripsi artikel</label>
                    <textarea
                        name="Deskripsi"
                        id="deskripsiArtikel"
                        value={formData.Deskripsi}
                        onChange={handleChange}
                        className="border border-gray-400 w-full rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:ring-blue-500 hover:ring-2"
                    ></textarea>
                </div>
                <div className="flex justify-end pt-6">
                    <button
                        type="submit"
                        className="inline-flex justify-center cursor-pointer p-2 bg-blue-600 rounded-lg text-white m-4 hover:bg-blue-700"
                    >
                        Update Artikel
                    </button>
                </div>
            </form>
        </div>
    );
}
