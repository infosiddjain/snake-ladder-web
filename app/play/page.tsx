import type { Metadata } from "next";
import OnlinePlay from "@/components/OnlinePlay";

export const metadata: Metadata = {
  title: "Play Snakes & Ladders Online",
  description:
    "Start a Snakes & Ladders game in your browser, share the six-letter room code and play live with up to three friends. Free, no sign-up.",
  alternates: { canonical: "/play" },
};

export default function PlayPage() {
  return <OnlinePlay />;
}
