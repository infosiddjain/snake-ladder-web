import type { Metadata } from "next";
import { APP_NAME, APP_VERSION, DEVELOPER_NAME, HOW_TO_PLAY } from "@/lib/site";

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
        <h3>Details</h3>
        <p>Developer: {DEVELOPER_NAME}</p>
        <p>Version: {APP_VERSION}</p>
      </div>
      <p className="muted center">Crafted with care</p>
    </div>
  );
}
