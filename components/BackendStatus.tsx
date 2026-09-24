"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/lib/config";

/** Calls the backend root route and shows what it says. */
export default function BackendStatus() {
  const [status, setStatus] = useState<"checking" | "online" | "offline">("checking");
  const [reply, setReply] = useState("");

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.text())
      .then((text) => {
        setReply(text);
        setStatus("online");
      })
      .catch(() => setStatus("offline"));
  }, []);

  return (
    <div className="status-pill" data-status={status}>
      <span className="status-dot" />
      {status === "checking" && "Checking game server…"}
      {status === "online" && (
        <>
          Game server online — it says <q>{reply}</q>
        </>
      )}
      {status === "offline" && `Game server offline (${API_URL})`}
    </div>
  );
}
