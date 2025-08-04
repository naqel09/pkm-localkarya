import React from "react";
import Link from "next/link";
import {Search} from "lucide-react";
import HotelCard from "./HotelCard";
import PaginationClient from "../../pagination/PaginationClient";
import { hotels } from "@/data/hotels";

const PopularHotels = () => {
    return (
        <section className="max-w-8xl mx-auto px-6 py-12 space-y-5">
            <h3 className="text-5xl font-semibold capitalise underline">
                Popular Hotels
            </h3>
            <div className="flex flex-wrap justify-between">
                <p>
                    pesan kamar yang anda inginkan untuk dapat memulai
                    petualangan yang baru lagi
                </p>
                <div className="w-full md:w-1/4 relative">
                    <input
                        type="text"
                        placeholder="Search"
                        className="w-full border rounded-full py-2 px-4 pl-10 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-black" />
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {hotels.map((dest, idx) => (
                    <Link
                        key={idx}
                        href={`/Hotel/${dest.slug}`}
                        className="cursor-pointer "
                    >
                        <HotelCard {...dest} />
                    </Link>
                ))}
            </div>
            <PaginationClient />
        </section>
    );
};

export default PopularHotels;
