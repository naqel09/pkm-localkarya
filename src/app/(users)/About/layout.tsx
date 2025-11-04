import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description: "memberi informasi tentang team",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}