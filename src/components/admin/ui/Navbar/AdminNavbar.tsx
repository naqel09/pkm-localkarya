"use client";
import React, { useState, useEffect } from "react";
import { Bell, MessageSquare, ChevronDown } from "lucide-react";
import { LuSearch } from "react-icons/lu";
import Image from "next/image";
import { useAuth } from "@/components/auth/AuthProvider";

// Define the AboutPage interface
interface AboutPageData {
  id: number;
  title: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  whatsappNumber: string;
  googleMapsUrl: string;
  backgroundImageUrl: string | null;
  logoUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  instagramUrl?: string | null;
  facebookUrl?: string | null;
  tiktokUrl?: string | null;
}

const AdminNavbar = () => {
  const [aboutData, setAboutData] = useState<AboutPageData | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const res = await fetch("/api/about-page");
        if (res.ok) {
          const response = await res.json();
          setAboutData(response.data);
        }
      } catch (error) {
        console.error("Error fetching about page data:", error);
      }
    };

    fetchAboutData();
  }, []);

  return (
    <nav className="h-15 bg-green-800 text-white px-6 flex items-center justify-between shadow-md">
      <div className="text-lg font-semibold flex items-center gap-3">
        {aboutData?.logoUrl ? (
          <>
          <Image
            src={aboutData.logoUrl}
            alt="Logo"
            width={40}
            height={20}
            className="object-contain"
          />
          <span>Wisata Desa Karyawangi</span></>
        ) : (
          <span>Wisata Desa Karyawangi</span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm">Logged in as: {user?.username || "Admin"}</span>
      </div>
    </nav>
  );
};

export default AdminNavbar;