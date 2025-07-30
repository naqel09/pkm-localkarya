import {Metadata} from "next"
import React from "react";
import TourHeader from "../components/TourHeader";
import Bookings from "./components/Bookings";
import PaginationClient from "./components/pagination/PaginationClient";
import River from "@/app/assets/river.jpg"

export const metadata: Metadata ={
    title:"Tours",
    description:"menampilkan halaman Tours apa saja yang ada di dalamnya"
}

function page() {
    return (
        <>
        <TourHeader title="Tour Packages" halaman="Home" bagian="Tours" image={River}/>
        <Bookings/>
        <PaginationClient/>
        </>
    );
}

export default page;
