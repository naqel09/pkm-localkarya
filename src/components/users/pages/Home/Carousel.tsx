"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

const images = ["/nyaba1.jpg", "/nyaba2.jpg"];

export default function Carousel() {
    const [current, setCurrent] = useState(0);
    const interval = 5000; // default 10 detik

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % images.length);
        }, interval);
        return () => clearInterval(timer);
    }, []);

    const handleNext = () => {
        setCurrent((prev) => (prev + 1) % images.length);
    };

    const handlePrev = () => {
        setCurrent((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <section className="relative h-screen w-full overflow-hidden z-0">
            {images.map((image, index) => (
                <Image
                    key={index}
                    src={image}
                    alt=""
                    fill
                    className={`absolute object-cover brightness-75 transition-all duration-1000 ease-in-out pointer-events-none ${
                        current === index ? "opacity-100" : "opacity-0"
                    }`}
                    priority
                />
            ))}

            {/* Tombol navigasi */}
            <div className="hidden absolute inset-0 sm:flex items-center justify-between px-4 z-20 pointer-events-none">
                <button
                    onClick={handlePrev}
                    className="text-white cursor-pointer rounded-full p-2 bg-opacity-50 bg-transparent hover:bg-black hover:opacity-65 pointer-events-auto"
                >
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <button
                    onClick={handleNext}
                    className="text-white cursor-pointer rounded-full p-2 bg-opacity-50 hover:bg-black hover:opacity-65 pointer-events-auto"
                >
                    <ChevronRightIcon className="w-6 h-6" />
                </button>
            </div>

            {/* Konten tengah dan search box */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10">
                <p className="text-xs md:text-sm lg:text-3xl tracking-widest uppercase text-white">
                    Selamat Datang di Desa Karyawangi
                </p>
                <h1 className="text-4xl md:text-6xl lg:text-9xl xl:text-[10rem] font-bold text-white">
                    NYABA WISATA
                </h1>
                <p className="text-center text-white max-w-2xl mt-4 text-sm md:text-lg lg:text-xl px-4">
                    Rasakan keseruan bermain dan menjelajahi keindahan alam Desa Karyawangi, 
                    Parongpong, Bandung Barat. Tempat di mana tradisi bertemu dengan petualangan modern, 
                    dan setiap sudut menawarkan pengalaman tak terlupakan untuk keluarga.
                </p>
            </div>
        </section>
    );
}
