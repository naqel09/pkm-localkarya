import React from "react";
import Image from "next/image";
import {ChevronUpIcon, ChevronDownIcon} from "@heroicons/react/24/solid";

function Testimonials() {
    return (
        <section className="bg-white py-16 px-4 md:px-6 lg:px-20">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
                {/* Left Side */}
                <div className="flex flex-col justify-between space-y-6 md:space-y-0">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            TESTIMONI
                        </h2>
                        <p className="text-gray-500">
                            Apa yang pengunjung katakan tentang Nyaba Wisata.
                        </p>
                    </div>
                    <div>
                        <ChevronUpIcon className="w-7 h-7 text-gray-300" />
                        <ChevronDownIcon className="w-7 h-7 text-blue-500" />
                    </div>
                </div>

                {/* Right Side */}
                <div className="bg-white shadow-xl rounded-xl p-4 md:p-6 col-span-1 md:col-span-2">
                    <p className="text-gray-700 mb-6 text-sm md:text-base text-justify leading-relaxed">
                        Saya baru saja mengunjungi Desa Karyawangi bersama keluarga melalui paket Nyaba Wisata, 
                        dan saya sangat puas dengan pengalaman yang diberikan. Mulai dari konsultasi awal hingga 
                        follow-up setelah wisata, semuanya ditangani dengan sangat profesional dan penuh perhatian. 
                        Itinerary kami disesuaikan dengan sempurna sesuai minat keluarga, dan kami sangat menikmati 
                        setiap momen bermain dan menjelajahi keindahan desa. Saya sangat merekomendasikan Nyaba Wisata 
                        kepada siapa saja yang mencari pengalaman wisata desa yang tak terlupakan dan bebas stres.
                    </p>
                    <div className="flex items-center gap-3 md:gap-4">
                        <Image
                            src="/testimonials.jpg" // Ganti sesuai lokasi gambarmu
                            alt="Sarah Johnson"
                            width={32}
                            height={32}
                            className="rounded-full w-8 h-8 md:w-10 md:h-10"
                        />
                        <div>
                            <p className="font-semibold text-gray-900 text-sm md:text-base">
                                Sari Indah
                            </p>
                            <p className="text-xs md:text-sm text-gray-500">
                                Pengunjung dari Jakarta
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Testimonials;
