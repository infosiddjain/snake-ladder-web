// Mirrors SnakeGame/src/constants/app.ts and legal.ts — keep them in sync.
// TODO: replace the placeholder contact details before publishing.
export const APP_NAME = "Snakes & Ladders";
export const APP_TAGLINE = "Royal Edition";
export const APP_VERSION = "1.0.0";
export const DEVELOPER_NAME = "Your Studio Name";
export const SUPPORT_EMAIL = "support@yourdomain.com";
export const WEBSITE_URL = "https://yourdomain.com";
export const PRIVACY_EFFECTIVE_DATE = "24 September 2026";

export const emailUrl = (subject: string) =>
  `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}`;

export const HOW_TO_PLAY = [
  "Choose between two and four players, or play online with friends using a room code.",
  "Tap the dice to roll, and your token moves step by step.",
  "Land on a ladder’s foot to climb; land on a snake’s head to slide.",
  "Roll a six to take another turn.",
  "Land exactly on square 100 to win.",
];

export const PRIVACY_SECTIONS = [
  {
    title: "Overview",
    body: [
      `${DEVELOPER_NAME} built Snakes & Ladders as a game you can play offline, or online with friends. This policy covers the app and this website, and explains what information they handle and how.`,
    ],
  },
  {
    title: "Information We Collect",
    body: [
      "We do not collect, store or share any personal information. There are no accounts, sign-in, advertising or analytics.",
      "When you play online, the name you enter is sent to our game server and shown to the other players in your room. It is kept only while the room is open and is never stored afterwards.",
    ],
  },
  {
    title: "Data Stored on Your Device",
    body: [
      "The app and website save your music and sound-effect preferences and the name you last played under, on your device or in your browser only.",
      "This data never leaves your device. Uninstall the app or clear your browser’s site data to remove it.",
    ],
  },
  {
    title: "Internet & Permissions",
    body: [
      "Games on one device and against the computer work fully offline. Online games connect to our game server to share moves between players. We never ask for access to your contacts, location, camera or microphone.",
    ],
  },
  {
    title: "Children’s Privacy",
    body: [
      "The game is suitable for all ages. Because we collect no personal information, no data from children is gathered.",
    ],
  },
  {
    title: "Changes to This Policy",
    body: [
      "If this policy changes, the updated version will be posted here with a new effective date.",
    ],
  },
  {
    title: "Contact",
    body: [`Questions about this policy can be sent to ${SUPPORT_EMAIL}.`],
  },
];
