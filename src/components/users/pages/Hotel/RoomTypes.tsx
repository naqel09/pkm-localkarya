"use client";

import Image from "next/image";
import { BedDouble, Ruler, Users } from "lucide-react";
import Link from "next/link";
import { hotels } from "@/data/hotels";
import { notFound } from "next/navigation";

const RoomTypes = ({params}:{params:{slug:string}}) => {
  const hotel = hotels.find((b)=>b.slug ===params.slug);
  const index = hotels.findIndex((b)=>b.slug === params.slug);
  const rooms = hotels[index];

  if(!hotel) return notFound();

  return (
    <section className="max-w-8xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-10">ROOM TYPES</h2>
      <div className="space-y-10">
        {rooms.rooms.map((room, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-xl overflow-hidden flex flex-col lg:flex-row border border-black"
          >
            {/* Gambar utama + galeri */}
            <div className="lg:w-1/2 w-full p-4 space-y-3">
              <div className="relative w-full h-[300px] rounded-lg overflow-hidden">
                <Image
                  src={room.galeri[0]}
                  alt={room.image}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Galeri gambar */}
              <div className="flex justify-between gap-2">
                {(room as any).galeri.slice(0, 3).map((img: string, i: number) => (
                  <div key={i} className="relative w-1/3 aspect-[4/3] rounded-md overflow-hidden">
                    <Image
                      src={img}
                      alt={`Gallery ${i}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Detail kamar */}
            <div className="lg:w-1/2 w-full p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-semibold">{room.name}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-600 mt-2 flex-wrap">
                  <div className="flex items-center gap-1">
                    <Ruler size={16} />
                    <span>{room.name === "Classic Room" ? "30 sqm" : "40 sqm"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BedDouble size={16} />
                    <span>{room.name === "Classic Room" ? "Queen Size" : "King Size"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users size={16} />
                    <span>{room.name === "Classic Room" ? "2 guests" : "3 guests"}</span>
                  </div>
                </div>

                <ul className="text-sm text-gray-700 mt-4 list-disc ml-4 space-y-1">
                  <li>Free Wi-Fi</li>
                  <li>AC</li>
                  <li>Toiletries</li>
                  <li>Mini Bar</li>
                  <li>{room.name === "Classic Room" ? "No Breakfast" : "Free Breakfast"}</li>
                </ul>
              </div>

              <div className="mt-6 flex justify-between items-center">
                <div className="text-lg font-semibold text-gray-800">
                  {room.price} <span className="text-sm text-gray-500">/ malam</span>
                </div>
                <button className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg text-sm cursor-pointer">
                  Whats App
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RoomTypes;