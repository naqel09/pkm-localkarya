import React from "react";
import ButtonKebutuhan from "./ButtonKebutuhan";


function Kebutuhan() {
    return (
        <section className=" bg-gray-300 py-20 px-6 w-full text-center mb-20">
            <h2 className="text-4xl font-bold uppercase mb-2">
                apa saja yang ada di wisata kami?
            </h2>
            <p className="text-white mb-10">
                Apa Yang Klien Kami Tanyakan Ketika Berkunjung Di Wisata Kami.
            </p>
            <ButtonKebutuhan/>
        </section>
    );
}

export default Kebutuhan;
