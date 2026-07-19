"use client";

import { SANS } from "@/utils/constants";

export default function FootnoteRef({ n }) {
  const handleClick = (e) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("bibliography:open", { detail: { n } }));
    setTimeout(() => {
      document.getElementById(`ref-${n}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 120);
  };

  return (
    <a
      href={`#ref-${n}`}
      onClick={handleClick}
      className={`${SANS.className} text-[10px] font-medium text-(--active) bg-(--active)/10 hover:bg-(--active)/20 px-1 transition-colors cursor-pointer align-super leading-none`}
    >
      [{n}]
    </a>
  );
}
