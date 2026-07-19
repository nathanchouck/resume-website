import { SANS } from "@/utils/constants";

/* Section title: Archivo semibold, normal case, ink, trailing hairline —
   an instrument label, not an eyebrow. Italic serif is reserved for prose
   and captions, never for labels. (DESIGN.md: The Two Voices Rule.) */
export default function SectionTitle({ children }) {
  return (
    <div className="flex items-center gap-5">
      <h2
        className={`${SANS.className} text-[13px] font-semibold tracking-[0.01em] text-(--primary-text)`}
      >
        {children}
      </h2>
      <span aria-hidden="true" className="flex-1 h-px bg-(--border)" />
    </div>
  );
}
