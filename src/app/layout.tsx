import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import { Sidebar } from "@/components/layout/sidebar";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "RoK Manager - Alliance Management",
  description: "Rise of Kingdoms Alliance Management Tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${outfit.variable} font-sans antialiased bg-slate-950 text-slate-100 min-h-screen`}>
        <div className="flex">
          <Sidebar />
          <main className="flex-1 lg:ml-64 min-h-screen pt-16 lg:pt-0">
            <div className="p-4 md:p-6 lg:p-8">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
