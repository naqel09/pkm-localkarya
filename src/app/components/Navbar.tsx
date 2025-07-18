"use client";
import React, {useState} from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/app/assets/mclaren.svg"

function Navbar() {
    const [open, setOpen] = useState(false);
    return (
        <nav className="flex items-center justify-between px-8 py-4 absolute bg-transparent text-white top-0 left-0 w-full z-20">
            <div className="text-2xl font-bold">
                <Link href="/Destinasi">
                    <Image
                        src={logo}
                        alt="Logo"
                        className="w-10 h-10"
                        />
                </Link>
            </div>
            <ul className="hidden md:flex space-x-8 text-sm font-medium">
                <li className="active:border-b-2 border-blue-800 hover:text-blue-400 active:text-blue-800">
                    <Link href="/Destinasi">Destination</Link>
                </li>
                <li className="active:border-b-2 border-blue-800 hover:text-blue-400 active:text-blue-800">
                    <Link href="#" onClick={() => setOpen(!open)}>
                        Tour
                    </Link>
                    {open && (
                        <div className="absolute top-15 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-md p-6 w-4xl grid grid-cols-5 gap-4">
                            <div>
                                <h3 className="font-semibold text-black text-lg mb-2">
                                    Personal Tours
                                </h3>
                                <ul className="space-y-1 text-sm text-black font-light">
                                    <li>
                                        <Link href="#">Open Personal Tour</Link>
                                    </li>
                                    <li>
                                        <Link href="#">
                                            Private Personal Tour
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="#">Family Tour</Link>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold text-black text-lg mb-2">
                                    Group Tours
                                </h3>
                                <ul className="space-y-1 text-sm text-black font-light">
                                    <li>
                                        <Link href="#">Open Group Tour</Link>
                                    </li>
                                    <li>
                                        <Link href="#">Private Group Tour</Link>
                                    </li>
                                    <li>
                                        <Link href="#">Business Tour</Link>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold text-black text-lg mb-2">
                                    Recommendation
                                </h3>
                                <ul className="space-y-1 text-sm text-black font-light">
                                    <li>
                                        <Link href="#">Best Seller Tours</Link>
                                    </li>
                                    <li>
                                        <Link href="#">Tour Testimonial</Link>
                                    </li>
                                    <li>
                                        <Link href="#">Tour Destinations</Link>
                                    </li>
                                </ul>
                            </div>
                            <div className="">
                                <h3 className="font-semibold text-black text-lg mb-2">
                                    Preparations
                                </h3>
                                <ul className="space-y-1 text-sm text-black font-light">
                                    <li>
                                        <Link href="#">Tour Rules</Link>
                                    </li>
                                    <li>
                                        <Link href="#">Airport Departure</Link>
                                    </li>
                                    <li>
                                        <Link href="#">Tour Booking Form</Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="#"
                                            className="flex justify-between"
                                        >
                                            <span>Tour Itinerary</span>
                                            <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded">
                                                New
                                            </span>
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold text-black text-lg mb-2">
                                    About Tours
                                </h3>
                                <ul className="space-y-1 text-sm text-black font-light">
                                    <li>
                                        <Link href="#">Tours Overview</Link>
                                    </li>
                                    <li>
                                        <Link href="#">FAQ</Link>
                                    </li>
                                    <li>
                                        <Link href="#">Terms & Condition</Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="#"
                                            className="flex justify-between"
                                        >
                                            <span>Promo Codes</span>
                                            <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded">
                                                New
                                            </span>
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )}
                </li>
                <li className="active:border-b-2 border-blue-800 hover:text-blue-400 active:text-blue-800">
                    <Link href="#">About</Link>
                </li>
                <li className="active:border-b-2 border-blue-800 hover:text-blue-400 active:text-blue-800">
                    <Link href="#">Blog</Link>
                </li>
                <li className="active:border-b-2 border-blue-800 hover:text-blue-400 active:text-blue-800">
                    <Link href="#">Kontak</Link>
                </li>
            </ul>
            <Link
                href="/Signin"
                className="px-4 py-2 font-bold rounded-md border-black bg-blue-600 hover:bg-blue-700 transition"
            >
                Sign In
            </Link>
        </nav>
    );
}

export default Navbar;
