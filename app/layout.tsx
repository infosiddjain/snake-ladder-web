import type { Metadata } from "next";
import { Geist, Playfair_Display } from "next/font/google";
import Link from "next/link";
import AudioController from "@/components/AudioController";
import { DEVELOPER_NAME, WEBSITE_URL } from "@/lib/site";
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
          <nav className="site-nav">
            <AudioController />
            <Link href="/settings" className="icon-btn" aria-label="Settings" title="Settings">
              ⚙
            </Link>
            <Link href="/play" className="btn btn-primary btn-sm">
              Play Online
            </Link>
          </nav>
        </header>
        <main className="flex-1 flex flex-col">{children}</main>
        <footer className="site-footer">
          <nav className="footer-links">
            <Link href="/about">About Us</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/settings">Settings</Link>
          </nav>
          <p>Snakes &amp; Ladders · Royal Edition</p>
          <p>
            Made by{" "}
            <a href={WEBSITE_URL} target="_blank" rel="noopener noreferrer" className="footer-credit">
              {DEVELOPER_NAME}
            </a>
          </p>
        </footer>
      </body>
    </html>
  );
}
