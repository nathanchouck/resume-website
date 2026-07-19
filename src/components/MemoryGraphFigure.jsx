/*
 * Agent memory graph. Every retrieval route travels ONLY along drawn gray
 * edges (the pulse picks a path through real connections), and every route
 * target is a permanent member of the node group, so nothing vanishes
 * between queries. Two modes:
 *   ambient    — free-running bead + breathing MATCH ring; no-JS fallback.
 *   controlled — the memory demo drives it: per-question route redraw,
 *                one-shot bead, flare at the target; `fading` dims the
 *                whole overlay during the question swap.
 * Ink strokes, one blue, mono only in-figure.
 */
import { MONO } from "@/utils/constants";

/* Shared curve segments — gray edges and blue routes use IDENTICAL
   geometry so the pulse always travels visible infrastructure. */
const SEG = {
  qA: "M40 150 C85 115 100 82 140 60",
  qD: "M40 150 C90 138 150 128 200 120",
  qF: "M40 150 C75 170 110 195 150 210",
  aD: "M140 60 Q160 96 200 120",
  aB: "M140 60 Q196 48 250 60",
  bC: "M250 60 Q284 42 320 40",
  bE: "M250 60 Q266 110 300 150",
  dE: "M200 120 Q255 130 300 150",
  dF: "M200 120 Q164 165 150 210",
  fG: "M150 210 Q198 230 250 230",
  gE: "M250 230 Q270 186 300 150",
  eH: "M300 150 Q324 114 360 90",
  hC: "M360 90 Q336 58 320 40",
  hM: "M360 90 Q378 144 380 200",
  gM: "M250 230 Q318 226 380 200",
};

/* One route per question — chains of the segments above (continuation
   segments drop their leading M via replace). */
const chain = (...ds) => ds.map((d, i) => (i === 0 ? d : d.replace(/^M[\d.\s]+/, ""))).join(" ");

const RETRIEVALS = [
  { d: chain(SEG.qF, SEG.fG, SEG.gM), node: { x: 380, y: 200 } },
  { d: chain(SEG.qA, SEG.aB, SEG.bC), node: { x: 320, y: 40 } },
  { d: chain(SEG.qD, SEG.dE, SEG.eH), node: { x: 360, y: 90 } },
  { d: chain(SEG.qF, SEG.fG), node: { x: 250, y: 230 } },
  { d: SEG.qA, node: { x: 140, y: 60 } },
  { d: chain(SEG.qD, SEG.dE), node: { x: 300, y: 150 } },
];

const AMBIENT_D = RETRIEVALS[0].d;

export default function MemoryGraphFigure({
  className = "",
  mode = "ambient",
  pulseKey = 0,
  pathIndex = 0,
  fading = false,
}) {
  const controlled = mode === "controlled";
  const route = RETRIEVALS[pathIndex % RETRIEVALS.length];

  return (
    <svg
      viewBox="0 0 440 300"
      role="img"
      aria-label="Line drawing of an agent memory graph: a query node on the left connects through curved edges to memory nodes; a pulse travels a highlighted retrieval path along the edges to the matched memory."
      className={`${MONO.className} ${className}`}
      fill="none"
    >
      {/* Graph edges — hairline, gently bowed; includes the query's links */}
      <g className="anim-fade" stroke="var(--border)" strokeWidth="0.9">
        <path d={SEG.qA} />
        <path d={SEG.qD} />
        <path d={SEG.qF} />
        <path d={SEG.aD} />
        <path d={SEG.aB} />
        <path d={SEG.bC} />
        <path d={SEG.bE} />
        <path d={SEG.dE} />
        <path d={SEG.dF} />
        <path d={SEG.fG} />
        <path d={SEG.gE} />
        <path d={SEG.eH} />
        <path d={SEG.hC} />
        <path d={SEG.hM} />
        <path d={SEG.gM} />
      </g>

      {/* Retrieval overlay */}
      {controlled ? (
        <g style={{ opacity: fading ? 0 : 1, transition: "opacity 400ms ease" }}>
          <path
            key={`route-${pathIndex}-${pulseKey}`}
            className="anim-stroke"
            pathLength="1"
            style={{ "--d": "0.05s" }}
            d={route.d}
            stroke="var(--accent-ink)"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <path
            key={`bead-${pathIndex}-${pulseKey}`}
            className="anim-bead-once"
            pathLength="100"
            d={route.d}
            stroke="var(--accent-ink)"
            strokeWidth="2.75"
            strokeLinecap="round"
          />
        </g>
      ) : (
        <>
          <path
            className="anim-stroke"
            pathLength="1"
            style={{ "--d": "0.5s" }}
            d={AMBIENT_D}
            stroke="var(--accent-ink)"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <path
            className="anim-bead"
            pathLength="100"
            d={AMBIENT_D}
            stroke="var(--accent-ink)"
            strokeWidth="2.75"
            strokeLinecap="round"
          />
        </>
      )}

      {/* Memory nodes — ink rings on paper; every route target included */}
      <g className="anim-fade" stroke="var(--primary-text)" strokeWidth="1.25" fill="var(--bg)">
        <circle cx="140" cy="60" r="7" />
        <circle cx="250" cy="60" r="5.5" />
        <circle cx="320" cy="40" r="7" />
        <circle cx="200" cy="120" r="7" />
        <circle cx="300" cy="150" r="7" />
        <circle cx="150" cy="210" r="5.5" />
        <circle cx="250" cy="230" r="7" />
        <circle cx="360" cy="90" r="5.5" />
        <circle cx="380" cy="200" r="7" />
      </g>

      {/* Query node — filled ink */}
      <g className="anim-fade">
        <circle cx="40" cy="150" r="7" fill="var(--accent-ink)" />
        <text x="40" y="180" fontSize="11" fill="var(--tertiary-text)" letterSpacing="2" textAnchor="middle">QUERY</text>
      </g>

      {/* Match indicator */}
      {controlled ? (
        <g
          key={`match-${pathIndex}-${pulseKey}`}
          style={{ opacity: fading ? 0 : 1, transition: "opacity 400ms ease" }}
        >
          <circle
            className="anim-ring-flare"
            cx={route.node.x} cy={route.node.y} r="12"
            stroke="var(--accent-ink)"
            strokeWidth="1"
          />
          <text
            className="anim-fade"
            style={{ "--d": "1.7s" }}
            x={route.node.x} y={route.node.y + 27}
            fontSize="11" fill="var(--tertiary-text)" letterSpacing="2" textAnchor="middle"
          >
            MATCH
          </text>
        </g>
      ) : (
        <g className="anim-fade">
          <text x="380" y="236" fontSize="11" fill="var(--tertiary-text)" letterSpacing="2" textAnchor="middle">MATCH</text>
          <circle
            className="anim-breathe"
            cx="380" cy="200" r="13"
            stroke="var(--accent-ink)"
            strokeWidth="0.9"
          />
        </g>
      )}
    </svg>
  );
}
