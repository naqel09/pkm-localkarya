import React from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/app/assets/mclaren.svg";
import NavbarLink from "./NavbarLink";

function Navbar() {
    return (
        <>
            {/* Navbar */}
            <nav className="flex items-center justify-between px-6 py-4 absolute bg-transparent text-white top-0 left-0 w-full z-20">
                <div className="text-2xl font-bold">
                    <Link href="/">
                        <Image src={logo} alt="Logo" className="w-10 h-10" />
                    </Link>
                </div>
                <NavbarLink />
            </nav>
            
        </>
    );
}

export default Navbar;
