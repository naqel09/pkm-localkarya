"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone } from "lucide-react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

interface Destination {
  id: number;
  namaLokasi: string;
  alamat?: string;
  deskripsi: string;
  gambar1: string;
  gambar2?: string;
  gambar3?: string;
  jamOperasional: string;
  tiketMasuk?: string;
  kontakPerson?: string;
  linkGmaps: string;
  createdAt: string;
  updatedAt: string;
}

export default function PopularDestinasiClient() {
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const totalItems = destinations.length;
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFading, setIsFading] = useState(false);

    useEffect(() => {
        const fetchDestinations = async () => {
            try {
                setLoading(true);
                const res = await fetch('/api/destinations');
                const data = await res.json();
                
                if (res.ok && data.data) {
                    setDestinations(data.data);
                } else {
                    setError(data.message || "Failed to fetch destinations");
                }
            } catch (err) {
                setError("Failed to fetch destinations");
                console.error("Error fetching destinations:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDestinations();
    }, []);

    // If there are no destinations, don't render the section at all
    if (!loading && (error || destinations.length === 0)) {
        return null;
    }

    const next = () => {
        if (destinations.length === 0) return;
        setIsFading(true);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % totalItems);
            setIsFading(false);
        }, 300);
    };

    const prev = () => {
        if (destinations.length === 0) return;
        setIsFading(true);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev - 1 + totalItems) % totalItems);
            setIsFading(false);
        }, 300);
    };

    const jumpTo = (index: number) => {
        if (destinations.length === 0) return;
        setIsFading(true);
        setTimeout(() => {
            setCurrentIndex(index);
            setIsFading(false);
        }, 300);
    };

    const getItemIndex = (offset: number) =>
        (currentIndex + offset + totalItems) % totalItems;

    if (loading) {
        return (
            <section className="py-12 text-center">
                <h2 className="text-3xl md:text-4xl font-bold uppercase">
                    Destinasi Populer
                </h2>
                <p className="text-gray-600 mt-2 max-w-xl mx-auto">
                    Jelajahi destinasi terfavorit di Desa Karyawangi berdasarkan ulasan pengunjung kami.
                </p>
                <div className="flex justify-center items-center h-64">
                    <p>Loading destinations...</p>
                </div>
            </section>
        );
    }

    if (error) {
        // Don't show the section if there's an error
        return null;
    }

    // Don't show the section if there are no destinations
    if (destinations.length === 0) {
        return null;
    }

    return (
        <section className="py-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold uppercase">
                Destinasi Populer
            </h2>
            <p className="text-gray-600 mt-2 max-w-xl mx-auto">
                Jelajahi destinasi terfavorit di Desa Karyawangi berdasarkan ulasan pengunjung kami.
            </p>
            <div className="flex justify-around items-center mt-10 relative">
                <button
                    onClick={prev}
                    className="hidden md:block px-1 py-3 hover:bg-black/30 z-10"
                    aria-label="Previous destination"
                >
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>

                <div className="grid grid-cols-5 md:gap-6 gap-2 transition-transform duration-500 ease-in-out">
                    {[
                        { index: getItemIndex(-2), position: 'far-left' },
                        { index: getItemIndex(-1), position: 'left' },
                        { index: currentIndex, position: 'center' },
                        { index: getItemIndex(1), position: 'right' },
                        { index: getItemIndex(2), position: 'far-right' }
                    ].map((item, idx) => {
                        const destination = destinations[item.index];
                        const isCenter = item.position === 'center';
                        const isClickable = item.position === 'left' || item.position === 'right';
                        const hasWhatsApp = destination.kontakPerson && destination.kontakPerson.trim() !== '';

                        return (
                            <div
                                key={`${destination.id}-${item.position}-${item.index}-${currentIndex}`}
                                onClick={() => {
                                    if (isClickable) {
                                        if (item.position === 'left') prev(); // Click left item to go previous
                                        if (item.position === 'right') next(); // Click right item to go next
                                    } else if (window.innerWidth < 768) {
                                        jumpTo(item.index);
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
                                    src={destination.gambar1 || "/sukawana.jpg"}
                                    alt={destination.namaLokasi}
                                    fill
                                    className="object-cover rounded-lg"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = '/sukawana.jpg';
                                    }}
                                />
                                {isCenter && (
                                    <div className="absolute inset-0 bg-black/30 md:opacity-0 md:group-hover:opacity-100 opacity-100 transition-opacity p-4 flex flex-col justify-end">
                                        <h2 className="md:text-xl text-sm font-semibold text-white text-start">
                                            {destination.namaLokasi}
                                        </h2>
                                        <div className="flex items-center text-gray-300 mt-1">
                                            <MapPin className="w-4 h-4 text-blue-300 mr-1" />
                                            <p className="text-start md:text-sm text-xs font">
                                                {destination.alamat ? destination.alamat.substring(0, 30) + (destination.alamat.length > 30 ? "..." : "") : "Alamat tidak tersedia"}
                                            </p>
                                        </div>
                                        <p className="text-start text-gray-300 mt-2 md:text-sm text-xs">
                                            {destination.deskripsi.substring(0, 100) + (destination.deskripsi.length > 100 ? "..." : "")}
                                        </p>

                                        <div className="md:mt-4 flex space-x-2 mt-3">
                                            {hasWhatsApp ? (
                                                <a
                                                    href={`https://wa.me/${destination.kontakPerson?.replace(/[^0-9]/g, '')}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="md:px-4 md:py-2 px-1 py-2 h-[2.5rem] bg-green-500 md:bg-green-500 text-white md:text-white text-sm font-medium rounded hover:bg-green-600 hover:text-white transition flex items-center justify-center"
                                                >
                                                    <Phone className="w-4 h-4 mr-1 hidden md:inline" />
                                                    <span className="hidden md:inline">Pesan</span>
                                                    <span className="md:hidden">📱</span>
                                                </a>
                                            ) : null}
                                            <Link
                                                href={`/Destination/${destination.namaLokasi.toLowerCase().replace(/\s+/g, '-')}-${destination.id}`}
                                                className="md:px-4 md:py-2 px-1 py-2 h-[2.5rem] border border-white text-white text-sm rounded hover:bg-white hover:text-black transition"
                                            >
                                                Detail
                                            </Link>
                                        </div>
                                        
                                        {/* WhatsApp indicator for mobile */}
                                        {hasWhatsApp && (
                                            <div className="md:hidden absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                                                <Phone className="w-3 h-3 mr-1" />
                                                WA
                                            </div>
                                        )}
                                    </div>
                                )}
                                {/* Click indicator for side items */}
                                {isClickable && (
                                    <div className="absolute inset-0 bg-black/10 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                                            {item.position === 'left' ? (
                                                <ChevronLeftIcon className="w-6 h-6 text-white" />
                                            ) : (
                                                <ChevronRightIcon className="w-6 h-6 text-white" />
                                            )}
                                        </div>
                                    </div>
                                )}
                                
                                {/* WhatsApp indicator for desktop (non-center items) */}
                                {!isCenter && hasWhatsApp && (
                                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center md:hidden">
                                        <Phone className="w-3 h-3 mr-1" />
                                        WA
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <button
                    onClick={next}
                    className="hidden md:block px-1 py-3 hover:bg-black/30 z-10"
                    aria-label="Next destination"
                >
                    <ChevronRightIcon className="w-6 h-6" />
                </button>
            </div>
        </section>
    );
}