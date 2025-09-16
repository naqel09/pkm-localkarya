import React from "react";
import Image from "next/image";
import {ChevronUpIcon, ChevronDownIcon} from "@heroicons/react/24/solid";

function Testimonials() {
    return (
        <section className="bg-white py-16 px-6 md:px-20">
            <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">
                {/* Left Side */}
                <div className="flex flex-col justify-between">
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
                <div className="bg-white shadow-xl rounded-xl p-6 col-span-2">
                    <p className="text-gray-700 mb-6 text-justify">
                        Saya baru saja mengunjungi Desa Karyawangi bersama keluarga melalui paket Nyaba Wisata, 
                        dan saya sangat puas dengan pengalaman yang diberikan. Mulai dari konsultasi awal hingga 
                        follow-up setelah wisata, semuanya ditangani dengan sangat profesional dan penuh perhatian. 
                        Itinerary kami disesuaikan dengan sempurna sesuai minat keluarga, dan kami sangat menikmati 
                        setiap momen bermain dan menjelajahi keindahan desa. Saya sangat merekomendasikan Nyaba Wisata 
                        kepada siapa saja yang mencari pengalaman wisata desa yang tak terlupakan dan bebas stres.
                    </p>
                    <div className="flex items-center gap-4">
                        <Image
                            src="/testimonials.jpg" // Ganti sesuai lokasi gambarmu
                            alt="Sarah Johnson"
                            width={40}
                            height={100}
                            className="rounded-full"
                        />
                        <div>
                            <p className="font-semibold text-gray-900">
                                Sari Indah
                            </p>
                            <p className="text-sm text-gray-500">
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
