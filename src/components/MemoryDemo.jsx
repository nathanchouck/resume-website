"use client";

import { useEffect, useRef, useState } from "react";
import MemoryGraphFigure from "./MemoryGraphFigure";
import { SANS, SERIF } from "@/utils/constants";

/*
 * "Ask the memory" — the agent memory graph, asked about its author.
 * Cycle: question fades in → a one-shot pulse crosses the graph →
 * the matched answer fades in → hold → next question.
 *
 * The first pair renders visible in SSR (no JS required to read it), and
 * auto-cycling is disabled under prefers-reduced-motion.
 */
const MEMORY_QA = [
  { q: "What's Nathan working on now?", a: "Integration on Project SENTINEL, a 3U CubeSat that catalogs objects in the GEO belt." },
  { q: "Where does he study?", a: "Embry-Riddle Aeronautical University, astronautics concentration, class of 2027." },
  { q: "What came out of the AI internship?", a: "A procurement scraper at EPI-USE America that found 5× more opportunities." },
  { q: "Did the submarine cooling work?", a: "It cut the ~190°F hull peak by over 60°F." },
  { q: "Does he actually write?", a: "Essays, short stories, and poems, all written by hand, in Musings." },
  { q: "What role is he looking for?", a: "Entry-level systems engineering, graduating May 2027." },
];

const ANSWER_AT = 1900;   // pulse arrival — answer appears
const HOLD_UNTIL = 6600;  // full pair on screen
const SWAP_GAP = 450;     // fade-out before the next question

export default function MemoryDemo() {
  const [index, setIndex] = useState(0);
  const [pulseKey, setPulseKey] = useState(0);
  // SSR state: question + answer both visible, no cycling.
  const [phase, setPhase] = useState("hold");
  const [cycling, setCycling] = useState(false);
  const timers = useRef([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setCycling(true);
  }, []);

  useEffect(() => {
    if (!cycling) return;
    const t = timers.current;
    if (phase === "ask") {
      setPulseKey((k) => k + 1);
      t.push(setTimeout(() => setPhase("hold"), ANSWER_AT));
    } else if (phase === "hold") {
      t.push(setTimeout(() => setPhase("swap"), HOLD_UNTIL - ANSWER_AT));
    } else if (phase === "swap") {
      t.push(
        setTimeout(() => {
          setIndex((i) => (i + 1) % MEMORY_QA.length);
          setPhase("ask");
        }, SWAP_GAP)
      );
    }
    return () => {
      t.forEach(clearTimeout);
      timers.current = [];
    };
  }, [phase, cycling]);

  const { q, a } = MEMORY_QA[index];
  const qVisible = phase !== "swap";
  const aVisible = phase === "hold";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px_1fr] gap-x-10 gap-y-6 items-center pt-8">
      {/* Asked */}
      <div className="lg:text-right min-h-[72px] flex flex-col lg:items-end justify-center gap-1.5">
        <p className={`${SANS.className} text-[11px] font-medium tracking-[0.02em] text-(--tertiary-text)`}>Asked</p>
        <p
          aria-live="polite"
          className={`${SERIF.className} italic text-[17px] leading-snug text-(--secondary-text) max-w-[36ch] transition-[opacity,transform] duration-500 ${
            qVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
          }`}
        >
          {q}
        </p>
      </div>

      {/* The graph */}
      <div className="w-full max-w-[300px] lg:max-w-none mx-auto">
        <MemoryGraphFigure
          mode={cycling ? "controlled" : "ambient"}
          pulseKey={pulseKey}
          pathIndex={index}
          fading={phase === "swap"}
          className="w-full"
        />
      </div>

      {/* Recalled */}
      <div className="min-h-[72px] flex flex-col justify-center gap-1.5">
        <p className={`${SANS.className} text-[11px] font-medium tracking-[0.02em] text-(--tertiary-text)`}>Recalled</p>
        <p
          aria-live="polite"
          className={`${SANS.className} text-[15px] leading-snug text-(--primary-text) max-w-[38ch] transition-[opacity,transform] duration-500 ${
            aVisible || !cycling ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
          }`}
        >
          {a}
        </p>
      </div>
    </div>
  );
}
