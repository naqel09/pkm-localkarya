import React from "react";
import Image from "next/image";

function Newsletter() {
    return (
        <section className="relative text-center py-24 px-6">
            <Image
                src="/nyaba1.jpg"
                alt="background"
                fill
                className="object-cover object-center"
                priority
            />
            <div className="relative z-10 max-w-5xl mx-auto my-20">
                <h2 className="text-white text-4xl sm:text-7xl lg:text-8xl font-extrabold uppercase mb-4">
                    Mulai Nyaba Anda
                </h2>
            </div>
        </section>
    );
}

export default Newsletter;
