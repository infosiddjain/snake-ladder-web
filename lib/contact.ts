// Shared by the contact form (instant feedback) and the server action (the real check).
export type ContactField = "name" | "email" | "message";
export type ContactValues = Record<ContactField, string>;
export type ContactErrors = Partial<Record<ContactField, string>>;

export type ContactState = {
  status: "idle" | "success" | "error";
  message: string;
  errors: ContactErrors;
  values: ContactValues;
  // Changes on every submit so the toast re-appears even when the message repeats.
  id: number;
};

export const EMPTY_CONTACT: ContactValues = { name: "", email: "", message: "" };

export const CONTACT_LIMITS = { name: 80, message: 2000, messageMin: 10 };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function readContact(formData: FormData): ContactValues {
  const get = (key: ContactField) => String(formData.get(key) ?? "").trim();
  return { name: get("name"), email: get("email"), message: get("message") };
}

export function validateContact({ name, email, message }: ContactValues): ContactErrors {
  const errors: ContactErrors = {};
  if (!name) errors.name = "Please enter your name.";
  else if (name.length < 2) errors.name = "Name must be at least 2 characters.";
  else if (name.length > CONTACT_LIMITS.name)
    errors.name = `Name must be under ${CONTACT_LIMITS.name} characters.`;

  if (!email) errors.email = "Please enter your email.";
  else if (!EMAIL_RE.test(email)) errors.email = "Please enter a valid email address.";

  if (!message) errors.message = "Please write a message.";
  else if (message.length < CONTACT_LIMITS.messageMin)
    errors.message = `Message must be at least ${CONTACT_LIMITS.messageMin} characters.`;
  else if (message.length > CONTACT_LIMITS.message)
    errors.message = `Message must be under ${CONTACT_LIMITS.message} characters.`;

  return errors;
}
