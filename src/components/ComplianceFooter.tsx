import type { ComplianceProfile } from "@/lib/types";
import { complianceFor, UNIVERSAL_DISCLAIMER } from "@/lib/compliance";

/**
 * Compliance footer (§9, Feature #16) — standing text selected by
 * `compliance_profile`, NOT by display category. Every investor-facing surface
 * carries exactly one lane's disclaimer; figures from two tracks never share a
 * surface (§6 cross-contamination guardrail).
 */
export function ComplianceFooter({ profile }: { profile: ComplianceProfile }) {
  const copy = complianceFor(profile);

  return (
    <footer className="border-t border-navy/10 bg-ivory">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <p className="font-mono text-[11px] uppercase tracking-label text-gold-600">
          {copy.label}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate">{copy.standing}</p>
        <p className="mt-3 text-xs leading-relaxed text-slate/80">
          {UNIVERSAL_DISCLAIMER}
        </p>
        <p className="mt-6 font-mono text-[10px] uppercase tracking-label text-slate/60">
          © {new Date().getFullYear()} Ekantik Capital Advisors. Draft templates
          — pending securities-counsel review.
        </p>
      </div>
    </footer>
  );
}
