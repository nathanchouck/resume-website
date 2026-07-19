"use client";

import PageWrapper from "@/components/PageWrapper";
import Main from "@/containers/Main";

export default function Home() {
  return (
    <PageWrapper>
      <div className="px-5 sm:px-8 w-full max-w-[1100px] pt-14 pb-32 lg:pt-20 lg:pb-20">
        <Main />
      </div>
    </PageWrapper>
  );
}
