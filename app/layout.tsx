import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Logo from "@/components/Logo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EUROPA.VOTE",
  description: "Voting on Europe's future — three scenarios with live insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-offwhite text-slate`}>
        {/* Header */}
        <header className="w-full border-b border-black/5 bg-white/70 backdrop-blur-sm">
          <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
            <Link href="/en" className="flex items-center gap-3">
              <Logo width={144} height={36} />
              <span className="sr-only">EUROPA.VOTE</span>
            </Link>
            <nav className="flex items-center gap-3 text-sm">
              <Link href="/en" className="px-3 py-1 rounded hover:bg-black/5">EN</Link>
              <Link href="/ru" className="px-3 py-1 rounded hover:bg-black/5">RU</Link>
            </nav>
          </div>
        </header>
        <main className="min-h-[calc(100dvh-64px)]">{children}</main>
        <footer className="w-full border-t border-black/5 bg-white/60">
          <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-black/60">
            © {new Date().getFullYear()} EUROPA.VOTE
          </div>
        </footer>
      </body>
    </html>
  );
}
