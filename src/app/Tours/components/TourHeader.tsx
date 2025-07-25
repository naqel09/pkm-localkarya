import React from "react";
import Image from "next/image";
import tourHeader from "@/app/assets/river.jpg";

function TourHeader() {
    return (
        <section className="relative h-screen w-full flex items-center justify-center text-white">
            {/* Background image full screen */}
            <Image
                src={tourHeader}
                alt="Tour Packages Background"
                fill
                className="object-cover object-center absolute z-0"
                priority
            />

            {/* Overlay jika ingin gelap/terang */}
            <div className="absolute inset-0 bg-black/30 z-10" />

            {/* Text Content */}
            <div className="relative z-20 text-center">
                <p className="text-xl md:text-3xl mb-2 tracking-wider">
                    Home &nbsp; | &nbsp; Tours
                </p>
                <h1 className="text-4xl lg:text-9xl md:text-7xl font-extrabold uppercase tracking-wide">
                    Tour Packages
                </h1>
            </div>
        </section>
    );
}

export default TourHeader;
