import type { Metadata } from "next";
import {
  APP_NAME,
  APP_VERSION,
  DEVELOPER_BIO,
  DEVELOPER_NAME,
  DEVELOPER_ROLE,
  HOW_TO_PLAY,
  SOCIAL_LINKS,
  WEBSITE_URL,
} from "@/lib/site";

export const metadata: Metadata = { title: "About Us — Snakes & Ladders" };

export default function AboutPage() {
  return (
    <div className="panel">
      <h1>About Us</h1>
      <div className="card">
        <h3>Our Story</h3>
        <p>
          {APP_NAME} brings the timeless family board game to your phone and browser, dressed in
          gold and ivory. We wanted a version that feels as good as a hand-crafted wooden board:
          calm, elegant and fun for every generation, and now one you can play live with friends
          wherever they are.
        </p>
      </div>
      <div className="card">
        <h3>How to Play</h3>
        <ol className="numbered">
          {HOW_TO_PLAY.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ol>
      </div>
      <div className="card">
        <h3>About the Developer</h3>
        <p className="setting-label">{DEVELOPER_NAME}</p>
        <p className="muted small">{DEVELOPER_ROLE}</p>
        <p>{DEVELOPER_BIO}</p>
        <div className="social-links">
          <a href={WEBSITE_URL} target="_blank" rel="noopener noreferrer">
            Portfolio
          </a>
          {SOCIAL_LINKS.map((link) => (
            <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer">
              {link.label}
            </a>
          ))}
        </div>
      </div>
      <div className="card">
        <h3>Details</h3>
        <p>Developer: {DEVELOPER_NAME}</p>
        <p>Version: {APP_VERSION}</p>
      </div>
      <p className="muted center">Crafted with care</p>
    </div>
  );
}
