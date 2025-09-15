"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            const response = await fetch("/api/auth/logout", {
                method: "POST",
            });

            if (response.ok) {
                // Redirect ke halaman login
                router.push("/admin");
                router.refresh();
            }
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <button
            onClick={handleLogout}
            className="flex items-center gap-3 hover:bg-red-50 hover:text-red-800 py-2 rounded-md w-full px-3 text-red-600"
        >
            <LogOut size={20} /> Logout
        </button>
    );
}
