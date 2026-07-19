"use client";

import { useState } from "react";
import MusingsSidebar from "@/components/MusingsSidebar";
import { useAppContext } from "@/app/provider";
import { SANS, SERIF } from "@/utils/constants";

function sortPostsAroundCurrent(posts, currentPost) {
    const currentIdx = posts.findIndex(post => post.slug === currentPost.slug);
    if (currentIdx === -1) {
        return posts;
    }
    const before = posts.slice(0, currentIdx);
    const after = posts.slice(currentIdx + 1);
    return [...after, ...before]; //conveniently remove the current post as well here

}

const Panel = ({ currentPost, posts }) => {
    const { handlePageChange } = useAppContext();
    const [isPanelOpen, setIsPanelOpen] = useState(false);


    posts = sortPostsAroundCurrent(posts, currentPost);

    return (
        <MusingsSidebar title="Musings" isOpen={isPanelOpen} setIsOpen={setIsPanelOpen}>
            {/*
              Sidebar/panel text is navigation furniture, not document outline —
              it must never introduce heading elements ahead of the article's
              own <h1>. Visuals are preserved 1:1; only the tag changed.
            */}
            <nav aria-label="Blog posts navigation">
                <p
                    className={`${SANS.className} anim-rise pl-3 mb-1 text-[13px] font-semibold text-(--primary-text)`}
                    style={{ "--d": "0s" }}
                >
                    Musings
                </p>
                <section aria-label="Current post" className="border-b border-(--border)">
                    <p
                        className={`${SANS.className} anim-rise pl-3 mb-4 text-[13px] text-(--secondary-text)`}
                        style={{ "--d": "0.05s" }}
                    >
                        You're reading:
                    </p>
                    <article
                        className="anim-rise inline-flex items-start justify-start w-full gap-4 p-3 mb-4 bg-(--fg)"
                        style={{ "--d": "0.1s" }}
                    >
                        <div className="inline-flex flex-col items-start justify-start text-left grow gap-0.5">
                            <p className={`${SERIF.className} text-[16px] font-medium text-(--primary-text)`}>{currentPost.title}</p>
                            <div className={`${SANS.className} mt-1 text-[12px] tabular-nums text-(--tertiary-text) flex flex-row gap-2`}>
                                <p className="font-normal">{currentPost["date-stylized"]}</p>
                                {" ⋅ "}
                                <span className="font-medium">{currentPost.category}</span>
                            </div>
                        </div>

                    </article>

                </section>
                <section aria-label="Suggested Posts" className="mt-3">
                    <p
                        className={`${SANS.className} anim-rise pl-3 text-[13px] font-semibold text-(--primary-text)`}
                        style={{ "--d": "0.15s" }}
                    >
                        Up next
                    </p>
                    <ul className="flex flex-col gap-2 p-0 list-none">
                        {posts.map((post, i) => (
                            <li key={post.slug}>
                                <a
                                    href={`/musings/${post.slug}`}
                                    onClick={(e) => {
                                        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                                        e.preventDefault();
                                        handlePageChange(`/musings/${post.slug}`)
                                    }}
                                    className="anim-rise flex items-center min-h-11 w-full gap-4 p-3 hover:bg-(--fg) hover:scale-[1.02] active:scale-95 transition-[background-color,transform]"
                                    style={{ "--d": `${0.2 + i * 0.04}s` }}
                                >
                                    <article className="inline-flex flex-col items-start justify-start text-left grow gap-0.5">
                                        <p className={`${SERIF.className} text-[15px] font-medium text-(--secondary-text)`}>{post.title}</p>
                                        <div className={`${SANS.className} mt-1 text-[12px] tabular-nums text-(--tertiary-text) flex flex-row gap-2`}>
                                            <p className="font-normal">{post["date-stylized"]}</p>
                                            {" ⋅ "}
                                            <span className="font-medium">{post.category}</span>
                                        </div>

                                    </article>
                                </a>
                            </li>


                        ))}
                    </ul>
                </section>
            </nav>

        </MusingsSidebar>

    )

}
export default Panel;
