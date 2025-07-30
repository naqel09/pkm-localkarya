import React from "react";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { FaStar} from "react-icons/fa"

interface HotelCardProps {
    image: string;
    title: string;
    location: string;
    price: string;
    rating?: number;
}

const HotelCard = ({
    image,
    title,
    location,
    price,
    rating = 5,
}: HotelCardProps) => {
    return (
        <div className="rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:scale-105 transition duration-300 bg-white">
            <div className="relative w-full h-80 ">
                <Image src={image} alt={title} fill className="object-cover" />
                <div className="absolute top-3 right-3 flex gap-1 bg-transparent  px-2 py-1 rounded-full">
                    {[...Array(5)].map((_, i) => (
                        <FaStar
                            key={i}
                            className={`w-4 h-4 ${
                                i < rating ? "text-yellow-400" : "text-gray-300"
                            }`}
                        />
                    ))}
                </div>
            </div>
            <div className="p-4 space-y-2">
                <h3 className="text-2xl font-semibold text-gray-800">
                    {title}
                </h3>
                <div className="flex items-center text-md text-gray-500">
                    <MapPin className="w-4 h-4 mr-1" />
                    {location}
                </div>
                <div className="text-blue-600 font-semibold text-lg">{price}</div>
            </div>
        </div>
    );
};

export default HotelCard;
