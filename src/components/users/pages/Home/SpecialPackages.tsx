"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

// Define the SpecialPackage type
interface SpecialPackage {
  id: number;
  title: string;
  description: string;
  imageUrl: string | null;
  orderIndex: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

function SpecialPackages() {
  const [packages, setPackages] = useState<SpecialPackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch("/api/special-packages");
        if (!res.ok) throw new Error("Failed to fetch packages");
        const response = await res.json();
        setPackages(response.data || []);
      } catch (error) {
        console.error("Error fetching packages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  // Function to get image path - handles both uploaded images and static images
  const getImagePath = (imagePath: string | null) => {
    // If no image, return a placeholder
    if (!imagePath) {
      // Using an existing image as placeholder
      return "/images/mountain2.jpg";
    }
    
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http') || imagePath.startsWith('/')) {
      return imagePath;
    }
    // For uploaded images, use the uploads endpoint
    return `/uploads/${imagePath}`;
  };

  // Show loading state
  if (loading) {
    return (
      <section className="py-16 px-4 max-w-8xl lg:mx-20 mx-4">
        <div className="flex justify-between flex-wrap items-start mb-10">
          <div className="w-full lg:w-auto mb-4 lg:mb-0">
            <div className="h-6 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-80 animate-pulse"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-9 auto-rows-auto lg:grid-rows-4 gap-4">
          {/* Gambar kiri panjang */}
          <div className="relative h-[300px] lg:h-full lg:col-span-3 lg:row-span-4 lg:col-start-1 rounded-lg bg-gray-200 animate-pulse"></div>

          {/* Gambar kanan atas */}
          <div className="relative h-[300px] lg:h-full lg:col-span-6 lg:row-span-3 lg:col-start-4 bg-gray-200 animate-pulse"></div>

          {/* Judul bawah */}
          <div className="lg:col-span-3 lg:col-start-4 lg:row-start-4">
            <div className="h-12 bg-gray-200 rounded w-48 animate-pulse"></div>
          </div>

          {/* Deskripsi dan tombol */}
          <div className="lg:col-span-3 flex flex-col justify-between">
            <div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-3/6 animate-pulse"></div>
            </div>
            <div className="h-10 bg-gray-200 rounded w-32 mt-4 animate-pulse"></div>
          </div>
        </div>
      </section>
    );
  }

  // Filter out inactive packages and sort by orderIndex
  const activePackages = packages
    .filter(pkg => pkg.isActive)
    .sort((a, b) => a.orderIndex - b.orderIndex);

  // If no active packages, show nothing
  if (activePackages.length === 0) {
    return null;
  }

  // Group packages into pairs for the layout
  const packagePairs = [];
  for (let i = 0; i < activePackages.length; i += 2) {
    packagePairs.push({
      first: activePackages[i],
      second: activePackages[i + 1]
    });
  }

  return (
    <section className="py-16 px-4 max-w-8xl lg:mx-20 mx-4">
      <div className="flex justify-between flex-wrap items-start mb-10">
        <div className="w-full lg:w-auto mb-4 lg:mb-0">
          <h3 className="font-bold text-xl uppercase tracking-wide">
            Paket Wisata Spesial
          </h3>
          <p className="text-sm text-gray-600">
            Nikmati paket wisata terbaik yang dirancang khusus untuk pengalaman nyaba di Desa Karyawangi
          </p>
        </div>
        <Link
          href="/Tours"
          className="relative inline-block text-blue-600 text-sm transition-colors duration-300 hover:text-blue-700
           after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2
           after:h-[2px] after:w-full after:scale-x-0 after:origin-center
           after:bg-blue-500 after:transition-transform after:duration-300 hover:after:scale-x-100 w-full lg:w-auto text-center lg:text-left"
        >
          see more packages
        </Link>
      </div>

      <div className="space-y-8">
        {packagePairs.map((pair, index) => {
          const firstPackage = pair.first;
          const secondPackage = pair.second;
          
          return (
            <div key={index} className="grid grid-cols-1 lg:grid-cols-9 auto-rows-auto lg:grid-rows-4 gap-4">
              {/* Gambar kiri panjang - First Package */}
              {firstPackage && (
                <div className="relative h-[300px] lg:h-full lg:col-span-3 lg:row-span-4 lg:col-start-1 rounded-lg">
                  <Image
                    src={getImagePath(firstPackage.imageUrl)}
                    alt={firstPackage.title}
                    fill
                    className="object-cover rounded-2xl"
                  />
                  <div className="absolute inset-0 bg-black/30 rounded-2xl flex flex-col justify-between p-4 text-white">
                    <span className="text-xl font-bold">0{index * 2 + 1}</span>
                    <div className="text-left lg:text-justify lg:w-3">
                      <p className="text-xl lg:text-2xl xl:text-5xl font-semibold">
                        {firstPackage.title}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Gambar kanan atas - Second Package */}
              {secondPackage ? (
                <div className="relative h-[300px] lg:h-full lg:col-span-6 lg:row-span-3 lg:col-start-4">
                  <Image
                    src={getImagePath(secondPackage.imageUrl)}
                    alt={secondPackage.title}
                    fill
                    className="object-cover rounded-lg"
                  />
                  <div className="absolute lg:top-4 lg:right-4 text-white font-bold text-lg p-4">
                    0{index * 2 + 2}
                  </div>
                </div>
              ) : firstPackage ? (
                <div className="relative h-[300px] lg:h-full lg:col-span-6 lg:row-span-3 lg:col-start-4 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">No package available</span>
                </div>
              ) : null}

              {/* Judul bawah - Second Package Name */}
              <div className="lg:col-span-3 lg:col-start-4 lg:row-start-4 text-center lg:text-left">
                {secondPackage ? (
                  <h2 className="text-4xl lg:text-7xl xl:text-8xl font-bold mt-4 lg:mt-0">
                    {secondPackage.title.split(" ").slice(0, 2).join(" ")}
                  </h2>
                ) : firstPackage ? (
                  <div className="h-16 bg-gray-100 rounded w-full mt-4 lg:mt-0 flex items-center justify-center">
                    <span className="text-gray-500">No package name</span>
                  </div>
                ) : null}
              </div>

              {/* Deskripsi dan tombol - Second Package */}
              <div className="lg:col-span-3 flex flex-col justify-between">
                {secondPackage ? (
                  <>
                    <p className="text-gray-600 text-base lg:text-2xl font-extralight text-justify mt-4 lg:mt-0">
                      {secondPackage.description.substring(0, 200)}...
                    </p>
                    {index === packagePairs.length - 1 && (
                      <Link 
                        href={`/Tours`} 
                        className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 cursor-pointer transition mt-4 text-center w-full lg:w-auto inline-block"
                      >
                        Pesan Sekarang
                      </Link>
                    )}
                  </>
                ) : firstPackage ? (
                  <div className="flex flex-col justify-between h-full">
                    <div className="bg-gray-100 rounded w-full h-24 flex items-center justify-center">
                      <span className="text-gray-500">No description available</span>
                    </div>
                    {index === packagePairs.length - 1 && (
                      <div className="bg-gray-200 rounded w-32 h-10 mt-4 flex items-center justify-center">
                        <span className="text-gray-500">Pesan Sekarang</span>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
        
        
      </div>
    </section>
  );
}

export default SpecialPackages;