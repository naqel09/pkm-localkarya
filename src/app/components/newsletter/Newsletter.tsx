import React from "react";
import Image from "next/image";
import carousel2 from "@/app/assets/mountaincarousel1.jpg";

function Newsletter() {
    return (
        <section className="relative text-center py-24 px-6">
            <Image
                src={carousel2}
                alt="background"
                fill
                className="object-cover object-center"
                priority
            />
            <div className="relative z-10 max-w-5xl mx-auto my-20">
                <h2 className="text-black text-4xl sm:text-7xl lg:text-8xl font-extrabold uppercase mb-4">
                    Start your adventure
                </h2>
                <p className="text-white mb-8">
                    Sign up for our newsletter and receive{" "}
                    <span className="font-medium text-black">
                        exclusive travel deals
                    </span>
                    , insider tips, and destination inspiration. Don’t miss out
                    on the adventure – join our mailing list today!
                </p>
                
            </div>
        </section>
    );
}

export default Newsletter;
