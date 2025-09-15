"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

// Data pertanyaan & jawaban
const faqs = [
    {
        question: "What type of travel packages does Vacasky offer?",
        answer: "Vacasky offers a wide range of travel packages to destinations around the world, including customized tours, group tours, luxury travel, adventure travel, and more. Our travel specialists work with you to create an itinerary that meets your specific needs and preferences.",
    },
    {
        question: "How do I book a trip with Vacasky?",
        answer: "You can book a trip by visiting our website and filling out the booking form or by contacting one of our travel consultants directly.",
    },
    {
        question: "What is the payment process for Vacasky?",
        answer: "Vacasky accepts various payment methods including credit/debit cards, bank transfers, and online payment platforms. Full details will be shared during the booking process.",
    },
    {
        question: "How to cancel my booking in Vacasky?",
        answer: "To cancel your booking, please contact our customer service. Cancellation policies may apply depending on the timing and type of booking.",
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
