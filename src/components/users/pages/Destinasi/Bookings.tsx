"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { MapPin, Search, LayoutGrid, List } from "lucide-react";
import Pagination from "@/components/users/pagination/Pagination"; // pastikan path benar

const categories = ["All", "Best Seller", "Nature", "City", "Seasonal"];

function Bookings() {
  const [view, setView] = useState("list");
  const [selected, setSelected] = useState("All");
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // tampilkan 5 per halaman

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await fetch("/api/admin");
        if (!res.ok) throw new Error("Gagal mengambil data");
        const data = await res.json();
        setDestinations(Array.isArray(data) ? data : data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDestinations();
  }, []);

  // filter pencarian
  const filtered = destinations.filter((d: any) =>
    d.title.toLowerCase().includes(search.toLowerCase())
  );

  // pagination logic
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filtered.slice(startIndex, endIndex);

  return (
    <section className="max-w-8xl mx-auto px-6 py-12 space-y-10">
      {/* Heading and Filter */}
      <div className="flex flex-col gap-6">
        <h2 className="text-3xl font-bold uppercase">Our Tour Packages</h2>

        <div className="flex flex-wrap gap-3">
          {categories.map((item, i) => (
            <button
              key={i}
              onClick={() => setSelected(item)}
              className={`px-4 py-1 rounded-full text-sm font-medium ${
                selected === item
                  ? "bg-blue-600 text-white border-blue-600"
                  : "text-black border-none bg-gray-200"
              } cursor-pointer`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Search and Toggle */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1); // reset ke halaman 1 kalau search berubah
            }}
            className="w-full border rounded-full py-2 px-4 pl-10 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView("grid")}
            className={`border p-2 rounded-md ${
              view === "grid" ? "bg-blue-600 text-white" : ""
            }`}
          >
            <LayoutGrid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setView("list")}
            className={`border p-2 rounded-md ${
              view === "list" ? "bg-blue-600 text-white" : ""
            }`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tour Cards List View */}
      <div className="space-y-6">
        {currentItems.map((d: any) => (
          <div
            key={d.id}
            className="flex flex-col md:flex-row bg-white shadow-md rounded-xl overflow-hidden border border-black"
          >
            <div className="relative h-52 md:h-auto md:w-60 w-full">
              <Image
                src={d.image}
                alt={d.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex-1 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-blue-600 text-sm font-semibold uppercase mb-1">
                  <MapPin className="w-4 h-4" />
                  {d.location}
                </div>
                <h3 className="text-xl font-bold mb-2">{d.title}</h3>
                <p className="text-sm text-gray-600">{d.description}</p>
              </div>

              <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-4 gap-4">
                <div className="flex gap-8 text-sm text-gray-600">
                  <p>📅 {d.days}</p>
                  <p>💰 {d.price}</p>
                </div>

                <div className="flex gap-3">
                  <button className="px-4 py-2 rounded-md bg-green-500 text-white text-sm font-medium cursor-pointer hover:bg-green-600">
                    WhatsApp
                  </button>
                  <button className="px-4 py-2 rounded-md border text-sm font-medium cursor-pointer">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </section>
  );
}

export default Bookings;
