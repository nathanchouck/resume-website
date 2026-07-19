import { SANS } from "@/utils/constants";

/* Primary CTA: Iron-Gall fill, Paper White text, trailing arrow. */
export default function PrimaryButton({ href, download, children }) {
  return (
    <a
      href={href}
      download={download}
      className={`${SANS.className} inline-flex items-center gap-2 text-[14px] font-semibold px-6 py-3 bg-(--accent) text-(--button-text) hover:opacity-90 active:translate-y-px transition-[opacity,transform]`}
    >
      {children}
      <span aria-hidden="true">→</span>
    </a>
  );
}
