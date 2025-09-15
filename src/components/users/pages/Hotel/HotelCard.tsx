import React from "react";
import Image from "next/image";
import { MapPin } from "lucide-react";

interface HotelCardProps {
    image: string;
    title: string;
    location: string;
    price: string;
    rating?: number;
    facilities?: string[];
    roomsCount?: number;
}

const HotelCard = ({
    image,
    title,
    location,
    price,
    rating = 5,
    facilities = [],
    roomsCount = 0,
}: HotelCardProps) => {
    return (
        <div className="rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:scale-105 transition duration-300 bg-white">
            <div className="relative w-full h-80">
                <Image 
                    src={image?.startsWith('data:image') ? image : `/uploads/${image}`} 
                    alt={title} 
                    fill 
                    className="object-cover pointer-events-none" 
                    onError={(e) => {
                        // Fallback to default image if image fails to load
                        (e.target as HTMLImageElement).src = '/hotel1.jpg';
                    }}
                />
                {roomsCount > 0 && (
                    <div className="absolute top-3 right-3 bg-blue-600 text-white px-2 py-1 rounded-lg text-sm font-medium">
                        {roomsCount} kamar
                    </div>
                )}
            </div>
            <div className="p-4 space-y-2">
                <h3 className="text-xl font-semibold text-gray-800 line-clamp-1">
                    {title}
                </h3>
                <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                    <span className="line-clamp-1">{location}</span>
                </div>
                
                {/* Facilities */}
                {facilities.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                        {facilities.map((facility, index) => (
                            <span 
                                key={index}
                                className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full"
                            >
                                {facility}
                            </span>
                        ))}
                        {facilities.length >= 3 && (
                            <span className="text-xs text-gray-400 px-2 py-1">
                                +lainnya
                            </span>
                        )}
                    </div>
                )}
                
                <div className="text-blue-600 font-semibold text-lg pt-1">
                    {price}
                </div>
            </div>
        </div>
    );
};

export default HotelCard;
