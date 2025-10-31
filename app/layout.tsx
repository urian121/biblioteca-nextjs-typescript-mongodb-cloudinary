import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Inter } from "next/font/google";
import "./styles/globals.css";
import { Search } from "lucide-react";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BookShop - Next.js",
  description: "Una BookShop en línea para gestionar libros y todo un Crud, con Next.js y MongoDB.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased bg-white text-slate-800`}>
        <header className="fixed top-0 left-0 right-0 z-50 bg-udemy-purple-purple text-white p-4 shadow">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
            <div className="font-semibold">
              <Link href="/" className="inline-flex items-center gap-2">
                <Image src="/bookshop.png" alt="Logo Biblioteca" className="w-8 h-8" width={32} height={32} />
                BookShop
              </Link>
            </div>
            <form action="/" method="get" role="search" className="flex-1 flex justify-end">
              <div className="relative w-full max-w-2xl">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} strokeWidth={2} aria-hidden="true" />
                <input
                  name="q"
                  placeholder="Buscar libro..."
                  className="w-full bg-white text-slate-900 pl-10 pr-4 py-2 rounded-full border border-slate-300 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-(--color-udemy-purple-purple) placeholder:text-slate-500 transition"
                />
              </div>
            </form>
          </div>
        </header>

        <main className="max-w-4xl mx-auto p-4 pt-24">{children}</main>
      </body>
    </html>
  );
}
