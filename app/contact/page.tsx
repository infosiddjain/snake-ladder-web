import type { Metadata } from "next";
import { APP_NAME, APP_VERSION, emailUrl, SUPPORT_EMAIL, WEBSITE_URL } from "@/lib/site";

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
      <div className="card">
        <a className="contact-row" href={emailUrl(`${APP_NAME} support`)}>
          <span className="setting-label">Email</span>
          <span className="muted">{SUPPORT_EMAIL}</span>
        </a>
        <a className="contact-row" href={WEBSITE_URL}>
          <span className="setting-label">Website</span>
          <span className="muted">{WEBSITE_URL.replace(/^https?:\/\//, "")}</span>
        </a>
      </div>
      <a className="btn btn-primary self-center" href={emailUrl(`${APP_NAME} feedback (v${APP_VERSION})`)}>
        Send Feedback
      </a>
    </div>
  );
}
