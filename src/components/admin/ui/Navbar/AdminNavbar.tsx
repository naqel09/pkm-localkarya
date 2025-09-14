"use client";
import React from "react";
import {Bell, MessageSquare, ChevronDown} from "lucide-react";
import {LuSearch} from "react-icons/lu";
import Image from "next/image";

const AdminNavbar = () => {
    return (
        <nav className="h-15 bg-green-800 text-white px-6 flex items-center justify-between shadow-md">
            <div className="text-lg font-semibold flex w-xl justify-between">
                Nyaba Karyawangi
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
                <span className="text-sm">Admin</span>
                <ChevronDown size={18} />
            </div>
        </nav>
    );
};

export default AdminNavbar;
