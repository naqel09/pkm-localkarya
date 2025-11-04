"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Smile, Mountain, Flag, RefreshCw } from "lucide-react";

interface Feature {
  id: number;
  title: string;
  description: string;
  orderIndex: number;
  isActive: boolean;
}

function PilihKami() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/pilih-kami');
        const data = await res.json();
        
        if (res.ok && data.success && data.data) {
          // Filter only active features and sort by orderIndex
          const activeFeatures = data.data
            .filter((feature: Feature) => feature.isActive)
            .sort((a: Feature, b: Feature) => a.orderIndex - b.orderIndex);
          
          setFeatures(activeFeatures);
        } else {
          setError(data.message || "Failed to fetch features");
        }
      } catch (err) {
        setError("Failed to fetch features");
        console.error("Error fetching features:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatures();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-blue-100/100 my-20 rounded-2xl mx-4 lg:mx-0">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Mengapa Memilih Nyaba Wisata?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Pengalaman wisata terbaik di Desa Karyawangi dengan pelayanan yang mengutamakan kenyamanan dan kepuasan pengunjung</p>
        </div>
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-20 text-center">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="p-4 rounded-lg bg-gray-200 animate-pulse w-16 h-16 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-1 animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6 animate-pulse"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-blue-100/100 my-20 rounded-2xl mx-4 lg:mx-0">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Mengapa Memilih Nyaba Wisata?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Pengalaman wisata terbaik di Desa Karyawangi dengan pelayanan yang mengutamakan kenyamanan dan kepuasan pengunjung</p>
        </div>
        <div className="max-w-6xl mx-auto px-4 text-center text-red-500">
          Error loading features: {error}
        </div>
      </section>
    );
  }

  // If no features, don't show the section
  if (features.length === 0) {
    return null;
  }

  const getIcon = (index: number) => {
    const icons = [Smile, Mountain, Flag, RefreshCw];
    const IconComponent = icons[index % icons.length];
    return <IconComponent size={40} className="mb-4" />;
  };

  // Calculate grid columns based on number of features
  let gridCols = "grid-cols-1";
  if (features.length === 2) {
    gridCols = "grid-cols-1 sm:grid-cols-2";
  } else if (features.length === 3) {
    gridCols = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
  } else if (features.length >= 4) {
    gridCols = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
  }

  return (
    <section className="py-16 bg-blue-100/100 my-20 rounded-2xl mx-4 lg:mx-0">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Mengapa Memilih Nyaba Wisata?</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">Pengalaman wisata terbaik di Desa Karyawangi dengan pelayanan yang mengutamakan kenyamanan dan kepuasan pengunjung</p>
      </div>
      <div className={`max-w-6xl mx-auto px-4 grid ${gridCols} gap-8 md:gap-20 text-center justify-items-center`}>
        {features.map((feature, index) => {
          const isActive = activeIndex === index;
          return (
            <div 
              key={feature.id} 
              onClick={() => setActiveIndex(index)}
              className="flex flex-col items-center group cursor-pointer w-full max-w-xs"
            >
              <div className={`p-4 rounded-lg transition-all duration-300 ${isActive ? "bg-blue-500 text-white" : "text-blue-500"} hover:scale-125 hover:-translate-y-2`}>
                {getIcon(index)}
              </div>
              <h3 className="text-lg font-semibold mt-4">{feature.title}</h3>
              <p className="text-gray-600 mt-2 text-sm">{feature.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default PilihKami;