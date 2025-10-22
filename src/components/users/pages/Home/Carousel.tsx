"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

interface CarouselItem {
  id: number;
  title: string;
  subtitle?: string;
  description: string;
  imageUrl: string;
  orderIndex: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export default function Carousel() {
    const [current, setCurrent] = useState(0);
    const [carouselItems, setCarouselItems] = useState<CarouselItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const interval = 5000; // default 5 detik

    useEffect(() => {
        const fetchCarouselData = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await fetch('/api/carousel');
                const data = await res.json();
                
                if (!res.ok) {
                    throw new Error(data.message || "Gagal mengambil data carousel");
                }
                
                if (data.success && Array.isArray(data.data) && data.data.length > 0) {
                    // Filter only active items and sort by orderIndex
                    const activeItems = data.data
                        .filter((item: CarouselItem) => item.isActive)
                        .sort((a: CarouselItem, b: CarouselItem) => a.orderIndex - b.orderIndex);
                    
                    setCarouselItems(activeItems);
                } else {
                    // Fallback to default images if no carousel data
                    setCarouselItems([
                        {
                            id: 1,
                            title: "Selamat Datang di Desa Karyawangi",
                            subtitle: "NYABA WISATA",
                            description: "Rasakan keseruan bermain dan menjelajahi keindahan alam Desa Karyawangi, Parongpong, Bandung Barat. Tempat di mana tradisi bertemu dengan petualangan modern, dan setiap sudut menawarkan pengalaman tak terlupakan untuk keluarga.",
                            imageUrl: "/nyaba1.jpg",
                            orderIndex: 0,
                            isActive: true
                        },
                        {
                            id: 2,
                            title: "Keindahan Alam yang Menakjubkan",
                            subtitle: "PETUALANGAN SERU",
                            description: "Nikmati keindahan alam yang masih alami dan asri di Desa Karyawangi. Berbagai aktivitas outdoor menantang yang siap memacu adrenalin Anda dan keluarga.",
                            imageUrl: "/nyaba2.jpg",
                            orderIndex: 1,
                            isActive: true
                        }
                    ]);
                }
            } catch (error) {
                console.error("Error fetching carousel data:", error);
                setError(error instanceof Error ? error.message : "Gagal mengambil data carousel");
                // Fallback to default images if API fails
                setCarouselItems([
                    {
                        id: 1,
                        title: "Selamat Datang di Desa Karyawangi",
                        subtitle: "NYABA WISATA",
                        description: "Rasakan keseruan bermain dan menjelajahi keindahan alam Desa Karyawangi, Parongpong, Bandung Barat. Tempat di mana tradisi bertemu dengan petualangan modern, dan setiap sudut menawarkan pengalaman tak terlupakan untuk keluarga.",
                        imageUrl: "/nyaba1.jpg",
                        orderIndex: 0,
                        isActive: true
                    },
                    {
                        id: 2,
                        title: "Keindahan Alam yang Menakjubkan",
                        subtitle: "PETUALANGAN SERU",
                        description: "Nikmati keindahan alam yang masih alami dan asri di Desa Karyawangi. Berbagai aktivitas outdoor menantang yang siap memacu adrenalin Anda dan keluarga.",
                        imageUrl: "/nyaba2.jpg",
                        orderIndex: 1,
                        isActive: true
                    }
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchCarouselData();
    }, []);

    useEffect(() => {
        if (carouselItems.length === 0) return;

        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % carouselItems.length);
        }, interval);
        return () => clearInterval(timer);
    }, [carouselItems]);

    const handleNext = () => {
        if (carouselItems.length === 0) return;
        setCurrent((prev) => (prev + 1) % carouselItems.length);
    };

    const handlePrev = () => {
        if (carouselItems.length === 0) return;
        setCurrent((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
    };

    if (loading) {
        return (
            <section className="relative h-screen w-full overflow-hidden z-0 bg-gray-200 flex items-center justify-center">
                <p className="text-gray-500">Loading carousel...</p>
            </section>
        );
    }

    if (error) {
        return (
            <section className="relative h-screen w-full overflow-hidden z-0 bg-gray-200 flex items-center justify-center">
                <p className="text-red-500">Error: {error}</p>
            </section>
        );
    }

    if (carouselItems.length === 0) {
        return (
            <section className="relative h-screen w-full overflow-hidden z-0 bg-gray-200 flex items-center justify-center">
                <p className="text-gray-500">No carousel items available</p>
            </section>
        );
    }

    return (
        <section className="relative h-screen w-full overflow-hidden z-0">
            {carouselItems.map((item, index) => (
                <Image
                    key={item.id}
                    src={item.imageUrl}
                    alt={item.title}
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
                    aria-label="Previous slide"
                >
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <button
                    onClick={handleNext}
                    className="text-white cursor-pointer rounded-full p-2 bg-opacity-50 hover:bg-black hover:opacity-65 pointer-events-auto"
                    aria-label="Next slide"
                >
                    <ChevronRightIcon className="w-6 h-6" />
                </button>
            </div>

            {/* Konten tengah dan search box */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10">
                <p className="text-xs md:text-sm lg:text-3xl tracking-widest uppercase text-white">
                    {carouselItems[current]?.title || "Selamat Datang di Desa Karyawangi"}
                </p>
                <h1 className="text-4xl md:text-6xl lg:text-9xl xl:text-[10rem] font-bold text-white">
                    {carouselItems[current]?.subtitle || "NYABA WISATA"}
                </h1>
                <p className="text-center text-white max-w-2xl mt-4 text-sm md:text-lg lg:text-xl px-4">
                    {carouselItems[current]?.description || "Rasakan keseruan bermain dan menjelajahi keindahan alam Desa Karyawangi, Parongpong, Bandung Barat. Tempat di mana tradisi bertemu dengan petualangan modern, dan setiap sudut menawarkan pengalaman tak terlupakan untuk keluarga."}
                </p>
            </div>
        </section>
    );
}