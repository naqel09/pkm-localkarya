"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

function Navbar() {
    // Langsung gunakan state tanpa hook eksternal
    const [open, setOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarTourOpen, setSidebarTourOpen] = useState(false);

    const toggleSidebar = () => setSidebarOpen((prev) => !prev);
    const closeSidebar = () => setSidebarOpen(false);
    const toggleTourDropdown = () => setSidebarTourOpen((prev) => !prev);
    const toggleOpen = () => setOpen((prev) => !prev);

    return (
        <nav className="flex items-center justify-between px-6 py-4 absolute bg-transparent text-white top-0 left-0 w-full z-20">
            <div className="text-2xl font-bold">
                <Link href="/">
                    <Image
                        src="/images/mclaren.svg"
                        alt="Logo"
                        width={40}
                        height={40}
                    />
                </Link>
            </div>

            {/* Desktop Navigation */}
            <ul className="hidden md:flex space-x-8 text-sm font-medium">
                <li className="hover:text-blue-400">
                    <Link href="/">Homepage</Link>
                </li>
                <li className="hover:text-blue-400">
                    <Link href="/Destination" onClick={toggleOpen}>
                        Destinasi
                    </Link>
                </li>
                <li className="hover:text-blue-400">
                    <Link href="/Tours">Paket Wisata</Link>
                </li>
                <li className="hover:text-blue-400">
                    <Link href="/Hotel">Hotel</Link>
                </li>
                <li className="hover:text-blue-400">
                    <Link href="/Restaurant">Restaurant</Link>
                </li>
                <li className="hover:text-blue-400">
                    <Link href="/About">About</Link>
                </li>
                <li className="hover:text-blue-400">
                    <Link href="/Blog">Blog</Link>
                </li>
            </ul>
            <div className="hidden md:block"></div>

            {/* Hamburger Icon */}
            <button onClick={toggleSidebar} className="block md:hidden">
                <Menu size={28} />
            </button>

            {/* Sidebar */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-50 flex justify-end bg-black/30 bg-opacity-60">
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
                                    Homepage
                                </Link>
                            </li>
                            <li>
                                <Link href="/Destination" onClick={closeSidebar}>
                                    Destinasi
                                </Link>
                            </li>
                            <li>
                                <Link href="/Tours" onClick={closeSidebar}>
                                    Paket Wisata
                                </Link>
                            </li>
                            <li>
                                <Link href="/Restaurant" onClick={closeSidebar}>
                                    Restaurant
                                </Link>
                            </li>
                            <li>
                                <Link href="/Hotel" onClick={closeSidebar}>
                                    Hotel
                                </Link>
                            </li>
                            <li>
                                <Link href="/About" onClick={closeSidebar}>
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link href="/Blog" onClick={closeSidebar}>
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/Login"
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
