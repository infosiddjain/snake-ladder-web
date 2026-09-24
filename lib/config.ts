/**
 * Snake-backend address, deployed on Render. Set NEXT_PUBLIC_API_URL in
 * .env.local (e.g. http://localhost:4000) to use a local server instead.
 */
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://snake-ladder-backend-1s20.onrender.com";

export const WS_URL =
  process.env.NEXT_PUBLIC_WS_URL ?? `${API_URL.replace(/^http/, "ws")}/ws`;
