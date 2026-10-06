import type { Metadata } from "next";
import { PRIVACY_EFFECTIVE_DATE, PRIVACY_SECTIONS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Snakepad collects no personal information: no accounts, no ads and no analytics. Read how the game handles your data.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="panel">
      <h1>Privacy Policy</h1>
      <p className="muted center">Effective {PRIVACY_EFFECTIVE_DATE}</p>
      {PRIVACY_SECTIONS.map((section) => (
        <div key={section.title} className="card">
          <h3>{section.title}</h3>
          {section.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      ))}
    </div>
  );
}
