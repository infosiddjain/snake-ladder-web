"use server";

import { APP_NAME, APP_VERSION } from "@/lib/site";
import {
  EMPTY_CONTACT,
  readContact,
  validateContact,
  type ContactField,
  type ContactState,
} from "@/lib/contact";

const HUBFORM_URL = "https://hub-form.vercel.app/api/f/382iy2Q6ytC8";

type HubFormResponse =
  | { ok: true }
  | { ok: false; code?: string; error?: string; field?: string };

export async function sendContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const values = readContact(formData);
  const fail = (message: string, errors: ContactState["errors"] = {}): ContactState => ({
    status: "error",
    message,
    errors,
    values,
    id: Date.now(),
  });

  // Spam trap: bots fill hidden fields. Pretend it worked and send nothing.
  if (formData.get("_gotcha")) {
    return sent();
  }

  const errors = validateContact(values);
  if (Object.keys(errors).length > 0) return fail("Please fix the highlighted fields.", errors);

  const key = process.env.HUB_KEY;
  if (!key) {
    console.error("sendContact: HUB_KEY is not set");
    return fail("The contact form isn’t set up yet. Please email us instead.");
  }

  try {
    const res = await fetch(HUBFORM_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({ ...values, source: `${APP_NAME} website (v${APP_VERSION})` }),
      cache: "no-store",
    });
    const data = (await res.json().catch(() => null)) as HubFormResponse | null;

    if (!data) return fail("Something went wrong. Please try again in a moment.");
    if (!data.ok) {
      const message = data.error || "Your message couldn’t be sent. Please try again.";
      const field = data.field as ContactField | undefined;
      return fail(message, field && field in EMPTY_CONTACT ? { [field]: message } : {});
    }
  } catch (err) {
    console.error("sendContact: request failed", err);
    return fail("Couldn’t reach the server. Check your connection and try again.");
  }

  return sent();
}

const sent = (): ContactState => ({
  status: "success",
  message: "Thanks! Your message has been sent.",
  errors: {},
  values: EMPTY_CONTACT,
  id: Date.now(),
});
