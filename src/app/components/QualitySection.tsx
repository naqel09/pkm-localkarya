import React from "react";
import Image from "next/image";
import bgImage from "@/app/assets/bgImage.jpg"; // Ganti dengan path gambar kamu

function QualitySection() {
    return (
        <section className="relative max-w-8-xl h-[35rem] rounded-2xl overflow-hidden text-white md:mx-20 mx-10 my-20 ">
            {/* Background Image */}
            <Image
                src={bgImage}
                alt="Quality Background"
                fill
                priority
                className="object-cover"
            />
            <div className="absolute top-1/2 right-20 text-right max-w-sm text-sm md:text-base text-gray-200 hidden md:block">
                <p>
                    Take a look at our numbers for our credibility. Let’s have
                    an adventure!
                </p>
            </div>
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/30 z-10" />

            {/* Content */}
            <div className="relative z-20 h-full flex flex-col justify-between p-10 md:p-16">
                {/* Header Text */}
                <div className="max-w-lg">
                    <h2 className="text-lg md:text-xl font-semibold uppercase">
                        Only the best quality for you
                    </h2>
                    <p className="mt-2 text-sm md:text-base text-gray-200">
                        You deserve the ultimate best quality for your memorable
                        experiences.
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 text-center border-t border-white/30 pt-6 gap-6 text-sm md:text-base">
                    <div>
                        <p className="text-xl font-semibold">20+</p>
                        <p className="text-gray-200">years of experience</p>
                    </div>
                    <div>
                        <p className="text-xl font-semibold">100+</p>
                        <p className="text-gray-200">destination countries</p>
                    </div>
                    <div>
                        <p className="text-xl font-semibold">10+</p>
                        <p className="text-gray-200">tour & travel awards</p>
                    </div>
                    <div>
                        <p className="text-xl font-semibold">2,237,216</p>
                        <p className="text-gray-200">delighted clients</p>
                    </div>
                </div>

                {/* Small Description */}
            </div>
        </section>
    );
}

export default QualitySection;
