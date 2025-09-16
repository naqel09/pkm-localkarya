"use client";
import React,{useState} from "react";
import Link from "next/link";
import {Smile, Mountain, Flag, RefreshCw} from "lucide-react";

const features = [
    {
        icon: <Smile size={40} className=" mb-4" />,
        title: "Kegembiraan Keluarga",
        description:
            "Kami menghadirkan kebahagiaan dan tawa untuk seluruh anggota keluarga di setiap petualangan.",
        href:"/kegembiraan-keluarga"
    },
    {
        icon: <Mountain size={40} className=" mb-4" />,
        title: "Wisata Alam Autentik",
        description:
            "Nikmati keindahan alam pegunungan Bandung Barat yang masih asli dan mempesona.",
        href:"/wisata-alam"
    },
    {
        icon: (
                <Flag size={40} className=" mb-4" />
        ),
        title: "Pemandu Lokal Berpengalaman",
        description:
            "Dipandu oleh warga lokal yang mengenal setiap sudut desa dan budaya Sunda.",
        href:"/pemandu-lokal"
    },
    {
        icon: <RefreshCw size={40} className="mb-4" />,
        title: "Fleksibilitas Waktu",
        description:
            "Jadwal wisata yang dapat disesuaikan dengan kebutuhan dan kenyamanan Anda.",
        href:"/fleksibilitas-waktu"
    },
];

function PilihKami() {
    const [activeIndex,setActiveIndex]=useState<number | null>(null)
    return (
        <section className="py-16 bg-blue-100/100 my-20 rounded-2xl">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Mengapa Memilih Nyaba Wisata?</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">Pengalaman wisata terbaik di Desa Karyawangi dengan pelayanan yang mengutamakan kenyamanan dan kepuasan pengunjung</p>
            </div>
            <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-20 text-center">
                {features.map((feature,index)=>{
                    const isActive = activeIndex ===index;
                    return(
                        <Link key={index} href="#" onClick={()=>setActiveIndex(index)} className="flex flex-col items-center group cursor-pointer">
                            <div className={`p-4 rounded-lg transition-all duration-300 ${isActive ? "bg-blue-500 text-white":" text-blue-500"} hover:scale-125 hover:-translate-y-2`}>
                                {feature.icon}
                            </div>
                            <h3 className="text-lg font-semibold mt-4">{feature.title}</h3>
                            <p className="text-gray-600 mt-2 text-sm">{feature.description}</p>
                        </Link>
                    )
                })}
            </div>
        </section>
    );
}

export default PilihKami;
