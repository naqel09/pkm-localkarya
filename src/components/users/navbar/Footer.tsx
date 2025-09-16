import React from "react";
import Link from "next/link";
import Image from "next/image";
import {FaFacebookF, FaTwitter, FaInstagram, FaMapMarkerAlt, FaUniversity} from "react-icons/fa";

function Footer() {
    return (
        <footer className="bg-neutral-900 text-white pt-12 pb-6 px-6 md:px-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                {/* Informasi Utama */}
                <div className="space-y-4">
                    <div className="text-2xl font-bold flex items-center gap-1">
                        <span className="bg-white text-black px-2 py-1 rounded">
                            NYABA
                        </span>
                        <span className="text-white">WISATA</span>
                    </div>
                    <h3 className="text-lg font-semibold text-blue-400">
                        Desa Karyawangi
                    </h3>
                    <div className="flex items-start gap-2 text-gray-300">
                        <FaMapMarkerAlt className="mt-1 text-blue-400" size={16} />
                        <div>
                            <p>Desa Karyawangi</p>
                            <p>Kecamatan Parongpong</p>
                            <p>Bandung Barat</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-blue-400">Menu Utama</h3>
                    <nav className="flex flex-col gap-3 text-gray-300">
                        <Link
                            href="/Destination"
                            className="hover:text-white transition"
                        >
                            Destinasi Wisata
                        </Link>
                        <Link href="/Tours" className="hover:text-white transition">
                            Paket Wisata
                        </Link>
                        <Link href="/Hotel" className="hover:text-white transition">
                            Penginapan
                        </Link>
                        <Link href="/Restaurant" className="hover:text-white transition">
                            Kuliner
                        </Link>
                        <Link href="/Blog" className="hover:text-white transition">
                            Artikel
                        </Link>
                        <Link href="/About" className="hover:text-white transition">
                            Tentang Kami
                        </Link>
                        
                    </nav>
                </div>

                {/* Social Media & Contact */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-blue-400">Hubungi Kami</h3>
                    <p className="text-sm text-gray-300 mb-3">
                        Ikuti media sosial kami untuk update terbaru tentang destinasi wisata dan kegiatan di Desa Karyawangi
                    </p>
                    <div className="flex gap-3">
                        <Link
                            href="https://facebook.com"
                            className="bg-blue-600 text-white rounded-full p-3 hover:scale-110 hover:bg-blue-700 transition-all duration-300 shadow-lg"
                            title="Facebook"
                        >
                            <FaFacebookF size={18} />
                        </Link>
                        <Link
                            href="https://twitter.com"
                            className="bg-blue-400 text-white rounded-full p-3 hover:scale-110 hover:bg-blue-500 transition-all duration-300 shadow-lg"
                            title="Twitter"
                        >
                            <FaTwitter size={18} />
                        </Link>
                        <Link
                            href="https://instagram.com"
                            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full p-3 hover:scale-110 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg"
                            title="Instagram"
                        >
                            <FaInstagram size={18} />
                        </Link>
                    </div>
                    
                    {/* Program Pengabdian */}
                    <div className="mt-6 p-4 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg border border-gray-600">
                        <div className="flex items-center gap-2 mb-3">
                            <FaUniversity className="text-yellow-400" size={16} />
                            <span className="text-sm font-semibold text-yellow-400">Website ini merupakan Hasil Program Pengabdian Masyarakat</span>
                        </div>
                        <div className="flex items-center justify-center gap-6">
                            <Link 
                                href="https://www.widyatama.ac.id/" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="hover:scale-110 transition-transform duration-300"
                            >
                                <Image
                                    src="/Logo-Widyatama.svg"
                                    alt="Universitas Widyatama"
                                    width={300}
                                    height={100}
                                    className="filter brightness-0 invert"
                                />
                            </Link>
                            <Link 
                                href="https://kemdiktisaintek.go.id/" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="hover:scale-110 transition-transform duration-300"
                            >
                                <Image
                                    src="/Logo-Diktisaintek.svg"
                                    alt="Kemendikbud Ristek"
                                    width={100}
                                    height={100}
                                    className="filter brightness-0 invert"
                                />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Garis */}
            <div className="border-t border-gray-700 my-6" />

            {/* Bottom Text */}
            <div className="flex flex-col md:flex-row md:justify-between text-xs text-gray-400 gap-3">
                <p>Copyright © 2025 Nyaba Wisata Desa Karyawangi. All rights reserved.</p>
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
