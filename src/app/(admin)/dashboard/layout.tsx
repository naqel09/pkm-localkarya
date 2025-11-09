import {Oswald} from "next/font/google";
import {Metadata} from "next";
import "@/app/globals.css";
import AdminSidebar from "@/components/admin/ui/Navbar/AdminSidebar";
import AdminNavbar from "@/components/admin/ui/Navbar/AdminNavbar";
import { AuthProvider } from "@/components/auth/AuthProvider";

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
                <AuthProvider>
                    <AdminNavbar />
                    <div className="flex flex-1">
                        <AdminSidebar />
                        <main className="flex-1 p-6 bg-white overflow-y-auto">
                            {children}
                        </main>
                    </div>
                </AuthProvider>
            </body>
        </html>
    );
}