"use client";
import React from "react";
import Link from "next/link";
import {
    Home,
    MapPin,
    Utensils,
    Bed,
    Users,
    FileText,
    Tag,
    ClipboardList,
    BookOpen,
    RefreshCcw,
    LogOut,
    Settings,
} from "lucide-react";

const AdminSidebar = () => {
    return (
        <aside className="w-64 min-h-screen bg-[#1f2937] text-white py-6 px-1 flex flex-col justify-between">
            <div className="space-y-6">
                <nav className="space-y-3">
                    <Link
                        href="#"
                        className="flex items-center gap-3 hover:text-black hover:bg-white py-2 rounded-md w-full px-3"
                    >
                        <Home size={20} /> Dashboard
                    </Link>
                    <Link
                        href="#"
                        className="flex items-center gap-3 hover:text-black hover:bg-white py-2 rounded-md w-full px-3"
                    >
                        <MapPin size={20} /> Tempat Wisata
                    </Link>
                    <Link
                        href="#"
                        className="flex items-center gap-3 hover:text-black hover:bg-white py-2 rounded-md w-full px-3"
                    >
                        <Utensils size={20} /> Tempat Makan
                    </Link>
                    <Link
                        href="#"
                        className="flex items-center gap-3 hover:text-black hover:bg-white py-2 rounded-md w-full px-3"
                    >
                        <Bed size={20} /> Penginapan
                    </Link>
                    <Link
                        href="#"
                        className="flex items-center gap-3 hover:text-black hover:bg-white py-2 rounded-md w-full px-3"
                    >
                        <Users size={20} /> Customers
                    </Link>
                    <Link
                        href="#"
                        className="flex items-center gap-3 hover:text-black hover:bg-white py-2 rounded-md w-full px-3"
                    >
                        <FileText size={20} /> Reports
                    </Link>
                    <Link
                        href="#"
                        className="flex items-center gap-3 hover:text-black hover:bg-white py-2 rounded-md w-full px-3"
                    >
                        <Tag size={20} /> Coupons
                    </Link>
                    <Link
                        href="#"
                        className="flex items-center gap-3 hover:text-black hover:bg-white py-2 rounded-md w-full px-3"
                    >
                        <ClipboardList size={20} /> Applications
                    </Link>

                    <div className="mt-6 text-sm text-gray-400">
                        Other Information
                    </div>
                    <Link
                        href="#"
                        className="flex items-center gap-3 hover:text-black hover:bg-white py-2 rounded-md w-full px-3"
                    >
                        <BookOpen size={20} /> Knowledge Base
                    </Link>
                    <Link
                        href="#"
                        className="flex items-center gap-3 hover:text-black hover:bg-white py-2 rounded-md w-full px-3"
                    >
                        <RefreshCcw size={20} /> Product Updates
                    </Link>

                    <div className="mt-6 text-sm text-gray-400">Settings</div>
                    <Link
                        href="#"
                        className="flex items-center gap-3 hover:text-black hover:bg-white py-2 rounded-md w-full px-3"
                    >
                        <LogOut size={20} /> Logout
                    </Link>
                    <Link
                        href="#"
                        className="flex items-center gap-3 hover:text-black hover:bg-white py-2 rounded-md w-full px-3"
                    >
                        <Settings size={20} /> Global Settings
                    </Link>
                </nav>
            </div>
        </aside>
    );
};

export default AdminSidebar;
