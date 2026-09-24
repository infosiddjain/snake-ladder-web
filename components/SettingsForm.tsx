"use client";

import { Settings, updateSetting, useSettings, playEffect } from "@/lib/audio";

const ROWS: { key: keyof Settings; label: string; description: string }[] = [
  { key: "music", label: "Music", description: "Background music while you browse and play" },
  { key: "soundEffects", label: "Sound Effects", description: "Dice rolls, footsteps and snake bites" },
];

export default function SettingsForm() {
  const settings = useSettings();

  return (
    <div className="card">
      <h3>Audio</h3>
      {ROWS.map(({ key, label, description }) => (
        <label key={key} className="setting-row">
          <span className="grow">
            <span className="setting-label">{label}</span>
            <span className="muted setting-desc">{description}</span>
          </span>
          <input
            type="checkbox"
            role="switch"
            className="switch"
            checked={settings[key]}
            onChange={(e) => {
              updateSetting(key, e.target.checked);
              if (key === "soundEffects" && e.target.checked) {
                playEffect("dice");
              }
            }}
          />
        </label>
      ))}
      <p className="muted small">
        Music starts after your first click or tap, as browsers don’t allow pages to play sound
        before that.
      </p>
    </div>
  );
}
