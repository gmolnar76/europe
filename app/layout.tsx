import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SiteNav from '@/components/ui/SiteNav';

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
        <SiteNav />
        <main className="min-h-[calc(100dvh-56px)]">{children}</main>
        <footer className="w-full border-t border-black/5 bg-white/60">
          <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-black/60">
            © {new Date().getFullYear()} EUROPA.VOTE
          </div>
        </footer>
      </body>
    </html>
  );
}
