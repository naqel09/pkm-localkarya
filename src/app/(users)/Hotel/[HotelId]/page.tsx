import Image from "next/image";
import {hotels} from "@/data/hotels";
import {notFound} from "next/navigation";
import {
    Wifi,
    Utensils,
    Bath,
    Hotel,
    Clock,
    ParkingCircle,
    Shirt,
    ConciergeBell,
    Briefcase,
    PackageCheck,
} from "lucide-react";
import TourHeader from "@/components/TourHeader";
import RoomTypes from "@/components/users/pages/Hotel/RoomTypes";
import Reviews from "@/components/users/pages/Hotel/Reviews";

export default function HotelDetailPage({params}: {params: {slug: string}}) {
    const hotel = hotels.find((hotel) => hotel.slug === params.slug);
    if (!hotel) return notFound();
    return (
        <>
            <TourHeader
                title="Hotels"
                halaman="Home"
                bagian="Hotel | Detail-Hotel"
                image="/bedroom.jpg"
            />
            <section className="max-w-8xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Gambar utama (besar) */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="relative w-full h-[250px] sm:h-[300px] md:h-[400px] lg:h-[500px] rounded-xl overflow-hidden">
                        <Image
                            src={hotel.image}
                            alt={hotel.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 66vw"
                            priority
                        />
                    </div>
                </div>

                {/* Galeri gambar kecil */}
                <div className="grid grid-cols-3 lg:grid-cols-1 lg:grid-rows-3 gap-2">
                    {hotel.gallery?.map((img, i) => (
                        <div
                            key={i}
                            className="relative w-full h-[100px] md:h-[120px] lg:h-[160px] rounded-md overflow-hidden"
                        >
                            <Image
                                src={img}
                                alt={`gallery-${i}`}
                                fill
                                className="object-cover"
                            />
                        </div>
                    ))}
                </div>
            </section>

            {/* Overview */}
            <section className="max-w-8xl mx-auto px-4 py-12 space-y-10">
                {/* Overview */}
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

                {/* Facilities */}
                <div>
                    <h2 className="text-2xl font-extrabold tracking-wide mb-6">
                        FACILITIES
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 text-sm text-gray-700">
                        <Facility
                            icon={<Wifi className="w-6 h-6" />}
                            label="High-Speed Internet"
                        />
                        <Facility
                            icon={<Utensils className="w-6 h-6" />}
                            label="Quality Restaurant"
                        />
                        <Facility
                            icon={<Bath className="w-6 h-6" />}
                            label="Spa & Wellness"
                        />
                        <Facility
                            icon={<Hotel className="w-6 h-6" />}
                            label="Swimming Pool & Sauna"
                        />
                        <Facility
                            icon={<Clock className="w-6 h-6" />}
                            label="24/7 Front-Desk"
                        />
                        <Facility
                            icon={<ParkingCircle className="w-6 h-6" />}
                            label="Valet Parking"
                        />
                        <Facility
                            icon={<Shirt className="w-6 h-6" />}
                            label="Laundry & Dry Cleaning"
                        />
                        <Facility
                            icon={<ConciergeBell className="w-6 h-6" />}
                            label="Room Service"
                        />
                        <Facility
                            icon={<Briefcase className="w-6 h-6" />}
                            label="Business Center & Meeting Room"
                        />
                        <Facility
                            icon={<PackageCheck className="w-6 h-6" />}
                            label="Luggage Storage"
                        />
                    </div>
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
            </section>
            <RoomTypes />
            <Reviews />
        </>
    );
}

function Facility({icon, label}: {icon: React.ReactNode; label: string}) {
    return (
        <div className="flex items-center gap-2">
            {icon}
            <span>{label}</span>
        </div>
    );
}

function NearbyAttraction({name, distance}: {name: string; distance: string}) {
    return (
        <div className="flex justify-between items-center text-gray-600">
            <span>{name}</span>
            <span>{distance}</span>
        </div>
    );
}
