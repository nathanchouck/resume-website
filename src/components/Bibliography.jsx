"use client";

import { useState, useEffect, useId } from "react";
import { ChevronDown } from "lucide-react";
import { SANS, SERIF } from "@/utils/constants";
import { BibliographyContext } from "@/utils/BibliographyContext";

export default function Bibliography({ children }) {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(null);
  const listId = useId();

  useEffect(() => {
    const handler = ({ detail: { n } }) => {
      setOpen(true);
      setHighlighted(n);
      setTimeout(() => {
        document.getElementById(`ref-${n}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => setHighlighted(null), 1500);
      }, 120);
    };
    window.addEventListener("bibliography:open", handler);
    return () => window.removeEventListener("bibliography:open", handler);
  }, []);

  return (
    <div className="mt-16 pt-6 border-t border-(--border)">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={listId}
        className={`${SANS.className} flex items-center gap-2 text-[12px] font-medium text-(--secondary-text) hover:text-(--primary-text) transition-colors cursor-pointer`}
      >
        References
        <ChevronDown
          size={12}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <BibliographyContext.Provider value={{ active: true, highlighted }}>
          <div id={listId} className={`${SERIF.className} mt-5 flex flex-col`}>
            {children}
          </div>
        </BibliographyContext.Provider>
      )}
    </div>
  );
}
