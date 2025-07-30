"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDown } from "lucide-react";
import { useNavbar } from "@/app/hooks/useNavbar";

function Navbar() {
    const {
        open,
        sidebarOpen,
        sidebarTourOpen,
        toggleSidebar,
        toggleTourDropdown,
        toggleOpen,
        closeSidebar,
    } = useNavbar();

    return (
        <nav className="flex items-center justify-between px-6 py-4 absolute bg-transparent text-white top-0 left-0 w-full z-20">
            <div className="text-2xl font-bold">
                <Link href="/">
                    <Image src="./mclaren.svg" alt="Logo" width={10} height={10} />
                </Link>
            </div>

            {/* Desktop Navigation */}
            <ul className="hidden md:flex space-x-8 text-sm font-medium">
                <li className="hover:text-blue-400">
                    <Link href="/">Homepage</Link>
                </li>
                <li className="hover:text-blue-400">
                    <Link href="/Tours" onClick={toggleOpen}>
                        Destinasi
                    </Link>
                </li>
                <li className="hover:text-blue-400">
                    <Link href="#">Hotel</Link>
                </li>
                <li className="hover:text-blue-400">
                    <Link href="/Restaurant">Restaurant</Link>
                </li>
                <li className="hover:text-blue-400">
                    <Link href="/About">About</Link>
                </li>
                <li className="hover:text-blue-400">
                    <Link href="#">Blog</Link>
                </li>
            </ul>

            <Link
                href="/Signin"
                className="hidden md:block px-4 py-2 font-bold rounded-md bg-blue-600 hover:bg-blue-700 transition"
            >
                Sign In
            </Link>

            {/* Hamburger Icon */}
            <button onClick={toggleSidebar} className="block md:hidden">
                <Menu size={28} />
            </button>

            {/* Sidebar */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 flex justify-end bg-black/30 bg-opacity-60">
                    <div className="fixed right-0 top-0 w-64 bg-white text-black p-6 space-y-4 h-full overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Menu</h2>
                            <button onClick={closeSidebar}>
                                <X size={24} />
                            </button>
                        </div>

                        <ul className="space-y-4 text-sm">
                            <li>
                                <Link href="/" onClick={closeSidebar}>
                                    Destination
                                </Link>
                            </li>
                            <li>
                                <button
                                    onClick={toggleTourDropdown}
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
                                            <Link href="/Tours">Open Personal Tour</Link>
                                        </li>
                                        <li>
                                            <Link href="#">Private Personal Tour</Link>
                                        </li>
                                        <li>
                                            <Link href="#">Family Tour</Link>
                                        </li>
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
                                )}
                            </li>
                            <li>
                                <Link href="/Restaurant" onClick={closeSidebar}>Restaurant</Link>
                            </li>
                            <li>
                                <Link href="/hOtel" onClick={closeSidebar}>Hotel</Link>
                            </li>
                            <li>
                                <Link href="/About" onClick={closeSidebar}>About</Link>
                            </li>
                            <li>
                                <Link href="#" onClick={closeSidebar}>Blog</Link>
                            </li>
                            <li>
                                <Link
                                    href="/Signin"
                                    className="block w-full bg-blue-600 text-white text-center py-2 rounded"
                                    onClick={closeSidebar}
                                >
                                    Sign In
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="flex-1" onClick={closeSidebar} />
                </div>
            )}
        </nav>
    );
}

export default Navbar;
