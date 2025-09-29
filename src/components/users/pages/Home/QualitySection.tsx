import React from "react";
import Image from "next/image"; // Ganti dengan path gambar kamu

function QualitySection() {
    return (
        <section className="relative max-w-8-xl h-[35rem] rounded-2xl overflow-hidden text-white md:mx-20 mx-4 my-20 ">
            {/* Background Image */}
            <Image
                src="/nyaba7.jpg"
                alt="Quality Background"
                fill
                priority
                className="object-cover"
            />
            <div className="absolute top-4 right-4 text-right max-w-sm text-xs md:text-sm lg:text-base text-gray-200 hidden lg:block">
                <p>
                    Lihat angka-angka prestasi kami sebagai bukti komitmen dalam memberikan pengalaman wisata terbaik. 
                    Mari berpetualang bersama di Desa Karyawangi!
                </p>
            </div>
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/30 z-10" />

            {/* Content */}
            <div className="relative z-20 h-full flex flex-col justify-between p-10 md:p-16">
                {/* Header Text */}
                <div className="max-w-lg">
                    <h2 className="text-lg md:text-xl font-semibold uppercase">
                        Kualitas Terbaik untuk Pengalaman Nyaba Anda
                    </h2>
                    <p className="mt-2 text-sm md:text-base text-gray-200">
                        Kami berkomitmen memberikan pelayanan wisata terbaik di Desa Karyawangi untuk menciptakan 
                        kenangan indah yang tak terlupakan.
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 text-center border-t border-white/30 pt-6 gap-4 md:gap-6 text-sm md:text-base">
                    <div>
                        <p className="text-lg md:text-xl font-semibold">5+</p>
                        <p className="text-gray-200 text-xs md:text-sm">tahun pengalaman wisata desa</p>
                    </div>
                    <div>
                        <p className="text-lg md:text-xl font-semibold">15+</p>
                        <p className="text-gray-200 text-xs md:text-sm">destinasi menarik di desa</p>
                    </div>
                    <div>
                        <p className="text-lg md:text-xl font-semibold">50+</p>
                        <p className="text-gray-200 text-xs md:text-sm">paket wisata tersedia</p>
                    </div>
                    <div>
                        <p className="text-lg md:text-xl font-semibold">1,000+</p>
                        <p className="text-gray-200 text-xs md:text-sm">pengunjung puas</p>
                    </div>
                </div>

                {/* Small Description */}
            </div>
        </section>
    );
}

export default QualitySection;
