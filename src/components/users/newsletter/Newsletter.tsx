"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

// Define the Newsletter interface
interface NewsletterData {
  id: number;
  title: string;
  backgroundImageUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

function Newsletter() {
  const [data, setData] = useState<NewsletterData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewsletter = async () => {
      try {
        const res = await fetch("/api/newsletter");
        if (!res.ok) throw new Error("Failed to fetch newsletter data");
        const response = await res.json();
        setData(response.data);
      } catch (error) {
        console.error("Error fetching newsletter:", error);
        // Fallback to default data if API fails
        setData({
          id: 1,
          title: "Mulai Nyaba Anda",
          backgroundImageUrl: "/nyaba1.jpg",
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      } finally {
        setLoading(false);
      }
    };

    fetchNewsletter();
  }, []);

  // Function to get image path - handles both uploaded images and static images
  const getImagePath = (imagePath: string | null) => {
    // If no image, return a default one
    if (!imagePath) {
      return "/nyaba1.jpg";
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
      <section className="relative text-center py-16 md:py-24 px-4 md:px-6">
        <div className="bg-gray-300 h-96 w-full animate-pulse"></div>
        <div className="relative z-10 max-w-5xl mx-auto my-10 md:my-20">
          <div className="h-16 bg-gray-200 rounded animate-pulse mx-auto w-3/4"></div>
        </div>
      </section>
    );
  }

  // If no data or not active, don't render anything
  if (!data || !data.isActive) {
    return null;
  }

  return (
    <section className="relative text-center py-16 md:py-24 px-4 md:px-6">
      <Image
        src={getImagePath(data.backgroundImageUrl)}
        alt="background"
        fill
        className="object-cover object-center"
        priority
      />
      <div className="relative z-10 max-w-5xl mx-auto my-10 md:my-20">
        <h2 className="text-white text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold uppercase mb-4">
          {data.title}
        </h2>
      </div>
    </section>
  );
}

export default Newsletter;