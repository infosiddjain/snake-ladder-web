"use client";

import { useEffect } from "react";
import { startAudio, updateSetting, useSettings } from "@/lib/audio";

/** Keeps background music running across pages, with a quick mute button. */
export default function AudioController() {
  const settings = useSettings();

  useEffect(startAudio, []);

  return (
    <button
      type="button"
      className="icon-btn"
      onClick={() => updateSetting("music", !settings.music)}
      aria-label={settings.music ? "Turn music off" : "Turn music on"}
      title={settings.music ? "Music on" : "Music off"}
    >
      {settings.music ? "♫" : "🔇"}
    </button>
  );
}
