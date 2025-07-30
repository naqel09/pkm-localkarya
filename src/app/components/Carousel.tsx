"use client";
import React from "react";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { useCarousel } from "@/app/hooks/useCarousel";

const images = ["/mountaincarousel1.jpg", "/mountain2.jpg"];

export default function Carousel() {
    const { current, handleNext, handlePrev } = useCarousel(images.length);

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
                <p className="lg:text-3xl md:text-xl text-sm tracking-widest uppercase text-white">
                    ini adalah tampilan dari hero
                </p>
                <h1 className="md:text-9xl lg:text-[10rem] text-6xl font-bold text-white">
                    ADVENTURE
                </h1>
                <p className="text-center text-white max-w-xl mt-4 text-xl">
                    mari menciptakan perjalanan yang indah dan dapat dilakukan di saat anda memiliki waktu luang yang sedang langka terjadwal dan sedang dinanti-nanti.
                </p>

                <div className="mt-10 bg-white shadow-md rounded-lg grid grid-cols-1 md:grid-cols-4 gap-4 w-full max-w-3xl p-4">
                    <input
                        type="text"
                        placeholder="Destinasi"
                        className="px-4 py-2 rounded border border-gray-300 shadow"
                    />
                    <input
                        type="date"
                        className="px-4 py-2 rounded text-black border border-gray-300 shadow cursor-pointer w-full"
                    />
                    <input
                        type="text"
                        placeholder="Harga"
                        className="px-4 py-2 rounded text-black border border-gray-300 shadow"
                    />
                    <button className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition cursor-pointer shadow-md">
                        Search
                    </button>
                </div>
            </div>
        </section>
    );
}
