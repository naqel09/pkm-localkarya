"use client";
import React from "react";
import ButtonDestinasi from "./ButtonDestinasi";




function PopularDestinasi() {
    return (
        <section className="py-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold uppercase">
                Popular Destinations
            </h2>
            <p className="text-gray-600 mt-2 max-w-xl mx-auto">
                Explore our top destinations right from our beloved clients’
                reviews.
            </p>
            <ButtonDestinasi/>
        </section>
    );
}

export default PopularDestinasi;
