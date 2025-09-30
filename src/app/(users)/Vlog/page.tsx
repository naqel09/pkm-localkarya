import VlogList from "@/components/users/pages/vlog/VlogList";
import TourHeader from "@/components/TourHeader";
import React from "react";

const page = () => {
    return (
        <>
            <TourHeader
                title="VLOG WISATA"
                halaman="Video"
                bagian="Petualangan"
                image="/images/artikel/headerblog.jpg"
            />
            <VlogList />
        </>
    );
};

export default page;