"use client";
import React from "react";
import Link from "next/link";
import {FaFacebookF, FaTwitter, FaInstagram} from "react-icons/fa";

function Footer() {
    return (
        <footer className="bg-neutral-900 text-white pt-12 pb-6 px-6 md:px-16">
            <div className="flex flex-col md:flex-row md:justify-between items-center gap-10">
                {/* Logo */}
                <div className="text-2xl font-bold flex items-center gap-1">
                    <span className="bg-white text-black px-2 py-1 rounded">
                        LOCAL
                    </span>
                    <span className="text-white">KARYA</span>
                </div>

                {/* Navigation */}
                <nav className="flex flex-wrap justify-center gap-6 text-sm text-gray-300">
                    <Link
                        href="/destinations"
                        className="hover:text-white transition"
                    >
                        Destinations
                    </Link>
                    <Link href="/tours" className="hover:text-white transition">
                        Tours
                    </Link>
                    <Link href="/about" className="hover:text-white transition">
                        About
                    </Link>
                    <Link href="/blog" className="hover:text-white transition">
                        Blog
                    </Link>
                    <Link
                        href="/contact"
                        className="hover:text-white transition"
                    >
                        Contact
                    </Link>
                </nav>

                {/* Social Media */}
                <div className="flex gap-4">
                    <Link
                        href="https://facebook.com"
                        className="bg-white text-black rounded-full p-2 hover:scale-105 transition"
                    >
                        <FaFacebookF size={16} />
                    </Link>
                    <Link
                        href="https://twitter.com"
                        className="bg-white text-black rounded-full p-2 hover:scale-105 transition"
                    >
                        <FaTwitter size={16} />
                    </Link>
                    <Link
                        href="https://instagram.com"
                        className="bg-white text-black rounded-full p-2 hover:scale-105 transition"
                    >
                        <FaInstagram size={16} />
                    </Link>
                </div>
            </div>

            {/* Garis */}
            <div className="border-t border-gray-700 my-6" />

            {/* Bottom Text */}
            <div className="flex flex-col md:flex-row md:justify-between text-xs text-gray-400 gap-3">
                <p>Copyright © 2025 LOCALKARYA. All rights reserved.</p>
                <div className="flex gap-2">
                    <Link
                        href="/privacy"
                        className="hover:text-white transition"
                    >
                        Privacy Policy
                    </Link>
                    <span>|</span>
                    <Link href="/terms" className="hover:text-white transition">
                        Terms & Condition
                    </Link>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
