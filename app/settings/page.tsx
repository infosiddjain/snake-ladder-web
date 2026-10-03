import type { Metadata } from "next";
import Link from "next/link";
import SettingsForm from "@/components/SettingsForm";
import { APP_VERSION } from "@/lib/site";

export const metadata: Metadata = { title: "Settings — Snakepad" };

export default function SettingsPage() {
  return (
    <div className="panel">
      <h1>Settings</h1>
      <SettingsForm />
      <div className="card">
        <h3>More</h3>
        <nav className="link-list">
          <Link href="/about">About Us</Link>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/contact">Contact Us</Link>
        </nav>
      </div>
      <p className="muted center small">Version {APP_VERSION}</p>
    </div>
  );
}
