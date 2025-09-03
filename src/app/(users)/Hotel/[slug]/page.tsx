import React from "react";
import {hotels} from "@/data/hotels";
import TourHeader from "@/components/TourHeader";
import {notFound} from "next/navigation";
import Image from "next/image";
import Reviews from "@/components/users/pages/Hotel/Reviews";

const page = ({params}: {params: {slug: string}}) => {
    const hotel = hotels.find((h) => h.slug === params.slug);
    if (!hotel) return notFound;
    return (
        <>
            <TourHeader
                title="Hotel"
                halaman="Home"
                bagian=" Hotel | Detail-hotel"
                image="/bedroom.jpg"
            />
            <section className="max-w-8xl mx-auto px-4 py-10 grid grid-cols1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    <div className="relative w-full h-[250px] sm:h-[300px] md:h-[400px] lg:h-[500px] rounded-xl overflow-hidden">
                        <Image
                            src={hotel.image}
                            alt={hotel.title}
                            fill
                            className="object-cover"
                            sizes="(max-width:768px) 100vw,66vw"
                            priority
                        />
                    </div>
                </div>
                <div className="grid grid-cols-3 lg:grid-cols-1 lg:grid-rows-3 gap-2">
                    <div className="relative w-full h-[100px] md:h-[120px] lg:h-[160px] rounded-md overflow-hidden">
                        <Image
                            src={hotel.galeri1}
                            alt={hotel.galeri1}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="relative w-full h-[100px] md:h-[120px] lg:h-[160px] rounded-md overflow-hidden">
                        <Image
                            src={hotel.galeri1}
                            alt={hotel.galeri1}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="relative w-full h-[100px] md:h-[120px] lg:h-[160px] rounded-md overflow-hidden">
                        <Image
                            src={hotel.galeri1}
                            alt={hotel.galeri1}
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>
            </section>
            {/* Overview */}
            <section className="max-w-8xl mx-auto px-4 py-12 space-y-10">
                <div>
                    <h2 className="text-2xl font-extrabold tracking-wide mb-4">
                        OVERVIEW
                    </h2>
                    <p className="text-lg text-gray-600 max-w-8xl leading-relaxed">
                        Situated just steps from the iconic Place Vendôme, the
                        hotel offers easy access to some of the city's most
                        famous attractions, including the Louvre Museum, the
                        Champs-Élysées, the Arc de Triomphe, and the famous
                        Eiffel Tower view.
                    </p>
                </div>
                {/* Location */}
                <div>
                    <h2 className="text-2xl font-extrabold tracking-wide mb-4">
                        LOCATION
                    </h2>
                    <div className="rounded-2xl overflow-hidden border shadow-sm">
                        <iframe
                            src="https://maps.google.com/maps?q=Palais%20Royal,%20Paris&t=&z=13&ie=UTF8&iwloc=&output=embed"
                            className="w-full h-90"
                            loading="lazy"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
                <section className="max-w-8xl mx-auto px-4 py-12">
                    <h2 className="text-3xl font-bold mb-10"> ROOM TYPES </h2>
                    <div className="space-y-10">
                        {hotel.rooms.map((room, index) => (
                            <div
                                key={index}
                                className="bg-white shadow-lg rounded-xl overflow-hidden flex flex-col lg:flex-row border border-black"
                            >
                                <div className="lg:w-1/2 w-full p-4 space-y-3">
                                    <div className="relative w-full aspect-[2/1] rounded-lg overflow-hidden">
                                        <Image
                                            src={room.image}
                                            alt={room.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex justify-between gap-2">
                                        <div className="relative w-2/3 aspect-[6/3] rounded-md overflow-hidden">
                                            <Image
                                                src={room.galeri1}
                                                alt={room.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="relative w-2/3 aspect-[6/3] rounded-md overflow-hidden">
                                            <Image
                                                src={room.galeri1}
                                                alt={room.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="lg:w-1/2 w-full p-6 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-xl font-semibold">
                                            {room.name}
                                        </h3>
                                    </div>
                                    <div className="mt-6 flex justify-between items-center">
                                        <div className="text-lg font-semibold text-gray-800">
                                            {room.price} <span>/malam</span>
                                        </div>
                                        <button className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg text-sm cursor-pointer">Whats App</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
                <Reviews />
            </section>
        </>
    );
};

export default page;
