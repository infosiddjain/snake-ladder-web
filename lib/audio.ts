"use client";

import { useSyncExternalStore } from "react";

// Same sounds and volume as the app (SnakeGame/src/services/audio.ts).
export type SoundEffect = "dice" | "step" | "snake";

const EFFECT_FILES: Record<SoundEffect, string> = {
  dice: "/sounds/dice_roll.mp3",
  step: "/sounds/step_move.mp3",
  snake: "/sounds/snake_bite.mp3",
};
const MUSIC_FILE = "/sounds/background_music.mp3";
const MUSIC_VOLUME = 0.35;
const SETTINGS_KEY = "snakes-ladders:settings";

export interface Settings {
  music: boolean;
  soundEffects: boolean;
}

const DEFAULT_SETTINGS: Settings = { music: true, soundEffects: true };

let settings = DEFAULT_SETTINGS;
let loaded = false;
const listeners = new Set<() => void>();
let music: HTMLAudioElement | null = null;
// Browsers only allow audio after the visitor has clicked or tapped.
let unlocked = false;

const load = () => {
  if (loaded || typeof window === "undefined") {
    return;
  }
  loaded = true;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    settings = raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch {
    // Blocked storage: keep the defaults for this visit.
  }
};

const updateMusic = () => {
  if (!unlocked) {
    return;
  }
  if (!music) {
    music = new Audio(MUSIC_FILE);
    music.loop = true;
    music.volume = MUSIC_VOLUME;
  }
  if (settings.music && !document.hidden) {
    music.play().catch(() => {});
  } else {
    music.pause();
  }
};

export const updateSetting = (key: keyof Settings, value: boolean) => {
  load();
  settings = { ...settings, [key]: value };
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // The change still applies for this visit.
  }
  listeners.forEach((l) => l());
  updateMusic();
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const useSettings = () =>
  useSyncExternalStore(
    subscribe,
    () => {
      load();
      return settings;
    },
    () => DEFAULT_SETTINGS,
  );

export const playEffect = (name: SoundEffect) => {
  load();
  if (!settings.soundEffects || !unlocked) {
    return;
  }
  // A fresh element per play, so quick steps can overlap.
  new Audio(EFFECT_FILES[name]).play().catch(() => {});
};

/** Starts music on the first interaction and pauses it in background tabs. */
export const startAudio = () => {
  load();
  const unlock = () => {
    unlocked = true;
    updateMusic();
    window.removeEventListener("pointerdown", unlock);
    window.removeEventListener("keydown", unlock);
  };
  window.addEventListener("pointerdown", unlock);
  window.addEventListener("keydown", unlock);
  document.addEventListener("visibilitychange", updateMusic);
  return () => {
    window.removeEventListener("pointerdown", unlock);
    window.removeEventListener("keydown", unlock);
    document.removeEventListener("visibilitychange", updateMusic);
  };
};
