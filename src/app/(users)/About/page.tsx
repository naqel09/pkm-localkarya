import React from "react";
import {Metadata} from "next";
import TourHeader from "../../../components/TourHeader";
import PilihKami from "../../../components/users/pages/Home/PilihKami";
import {PiAirplaneTiltFill} from "react-icons/pi";

export const metadata: Metadata = {
    title: "Tentang Kami",
    description: "memeberi informasi tentang team",
};

const page = () => {
    return (
        <>
            <TourHeader
                title="Tentang Kami"
                halaman="Home"
                bagian="Tentang"
                image="/bgImage.jpg"
            />
            <div className="py-16 px-4 text-center">
                <div className="flex justify-center mb-6">
                    <span className="text-3xl">
                        <PiAirplaneTiltFill />
                    </span>
                </div>
                <p className="max-w-3xl mx-auto text-gray-600 leading-relaxed mb-16">
                    Desa Karyawangi terletak di kaki pegunungan Parongpong, Bandung Barat, yang menawarkan keindahan alam menawan 
                    dan kearifan budaya Sunda yang masih terjaga. "Nyaba" dalam bahasa Sunda berarti bermain atau berekreasi, 
                    yang menjadi filosofi utama kami dalam menghadirkan pengalaman wisata yang menyenangkan dan berkesan.
                    <br/><br/>
                    Kami percaya bahwa setiap perjalanan harus memberikan kegembiraan, pembelajaran, dan koneksi yang mendalam 
                    dengan alam dan budaya lokal. Tim kami yang terdiri dari warga desa berpengalaman siap memandu Anda 
                    menjelajahi setiap sudut keindahan Karyawangi dengan hati yang tulus.
                </p>
                
                {/* Tim Nyaba Contact Information */}
                <div className="max-w-4xl mx-auto mb-16">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 shadow-lg">
                        <h3 className="text-2xl font-bold text-green-800 mb-6 text-center">
                            🌿 Tim Nyaba - Informasi Kontak
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Contact Details */}
                            <div className="space-y-6">
                                {/* Address */}
                                <div className="flex items-start space-x-3">
                                    <div className="text-green-600 text-xl mt-1">📍</div>
                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-1">Alamat Tim Nyaba</h4>
                                        <p className="text-gray-600">
                                            Desa Karyawangi, Kecamatan Parongpong<br/>
                                            Kabupaten Bandung Barat, Jawa Barat
                                        </p>
                                    </div>
                                </div>
                                
                                {/* Phone */}
                                <div className="flex items-center space-x-3">
                                    <div className="text-green-600 text-xl">📞</div>
                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-1">Telepon</h4>
                                        <p className="text-gray-600">+62 812-3456-7890</p>
                                    </div>
                                </div>
                                
                                {/* Email */}
                                <div className="flex items-center space-x-3">
                                    <div className="text-green-600 text-xl">📧</div>
                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-1">Email</h4>
                                        <p className="text-gray-600">info.timnyaba@gmail.com</p>
                                    </div>
                                </div>
                                
                                {/* WhatsApp Button */}
                                <div className="pt-4">
                                    <a 
                                        href="https://wa.me/6281234567890?text=Halo%20Tim%20Nyaba!%20Saya%20tertarik%20dengan%20wisata%20di%20Desa%20Karyawangi" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
                                    >
                                        <span className="mr-2">📱</span>
                                        Hubungi via WhatsApp
                                    </a>
                                </div>
                            </div>
                            
                            <div>
                                <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                                    <span className="mr-2">🗺️</span>
                                    Lokasi Kami
                                </h4>
                                <div className="rounded-lg overflow-hidden shadow-md h-64 md:h-[300px]">
                                    <iframe 
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126748.56211937005!2d107.41311766484375!3d-6.87167665!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e1dce64b31b1%3A0x7a1f1e1c8a8b9c0d!2sKaryawangi%2C%20Parongpong%2C%20West%20Bandung%20Regency%2C%20West%20Java!5e0!3m2!1sen!2sid!4v1703123456789!5m2!1sen!2sid"
                                        width="100%" 
                                        height="100%" 
                                        style={{border: 0}} 
                                        allowFullScreen 
                                        loading="lazy" 
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title="Lokasi Tim Nyaba - Desa Karyawangi"
                                    ></iframe>
                                </div>
                                <div className="mt-3 text-center">
                                    <a 
                                        href="https://maps.app.goo.gl/9XopyAHGHQvParsC6" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-green-600 hover:text-green-700 font-medium transition-colors duration-300"
                                    >
                                        🔗 Buka di Google Maps
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <PilihKami />
            </div>
        </>
    );
};

export default page;
