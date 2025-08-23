import React from "react";
import TourHeader from "@/components/TourHeader";
import PopularHotels from "@/components/users/pages/Hotel/PopularHotels";

const page = () => {
    return (
        <>
            <TourHeader
                title="Penginapan"
                halaman="Beranda"
                bagian="Hotel"
                image="/bedroom.jpg"
            />
            <PopularHotels />
        </>
    );
};

export default page;
