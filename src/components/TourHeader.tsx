import React from "react";
import Image,{StaticImageData} from "next/image";

interface TourHeaderProps{
    title: string;
    halaman: string;
    bagian: string;
    image: StaticImageData | string;
}

function TourHeader({title,halaman,bagian,image}:TourHeaderProps) {
    return (
        <section className="relative h-screen w-full flex items-center justify-center text-white">
            {/* Background image full screen */}
            <Image
                src={image}
                alt="Tour Packages Background"
                fill
                className="object-cover object-center absolute z-0"
                priority
            />

            {/* Overlay jika ingin gelap/terang */}
            <div className="absolute inset-0 bg-black/30 z-10" />

            {/* Text Content */}
            <div className="relative z-10 text-center px-4">
                <p className="text-lg md:text-xl lg:text-3xl mb-2 tracking-wider">
                    {halaman} &nbsp; | &nbsp; {bagian}
                </p>
                <h1 className="text-3xl md:text-5xl lg:text-7xl font-extrabold uppercase tracking-wide">
                    {title}
                </h1>
            </div>
        </section>
    );
}

export default TourHeader;
