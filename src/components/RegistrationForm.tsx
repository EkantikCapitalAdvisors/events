"use client";

import { useState, type FormEvent } from "react";
import type { EkantikEvent, ComplianceProfile } from "@/lib/types";
import { AddToCalendar } from "./AddToCalendar";

/**
 * Phase 2 native registration form (§8) — the owned capture path that replaces
 * the Phase 1 Zoom link-out. Three variants, selected by the event's
 * compliance lane (NOT its display category), so a foundational session
 * inherits the right form for whatever surface it sits on:
 *
 *   futures   → ECFS light   (low friction = more registrations)
 *   publisher → Alpha light  (publisher consent; accreditation is OPTIONAL,
 *                             a routing signal only — never a gate)
 *   advisory  → EPIG gated   (accreditation attestation IS the gate)
 *
 * Posts to /api/register. Until Zoom S2S + HubSpot credentials are configured
 * the backend returns 501; we degrade gracefully to the Zoom source-tracking
 * link (carrying ?ref=) so the page never strands a visitor without a path to
 * register. When the backend is live, a 200 returns the confirmation state
 * with the unique join link + add-to-calendar.
 */
type Variant = "ecfs" | "alpha" | "epig";

const VARIANT_BY_PROFILE: Record<ComplianceProfile, Variant> = {
  futures: "ecfs",
  publisher: "alpha",
  advisory: "epig",
};

type State = "idle" | "submitting" | "success" | "fallback" | "error";

export function RegistrationForm({
  event,
  sourceRef,
}: {
  event: EkantikEvent;
  sourceRef?: string;
}) {
  const variant = VARIANT_BY_PROFILE[event.complianceProfile];
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState<string>("");
  const [fallbackUrl, setFallbackUrl] = useState<string | undefined>();
  const [joinUrl, setJoinUrl] = useState<string | undefined>();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state === "submitting") return;
    setState("submitting");
    setMessage("");

    const form = new FormData(e.currentTarget);
    const firstName = String(form.get("firstName") ?? "").trim();
    const lastName = String(form.get("lastName") ?? "").trim();

    const payload = {
      slug: event.slug,
      name: `${firstName} ${lastName}`.trim(),
      firstName,
      lastName,
      email: String(form.get("email") ?? "").trim(),
      phone: String(form.get("phone") ?? "").trim() || undefined,
      consent: form.get("consent") === "on",
      // EPIG attestation is the gate; Alpha's select is a routing signal only.
      accredited: variant === "epig" ? form.get("accreditation") === "on" : false,
      accreditationSelfId: form.get("accreditationSelfId") || undefined,
      primaryInterest: form.get("primaryInterest") || undefined,
      futuresTrader: form.get("futuresTrader") || undefined,
      researchInterest: form.get("researchInterest") || undefined,
      investableAssets: form.get("investableAssets") || undefined,
      inviteCode: form.get("inviteCode") || undefined,
      prompt: form.get("prompt") || undefined,
      sourceRef,
    };

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setJoinUrl(data.joinUrl);
        setState("success");
        return;
      }
      if (res.status === 501 && data?.error === "native_registration_not_configured") {
        // Owned path not yet wired — fall back to the Zoom source-tracking link.
        setFallbackUrl(data.fallbackUrl ?? undefined);
        setState("fallback");
        return;
      }
      setMessage(data?.error ?? "Registration failed — please try again.");
      setState("error");
    } catch {
      setMessage("Network error — please try again.");
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div role="status">
        <p className="inline-flex items-center gap-2 rounded-md bg-gold/10 px-4 py-2 font-mono text-sm uppercase tracking-label text-gold-600">
          Registered
        </p>
        <p className="mt-4 text-sm text-slate">
          Your join link is on its way by email. Add it to your calendar so you
          don&apos;t miss it:
        </p>
        <div className="mt-4">
          <AddToCalendar event={event} joinUrl={joinUrl} />
        </div>
      </div>
    );
  }

  if (state === "fallback") {
    const href = fallbackUrl ?? event.zoomRegistrationUrl;
    return (
      <div role="status">
        <p className="text-sm text-slate">
          Finish your registration on our secure session partner — your details
          and source are carried through.
        </p>
        {href && (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex w-full items-center justify-center rounded-md bg-gold px-6 py-3 text-base font-medium text-navy transition hover:bg-gold-600"
          >
            Continue to register
          </a>
        )}
      </div>
    );
  }

  const isEpig = variant === "epig";
  const submitting = state === "submitting";

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="First name" required>
          <input name="firstName" required autoComplete="given-name" className={inputCls} />
        </Field>
        <Field label="Last name" required>
          <input name="lastName" required autoComplete="family-name" className={inputCls} />
        </Field>
      </div>

      <Field label="Email" required>
        <input name="email" type="email" required autoComplete="email" className={inputCls} />
      </Field>

      <Field label="Phone" required={isEpig} hint={isEpig ? undefined : "Optional"}>
        <input
          name="phone"
          type="tel"
          required={isEpig}
          autoComplete="tel"
          className={inputCls}
        />
      </Field>

      {variant === "ecfs" && (
        <>
          <Field label="Primary interest" hint="Optional">
            <select name="primaryInterest" defaultValue="" className={inputCls}>
              <option value="">Select one…</option>
              <option>Consistent cash flow</option>
              <option>Understanding the methodology</option>
              <option>Evaluating for my capital</option>
            </select>
          </Field>
          <Field label="Active futures trader?" hint="Optional">
            <select name="futuresTrader" defaultValue="" className={inputCls}>
              <option value="">Select one…</option>
              <option>Yes</option>
              <option>Not yet</option>
              <option>Exploring</option>
            </select>
          </Field>
        </>
      )}

      {variant === "alpha" && (
        <>
          <Field label="How do you invest?" hint="Optional">
            <select name="researchInterest" defaultValue="" className={inputCls}>
              <option value="">Select one…</option>
              <option>Self-directed</option>
              <option>Work with an advisor</option>
              <option>Exploring</option>
            </select>
          </Field>
          <Field label="Accredited investor?" hint="Optional — routing only">
            <select name="accreditationSelfId" defaultValue="" className={inputCls}>
              <option value="">Prefer not to say</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </Field>
        </>
      )}

      {isEpig && (
        <>
          <label className="flex items-start gap-2 rounded-md border border-gold/40 bg-gold/5 p-3 text-sm text-navy">
            <input
              type="checkbox"
              name="accreditation"
              required
              className="mt-0.5 h-4 w-4 rounded border-navy/30 text-gold focus:ring-gold"
            />
            <span>
              I qualify as an accredited investor (as defined under SEC rules).
            </span>
          </label>

          <Field label="Investable assets" required>
            <select name="investableAssets" required defaultValue="" className={inputCls}>
              <option value="" disabled>
                Select a range…
              </option>
              <option>$500K–$1M</option>
              <option>$1M–$5M</option>
              <option>$5M+</option>
            </select>
          </Field>

          <Field label="What's prompting your interest?" hint="Optional">
            <textarea name="prompt" rows={3} className={inputCls} />
          </Field>

          <Field label="Invite code" hint="If you were given one">
            <input name="inviteCode" className={inputCls} />
          </Field>
        </>
      )}

      <label className="flex items-start gap-2 text-xs leading-relaxed text-slate">
        <input
          type="checkbox"
          name="consent"
          required
          className="mt-0.5 h-4 w-4 rounded border-navy/30 text-gold focus:ring-gold"
        />
        <span>{consentCopy(variant)}</span>
      </label>

      {state === "error" && (
        <p role="alert" className="text-xs text-signal">
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex w-full items-center justify-center rounded-md bg-gold px-6 py-3 text-base font-medium text-navy transition hover:bg-gold-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Registering…" : "Register"}
      </button>
    </form>
  );
}

const inputCls =
  "w-full rounded-md border border-navy/15 bg-white px-3 py-2 text-sm text-navy placeholder:text-slate focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold";

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 flex items-baseline justify-between">
        <span className="font-mono text-[11px] uppercase tracking-label text-navy/80">
          {label}
          {required && <span className="text-signal"> *</span>}
        </span>
        {hint && <span className="text-[10px] text-slate">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

function consentCopy(variant: Variant): string {
  if (variant === "alpha") {
    return "I understand these sessions are educational research, not personalized investment advice, and I'd like to receive Ekantik research communications.";
  }
  if (variant === "epig") {
    return "I consent to be contacted and acknowledge the disclosures applicable to accredited investors.";
  }
  return "I'd like to receive Ekantik communications and acknowledge the risk disclosure.";
}
