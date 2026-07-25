import { SANS, SERIF } from "@/utils/constants";

export const metadata = {
  title: "404 — Not Found",
  description: "Page not found.",
};

const ROUTES = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/resume", label: "Résumé" },
  { href: "/musings", label: "Musings" },
  { href: "/now", label: "Now" },
];

export default function NotFound() {
  return (
    <div className="min-h-screen w-screen flex items-center justify-center px-5">
      <div className="flex flex-col gap-6 max-w-md">
        <p
          className={`${SANS.className} text-[13px] font-medium tabular-nums text-(--tertiary-text) anim-rise`}
          style={{ "--d": "0s" }}
        >
          404
        </p>

        <h1
          className={`${SERIF.className} text-[clamp(1.9rem,4vw,2.4rem)] font-medium text-(--primary-text) anim-lift`}
          style={{ "--d": "0.07s" }}
        >
          Nothing here.
        </h1>

        <p
          className={`${SERIF.className} text-[16px] leading-[1.65] text-(--secondary-text) anim-rise`}
          style={{ "--d": "0.14s" }}
        >
          The page you're looking for doesn't exist or has been moved.
        </p>

        <nav
          aria-label="Site contents"
          className="pt-2 border-t border-(--border) anim-rise"
          style={{ "--d": "0.21s" }}
        >
          <ol>
            {ROUTES.map(({ href, label }) => (
              <li key={href}>
                <a
                  href={href}
                  className="group flex items-baseline justify-between py-3 border-b border-(--border) hover:bg-(--button-highlight) transition-colors -mx-3 px-3"
                >
                  <span
                    className={`${SANS.className} text-[14px] font-medium text-(--primary-text)`}
                  >
                    {label}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`${SANS.className} text-[13px] text-(--tertiary-text) group-hover:text-(--active) group-hover:translate-x-0.5 transition-[color,transform]`}
                  >
                    →
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  );
}
