"use client";

import { useContext } from "react";
import { BibliographyContext } from "@/utils/BibliographyContext";
import FootnoteRef from "@/components/FootnoteRef";
import { SERIF, SANS } from "@/utils/constants";

// Recursively replace [n] patterns in text nodes with <FootnoteRef>
function parseInlineRefs(node) {
  if (typeof node === "string") {
    const parts = node.split(/(\[\d+\])/);
    if (parts.length === 1) return node;
    return parts.map((part, i) => {
      const match = part.match(/^\[(\d+)\]$/);
      return match ? <FootnoteRef key={`ref-${match[1]}-${i}`} n={parseInt(match[1])} /> : part;
    });
  }
  if (Array.isArray(node)) {
    return node.flatMap((child) => {
      const result = parseInlineRefs(child);
      return Array.isArray(result) ? result : [result];
    });
  }
  return node;
}

function getLeadingText(children) {
  if (typeof children === "string") return children;
  if (Array.isArray(children) && typeof children[0] === "string") return children[0];
  return "";
}

function stripLeadingCiteNumber(children, matchStr) {
  if (typeof children === "string") {
    return children.slice(matchStr.length).trimStart();
  }
  if (Array.isArray(children)) {
    const [first, ...rest] = children;
    return [first.slice(matchStr.length).trimStart(), ...rest];
  }
  return children;
}

export default function MDXParagraph({ children, ...props }) {
  const { active: inBibliography, highlighted } = useContext(BibliographyContext);

  // Image passthrough
  const hasImage =
    children?.type === "img" ||
    (typeof children === "object" && children?.props?.src);

  if (hasImage) {
    return (
      <div className="flex justify-center w-full mb-5">
        {children}
      </div>
    );
  }

  // Inside bibliography: render as a citation row with styled [n] prefix
  if (inBibliography) {
    const leadText = getLeadingText(children);
    const match = leadText.match(/^\[(\d+)\]/);

    if (match) {
      const n = parseInt(match[1]);
      const isHighlighted = highlighted === n;
      const rest = stripLeadingCiteNumber(children, match[0]);

      return (
        <p
          id={`ref-${n}`}
          className={`${SERIF.className} flex gap-2 text-[13px] leading-relaxed mb-2 px-2 -mx-2 transition-colors duration-700 ${
            isHighlighted ? "text-(--primary-text) bg-(--accent)/10" : "text-(--tertiary-text) bg-transparent"
          }`}
        >
          <span className={`${SANS.className} text-[12px] font-medium text-(--accent) shrink-0 mt-0.5`}>
            [{n}]
          </span>
          <span>{rest}</span>
        </p>
      );
    }

    return (
      <p className={`${SERIF.className} text-[13px] leading-relaxed mb-2 text-(--tertiary-text)`}>
        {children}
      </p>
    );
  }

  // Normal body paragraph: parse [n] refs inline
  return (
    <p
      className={`${SERIF.className} mb-5 text-[17px] leading-[1.7] text-(--secondary-text)`}
      {...props}
    >
      {parseInlineRefs(children)}
    </p>
  );
}
