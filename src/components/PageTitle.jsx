import { SERIF } from "@/utils/constants";

/* Page title: serif h1 + trailing hairline — used identically atop
   Projects, Résumé, and Now. (DESIGN.md: The Two Voices Rule.) */
export default function PageTitle({ children }) {
  return (
    <div className="anim-rise flex items-baseline gap-5" style={{ "--d": "0s" }}>
      <h1 className={`${SERIF.className} text-[clamp(1.7rem,3vw,2rem)] font-medium text-(--primary-text)`}>
        {children}
      </h1>
      <span aria-hidden="true" className="flex-1 h-px bg-(--border) self-center" />
    </div>
  );
}
