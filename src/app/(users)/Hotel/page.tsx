import React from "react";
import TourHeader from "@/components/TourHeader";
import PopularHotels from "@/components/users/pages/Hotel/PopularHotels";

const page = () => {
    return (
        <>
            <TourHeader
                title="Penginapan"
                halaman="Villa"
                bagian="Hotel"
                image="/hotel1.webp"
            />
            <PopularHotels />
        </>
    );
};

export default page;
