"use client";
import React, {useState} from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";

function NavbarLink() {
    const [open, setOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarTourOpen, setSidebarTourOpen] = useState(false); // <- for sidebar dropdown
    return (
        <>
            {/* Desktop Navigation */}
            <ul className="hidden md:flex space-x-8 text-sm font-medium">
                <li className="active:border-b-2 border-blue-800 hover:text-blue-400 active:text-blue-800">
                    <Link href="/">Destination</Link>
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
                                        <Link href="/Tours">
                                            Open Personal Tour
                                        </Link>
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
            {/* Desktop Sign In */}
            <Link
                href="/Signin"
                className="hidden md:block px-4 py-2 font-bold rounded-md border-black bg-blue-600 hover:bg-blue-700 transition"
            >
                Sign In
            </Link>

            {/* Hamburger for mobile/tablet */}
            <button
                onClick={() => setSidebarOpen(true)}
                className="block md:hidden"
            >
                <Menu size={28} />
            </button>

            {/* SIDEBAR dari KANAN */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 flex justify-end bg-black/30 bg-opacity-60">
                    <div className="fixed right-0 top-0 w-64 bg-white text-black p-6 space-y-4 h-full overflow-y-auto transition duration-300">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Menu</h2>
                            <button onClick={() => setSidebarOpen(false)}>
                                <X size={24} />
                            </button>
                        </div>

                        {/* Menu Items */}
                        <ul className="space-y-4 text-sm">
                            <li>
                                <Link
                                    href="/"
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    Destination
                                </Link>
                            </li>

                            {/* Tour with dropdown inside sidebar */}
                            <li>
                                <button
                                    onClick={() =>
                                        setSidebarTourOpen(!sidebarTourOpen)
                                    }
                                    className="flex justify-between w-full items-center"
                                >
                                    <span>Tour</span>
                                    <ChevronDown
                                        size={18}
                                        className={`transition-transform ${
                                            sidebarTourOpen ? "rotate-180" : ""
                                        }`}
                                    />
                                </button>
                                {sidebarTourOpen && (
                                    <ul className="pl-4 mt-2 space-y-2 text-sm text-gray-700">
                                        <li>
                                            <Link href="/Tours">
                                                Open Personal Tour
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="#">
                                                Private Personal Tour
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="#">Family Tour</Link>
                                        </li>
                                        <li>
                                            <Link href="#">
                                                Open Group Tour
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="#">
                                                Private Group Tour
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="#">Business Tour</Link>
                                        </li>
                                    </ul>
                                )}
                            </li>

                            <li>
                                <Link
                                    href="#"
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    Kontak
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/Signin"
                                    className="block w-full bg-blue-600 text-white text-center py-2 rounded"
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    Sign In
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* klik luar untuk tutup */}
                    <div
                        className="flex-1"
                        onClick={() => setSidebarOpen(false)}
                    />
                </div>
            )}
        </>
    );
}

export default NavbarLink;
