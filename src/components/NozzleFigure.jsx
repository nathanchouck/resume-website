/*
 * Converging–diverging nozzle cross-section, drawn like a fine-line
 * instrument drawing: weighted ink contour, hairline construction,
 * drafting-tick dimension callouts, and a pair of streamlines whose
 * traveling dashes keep the flow alive after the entrance. Symbolic
 * dimensions only (d*, de); illustrative. Pure-CSS animation — the
 * drawing is complete without JS and static under reduced motion.
 */
import { MONO } from "@/utils/constants";

export default function NozzleFigure({ className = "", variant = "figure" }) {
  // background: contours + centerline + traveling streamlines only —
  // no text, no dimensions. Used as faint ambient line-work behind the hero.
  const bg = variant === "background";
  return (
    <svg
      viewBox="0 0 920 300"
      role={bg ? undefined : "img"}
      aria-hidden={bg ? "true" : undefined}
      aria-label={bg ? undefined : "Cross-section line drawing of a converging–diverging nozzle with animated streamlines: flow enters the chamber on the left, chokes at the throat where Mach equals one, and expands through the bell to a supersonic exit."}
      className={`${MONO.className} ${className}`}
      fill="none"
    >
      {/* Centerline — long-short dash, hairline */}
      <line
        className="anim-fade"
        x1="64" y1="150" x2="884" y2="150"
        stroke="var(--tertiary-text)"
        strokeWidth="0.75"
        strokeDasharray="18 5 3 5"
      />

      {/* Expansion characteristics — two, hairline */}
      <g className="anim-fade" stroke="var(--border)" strokeWidth="0.9" strokeDasharray="3 6">
        <line x1="470" y1="150" x2="760" y2="98" />
        <line x1="470" y1="150" x2="760" y2="202" />
      </g>

      {/* Streamlines — ambient: fine ink-blue dashes traveling with the flow */}
      <g stroke="var(--accent-ink)" strokeWidth="0.9" opacity="0.55" strokeLinecap="round">
        <path
          className="anim-flow"
          d="M80 114 H300 C390 118 435 128 470 134 C520 132 700 116 855 105"
        />
        <path
          className="anim-flow"
          style={{ "--d": "1.65s" }}
          d="M80 186 H300 C390 182 435 172 470 166 C520 168 700 184 855 195"
        />
      </g>

      {/* Nozzle contour — the weighted stroke */}
      <path
        className="anim-stroke"
        pathLength="1"
        style={{ "--d": "0.35s" }}
        d="M110 78 H300 C380 84 432 112 470 118 C508 118 640 86 830 60"
        stroke="var(--primary-text)"
        strokeWidth="2.25"
        strokeLinecap="round"
      />
      <path
        className="anim-stroke"
        pathLength="1"
        style={{ "--d": "0.45s" }}
        d="M110 222 H300 C380 216 432 188 470 182 C508 182 640 214 830 240"
        stroke="var(--primary-text)"
        strokeWidth="2.25"
        strokeLinecap="round"
      />
      {/* Injector face + hairline flange echo */}
      <path
        className="anim-stroke"
        pathLength="1"
        style={{ "--d": "0.25s" }}
        d="M110 78 V222"
        stroke="var(--primary-text)"
        strokeWidth="2.25"
        strokeLinecap="round"
      />
      <path
        className="anim-stroke"
        pathLength="1"
        style={{ "--d": "0.3s" }}
        d="M103 88 V212"
        stroke="var(--primary-text)"
        strokeWidth="0.7"
        strokeLinecap="round"
      />

      {bg ? null : (<>
      {/* Throat dimension — d*, drafting ticks */}
      <g className="anim-fade">
        <line x1="470" y1="120" x2="470" y2="180" stroke="var(--accent-ink)" strokeWidth="1" />
        <line x1="464" y1="124" x2="476" y2="112" stroke="var(--accent-ink)" strokeWidth="1.1" />
        <line x1="464" y1="188" x2="476" y2="176" stroke="var(--accent-ink)" strokeWidth="1.1" />
        <text x="482" y="147" fontSize="12" fill="var(--accent-ink)">d*</text>
        <text x="482" y="163" fontSize="11" fill="var(--tertiary-text)">M = 1</text>
      </g>

      {/* Exit dimension — de, drafting ticks */}
      <g className="anim-fade">
        <line x1="830" y1="62" x2="830" y2="238" stroke="var(--accent-ink)" strokeWidth="1" />
        <line x1="824" y1="66" x2="836" y2="54" stroke="var(--accent-ink)" strokeWidth="1.1" />
        <line x1="824" y1="246" x2="836" y2="234" stroke="var(--accent-ink)" strokeWidth="1.1" />
        <text x="842" y="147" fontSize="12" fill="var(--accent-ink)">
          d<tspan fontSize="9" dy="3">e</tspan>
        </text>
        <text x="842" y="163" fontSize="11" fill="var(--tertiary-text)">M &gt; 1</text>
      </g>

      {/* Station labels with hairline leaders */}
      <g className="anim-fade" fontSize="11" fill="var(--tertiary-text)" letterSpacing="2">
        <text x="205" y="44" textAnchor="middle">CHAMBER</text>
        <line x1="205" y1="52" x2="205" y2="70" stroke="var(--border)" strokeWidth="0.6" />
        <text x="470" y="44" textAnchor="middle">THROAT</text>
        <line x1="470" y1="52" x2="470" y2="110" stroke="var(--border)" strokeWidth="0.6" />
        <text x="830" y="44" textAnchor="middle">EXIT</text>
      </g>
      </>)}
    </svg>
  );
}
