import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import {
  APP_NAME,
  APP_VERSION,
  emailUrl,
  SOCIAL_LINKS,
  SUPPORT_EMAIL,
  WEBSITE_URL,
} from "@/lib/site";

export const metadata: Metadata = { title: "Contact Us — Snakes & Ladders" };

export default function ContactPage() {
  return (
    <div className="panel">
      <h1>Contact Us</h1>
      <div className="card">
        <h3>We’d Love to Hear From You</h3>
        <p>
          Found a bug, have an idea, or simply enjoyed a game? Write to us and we will reply as soon
          as we can.
        </p>
      </div>
      <ContactForm />
      <div className="card">
        <a className="contact-row" href={emailUrl(`${APP_NAME} support`)}>
          <span className="setting-label">Email</span>
          <span className="muted">{SUPPORT_EMAIL}</span>
        </a>
        <a className="contact-row" href={WEBSITE_URL} target="_blank" rel="noopener noreferrer">
          <span className="setting-label">Portfolio</span>
          <span className="muted">{WEBSITE_URL.replace(/^https?:\/\//, "")}</span>
        </a>
        {SOCIAL_LINKS.map((link) => (
          <a
            key={link.label}
            className="contact-row"
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="setting-label">{link.label}</span>
            <span className="muted">{link.url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}</span>
          </a>
        ))}
      </div>
      <a className="btn btn-primary self-center" href={emailUrl(`${APP_NAME} feedback (v${APP_VERSION})`)}>
        Send Feedback
      </a>
    </div>
  );
}
