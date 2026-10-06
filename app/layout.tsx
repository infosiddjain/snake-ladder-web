import type { Metadata, Viewport } from "next";
import { Geist, Playfair_Display } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import AudioController from "@/components/AudioController";
import {
  APP_NAME,
  APP_TAGLINE,
  DEVELOPER_NAME,
  DEVELOPER_ROLE,
  SITE_DESCRIPTION,
  SITE_URL,
  SOCIAL_LINKS,
  WEBSITE_URL,
} from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

const TITLE = `${APP_NAME} — Play ${APP_TAGLINE} Online with Friends`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: `%s | ${APP_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: APP_NAME,
  keywords: [
    "snakes and ladders",
    "snakes and ladders online",
    "play snakes and ladders with friends",
    "multiplayer board game",
    "online board game",
    "snake and ladder game",
    "saap seedhi",
    APP_NAME,
  ],
  authors: [{ name: DEVELOPER_NAME, url: WEBSITE_URL }],
  creator: DEVELOPER_NAME,
  category: "games",
  alternates: { canonical: "/" },
  appleWebApp: { title: APP_NAME },
  openGraph: {
    siteName: APP_NAME,
    title: TITLE,
    description: SITE_DESCRIPTION,
    url: "/",
    locale: "en_US",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: SITE_DESCRIPTION },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: APP_NAME,
      description: SITE_DESCRIPTION,
      inLanguage: "en",
    },
    {
      "@type": ["VideoGame", "WebApplication"],
      name: `${APP_NAME} — ${APP_TAGLINE}`,
      url: `${SITE_URL}/play`,
      description: SITE_DESCRIPTION,
      genre: ["Board game", "Family game"],
      gamePlatform: ["Web browser", "Android", "iOS"],
      applicationCategory: "GameApplication",
      operatingSystem: "Any",
      playMode: "MultiPlayer",
      numberOfPlayers: { "@type": "QuantitativeValue", minValue: 2, maxValue: 4 },
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      author: { "@id": `${SITE_URL}/#developer` },
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#developer`,
      name: DEVELOPER_NAME,
      jobTitle: DEVELOPER_ROLE,
      url: WEBSITE_URL,
      sameAs: SOCIAL_LINKS.map((link) => link.url),
    },
  ],
};

export const viewport: Viewport = {
  themeColor: "#0a0a14",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${playfair.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD).replace(/</g, "\\u003c") }}
        />
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
