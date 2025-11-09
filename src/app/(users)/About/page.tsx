"use client";

import React, { useState, useEffect } from "react";
import TourHeader from "../../../components/TourHeader";
import PilihKami from "../../../components/users/pages/Home/PilihKami";
import { PiAirplaneTiltFill } from "react-icons/pi";

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

const AboutPage = () => {
  const [data, setData] = useState<AboutPageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutPage = async () => {
      try {
        const res = await fetch("/api/about-page");
        if (!res.ok) throw new Error("Failed to fetch about page data");
        const response = await res.json();
        setData(response.data);
      } catch (error) {
        console.error("Error fetching about page:", error);
        // Fallback to default data if API fails
        setData({
          id: 1,
          title: "Tentang Kami",
          description: "Desa Karyawangi terletak di kaki pegunungan Parongpong, Bandung Barat, yang menawarkan keindahan alam menawan dan kearifan budaya Sunda yang masih terjaga. \"Nyaba\" dalam bahasa Sunda berarti bermain atau berekreasi, yang menjadi filosofi utama kami dalam menghadirkan pengalaman wisata yang menyenangkan dan berkesan.\n\nKami percaya bahwa setiap perjalanan harus memberikan kegembiraan, pembelajaran, dan koneksi yang mendalam dengan alam dan budaya lokal. Tim kami yang terdiri dari warga desa berpengalaman siap memandu Anda menjelajahi setiap sudut keindahan Karyawangi dengan hati yang tulus.",
          address: "Desa Karyawangi, Kecamatan Parongpong\nKabupaten Bandung Barat, Jawa Barat",
          phone: "+62 812-3456-7890",
          email: "info.timnyaba@gmail.com",
          whatsappNumber: "6281234567890",
          googleMapsUrl: "https://maps.app.goo.gl/9XopyAHGHQvParsC6",
          instagramUrl: null,
          facebookUrl: null,
          tiktokUrl: null,
          backgroundImageUrl: "/bgImage.jpg",
          logoUrl: null,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAboutPage();
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If no data or not active, show a simple message
  if (!data || !data.isActive) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Halaman tidak tersedia</h1>
          <p className="text-gray-600 mt-2">Halaman tentang kami sedang dalam perbaikan.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <TourHeader
        title={data.title}
        halaman="Home"
        bagian="Tentang"
        image={data.backgroundImageUrl || "/bgImage.jpg"}
        logo={data.logoUrl}
      />
      <div className="py-16 px-4 text-center">
        <div className="flex justify-center mb-6">
          <span className="text-3xl">
            <PiAirplaneTiltFill />
          </span>
        </div>
        <p className="max-w-3xl mx-auto text-gray-600 leading-relaxed mb-16 whitespace-pre-line">
          {data.description}
        </p>
        
        {/* Tim Nyaba Contact Information */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-green-800 mb-6 text-center">
              🌿 Tim Nyaba - Informasi Kontak
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Contact Details */}
              <div className="space-y-6">
                {/* Address */}
                <div className="flex items-start space-x-3">
                  <div className="text-green-600 text-xl mt-1">📍</div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Alamat Tim Nyaba</h4>
                    <p className="text-gray-600 whitespace-pre-line">
                      {data.address}
                    </p>
                  </div>
                </div>
                
                {/* Phone */}
                <div className="flex items-center space-x-3">
                  <div className="text-green-600 text-xl">📞</div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Telepon</h4>
                    <p className="text-gray-600">{data.phone}</p>
                  </div>
                </div>
                
                {/* Email */}
                <div className="flex items-center space-x-3">
                  <div className="text-green-600 text-xl">📧</div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Email</h4>
                    <p className="text-gray-600">{data.email}</p>
                  </div>
                </div>
                
                {/* WhatsApp Button */}
                <div className="pt-4">
                  <a 
                    href={`https://wa.me/${data.whatsappNumber}?text=Halo%20Tim%20Nyaba!%20Saya%20tertarik%20dengan%20wisata%20di%20Desa%20Karyawangi`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    <span className="mr-2">📱</span>
                    Hubungi via WhatsApp
                  </a>
                </div>
                
                {/* Social Media Links */}
                {(data.instagramUrl || data.facebookUrl || data.tiktokUrl) && (
                  <div className="pt-4">
                    <h4 className="font-semibold text-gray-800 mb-3">Ikuti Kami di Media Sosial</h4>
                    <div className="flex space-x-4 justify-center">
                      {data.instagramUrl && (
                        <a 
                          href={data.instagramUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-pink-500 hover:text-pink-600 text-2xl transition-colors duration-300"
                          title="Instagram"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                          </svg>
                        </a>
                      )}
                      {data.facebookUrl && (
                        <a 
                          href={data.facebookUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 text-2xl transition-colors duration-300"
                          title="Facebook"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                          </svg>
                        </a>
                      )}
                      {data.tiktokUrl && (
                        <a 
                          href={data.tiktokUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-black hover:text-gray-800 text-2xl transition-colors duration-300"
                          title="TikTok"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.05z"/>
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <span className="mr-2">🗺️</span>
                  Lokasi Kami
                </h4>
                <div className="rounded-lg overflow-hidden shadow-md h-64 md:h-[300px]">
                  <iframe 
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(data.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                    width="100%" 
                    height="100%" 
                    style={{border: 0}} 
                    allowFullScreen 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Lokasi Tim Nyaba - Desa Karyawangi"
                  ></iframe>
                </div>
                <div className="mt-3 text-center">
                  <a 
                    href={data.googleMapsUrl}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-700 font-medium transition-colors duration-300"
                  >
                    🔗 Buka di Google Maps
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <PilihKami />
      </div>
    </>
  );
};

export default AboutPage;