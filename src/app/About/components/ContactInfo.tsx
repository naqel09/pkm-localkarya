import React from "react";

const ContactInfo = () => {
    return (
        <section className="px-4 py-8 max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-6 text-gray-800 uppercase">
                Informasi kontak kami
            </h2>
            <div className="grid md:grid-cols-2 gap-y-6 gap-x-10">
                {/* PHONE */}
                <div>
                    <p className="text-blue-400 uppercase text-xl tracking-widest font-medium mb-1">
                        Phone
                    </p>
                    <p className="text-gray-800 font-semibold">
                        +62 852-3186-9051
                    </p>
                </div>

                {/* EMAIL */}
                <div>
                    <p className="text-blue-400 uppercase text-xl tracking-widest font-medium mb-1">
                        Email
                    </p>
                    <p className="text-gray-800 font-semibold">
                        info@vacasky.com
                    </p>
                </div>

                {/* ADDRESS (span 2 cols on mobile) */}
                <div className="md:col-span-2">
                    <p className="text-blue-400 uppercase text-xl tracking-widest font-medium mb-1">
                        Address
                    </p>
                    <p className="text-gray-800 font-semibold">
                        123 Anywhere Street, Any City, Canada
                    </p>
                </div>
            </div>
        </section>
    );
};

export default ContactInfo;
