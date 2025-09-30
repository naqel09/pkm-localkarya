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
        <nav className="flex items-center justify-between px-4 md:px-6 py-4 absolute bg-transparent text-white top-0 left-0 w-full z-20">
            <div className="text-2xl font-bold">
                
            </div>

            {/* Desktop Navigation */}
            <ul className="hidden md:flex space-x-8 text-sm font-medium">
                <li className="hover:text-blue-400">
                    <Link href="/">Beranda</Link>
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
                    <Link href="/Hotel">Penginapan</Link>
                </li>
                <li className="hover:text-blue-400">
                    <Link href="/Restaurant">Kuliner</Link>
                </li>
                <li className="hover:text-blue-400">
                    <Link href="/UMKM">UMKM</Link>
                </li>
                
                <li className="hover:text-blue-400">
                    <Link href="/Blog">Artikel</Link>
                </li>
                <li className="hover:text-blue-400">
                    <Link href="/Vlog">Vlog</Link>
                </li>
                <li className="hover:text-blue-400">
                    <Link href="/About">Tentang Kami</Link>
                </li>
            </ul>
            <div className="hidden md:block"></div>

            {/* Hamburger Icon */}
            <button onClick={toggleSidebar} className="block md:hidden p-2">
                <Menu size={24} />
            </button>

            {/* Sidebar */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-50 flex justify-end bg-black/30 bg-opacity-60">
                    <div className="fixed right-0 top-0 w-72 md:w-80 bg-white text-black p-6 space-y-4 h-full overflow-y-auto shadow-2xl">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Menu</h2>
                            <button onClick={closeSidebar}>
                                <X size={24} />
                            </button>
                        </div>

                        <ul className="space-y-4 text-sm">
                            <li>
                                <Link href="/" onClick={closeSidebar}>
                                    Beranda
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
                                    Kuliner
                                </Link>
                            </li>
                            <li>
                                <Link href="/UMKM" onClick={closeSidebar}>
                                    UMKM
                                </Link>
                            </li>
                            <li>
                                <Link href="/Hotel" onClick={closeSidebar}>
                                    Penginapan
                                </Link>
                            </li>
                            <li>
                                <Link href="/Blog" onClick={closeSidebar}>
                                    Artikel
                                </Link>
                            </li>
                            <li>
                                <Link href="/Vlog" onClick={closeSidebar}>
                                    Vlog
                                </Link>
                            </li>
                            <li>
                                <Link href="/About" onClick={closeSidebar}>
                                    Tentang Kami
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
