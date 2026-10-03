import type { Metadata, Viewport } from "next";
import { Geist, Playfair_Display } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import AudioController from "@/components/AudioController";
import { APP_NAME, APP_TAGLINE, DEVELOPER_NAME, WEBSITE_URL } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

const DESCRIPTION = `${APP_NAME}: play Snakes & Ladders live with friends. Share a room code and play together from the app or the web.`;

export const metadata: Metadata = {
  title: `${APP_NAME} — ${APP_TAGLINE}`,
  description: DESCRIPTION,
  applicationName: APP_NAME,
  appleWebApp: { title: APP_NAME },
  openGraph: { siteName: APP_NAME, title: `${APP_NAME} — ${APP_TAGLINE}`, description: DESCRIPTION, type: "website" },
  twitter: { card: "summary", title: `${APP_NAME} — ${APP_TAGLINE}`, description: DESCRIPTION },
};

export const viewport: Viewport = {
  themeColor: "#0a0a14",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${playfair.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <header className="site-header">
          <Link href="/" className="brand">
            <Image src="/logo.svg" alt="" width={36} height={36} className="brand-logo" priority />
            <span>{APP_NAME}</span>
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
          <p>{APP_NAME} · {APP_TAGLINE}</p>
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
