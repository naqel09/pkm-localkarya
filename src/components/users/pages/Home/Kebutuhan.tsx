"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

// Define the FAQ interface
interface Faq {
  id: number;
  question: string;
  answer: string;
  orderIndex: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function KebutuhanClient() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch FAQs from API
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await fetch("/api/faqs");
        if (!res.ok) throw new Error("Failed to fetch FAQs");
        const response = await res.json();
        setFaqs(response.data || []);
      } catch (error) {
        console.error("Error fetching FAQs:", error);
        // Fallback to default FAQs if API fails
        setFaqs([
          {
            id: 1,
            question: "Jenis paket wisata apa saja yang ditawarkan Nyaba Wisata?",
            answer: "Nyaba Wisata menawarkan berbagai paket wisata di Desa Karyawangi, termasuk wisata keluarga, wisata budaya, wisata alam, dan paket khusus sesuai kebutuhan. Tim kami akan membantu Anda merancang itinerary yang sesuai dengan minat dan preferensi keluarga.",
            orderIndex: 0,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: 2,
            question: "Bagaimana cara memesan wisata dengan Nyaba Wisata?",
            answer: "Pemesanan sangat mudah! Anda cukup mengklik tombol 'Pesan' pada paket wisata yang diminati, kemudian Anda akan diarahkan ke WhatsApp kami untuk konsultasi langsung dengan tim customer service. Kami akan membantu mengatur detail perjalanan sesuai kebutuhan Anda.",
            orderIndex: 1,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: 3,
            question: "Bagaimana sistem pembayaran dan konfirmasi pesanan?",
            answer: "Setelah Anda menghubungi kami melalui WhatsApp, tim kami akan memberikan informasi lengkap mengenai harga, jadwal, dan metode pembayaran yang tersedia. Pembayaran dapat dilakukan melalui transfer bank atau metode lain yang akan dijelaskan saat konsultasi.",
            orderIndex: 2,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: 4,
            question: "Apakah bisa konsultasi dulu sebelum memutuskan paket wisata?",
            answer: "Tentu saja! Kami sangat mendorong calon pengunjung untuk berkonsultasi terlebih dahulu melalui WhatsApp. Tim kami akan dengan senang hati menjelaskan detail setiap paket, memberikan rekomendasi sesuai kebutuhan, dan menjawab semua pertanyaan Anda sebelum Anda memutuskan.",
            orderIndex: 3,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  const toggleIndex = (index: number) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  if (loading) {
    return (
      <section className="bg-gray-300 py-20 px-6 w-full text-center mb-20">
        <h2 className="text-4xl font-bold uppercase mb-2">
          apa saja yang ada di wisata kami?
        </h2>
        <p className="mb-10">
          Apa Yang Klien Kami Tanyakan Ketika Berkunjung Di Wisata Kami.
        </p>
        <div className="space-y-4 text-left max-w-4xl mx-auto">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="bg-white shadow-md rounded-xl transition-all duration-300 animate-pulse"
            >
              <div className="w-full p-5">
                <div className="h-6 bg-gray-200 rounded"></div>
              </div>
              <div className="px-5 pb-5">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-300 py-20 px-6 w-full text-center mb-20">
      <h2 className="text-4xl font-bold uppercase mb-2">
        apa saja yang ada di wisata kami?
      </h2>
      <p className="mb-10">
        Apa Yang Klien Kami Tanyakan Ketika Berkunjung Di Wisata Kami.
      </p>
      <div className="space-y-4 text-left max-w-4xl mx-auto">
        {faqs.map((faq, index) => (
          <div
            key={faq.id}
            className="bg-white shadow-md rounded-xl transition-all duration-300"
          >
            <button
              onClick={() => toggleIndex(index)}
              className="w-full flex justify-between items-center p-5 text-left text-lg font-semibold text-gray-800 focus:outline-none cursor-pointer"
            >
              <span>{faq.question}</span>
              {activeIndex === index ? (
                <ChevronUp className="text-white bg-blue-500 rounded-full" />
              ) : (
                <ChevronDown className="text-blue-500" />
              )}
            </button>
            {activeIndex === index && (
              <div className="px-5 pb-5 text-sm text-gray-600 transition-all duration-300">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}