"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import HotelCard from "./HotelCard";
import Pagination from "../../pagination/Pagination"; // ganti sesuai path file Pagination.tsx
import { hotels } from "@/data/hotels";

const PopularHotels: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6; // jumlah hotel per halaman

  // Hitung total halaman
  const totalPages = Math.ceil(hotels.length / itemsPerPage);

  // Data hotel yang ditampilkan sesuai halaman
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentHotels = hotels.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section className="max-w-8xl mx-auto px-6 py-12 space-y-5">
      <h3 className="text-5xl font-semibold capitalize underline">
        Popular Hotels
      </h3>

      <div className="flex flex-wrap justify-between">
        <p>
          Pesan kamar yang anda inginkan untuk memulai petualangan baru lagi
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

      {/* Grid Hotel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {currentHotels.map((dest, idx) => (
          <Link
            key={idx}
            href={`/Hotel/${dest.slug}`}
            className="cursor-pointer"
          >
            <HotelCard
              image={dest.image}
              title={dest.title}
              location={dest.location}
              price={dest.price}
            />
          </Link>
        ))}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </section>
  );
};

export default PopularHotels;
