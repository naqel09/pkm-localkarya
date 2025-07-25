"use client";
import React from "react";
import Image from "next/image";
import carousel1 from "@/app/assets/mountaincarousel1.jpg";
import carousel2 from "@/app/assets/mountain2.jpg";
import {useState, useEffect} from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

const images = [carousel1, carousel2];

function HeroCarousel() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % images.length);
        }, 10000); // mengubah gambar setiap 10 detik
    }, []);
    return (
        <>
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

            <div className="hidden absolute inset-0 sm:flex items-center justify-between px-4 z-20 pointer-events-none">
                <button
                    onClick={() =>
                        setCurrent(
                            (current - 1 + images.length) % images.length
                        )
                    }
                    className="text-white cursor-pointer rounded-full p-2 bg-opacity-50 bg-transparent hover:bg-black hover:opacity-65 pointer-events-auto"
                >
                    <ChevronLeftIcon className="w-6 h-6 " />
                </button>
                <button
                    onClick={() => setCurrent((current + 1) % images.length)}
                    className="text-white cursor-pointer rounded-full p-2 bg-opacity-50 hover:bg-black hover:opacity-65 pointer-events-auto"
                >
                    <ChevronRightIcon className="w-6 h-6" />
                </button>
            </div>
            
        </>
    );
}

export default HeroCarousel;
