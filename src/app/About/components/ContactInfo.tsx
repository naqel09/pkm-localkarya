import React from "react";
import {PiAddressBookFill} from "react-icons/pi";
import {FaPhone} from "react-icons/fa6";
import {IoMail} from "react-icons/io5";

const ContactInfo = () => {
    return (
        <section className="px-4 py-8 max-w-8xl">
            <h2 className="md:text-6xl text-2xl font-bold mb-5 text-gray-800 uppercase underline ">
                Informasi kontak kami
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 p-5 shadow-2xl border border-black rounded-lg">
                <div>
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.938228493074!2d107.64282637573919!3d-6.897991767505768!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e797d4ff9d55%3A0x7255df8d69db4d3a!2sUniversitas%20Widyatama!5e0!3m2!1sen!2sid!4v1753900263350!5m2!1sen!2sid"
                        width="100%"
                        height="450"
                        style={{border: 0}}
                        allowFullScreen={true}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
                {/* Detail informasi */}
                <div>
                    <div className="flex flex-col gap-10">
                        <div>
                            <div className="flex items-center">
                                <FaPhone className="md:w-[2rem] md:h-[2rem] w-[1.5rem] h-[1.5rem] tracking-widest text-blue-800 mr-3" />
                                <p className="text-blue-400 capitalize md:text-5xl text-3xl tracking-widest font-medium mb-1">
                                    Phone
                                </p>
                            </div>

                            <p className="md:text-[1.5rem] text-lg text-gray-800 font-medium">
                                +62 852-3186-9051
                            </p>
                        </div>
                        <div>
                            <div className="flex items-center">
                                <PiAddressBookFill className="md:w-[3rem] md:h-[3rem] w-[2rem] h-[2rem] tracking-widest text-blue-800 mr-3" />
                                <p className="text-blue-400 capitalize md:text-5xl text-3xl tracking-widest font-medium mb-1">
                                    Address
                                </p>
                            </div>

                            <p className="md:text-[1.5rem] text-lg text-gray-800 font-medium">
                                Indonesia,Bandung,jalan cikutra sukapada
                                cibeunying Kidul
                            </p>
                        </div>
                        <div>
                            <div className="flex items-center">
                                <IoMail className="md:w-[3rem] md:h-[3rem] mr-3 w-[2rem] h-[2rem] tracking-widest text-blue-800" />
                                <p className="text-blue-400 capitalize md:text-5xl text-3xl tracking-widest font-medium mb-1">
                                    Email
                                </p>
                            </div>

                            <p className="text-gray-800 font-medium md:text-[1.5rem]">
                                UniversitasWidyatama@.ac.id
                            </p>
                        </div>
                    </div>
                </div>

                {/* EMAIL */}
                <div className="flex flex-col"></div>

                {/* ADDRESS (span 2 cols on mobile) */}
                <div className="md:col-span-2"></div>
            </div>
        </section>
    );
};

export default ContactInfo;
