"use client";

/*
 * NotebookGraph — the knowledge graph plotted as a technical chart from the
 * same desk as NozzleFigure / MemoryGraphFigure: hairline ink edges, four
 * plot-marker node shapes sized by degree, stroke-draw entrance. No neon, no
 * glow. Pan/zoom is a single transformed <g> (no library); the index list
 * below is the accessible/keyboard interface, so nodes are not tab stops.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { MONO, SANS } from "@/utils/constants";
import { stripEmphasis } from "@/components/NotebookMarkers";

const VBW = 1000;
const VBH = 620;
const K_MIN = 0.75;
const K_MAX = 3;

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

export default function NotebookGraph({ nodes, edges, activeIds, selectedId, onSelect }) {
  const svgRef = useRef(null);
  const innerRef = useRef(null);
  const transformRef = useRef({ x: 0, y: 0, k: 1 });
  const dragRef = useRef(null);
  const movedRef = useRef(false);

  const [hoveredId, setHoveredId] = useState(null);
  const [transformed, setTransformed] = useState(false);

  // Lookups derived once from the (static) graph data.
  const { nodeById, neighbors, rOf, topIds } = useMemo(() => {
    const nodeById = new Map(nodes.map((n) => [n.id, n]));
    const neighbors = new Map(nodes.map((n) => [n.id, new Set()]));
    edges.forEach((e) => {
      neighbors.get(e.source)?.add(e.target);
      neighbors.get(e.target)?.add(e.source);
    });
    const degs = nodes.map((n) => n.degree || 0);
    const sMin = Math.sqrt(Math.max(Math.min(...degs), 0));
    const sMax = Math.sqrt(Math.max(Math.max(...degs), 1));
    const rOf = (d) => {
      const s = Math.sqrt(Math.max(d || 0, 0));
      const t = sMax > sMin ? (s - sMin) / (sMax - sMin) : 0;
      return 2.5 + t * (8 - 2.5);
    };
    const topIds = new Set(
      [...nodes].sort((a, b) => (b.degree || 0) - (a.degree || 0)).slice(0, 8).map((n) => n.id)
    );
    return { nodeById, neighbors, rOf, topIds };
  }, [nodes, edges]);

  const transformStr = () => {
    const t = transformRef.current;
    return `translate(${t.x} ${t.y}) scale(${t.k})`;
  };
  const applyTransform = () => {
    innerRef.current?.setAttribute("transform", transformStr());
  };
  const isIdentity = (t) =>
    Math.abs(t.k - 1) < 1e-3 && Math.abs(t.x) < 0.5 && Math.abs(t.y) < 0.5;
  const reset = () => {
    transformRef.current = { x: 0, y: 0, k: 1 };
    applyTransform();
    setTransformed(false);
  };

  // Wheel zoom toward cursor — non-passive so we can preventDefault the scroll.
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return undefined;
    const onWheel = (e) => {
      e.preventDefault();
      const rect = svg.getBoundingClientRect();
      const t = transformRef.current;
      const px = ((e.clientX - rect.left) / rect.width) * VBW;
      const py = ((e.clientY - rect.top) / rect.height) * VBH;
      const factor = e.deltaY < 0 ? 1.12 : 1 / 1.12;
      const k = clamp(t.k * factor, K_MIN, K_MAX);
      const cx = (px - t.x) / t.k;
      const cy = (py - t.y) / t.k;
      transformRef.current = { x: px - cx * k, y: py - cy * k, k };
      applyTransform();
      setTransformed(!isIdentity(transformRef.current));
    };
    svg.addEventListener("wheel", onWheel, { passive: false });
    return () => svg.removeEventListener("wheel", onWheel);
  }, []);

  // Drag-pan is scoped to mouse/pen. Touch is left to native vertical scroll
  // (touch-action: pan-y) so the page never traps the finger, and taps still
  // open notes; touch pan/pinch-zoom is deferred (see report).
  //
  // Pointer capture is deferred until the press actually crosses the drag
  // threshold. Capturing on pointerdown retargets the synthesized `click` to
  // the capturing SVG root (Chromium behavior), so a plain click on a node
  // never reaches the node's onClick and the note never opens. By only
  // capturing once real movement begins, a stationary click stays on the node
  // while a genuine drag still keeps receiving move events outside the bounds.
  const onPointerDown = (e) => {
    movedRef.current = false;
    if (e.pointerType === "touch") return;
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      base: { ...transformRef.current },
      pointerId: e.pointerId,
      captured: false,
    };
  };

  const onPointerMove = (e) => {
    const d = dragRef.current;
    if (!d) return;
    const rect = svgRef.current.getBoundingClientRect();
    const dx = ((e.clientX - d.startX) / rect.width) * VBW;
    const dy = ((e.clientY - d.startY) / rect.height) * VBH;
    if (Math.abs(e.clientX - d.startX) > 3 || Math.abs(e.clientY - d.startY) > 3) {
      movedRef.current = true;
      if (!d.captured) {
        svgRef.current?.setPointerCapture?.(d.pointerId);
        d.captured = true;
      }
    }
    transformRef.current = { x: d.base.x + dx, y: d.base.y + dy, k: d.base.k };
    applyTransform();
    setTransformed(!isIdentity(transformRef.current));
  };

  const onPointerUp = (e) => {
    const d = dragRef.current;
    if (d?.captured) svgRef.current?.releasePointerCapture?.(e.pointerId);
    dragRef.current = null;
  };

  // Base opacity from the type/search filter (dimmed = 0.12 / edges fainter).
  const nodeFiltered = (id) => activeIds.has(id);
  const nodeOpacity = (n) => {
    if (!nodeFiltered(n.id)) return 0.12;
    if (hoveredId) {
      if (n.id === hoveredId) return 1;
      return neighbors.get(hoveredId)?.has(n.id) ? 1 : 0.15;
    }
    return 1;
  };
  const edgeOpacity = (e) => {
    const on = nodeFiltered(e.source) && nodeFiltered(e.target);
    if (!on) return 0.05;
    if (hoveredId) return e.source === hoveredId || e.target === hoveredId ? 0.55 : 0.06;
    return 0.5;
  };

  const label = hoveredId || selectedId;
  const labelNode = label ? nodeById.get(label) : null;

  const nodeHandlers = (n) => ({
    onMouseEnter: () => setHoveredId(n.id),
    onMouseLeave: () => setHoveredId(null),
    onClick: (e) => {
      if (movedRef.current) return;
      onSelect(n.id, e.currentTarget);
    },
    style: { cursor: "pointer", opacity: nodeOpacity(n), transition: "opacity 200ms ease-out" },
  });

  const renderNode = (n) => {
    const r = rOf(n.degree);
    const h = nodeHandlers(n);
    if (n.type === "course") {
      return (
        <circle key={n.id} cx={n.x} cy={n.y} r={r} fill="var(--bg)" stroke="var(--accent-ink)" strokeWidth="1" {...h} />
      );
    }
    if (n.type === "source") {
      const s = r * 1.7;
      return <rect key={n.id} x={n.x - s / 2} y={n.y - s / 2} width={s} height={s} fill="var(--secondary-text)" {...h} />;
    }
    if (n.type === "organization") {
      const s = r * 1.3;
      return (
        <path key={n.id} d={`M${n.x} ${n.y - s} L${n.x + s} ${n.y} L${n.x} ${n.y + s} L${n.x - s} ${n.y} Z`} fill="var(--accent)" {...h} />
      );
    }
    return <circle key={n.id} cx={n.x} cy={n.y} r={r} fill="var(--primary-text)" {...h} />;
  };

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VBW} ${VBH}`}
        role="img"
        aria-label={`Knowledge graph of ${nodes.length} notebook entries linked by ${edges.length} cross-references, plotted as a technical chart. Denser regions mark the most-studied areas. The index list below is the equivalent keyboard-accessible interface.`}
        className={`${MONO.className} w-full h-auto select-none`}
        style={{ minHeight: "420px", touchAction: "pan-y" }}
        fill="none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onDoubleClick={reset}
      >
        {/* Drag surface */}
        <rect x="0" y="0" width={VBW} height={VBH} fill="transparent" pointerEvents="all" />

        <g ref={innerRef} transform={transformStr()}>
          {/* Edges — hairline ink, stroke-draw entrance (staggered via --d) */}
          <g stroke="var(--border)" strokeWidth="0.75" strokeLinecap="round">
            {edges.map((e, i) => {
              const a = nodeById.get(e.source);
              const b = nodeById.get(e.target);
              if (!a || !b) return null;
              return (
                <line
                  key={i}
                  className="anim-stroke"
                  pathLength="1"
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  style={{
                    "--d": `${(0.3 + (i / edges.length) * 0.6).toFixed(3)}s`,
                    opacity: edgeOpacity(e),
                    transition: "opacity 200ms ease-out",
                  }}
                />
              );
            })}
          </g>

          {/* Nodes — fade in after the edges have drawn */}
          <g className="anim-fade" style={{ "--d": "0.9s" }}>{nodes.map(renderNode)}</g>

          {/* Always-on labels for the eight highest-degree nodes */}
          <g className="anim-fade" style={{ "--d": "1.15s" }}>
            {nodes
              .filter((n) => topIds.has(n.id))
              .map((n) => (
                <text
                  key={`top-${n.id}`}
                  x={n.x}
                  y={n.y - rOf(n.degree) - 5}
                  textAnchor="middle"
                  fontSize="9"
                  fill="var(--tertiary-text)"
                  style={{ opacity: nodeFiltered(n.id) ? 0.85 : 0.12, pointerEvents: "none" }}
                >
                  {stripEmphasis(n.title).toUpperCase()}
                </text>
              ))}
          </g>

          {/* Selection ring — echoes MemoryGraphFigure's match flare */}
          {selectedId && nodeById.get(selectedId) && (
            <circle
              key={`ring-${selectedId}`}
              className="anim-ring-flare"
              cx={nodeById.get(selectedId).x}
              cy={nodeById.get(selectedId).y}
              r={rOf(nodeById.get(selectedId).degree) + 5}
              fill="none"
              stroke="var(--accent-ink)"
              strokeWidth="1.5"
              style={{ pointerEvents: "none" }}
            />
          )}

          {/* Hover / active label — Archivo with a --bg halo so it stays legible */}
          {labelNode && (
            <text
              x={labelNode.x}
              y={labelNode.y - rOf(labelNode.degree) - 6}
              textAnchor="middle"
              fontSize="11"
              paintOrder="stroke"
              stroke="var(--bg)"
              strokeWidth="3.5"
              strokeLinejoin="round"
              fill="var(--primary-text)"
              className={SANS.className}
              style={{ pointerEvents: "none" }}
            >
              {stripEmphasis(labelNode.title)}
            </text>
          )}
        </g>
      </svg>

      {transformed && (
        <button
          type="button"
          onClick={reset}
          className={`${MONO.className} absolute top-2 right-2 z-10 text-[10px] tracking-[0.15em] uppercase text-(--tertiary-text) bg-(--bg) border border-(--border) px-2 py-1 hover:text-(--primary-text) transition-colors`}
        >
          Reset
        </button>
      )}
    </div>
  );
}
