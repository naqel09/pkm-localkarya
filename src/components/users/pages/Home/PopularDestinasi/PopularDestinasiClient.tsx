"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

const destinations = [
    {
        name: "Kebun Teh Sukawana",
        packages: 20,
        image: "/sukawana.jpg",
        description: "Suasana sejuk khas pegunungan dengan hamparan kebun teh hijau yang luas, cocok untuk trekking, foto, maupun healing santai .",
    },
    {
        name: "Ciwangun Indah Camp",
        packages: 15,
        image: "/ciwangun.webp",
        description: "Area wisata alam dengan konsep camping ground, outbound, dan jalur tracking yang banyak dipilih untuk kegiatan kelompok maupun keluarga .",
    },
    {
        name: "Curug Putri & Rainbow Waterfall",
        packages: 10,
        image: "/curug-putri.webp",
        description: "Air terjun alami yang masih asri, cocok untuk wisata alam dengan nuansa sejuk .",
    },
    {
        name: "Rainbow Garden",
        packages: 10,
        image: "/rainbow-garden.jpg",
        description: "Taman bunga warna-warni dengan berbagai jenis bunga hias, populer untuk wisata keluarga dan foto .",
    },
    {
        name: "Agrowisata Kebun Bunga Cihideung",
        packages: 10,
        image: "/kebun-bunga.webp",
        description: "Kebun bunga dengan berbagai macam tanaman exotis, cocok untuk wisata keluarga dan foto .",
    },
];

export default function PopularDestinasiClient() {
    const totalItems = destinations.length;
    const [currentIndex, setCurrentIndex] = useState(1);
    const [isFading, setIsFading] = useState(false);

    const next = () => {
        setIsFading(true);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % totalItems);
            setIsFading(false);
        }, 300);
    };

    const prev = () => {
        setIsFading(true);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev - 1 + totalItems) % totalItems);
            setIsFading(false);
        }, 300);
    };

    const jumpTo = (index: number) => {
        setIsFading(true);
        setTimeout(() => {
            setCurrentIndex(index);
            setIsFading(false);
        }, 300);
    };

    const getItemIndex = (offset: number) =>
        (currentIndex + offset + totalItems) % totalItems;

    return (
        <div className="flex justify-around items-center mt-10 relative">
            <button
                onClick={prev}
                className="hidden md:block px-1 py-3 hover:bg-black/30 z-10"
            >
                <ChevronLeftIcon className="w-6 h-6" />
            </button>

            <div className="grid grid-cols-5 md:gap-6 gap-2 transition-transform duration-500 ease-in-out">
                {[
                    getItemIndex(-2),
                    getItemIndex(-1), 
                    currentIndex, 
                    getItemIndex(1),
                    getItemIndex(2)
                ].map((i, idx) => {
                    const destination = destinations[i];
                    const isCenter = idx === 2;
                    const isClickable = idx === 1 || idx === 3; // Left and right neighbors

                    return (
                        <div
                            key={`${i}-${currentIndex}`}
                            onClick={() => {
                                if (isClickable) {
                                    if (idx === 1) prev(); // Click left item to go previous
                                    if (idx === 3) next(); // Click right item to go next
                                } else if (window.innerWidth < 768) {
                                    jumpTo(i);
                                }
                            }}
                            className={`md:w-[14rem] md:h-[18rem] w-[5rem] h-[8rem] mx-auto rounded-lg overflow-hidden shadow-lg group relative transition-all duration-500 ease-in-out ${
                                isCenter
                                    ? "scale-110 z-10 cursor-pointer"
                                    : isClickable
                                    ? "scale-90 opacity-80 cursor-pointer hover:scale-95 hover:opacity-90"
                                    : "scale-75 opacity-40"
                            } ${
                                isCenter && isFading
                                    ? "opacity-0"
                                    : ""
                            } transition-opacity duration-500`}
                        >
                            <Image
                                src={destination.image}
                                alt={destination.name}
                                fill
                                className="object-cover rounded-lg"
                            />
                            {isCenter && (
                                <div className="absolute inset-0 bg-black/30 md:opacity-0 md:group-hover:opacity-100 opacity-100 transition-opacity p-4 flex flex-col justify-end">
                                    <h2 className="md:text-xl text-sm font-semibold text-white text-start">
                                        {destination.name}
                                    </h2>
                                    <div className="flex items-center text-gray-300 mt-1">
                                        <MapPin className="w-4 h-4 text-blue-300 mr-1" />
                                        <p className="text-start md:text-sm text-xs font">
                                            {destination.packages} Packages
                                        </p>
                                    </div>
                                    <p className="text-start text-gray-300 mt-2 md:text-sm text-xs">
                                        {destination.description}
                                    </p>

                                    <div className="md:mt-4 flex space-x-2 mt-3">
                                        <Link
                                            href="/Tours"
                                            className="md:px-4 md:py-2 px-1 py-2 h-[2.5rem] bg-blue-500 md:bg-white text-white md:text-black text-sm font-medium rounded hover:bg-blue-600 hover:text-white transition"
                                        >
                                            Pesan
                                        </Link>
                                        <Link
                                            href="/Detail"
                                            className="md:px-4 md:py-2 px-1 py-2 h-[2.5rem] border border-white text-white text-sm rounded hover:bg-white hover:text-black transition"
                                        >
                                            Detail
                                        </Link>
                                    </div>
                                </div>
                            )}
                            {/* Click indicator for side items */}
                            {isClickable && (
                                <div className="absolute inset-0 bg-black/10 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                                        {idx === 1 ? (
                                            <ChevronLeftIcon className="w-6 h-6 text-white" />
                                        ) : (
                                            <ChevronRightIcon className="w-6 h-6 text-white" />
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <button
                onClick={next}
                className="hidden md:block px-1 py-3 hover:bg-black/30 z-10"
            >
                <ChevronRightIcon className="w-6 h-6" />
            </button>
        </div>
    );
}
