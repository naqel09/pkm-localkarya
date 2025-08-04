import type {Metadata} from "next";
import {Geist, Geist_Mono, Oswald} from "next/font/google";
import "./globals.css";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/navbar/Footer";
import Newsletter from "../components/newsletter/Newsletter";
const oswald = Oswald({
    variable: "--font-oswald",
    subsets: ["latin"],
    weight: ["200", "300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
    title: "Homepage",
    description: "menampilkan halaman homepage",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${oswald.variable}antialiased`}>
                <Navbar></Navbar>
                {children}
                <Newsletter></Newsletter>
                <Footer></Footer>
            </body>
        </html>
    );
}
