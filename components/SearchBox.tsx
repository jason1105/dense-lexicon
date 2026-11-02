"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { IndexFile, IndexedWord } from "@/lib/types";

/** 首次命中高亮（大小写不敏感） */
function Hl({ text, q }: { text: string; q: string }) {
  const i = q ? text.toLowerCase().indexOf(q.toLowerCase()) : -1;
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark>{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  );
}

type Snippet = {
  prefix?: string;
  text: string;
  suffix?: string;
  mark: boolean;
};

/** 结果摘要：定义命中取窗口；否则命中条目行；否则定义开头 */
function snippetOf(w: IndexedWord, q: string): Snippet {
  const lq = q.toLowerCase();
  const d = w.definition;
  const i = d.toLowerCase().indexOf(lq);
  if (i >= 0) {
    const s = i < 50 ? 0 : i - 20;
    return {
      prefix: s > 0 ? "…" : "",
      text: d.slice(s, s + 90),
      suffix: s + 90 < d.length ? "…" : "",
      mark: true,
    };
  }
  const c = w.compresses.find((x) => x.toLowerCase().includes(lq));
  if (c) return { prefix: "压缩了什么：", text: c, mark: true };
  return {
    text: d.slice(0, 60),
    suffix: d.length > 60 ? "…" : "",
    mark: false,
  };
}

/**
 * 搜索：term / termZh / definition / compresses 大小写不敏感子串匹配；
 * term 或 termZh 命中优先，再按日期倒序；输入去抖 120ms 并同步 ?q=。
 */
export default function SearchBox() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get("q") ?? "";
  const [q, setQ] = useState(initialQ);
  const [submitted, setSubmitted] = useState(initialQ);
  const [index, setIndex] = useState<IndexFile | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  /* 数据来自静态 /index.json */
  useEffect(() => {
    let alive = true;
    fetch("/index.json")
      .then((r) => r.json() as Promise<IndexFile>)
      .then((d) => {
        if (alive) setIndex(d);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  /* 自动聚焦，光标移到末尾 */
  useEffect(() => {
    const el = inputRef.current;
    if (el) {
      el.focus();
      el.setSelectionRange(el.value.length, el.value.length);
    }
  }, []);

  /* 卸载时清掉去抖计时器 */
  useEffect(() => () => clearTimeout(timer.current), []);

  const onChange = (value: string) => {
    setQ(value);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setSubmitted(value);
      const t = value.trim();
      window.history.replaceState(
        null,
        "",
        t ? `/search?q=${encodeURIComponent(t)}` : "/search",
      );
    }, 120);
  };

  const trimmed = submitted.trim();
  const loaded = index !== null;

  const results = useMemo(() => {
    if (!index || !trimmed) return [];
    const lq = trimmed.toLowerCase();
    return index.words
      .map((w) => {
        const head = `${w.term} ${w.termZh}`.toLowerCase().includes(lq);
        const body =
          head ||
          w.definition.toLowerCase().includes(lq) ||
          w.compresses.some((c) => c.toLowerCase().includes(lq));
        return body ? { w, rank: head ? 0 : 1 } : null;
      })
      .filter((x): x is { w: IndexedWord; rank: number } => x !== null)
      .sort((a, b) => a.rank - b.rank || b.w.date.localeCompare(a.w.date));
  }, [index, trimmed]);

  return (
    <>
      <div className="search">
        <label className="vh" htmlFor="q">
          搜索
        </label>
        <input
          id="q"
          ref={inputRef}
          type="search"
          placeholder="搜索术语、中文、定义…"
          value={q}
          autoComplete="off"
          enterKeyHint="search"
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      <p className="count t-meta" aria-live="polite">
        {trimmed ? (loaded ? `${results.length} 个结果` : "") : ""}
      </p>
      <div>
        {!trimmed ? (
          <p className="hint">输入关键词，例如：幂等、circuit</p>
        ) : !loaded ? null : results.length === 0 ? (
          <p className="hint">
            没有找到“{trimmed}”。试试英文术语或更短的词。
            <br />
            <Link href="/archive">看档案</Link>
          </p>
        ) : (
          <ul className="results">
            {results.map(({ w }) => {
              const snip = snippetOf(w, trimmed);
              return (
                <li key={w.id}>
                  <Link href={`/w/${w.id}`}>
                    <span className="en t-subtitle" lang="en">
                      <Hl text={w.term} q={trimmed} />
                    </span>{" "}
                    <span className="muted">
                      <Hl text={w.termZh} q={trimmed} />
                    </span>
                    <span className="snip">
                      {snip.prefix}
                      {snip.mark ? <Hl text={snip.text} q={trimmed} /> : snip.text}
                      {snip.suffix}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}
