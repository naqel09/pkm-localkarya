import React from "react";
import Image from "next/image";
import Testimonial from "@/app/assets/testimonials.jpg";
import {ChevronUpIcon, ChevronDownIcon} from "@heroicons/react/24/solid";

function Testimonials() {
    return (
        <section className="bg-white py-16 px-6 md:px-20">
            <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">
                {/* Left Side */}
                <div className="flex flex-col justify-between">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            TESTIMONIALS
                        </h2>
                        <p className="text-gray-500">
                            What our clients love about us.
                        </p>
                    </div>
                    <div>
                        <ChevronUpIcon className="w-7 h-7 text-gray-300" />
                        <ChevronDownIcon className="w-7 h-7 text-blue-500" />
                    </div>
                </div>

                {/* Right Side */}
                <div className="bg-white shadow-xl rounded-xl p-6 col-span-2">
                    <p className="text-gray-700 mb-6 text-justify">
                        I recently booked a trip to Italy with Vacasay, and I
                        couldn't be happier with the experience. From the
                        initial consultation to the post-trip follow-up,
                        everything was handled with the utmost professionalism
                        and care. Our itinerary was perfectly tailored to our
                        interests, and we had an amazing time exploring the
                        country. I would highly recommend Vacasay to anyone
                        looking for a stress-free and unforgettable travel
                        experience.
                    </p>
                    <div className="flex items-center gap-4">
                        <Image
                            src={Testimonial} // Ganti sesuai lokasi gambarmu
                            alt="Sarah Johnson"
                            width={40}
                            className="rounded-"
                        />
                        <div>
                            <p className="font-semibold text-gray-900">
                                Sarah Johnson
                            </p>
                            <p className="text-sm text-gray-500">
                                Client from United States of America
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Testimonials;
