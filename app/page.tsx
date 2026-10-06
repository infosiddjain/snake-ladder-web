import Image from "next/image";
import Link from "next/link";
import BackendStatus from "@/components/BackendStatus";
import { APP_NAME, APP_TAGLINE } from "@/lib/site";

const STEPS = [
  { title: "Create a room", text: "Enter your name and tap Create Game to get a six-letter room code." },
  { title: "Share the code", text: "Send it to up to three friends. They join from the app or right here on the web." },
  { title: "Play live", text: "Take turns rolling. Every move shows up on every screen at the same moment." },
];

const FAQ = [
  {
    q: "How do I play Snakes & Ladders online with friends?",
    a: "Open Play Online, enter your name and tap Create Game. Share the six-letter room code with your friends; they enter it under Join a friend, and the host starts the game.",
  },
  {
    q: "Is Snakepad free?",
    a: "Yes. There is no sign-up, no account and no advertising — just open the page and play.",
  },
  {
    q: "How many players can join a game?",
    a: "Two to four players per room. Friends can join from the Snakepad app or from any web browser.",
  },
  {
    q: "Do I need to download anything?",
    a: "No. The online game runs in your browser on phone, tablet or computer. The Snakepad app also lets you play offline or against the computer.",
  },
  {
    q: "What happens if someone loses their connection?",
    a: "Their turns are skipped until they come back. They can rejoin with the same room code and name and carry on.",
  },
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
          Play Snakes &amp; Ladders online with friends. Start a game, share the room code, and
          play together in real time — on the {APP_NAME} app or in your browser. Free, with no
          sign-up.
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
        <h2>How to play online with friends</h2>
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
        <h2>Snakes &amp; Ladders rules</h2>
        <ul className="rules">
          {RULES.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
      </section>

      <section className="section">
        <h2>Frequently asked questions</h2>
        <div className="faq">
          {FAQ.map((item) => (
            <details key={item.q} className="card">
              <summary>
                <h3>{item.q}</h3>
              </summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
