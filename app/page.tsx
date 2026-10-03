import Image from "next/image";
import Link from "next/link";
import BackendStatus from "@/components/BackendStatus";
import { APP_NAME, APP_TAGLINE } from "@/lib/site";

const STEPS = [
  { title: "Create a room", text: "Enter your name and tap Create Game to get a six-letter room code." },
  { title: "Share the code", text: "Send it to up to three friends. They join from the app or right here on the web." },
  { title: "Play live", text: "Take turns rolling. Every move shows up on every screen at the same moment." },
];

const RULES = [
  "Land at the foot of a ladder to climb it.",
  "Land on a snake’s head and slide down to its tail.",
  "Roll a six to take another turn.",
  "Land exactly on square 100 to win.",
];

export default function Home() {
  return (
    <div className="page">
      <section className="hero">
        <Image src="/logo.svg" alt={`${APP_NAME} logo`} width={140} height={140} className="hero-logo" priority />
        <p className="eyebrow">{APP_TAGLINE}</p>
        <h1>{APP_NAME}</h1>
        <p className="lead">
          Snakes &amp; Ladders, live with friends. Start a game, share the room code, and play
          together in real time — on the {APP_NAME} app or in your browser.
        </p>
        <div className="hero-actions">
          <Link href="/play" className="btn btn-primary">
            Play Online
          </Link>
          <a href="#how" className="btn btn-outline">
            How it works
          </a>
        </div>
        <BackendStatus />
      </section>

      <section id="how" className="section">
        <h2>How it works</h2>
        <div className="cards">
          {STEPS.map((step, i) => (
            <div key={step.title} className="card">
              <span className="card-num">{i + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>The rules</h2>
        <ul className="rules">
          {RULES.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
