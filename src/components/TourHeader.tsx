"use client";

import React, { useState, useEffect } from "react";
import Image,{StaticImageData} from "next/image";

interface TourHeaderProps{
    title: string;
    halaman: string;
    bagian: string;
    image: StaticImageData | string;
    logo?: string | null;
}

function TourHeader({title,halaman,bagian,image,logo}:TourHeaderProps) {
    const [carouselImage, setCarouselImage] = useState<string | null>(null);
    
    // Determine if we should use the image directly or apply gradient
    // For About page, always use the provided image
    // For other pages, try to use carousel images
    const isAboutPage = title === "Tentang Kami";
    const shouldUseImage = isAboutPage || (typeof image === 'string' && (image.startsWith('/') || image.startsWith('http')));
    
    // Determine which carousel image to use based on page type
    const getCarouselImageIndex = () => {
        switch(title) {
            case "Penginapan":
                return 2; // Third carousel image
            case "Kuliner":
                return 3; // Fourth carousel image
            case "UMKM Lokal":
                return 4; // Fifth carousel image
            case "ARTIKEL":
                return 5; // Sixth carousel image
            case "VLOG WISATA":
                return 6; // Seventh carousel image
            default:
                return 0; // First carousel image for other pages
        }
    };

    // Fetch carousel images
    useEffect(() => {
        // Don't fetch carousel images for About page since it uses its own image
        if (isAboutPage) {
            return;
        }
        
        const fetchCarouselImages = async () => {
            try {
                const res = await fetch("/api/carousel");
                if (!res.ok) throw new Error("Failed to fetch carousel images");
                const response = await res.json();
                const carousels = response.data || [];
                
                // Use specific carousel image based on page type
                const imageIndex = getCarouselImageIndex();
                if (carousels.length > imageIndex) {
                    setCarouselImage(carousels[imageIndex].imageUrl);
                } else if (carousels.length > 0) {
                    // Fallback to first image if specific index not available
                    setCarouselImage(carousels[0].imageUrl);
                }
            } catch (error) {
                console.error("Error fetching carousel images:", error);
                // Keep default behavior if fetch fails
            }
        };

        fetchCarouselImages();
    }, [title, isAboutPage]);

    // Determine gradient based on title - forest base with dynamic accents
    const getGradient = () => {
        // Only apply gradients when not using a background image
        if ((shouldUseImage && !isAboutPage) || carouselImage) return "";
        
        switch(title) {
            case "Penginapan":
                return "from-green-700 via-emerald-800 to-teal-900"; // Forest green with teal accent
            case "Kuliner":
                return "from-green-700 via-emerald-800 to-lime-900"; // Forest green with lime accent
            case "UMKM Lokal":
                return "from-green-700 via-emerald-800 to-cyan-900"; // Forest green with cyan accent
            case "ARTIKEL":
                return "from-green-700 via-emerald-800 to-blue-900"; // Forest green with blue accent
            case "VLOG WISATA":
                return "from-green-700 via-emerald-800 to-indigo-900"; // Forest green with indigo accent
            default:
                return "from-green-700 via-emerald-800 to-green-900"; // Default forest green
        }
    };

    // Determine emoji based on title
    const getEmoji = () => {
        switch(title) {
            case "Penginapan":
                return "🏨";
            case "Kuliner":
                return "🍽️";
            case "UMKM Lokal":
                return "🏪";
            case "ARTIKEL":
                return "📝";
            case "VLOG WISATA":
                return "🎥";
            default:
                return "🌿";
        }
    };

    // Determine which image to use
    const backgroundImage = isAboutPage ? image : (carouselImage || image);

    return (
        <section className="relative h-96 overflow-hidden">
            {shouldUseImage || carouselImage ? (
                // Use actual background image when provided
                <>
                    <Image
                        src={backgroundImage}
                        alt={`${title} Background`}
                        fill
                        className="object-cover object-center absolute z-0"
                        priority
                    />
                    {/* Overlay for better text readability */}
                    <div className="absolute inset-0 bg-black/30 z-10" />
                </>
            ) : (
                // Use gradient background when no image is provided
                <div className={`absolute inset-0 bg-gradient-to-br ${getGradient()}`}>
                    {/* Decorative Elements */}
                    <div className="absolute inset-0">
                        <div className="absolute top-10 left-10 w-20 h-20 bg-white/20 rounded-full animate-pulse"></div>
                        <div className="absolute bottom-20 right-20 w-16 h-16 bg-white/15 rounded-full animate-bounce"></div>
                        <div className="absolute top-32 right-32 w-12 h-12 bg-white/25 rounded-full animate-ping"></div>
                        <div className="absolute bottom-32 left-32 w-8 h-8 bg-white/30 rounded-full animate-pulse"></div>
                    </div>
                </div>
            )}
            
            {/* Content */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="text-center text-white px-4">
                    <div className="mb-4">
                        <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                            {getEmoji()} {halaman} | {bagian}
                        </span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-wider drop-shadow-2xl">
                        {title}
                    </h1>
                    <div className="mt-8">
                        <span className="px-8 py-3 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-full backdrop-blur-sm border border-white/30 transition-all duration-300 hover:scale-105">
                            Jelajahi {title} ✨
                        </span>
                    </div>
                </div>
            </div>
            
            {/* Logo in top left corner if provided */}
            {logo && (
                <div className="absolute top-6 left-6 z-20">
                    <Image
                        src={logo}
                        alt="Logo"
                        width={100}
                        height={50}
                        className="object-contain"
                    />
                </div>
            )}
        </section>
    );
}

export default TourHeader;