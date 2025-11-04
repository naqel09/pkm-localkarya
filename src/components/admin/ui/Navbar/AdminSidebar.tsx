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
    Store,
    Youtube,
    Image,
    Heart,
    Star,
    HelpCircle,
    Mail,
} from "lucide-react";

const AdminSidebar = () => {
    // Define menu categories
    const menuCategories = [
        {
            title: "Main",
            items: [
                { href: "/dashboard", label: "Dashboard", icon: Home },
            ]
        },
        {
            title: "Content Management",
            items: [
                { href: "/dashboard/Destinasi", label: "Tempat Wisata", icon: MapPin },
                { href: "/dashboard/PaketWisata", label: "Paket Wisata", icon: Map },
                { href: "/dashboard/Restaurant", label: "Tempat Makan", icon: Utensils },
                { href: "/dashboard/Hotel", label: "Penginapan", icon: Bed },
                { href: "/dashboard/UMKM", label: "UMKM", icon: Store },
                { href: "/dashboard/Blog", label: "Artikel", icon: FileText },
                { href: "/dashboard/Vlog", label: "Vlog", icon: Youtube },
                { href: "/dashboard/Carousel", label: "Carousel", icon: Image },
                { href: "/dashboard/AboutPage", label: "About Page", icon: BookOpen },
            ]
        },
        {
            title: "Homepage Sections",
            items: [
                { href: "/dashboard/PilihKami", label: "Pilih Kami", icon: Heart },
                { href: "/dashboard/special-packages", label: "Special Packages", icon: Tag },
                { href: "/dashboard/QualitySection", label: "Quality Section", icon: Star },
                { href: "/dashboard/FAQ", label: "FAQ Management", icon: HelpCircle },
                { href: "/dashboard/Newsletter", label: "Newsletter", icon: Mail },
            ]
        },
        {
            title: "System",
            items: [
                { href: "/dashboard/users", label: "Manage Users", icon: ClipboardList },
                { href: "/dashboard/settings", label: "Settings", icon: Settings },
            ]
        }
    ];

    return (
        <aside className="xl:w-64 min-h-screen bg-[#1f2937] text-white py-6 px-1 flex flex-col justify-between">
            <div className="space-y-6">
                <nav className="space-y-6">
                    {menuCategories.map((category) => (
                        <div key={category.title}>
                            <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                {category.title}
                            </div>
                            <div className="space-y-1">
                                {category.items.map((item) => {
                                    const IconComponent = item.icon;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className="flex items-center gap-3 hover:text-black hover:bg-white py-2 rounded-md w-full px-3 transition-colors"
                                        >
                                            <IconComponent size={20} />
                                            <span className="text-sm">{item.label}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>
            </div>
            <div className="px-3">
                <LogoutButton />
            </div>
        </aside>
    );
};

export default AdminSidebar;