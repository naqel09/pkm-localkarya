"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

// Data pertanyaan & jawaban
const faqs = [
    {
        question: "Jenis paket wisata apa saja yang ditawarkan Nyaba Wisata?",
        answer: "Nyaba Wisata menawarkan berbagai paket wisata di Desa Karyawangi, termasuk wisata keluarga, wisata budaya, wisata alam, dan paket khusus sesuai kebutuhan. Tim kami akan membantu Anda merancang itinerary yang sesuai dengan minat dan preferensi keluarga.",
    },
    {
        question: "Bagaimana cara memesan wisata dengan Nyaba Wisata?",
        answer: "Pemesanan sangat mudah! Anda cukup mengklik tombol 'Pesan' pada paket wisata yang diminati, kemudian Anda akan diarahkan ke WhatsApp kami untuk konsultasi langsung dengan tim customer service. Kami akan membantu mengatur detail perjalanan sesuai kebutuhan Anda.",
    },
    {
        question: "Bagaimana sistem pembayaran dan konfirmasi pesanan?",
        answer: "Setelah Anda menghubungi kami melalui WhatsApp, tim kami akan memberikan informasi lengkap mengenai harga, jadwal, dan metode pembayaran yang tersedia. Pembayaran dapat dilakukan melalui transfer bank atau metode lain yang akan dijelaskan saat konsultasi.",
    },
    {
        question: "Apakah bisa konsultasi dulu sebelum memutuskan paket wisata?",
        answer: "Tentu saja! Kami sangat mendorong calon pengunjung untuk berkonsultasi terlebih dahulu melalui WhatsApp. Tim kami akan dengan senang hati menjelaskan detail setiap paket, memberikan rekomendasi sesuai kebutuhan, dan menjawab semua pertanyaan Anda sebelum Anda memutuskan.",
    },
];

export default function KebutuhanClient() {
    // ✅ Langsung menggunakan useState di dalam komponen (tanpa hook terpisah)
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const toggleIndex = (index: number) => {
        setActiveIndex((prev) => (prev === index ? null : index));
    };

    return (
        <section className="bg-gray-300 py-20 px-6 w-full text-center mb-20">
            <h2 className="text-4xl font-bold uppercase mb-2">
                apa saja yang ada di wisata kami?
            </h2>
            <p className="text-white mb-10">
                Apa Yang Klien Kami Tanyakan Ketika Berkunjung Di Wisata Kami.
            </p>
            <div className="space-y-4 text-left max-w-4xl mx-auto">
                {faqs.map((faq, index) => (
                    <div
                        key={index}
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
