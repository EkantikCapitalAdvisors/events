import type { ComplianceProfile } from "./types";

/**
 * Per-lane standing disclaimers (§6 / §9). Selected by `compliance_profile`,
 * NOT by display category — so the legal lane and the surface are decoupled.
 *
 * ATTORNEY GATE: this is draft template text. Nothing ships until
 * securities-counsel review. Performance figures are bracketed placeholders.
 */
export interface ComplianceCopy {
  label: string;
  /** Standing footer paragraph for the surface. */
  standing: string;
  /** Short line shown inline near figures / CTAs. */
  short: string;
}

export const COMPLIANCE: Record<ComplianceProfile, ComplianceCopy> = {
  futures: {
    label: "Futures Risk Disclosure",
    standing:
      "Trading futures involves substantial risk of loss and is not suitable for every investor. Any figures shown are hand-logged actuals, presented for illustration and labeled as such; past performance does not guarantee future results. Loss-First Architecture is an operating discipline, not a guarantee or any form of principal protection. No forward return projections are made. Nothing here is personalized investment advice.",
    short:
      "Futures involve substantial risk of loss. Figures are hand-logged actuals; past performance does not guarantee future results.",
  },
  publisher: {
    label: "Publisher / Research Disclosure",
    standing:
      "These sessions are educational research, not personalized investment advice. Any model portfolio referenced is hypothetical; historical or backtested figures are labeled as such and have inherent limitations. Nothing here is a recommendation to buy or sell any specific security for your situation. Investing involves risk, including loss of principal.",
    short:
      "Educational research, not advice. Any model portfolio is hypothetical; backtested figures are labeled.",
  },
  advisory: {
    label: "Advisory / Accredited Disclosure",
    standing:
      "This material is for accredited investors only and is not an offer to sell or a solicitation of an offer to buy any security. Investing involves risk, including loss of principal. Any figures are historical and accompanied by full disclosures. Advisory services are subject to a written agreement; nothing here is personalized investment advice.",
    short:
      "Accredited investors only. Not an offer to sell securities. Investing involves risk.",
  },
};

/** Universal standing line appended on every investor-facing surface (§9). */
export const UNIVERSAL_DISCLAIMER =
  "Investing involves risk; past performance does not guarantee future results. Any figures are historical or hypothetical and labeled as such. Nothing on this page is personalized investment advice.";

export function complianceFor(profile: ComplianceProfile): ComplianceCopy {
  return COMPLIANCE[profile];
}
