import { SERIF } from "@/utils/constants";
import Bibliography from "@/components/Bibliography";
import MDXParagraph from "@/components/MDXParagraph";

const mdxComponents = {
  Bibliography,
  // Mapped to <h2> (not <h1>) so MDX content can never introduce a second
  // page-level h1 — the article's own <h1> (post title) owns that role.
  // Visual styling is kept identical to the original h1 treatment.
  h1: (props) => (
    <h2 className={`${SERIF.className} mt-2 mb-5 text-[26px] font-normal tracking-[-0.01em] text-(--primary-text)`} {...props} />
  ),

  h2: ({ children, ...props }) => (
    <div className="mt-10 mb-4">
      <h2 className={`${SERIF.className} text-[22px] font-medium tracking-[-0.015em] text-(--primary-text)`} {...props}>{children}</h2>
    </div>
  ),

  h3: ({ children, ...props }) => (
    <div className="mt-6 mb-3">
      <h3 className={`${SERIF.className} text-[18px] font-medium text-(--primary-text)`} {...props}>{children}</h3>
    </div>
  ),

  p: MDXParagraph,

  a: (props) => (
    <a
      className="text-(--primary-text) underline decoration-(--border) underline-offset-4 hover:text-(--active) hover:decoration-(--active) transition-colors"
      {...props}
    />
  ),

  hr: (props) => (
    <hr className="my-6 border-t border-(--border)" {...props} />
  ),

  ol: (props) => (
    <ol className={`${SERIF.className} pl-5 text-(--secondary-text) mb-5 list-decimal text-[17px] leading-[1.65]`} {...props} />
  ),

  ul: (props) => (
    <ul className={`${SERIF.className} pl-5 mb-5 text-(--secondary-text) list-disc text-[17px] leading-[1.65]`} {...props} />
  ),

  li: (props) => <li className="mb-2" {...props} />,

  img: (props) => (
    <img className="max-w-full h-auto" loading="lazy" decoding="async" {...props} />
  ),

  figure: (props) => (
    <figure className="flex flex-col items-center w-full mb-6" {...props} />
  ),

  figcaption: (props) => (
    <figcaption className={`${SERIF.className} italic mt-2 text-[13px] text-center text-(--tertiary-text)`} {...props} />
  ),

  blockquote: (props) => (
    <blockquote
      className={`${SERIF.className} pl-5 pr-4 py-3 mb-6 border-l-2 border-(--accent) text-(--secondary-text) italic text-[17px] leading-[1.65] [&>p]:mb-0`}
      {...props}
    />
  ),

  span: ({ className, ...props }) => {
    if (className && className.includes("katex")) {
      return (
        <span
          className={`relative inline-block rounded-md p-2 bg-(--button-highlight) text-(--secondary-text) ${className}`}
          {...props}
        />
      );
    }
    return <span className={className} {...props} />;
  },
};

export default mdxComponents;
