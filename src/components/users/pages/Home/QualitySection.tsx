"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

// Define the QualitySection type
interface QualitySectionData {
  id: number;
  title: string;
  description: string;
  backgroundImageUrl: string | null;
  tag1Quantity: string;
  tag1Description: string;
  tag2Quantity: string;
  tag2Description: string;
  tag3Quantity: string;
  tag3Description: string;
  tag4Quantity: string;
  tag4Description: string;
  createdAt: string;
  updatedAt: string;
}

function QualitySection() {
  const [data, setData] = useState<QualitySectionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQualitySection = async () => {
      try {
        const res = await fetch("/api/quality-section");
        if (!res.ok) throw new Error("Failed to fetch quality section data");
        const response = await res.json();
        setData(response.data);
      } catch (error) {
        console.error("Error fetching quality section:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQualitySection();
  }, []);

  // Function to get image path - handles both uploaded images and static images
  const getImagePath = (imagePath: string | null) => {
    // If no image, return a default one
    if (!imagePath) {
      return "/nyaba7.jpg";
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
      <section className="relative max-w-8-xl h-[35rem] rounded-2xl overflow-hidden text-white md:mx-20 mx-4 my-20 animate-pulse">
        <div className="bg-gray-300 h-full w-full"></div>
      </section>
    );
  }

  // If no data, don't render anything
  if (!data) {
    return null;
  }

  return (
    <section className="relative max-w-8-xl h-[35rem] rounded-2xl overflow-hidden text-white md:mx-20 mx-4 my-20">
      {/* Background Image */}
      <Image
        src={getImagePath(data.backgroundImageUrl)}
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
            {data.title}
          </h2>
          <p className="mt-2 text-sm md:text-base text-gray-200">
            {data.description}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 text-center border-t border-white/30 pt-6 gap-4 md:gap-6 text-sm md:text-base">
          <div>
            <p className="text-lg md:text-xl font-semibold">{data.tag1Quantity}</p>
            <p className="text-gray-200 text-xs md:text-sm">{data.tag1Description}</p>
          </div>
          <div>
            <p className="text-lg md:text-xl font-semibold">{data.tag2Quantity}</p>
            <p className="text-gray-200 text-xs md:text-sm">{data.tag2Description}</p>
          </div>
          <div>
            <p className="text-lg md:text-xl font-semibold">{data.tag3Quantity}</p>
            <p className="text-gray-200 text-xs md:text-sm">{data.tag3Description}</p>
          </div>
          <div>
            <p className="text-lg md:text-xl font-semibold">{data.tag4Quantity}</p>
            <p className="text-gray-200 text-xs md:text-sm">{data.tag4Description}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default QualitySection;