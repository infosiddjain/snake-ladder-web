"use client";

import { useActionState, useState, type FormEvent } from "react";
import { sendContact } from "@/app/actions/contact";
import {
  CONTACT_LIMITS,
  EMPTY_CONTACT,
  readContact,
  validateContact,
  type ContactErrors,
  type ContactField,
  type ContactState,
} from "@/lib/contact";

const initialState: ContactState = {
  status: "idle",
  message: "",
  errors: {},
  values: EMPTY_CONTACT,
  id: 0,
};

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(sendContact, initialState);
  // Errors found in the browser before submitting; server errors arrive in `state`.
  const [clientErrors, setClientErrors] = useState<ContactErrors | null>(null);

  const errors = clientErrors ?? state.errors;

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    const found = validateContact(readContact(new FormData(e.currentTarget)));
    if (Object.keys(found).length > 0) {
      e.preventDefault();
      setClientErrors(found);
      const first = Object.keys(found)[0];
      e.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setClientErrors(null);
  };

  // Clear a field's error as soon as the visitor edits it.
  const clearError = (field: ContactField) => {
    if (errors[field]) setClientErrors({ ...errors, [field]: undefined });
  };

  const fieldProps = (field: ContactField) => ({
    id: `contact-${field}`,
    name: field,
    defaultValue: state.values[field],
    "aria-invalid": Boolean(errors[field]),
    "aria-describedby": errors[field] ? `contact-${field}-error` : undefined,
    onChange: () => clearError(field),
  });

  const fieldError = (field: ContactField) =>
    errors[field] ? (
      <span id={`contact-${field}-error`} className="field-error">
        {errors[field]}
      </span>
    ) : null;

  return (
    <>
      <form
        className="card contact-form"
        action={formAction}
        onSubmit={onSubmit}
        noValidate
      >
        <h3>Send a Message</h3>
        <label className="field" htmlFor="contact-name">
          Name
          <input
            {...fieldProps("name")}
            type="text"
            autoComplete="name"
            maxLength={CONTACT_LIMITS.name}
            placeholder="Your name"
            required
          />
          {fieldError("name")}
        </label>
        <label className="field" htmlFor="contact-email">
          Email
          <input
            {...fieldProps("email")}
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
          />
          {fieldError("email")}
        </label>
        <label className="field" htmlFor="contact-message">
          Message
          <textarea
            {...fieldProps("message")}
            rows={5}
            maxLength={CONTACT_LIMITS.message}
            placeholder="Found a bug or have an idea? Tell us about it."
            required
          />
          {fieldError("message")}
        </label>
        {/* Spam trap: hidden from people, bots fill it in. */}
        <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
        <button type="submit" className="btn btn-primary self-center" disabled={pending}>
          {pending ? "Sending…" : "Send Message"}
        </button>
      </form>

      {state.status !== "idle" && !pending && (
        <div
          key={state.id}
          role={state.status === "error" ? "alert" : "status"}
          className="toast"
          data-status={state.status}
        >
          {state.status === "success" ? "✓ " : "⚠ "}
          {state.message}
        </div>
      )}
    </>
  );
}
