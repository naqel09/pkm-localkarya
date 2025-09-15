"use client";

import React from "react";
import Image from "next/image";
import { Star } from "lucide-react";

const ratings = [
  { label: "Cleanliness", value: 4 },
  { label: "Service", value: 5 },
  { label: "Facility", value: 4 },
  { label: "Meal", value: 4 },
  { label: "Location", value: 5 },
  { label: "Comfort", value: 5 },
];

const testimonials = [
  {
    name: "Maria Garcia",
    country: "Client from Spain",
    text: "We had a wonderful stay at the Grand Élysée Hotel. The staff was extremely friendly and helpful, and the room was spacious, clean, and comfortable. The hotel's location is perfect, with many popular attractions and restaurants within walking distance. We also enjoyed the hotel's restaurant and spa, which were both excellent. Overall, it was a truly luxurious and memorable experience.",
    image: "/testimonials.jpg",
  },
  {
    name: "Jonathan Smith",
    country: "Client from United States",
    text: "My wife and I stayed at the Grand Élysée Hotel for our honeymoon, and we couldn’t have been happier with our experience. The hotel’s service and facilities were exceptional, and the staff went above and beyond to make our stay special. We especially enjoyed the spa and fitness center, which were both top-notch. The location of the hotel is also excellent, with many popular attractions nearby. We highly recommend!",
    image: "/testimonials.jpg",
  },
];

const Reviews = () => {
  return (
    <section className="max-w-8xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold mb-6">REVIEWS</h2>

      <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-6 mb-12">
        {/* Rating Score */}
        <div className="bg-white p-6 text-center shadow-sm">
          <p className="text-4xl font-bold">4.5</p>
          <p className="text-sm text-gray-500">(1,500+)</p>
        </div>

        {/* Detail Ratings */}
        <div className="grid grid-cols-2 gap-4">
          {ratings.map((rating, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <span className="text-sm">{rating.label}</span>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={`${
                      i < rating.value ? "text-blue-400" : "text-gray-300"
                    }`}
                    fill={i < rating.value ? "#00FFFF" : "none"}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="space-y-8">
        {testimonials.map((t, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-xl shadow-md border space-y-4"
          >
            <h3 className="text-lg font-semibold">
              {idx === 0
                ? "A Luxurious and Memorable Stay"
                : "Exceptional Service & Facilities"}
            </h3>
            <p className="text-sm text-gray-700">{t.text}</p>
            <div className="flex items-center gap-4 pt-2">
              <Image
                src={t.image}
                alt={t.name}
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
              <div>
                <p className="font-medium text-sm">{t.name}</p>
                <p className="text-xs text-gray-500">{t.country}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Reviews;
