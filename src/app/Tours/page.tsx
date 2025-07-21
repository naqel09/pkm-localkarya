'use client'
import React from "react";
import Navbar from "../components/Navbar";
import TourHeader from "./components/TourHeader";
import Footer from "../components/Footer";

function page() {
    return (
        <div>
            <Navbar/>
            <TourHeader />
            <h1>ini adalah halaman booking</h1>
            <Footer/>
        </div>
    );
}

export default page;
