"use client"
import React,{useState} from "react";
import carousel1 from "@/app/assets/mountaincarousel1.jpg";
import carousel2 from "@/app/assets/mountain2.jpg";
import carousel3 from "@/app/assets/mountain3.jpg";
import Link from "next/link";
import Image from "next/image";
import {MapPin} from "lucide-react";
import {ChevronLeftIcon, ChevronRightIcon} from "@heroicons/react/24/solid";

const destinations = [
    {
        name: "Italy",
        packages: 20,
        image: carousel1,
        description: "jelajahi indahnya bandung",
    },
    {
        name: "Bali",
        packages: 20,
        image: carousel2,
        description: "jelajahi indahnya bandung",
    },
    {
        name: "Bandung",
        packages: 20,
        image: carousel3,
        description: "jelajahi indahnya bandung",
    },
];

function ButtonDestinasi() {
    const [currentIndex, setCurrentIndex] = useState(1);
    const [isFading, setIsFading] = useState(false);
    const total = destinations.length;

    const prevSlide = () => {
        setIsFading(true);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev - 1 + total) % total);
            setIsFading(false);
        }, 300); // Durasi fade-out
    };

    const nextSlide = () => {
        setIsFading(true);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % total);
            setIsFading(false);
        }, 300);
    };

    const getItemIndex = (offset: number) =>
        (currentIndex + offset + total) % total;

    return (
        <div className="flex justify-around items-center  mt-10 relative">
            {/* Tombol navigasi kiri untuk layar besar */}
            <button
                onClick={prevSlide}
                className="hidden md:block text-xl px-1 py-3 rounded  hover:bg-black/30 cursor-pointer z-10"
            >
                <ChevronLeftIcon className="w-6 h-6" />
            </button>

            <div className="grid grid-cols-3 md:gap-10 gap-4 transition-transform duration-500 ease-in-out">
                {[getItemIndex(-1), currentIndex, getItemIndex(1)].map(
                    (i, idx) => {
                        const destination = destinations[i];
                        const isCenter = idx === 1;

                        return (
                            <div
                                key={`${i}-${currentIndex}`} // agar memicu animasi ulang
                                onClick={() => {
                                    if (window.innerWidth < 768) {
                                        setIsFading(true);
                                        setTimeout(() => {
                                            setCurrentIndex(i);
                                            setIsFading(false);
                                        }, 300);
                                    }
                                }}
                                className={`md:w-[16rem] md:h-[20rem] w-[8rem] h-[12rem] flex-shrink-0 mx-auto rounded-lg overflow-hidden shadow-lg group relative cursor-pointer transition-all duration-500 ease-in-out ${
                                    isCenter
                                        ? "scale-105"
                                        : "scale-75 opacity-0"
                                } ${
                                    isCenter && isFading
                                        ? "opacity-0"
                                        : "opacity-100"
                                } transition-opacity duration-500`}
                            >
                                <Image
                                    src={destination.image}
                                    alt={destination.name}
                                    fill
                                    className="object-cover rounded-lg"
                                />
                                {/* Overlay untuk gambar tengah */}
                                {isCenter && (
                                    <div className="absolute inset-0 bg-black/30 md:opacity-0 md:group-hover:opacity-100 opacity-100 transition-opacity p-4 flex flex-col justify-end ">
                                        <h2 className="md:text-xl text-sm font-semibold text-white text-start">
                                            {destination.name}
                                        </h2>
                                        <div className="flex items-center text-gray-300 text-sm mt-1">
                                            <MapPin className="w-4 h-4 text-blue-300 mr-1" />
                                            {destination.packages} Packages
                                        </div>
                                        <p className="text-start text-gray-300 mt-2 text-sm">
                                            {destination.description}
                                        </p>

                                        <div className="md:mt-4 flex space-x-2 mt-3">
                                            <Link
                                                href="/Tours"
                                                className="md:px-4 md:py-2 px-1 py-2 h-[2.5rem] mt-3x md:bg-white bg-blue-500 text-white md:text-black text-sm font-medium rounded hover:bg-blue-500 hover:text-white transition cursor-pointer"
                                            >
                                                pesan
                                            </Link>
                                            <Link
                                                href="/Detail"
                                                className="md:px-4 md:py-2 px-1 py-2 h-[2.5rem] mt-3x border border-white text-sm  text-white rounded hover:bg-white hover:text-black transition cursor-pointer"
                                            >
                                                Detail
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    }
                )}
            </div>

            {/* Tombol navigasi kanan untuk layar besar */}
            <button
                onClick={nextSlide}
                className="hidden md:block text-xl px-1 py-3 rounded hover:bg-black/30 cursor-pointer z-10"
            >
                <ChevronRightIcon className="w-6 h-6" />
            </button>
        </div>
    );
}

export default ButtonDestinasi;
