/* Quiet document link: hairline underline, floods Iron-Gall on hover.
   Color is intentionally not set here — it inherits from the parent
   (e.g. text-(--secondary-text) on the wrapping span), matching the
   contract callers relied on before extraction. */
export default function QuietLink({ href, download, children }) {
  return (
    <a
      href={href}
      download={download}
      className="inline-block py-3.5 -my-3.5 underline underline-offset-4 decoration-1 decoration-(--border) hover:text-(--active) hover:decoration-(--active) transition-colors"
    >
      {children}
    </a>
  );
}
