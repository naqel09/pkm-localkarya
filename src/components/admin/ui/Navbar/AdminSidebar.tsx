"use client";
import React from "react";
import Link from "next/link";
import LogoutButton from "../../LogoutButton";
import {
    Home,
    MapPin,
    Utensils,
    Bed,
    FileText,
    Tag,
    ClipboardList,
    BookOpen,
    RefreshCcw,
    LogOut,
    Settings,
    Map,
} from "lucide-react";

const AdminSidebar = () => {
    return (
        <aside className="xl:w-64 min-h-screen bg-[#1f2937] text-white py-6 px-1 flex flex-col justify-between">
            <div className="space-y-6">
                <nav className="space-y-3">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-3 hover:text-black hover:bg-white py-2 rounded-md w-full px-3"
                    >
                        <Home size={20} /> Dashboard
                    </Link>
                    <Link
                        href="/dashboard/Destinasi"
                        className="flex items-center gap-3 hover:text-black hover:bg-white py-2 rounded-md w-full px-3"
                    >
                        <MapPin size={20} /> Tempat Wisata
                    </Link>
                    <Link
                        href="/dashboard/PaketWisata"
                        className="flex items-center gap-3 hover:text-black hover:bg-white py-2 rounded-md w-full px-3"
                    >
                        <Map size={20} /> Paket Wisata
                    </Link>
                    <Link
                        href="/dashboard/Restaurant"
                        className="flex items-center gap-3 hover:text-black hover:bg-white py-2 rounded-md w-full px-3"
                    >
                        <Utensils size={20} /> Tempat Makan
                    </Link>
                    <Link
                        href="/dashboard/Hotel"
                        className="flex items-center gap-3 hover:text-black hover:bg-white py-2 rounded-md w-full px-3"
                    >
                        <Bed size={20} /> Penginapan
                    </Link>
                    <Link
                        href="/dashboard/Blog"
                        className="flex items-center gap-3 hover:text-black hover:bg-white py-2 rounded-md w-full px-3"
                    >
                        <FileText size={20} /> Artikel
                    </Link>

                    <div className="mt-6 text-sm text-gray-400">Settings</div>
                    <LogoutButton />
                </nav>
            </div>
        </aside>
    );
};

export default AdminSidebar;
