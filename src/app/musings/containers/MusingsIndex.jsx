import { SANS, SERIF } from "@/utils/constants";

export default function MusingsIndex({ posts }) {
  return (
    <main className="px-5 sm:px-8 w-full max-w-[800px] pt-14 pb-32 lg:pt-20 lg:pb-20">
      {/* Page title */}
      <div className="anim-rise flex items-baseline gap-5" style={{ "--d": "0s" }}>
        <h1 className={`${SERIF.className} text-[clamp(1.7rem,3vw,2rem)] font-medium text-(--primary-text)`}>
          Musings
        </h1>
        <span aria-hidden="true" className="flex-1 h-px bg-(--border) self-center" />
      </div>

      {/* Post list — ruled rows, Contents-row grammar */}
      <div className="flex flex-col pt-10">
        {posts.map((post, i) => (
          <a
            key={post.slug}
            href={`/musings/${post.slug}`}
            className="anim-rise group flex items-baseline gap-5 py-3.5 -mx-3 px-3 border-b border-(--border) hover:bg-(--button-highlight) transition-colors"
            style={{ "--d": `${0.07 + i * 0.05}s` }}
          >
            <span className={`${SANS.className} text-[12px] tabular-nums text-(--tertiary-text) w-20 shrink-0`}>
              {post.date}
            </span>
            <span className={`${SERIF.className} text-[18px] font-medium text-(--primary-text) flex-1`}>
              {post.title}
            </span>
            <span className={`${SANS.className} text-[12px] font-medium text-(--tertiary-text) shrink-0`}>
              {post.category}
            </span>
            <span
              aria-hidden="true"
              className={`${SANS.className} text-[13px] text-(--tertiary-text) shrink-0 group-hover:text-(--active) group-hover:translate-x-0.5 transition-[color,transform]`}
            >
              →
            </span>
          </a>
        ))}
      </div>
    </main>
  );
}
