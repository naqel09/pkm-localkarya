import { Oswald } from "next/font/google";
import { Metadata } from "next";
import "@/app/globals.css";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminNavbar from "@/components/admin/AdminNavbar";

export const metadata: Metadata = {
    title: "Admin",
    description: "menampilkan halaman admin",
};

const oswald = Oswald({
    variable: "--font-oswald",
    subsets: ["latin"],
    weight: ["200", "300", "400", "500", "600", "700"],
});

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${oswald.variable}antialiased`}>
                <AdminNavbar/>
                <AdminSidebar/>
                {children}
            </body>
        </html>
    );
}