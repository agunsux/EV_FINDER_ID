import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from 'next/link';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EV Finder Indonesia",
  description: "Bandingkan mobil listrik Indonesia berdasarkan harga, range, baterai, charging, dan kebutuhan Anda.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.className} bg-[#0b0f19] text-white min-h-screen flex flex-col`}>
        <nav className="border-b border-gray-800 bg-[#121826]/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
                EV Finder
              </Link>
              <div className="flex space-x-6">
                <Link href="/" className="text-gray-300 hover:text-white transition-colors">Semua EV</Link>
                <Link href="/compare" className="text-gray-300 hover:text-white transition-colors">Bandingkan</Link>
              </div>
            </div>
          </div>
        </nav>
        <main className="flex-grow">
          {children}
        </main>
      </body>
    </html>
  );
}
