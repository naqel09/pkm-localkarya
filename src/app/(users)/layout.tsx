import type { Metadata } from "next";
import { Oswald } from "next/font/google";
import "../globals.css";
import Navbar from "../../components/users/navbar/Navbar";
import Footer from "../../components/users/navbar/Footer";
import Newsletter from "../../components/users/newsletter/Newsletter";

export const metadata: Metadata = {
  title: "Homepage",
  description: "menampilkan halaman homepage",
  icons: {
    icon: "/api/about-page/logo",
  },
};

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/api/about-page/logo" type="image/x-icon" />
      </head>
      <body className={`${oswald.variable}antialiased`}>
        <Navbar></Navbar>
        {children}
        <Newsletter></Newsletter>
        <Footer></Footer>
      </body>
    </html>
  );
}