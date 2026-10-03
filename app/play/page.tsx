import type { Metadata } from "next";
import OnlinePlay from "@/components/OnlinePlay";

export const metadata: Metadata = {
  title: "Play Online — Snakepad",
};

export default function PlayPage() {
  return <OnlinePlay />;
}
