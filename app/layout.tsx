import type { Metadata } from "next";
import { Geist, Playfair_Display } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Snakes & Ladders — Royal Edition",
  description:
    "Play Snakes & Ladders live with friends. Share a room code and play together from the app or the web.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${playfair.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <header className="site-header">
          <Link href="/" className="brand">
            Snakes <span>&amp;</span> Ladders
          </Link>
          <nav>
            <Link href="/play" className="btn btn-primary btn-sm">
              Play Online
            </Link>
          </nav>
        </header>
        <main className="flex-1 flex flex-col">{children}</main>
        <footer className="site-footer">Snakes &amp; Ladders · Royal Edition</footer>
      </body>
    </html>
  );
}
