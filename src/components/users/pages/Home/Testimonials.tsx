"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/solid";

// Define the Testimonial interface
interface Testimonial {
  id: number;
  name: string;
  location: string;
  comment: string;
  imageUrl: string;
  orderIndex: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch("/api/testimonials");
        if (!res.ok) throw new Error("Failed to fetch testimonials");
        const response = await res.json();
        setTestimonials(response.data || []);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
        // Fallback to default testimonials if API fails
        setTestimonials([
          {
            id: 1,
            name: "Sari Indah",
            location: "Pengunjung dari Jakarta",
            comment: "Saya baru saja mengunjungi Desa Karyawangi bersama keluarga melalui paket Nyaba Wisata, dan saya sangat puas dengan pengalaman yang diberikan. Mulai dari konsultasi awal hingga follow-up setelah wisata, semuanya ditangani dengan sangat profesional dan penuh perhatian. Itinerary kami disesuaikan dengan sempurna sesuai minat keluarga, dan kami sangat menikmati setiap momen bermain dan menjelajahi keindahan desa. Saya sangat merekomendasikan Nyaba Wisata kepada siapa saja yang mencari pengalaman wisata desa yang tak terlupakan dan bebas stres.",
            imageUrl: "/testimonials.jpg",
            orderIndex: 0,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  if (loading) {
    return (
      <section className="bg-white py-16 px-4 md:px-6 lg:px-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {/* Left Side - Skeleton */}
          <div className="flex flex-col justify-between space-y-6 md:space-y-0">
            <div>
              <div className="h-8 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
            </div>
            <div className="flex space-x-2">
              <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>

          {/* Right Side - Skeleton */}
          <div className="bg-white shadow-xl rounded-xl p-4 md:p-6 col-span-1 md:col-span-2">
            <div className="space-y-2 mb-6">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
              <div>
                <div className="h-4 bg-gray-200 rounded w-24 mb-2 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-32 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // If no testimonials, don't show the section
  if (testimonials.length === 0) {
    return null;
  }

  // Get the first active testimonial
  const activeTestimonials = testimonials
    .filter(testimonial => testimonial.isActive)
    .sort((a, b) => a.orderIndex - b.orderIndex);

  if (activeTestimonials.length === 0) {
    return null;
  }

  const testimonial = activeTestimonials[0];

  return (
    <section className="bg-white py-16 px-4 md:px-6 lg:px-20">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
        {/* Left Side */}
        <div className="flex flex-col justify-between space-y-6 md:space-y-0">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              TESTIMONI
            </h2>
            <p className="text-gray-500">
              Apa yang pengunjung katakan tentang Nyaba Wisata.
            </p>
          </div>
          <div>
            <ChevronUpIcon className="w-7 h-7 text-gray-300" />
            <ChevronDownIcon className="w-7 h-7 text-blue-500" />
          </div>
        </div>

        {/* Right Side */}
        <div className="bg-white shadow-xl rounded-xl p-4 md:p-6 col-span-1 md:col-span-2">
          <p className="text-gray-700 mb-6 text-sm md:text-base text-justify leading-relaxed">
            {testimonial.comment}
          </p>
          <div className="flex items-center gap-3 md:gap-4">
            <Image
              src={testimonial.imageUrl}
              alt={testimonial.name}
              width={40}
              height={40}
              className="rounded-full w-10 h-10"
            />
            <div>
              <p className="font-semibold text-gray-900 text-sm md:text-base">
                {testimonial.name}
              </p>
              <p className="text-xs md:text-sm text-gray-500">
                {testimonial.location}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;