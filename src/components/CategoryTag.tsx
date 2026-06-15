import type { Category, SessionType } from "@/lib/types";

const CATEGORY_LABEL: Record<Category, string> = {
  ecfs: "ECFS",
  alpha: "Alpha Engine",
  epig: "Ekantik 500",
  foundational: "Foundational",
};

export function categoryLabel(c: Category): string {
  return CATEGORY_LABEL[c];
}

export function CategoryTag({ category }: { category: Category }) {
  return (
    <span className="inline-flex items-center rounded-full border border-gold/40 bg-gold/5 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-label text-gold-600">
      {CATEGORY_LABEL[category]}
    </span>
  );
}

export function SessionTypeTag({ type }: { type: SessionType }) {
  return (
    <span className="inline-flex items-center rounded-full border border-navy/15 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-label text-slate">
      {type === "meeting" ? "Interactive" : "Webinar"}
    </span>
  );
}
