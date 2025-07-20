import React from "react";
import Link from "next/link";
import Image from "next/image";
import culturalImg from "@/app/assets/cultural.jpg";
import riverImg from "@/app/assets/river.jpg";

function SpecialPackages() {
    return (
        <section className="py-16 px-4 max-w-8xl mx-20">
            <div className="flex justify-between flex-wrap items-center mb-10">
                <div>
                    <h3 className="font-bold text-xl uppercase tracking-wide">
                        special packages
                    </h3>
                    <p className="text-sm text-gray-600">
                        Get Special travel packages made tailored for your needs
                    </p>
                </div>
                <Link
                    href="/packages"
                    className="relative inline-block text-blue-600 text-sm transition-colors duration-300 hover:text-blue-700
             after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2
             after:h-[2px] after:w-full after:scale-x-0 after:origin-center
             after:bg-blue-500 after:transition-transform after:duration-300 hover:after:scale-x-100 mt-3"
                >
                    see more packages
                </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-9 auto-rows-auto md:grid-rows-4 gap-4">
                {/* Gambar kiri panjang */}
                <div className="relative h-[300px] md:h-full md:col-span-3 md:row-span-4 md:col-start-1 rounded-lg">
                    <Image
                        src={riverImg}
                        alt="Cultural"
                        fill
                        className="object-cover rounded-2xl"
                    />
                    <div className="absolute inset-0 bg-black/30 rounded-2xl flex flex-col justify-between p-4 text-white">
                        <span className="text-xl font-bold">01</span>
                        <div className="text-justify md:w-3">
                            <p className="text-2xl md:text-5xl font-semibold hidden md:block">
                                Cultural Immersion Package
                            </p>
                        </div>
                    </div>
                </div>

                {/* Gambar kanan atas */}
                <div className="relative h-[300px] md:h-full md:col-span-6 md:row-span-3 md:col-start-4">
                    <Image
                        src={culturalImg}
                        alt="Cultural"
                        fill
                        className="object-cover rounded-lg"
                    />
                    <div className="absolute md:top-4 md:right-4 text-white font-bold text-lg p-4">
                        02
                    </div>
                </div>

                {/* Judul bawah */}
                <div className="md:col-span-3 md:col-start-4 md:row-start-4 ">
                    <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold mt-4 md:mt-0">
                        ESCAPE TO PARADISE
                    </h2>
                </div>

                {/* Deskripsi dan tombol */}
                <div className="md:col-span-3 flex flex-col justify-between">
                    <p className="text-gray-600 text-base md:text-2xl text-justify mt-4 md:mt-0">
                        Bask in the warm tropical sun with our exclusive
                        Tropical Escape Package. This 7-day trip takes you to
                        the most stunning tropical islands.
                    </p>
                    <button className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 cursor-pointer transition mt-4 md:w-1/3">
                        Book Now
                    </button>
                </div>
            </div>
        </section>
    );
}

export default SpecialPackages;
