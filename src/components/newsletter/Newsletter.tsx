import React from "react";
import Image from "next/image";

function Newsletter() {
    return (
        <section className="relative text-center py-24 px-6">
            <Image
                src="/mountaincarousel1.jpg"
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
                <form className="flex items-center justify-center gap-4">
                    <input
                        type="email"
                        placeholder="Enter your email address here ..."
                        className="px-4 py-3 w-full sm:w-[400px] border-b-2 border-black outline-none focus:border-black bg-transparent placeholder-black text-sm"
                    />
                    <button
                        type="submit"
                        className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition cursor-pointer"
                    >
                        Subscribe
                    </button>
                </form>
            </div>
        </section>
    );
}

export default Newsletter;
