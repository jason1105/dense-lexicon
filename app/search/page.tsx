import type { Metadata } from "next";
import { Suspense } from "react";
import SearchBox from "@/components/SearchBox";

export const metadata: Metadata = { title: "搜索" };

/** 无 JS 时的静态外壳（水合后被 SearchBox 接管） */
function StaticSearch() {
  return (
    <>
      <div className="search">
        <label className="vh" htmlFor="q">
          搜索
        </label>
        <input
          id="q"
          type="search"
          placeholder="搜索术语、中文、定义…"
          autoComplete="off"
          enterKeyHint="search"
        />
      </div>
      <p className="count t-meta" aria-live="polite" />
      <p className="hint">输入关键词，例如：幂等、circuit</p>
    </>
  );
}

export default function SearchPage() {
  return (
    <>
      <h1 className="vh">搜索</h1>
      <Suspense fallback={<StaticSearch />}>
        <SearchBox />
      </Suspense>
    </>
  );
}
