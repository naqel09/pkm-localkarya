"use client";
import React from "react";
import {Bell, MessageSquare, ChevronDown} from "lucide-react";
import {LuSearch} from "react-icons/lu";
import Image from "next/image";

const AdminNavbar = () => {
    return (
        <nav className="h-15 bg-green-800 text-white px-6 flex items-center justify-between shadow-md">
            <div className="text-lg font-semibold flex w-xl justify-between">
                ini adalah logo
                <div className="flex items-center border-white border-b-2">
                    <LuSearch />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="px-3 py-1 rounded-md text-white focus:outline-none"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2">
                <MessageSquare size={20} />
                <Bell size={20} />
                <Image
                    src="/images/testimonials.jpg" // ganti dengan path gambar profil kamu
                    alt="User"
                    width={32}
                    height={32}
                    className="rounded-full"
                />
                <span className="text-sm">Xeriya Ponald</span>
                <ChevronDown size={18} />
            </div>
        </nav>
    );
};

export default AdminNavbar;
