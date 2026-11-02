import Link from "next/link";
import type { Domain } from "@/lib/types";

export type ArchWord = { id: string; term: string; termZh: string; domain: Domain };
export type ArchDay = { date: string; words: ArchWord[] };

/**
 * 档案的展示视图：领域胶囊 + 日期分组列表。
 * onSelect 缺省时为纯静态渲染（用作 Suspense fallback，服务端可完整输出“全部”视图）。
 */
export default function ArchiveView({
  days,
  domains,
  selected,
  onSelect,
}: {
  days: ArchDay[];
  domains: { domain: Domain; label: string }[];
  selected: string;
  onSelect?: (domain: string) => void;
}) {
  const groups = days
    .map((d) => ({
      ...d,
      words: d.words.filter((w) => !selected || w.domain === selected),
    }))
    .filter((g) => g.words.length > 0);

  const chips = [
    { key: "", label: "全部" },
    ...domains.map((d) => ({ key: d.domain, label: d.label })),
  ];

  return (
    <>
      <div className="chips" role="group" aria-label="按领域筛选">
        {chips.map((c) => (
          <button
            key={c.key || "all"}
            className="chip"
            type="button"
            aria-pressed={c.key === selected}
            onClick={onSelect ? () => onSelect(c.key) : undefined}
          >
            <span>{c.label}</span>
          </button>
        ))}
      </div>
      {groups.length > 0 ? (
        groups.map((g) => (
          <section className="group" key={g.date}>
            <Link className="gdate" href={`/d/${g.date}`}>
              {g.date}
            </Link>
            <ul>
              {g.words.map((w) => (
                <li key={w.id}>
                  <Link className="wline" href={`/w/${w.id}`}>
                    <span className="en" lang="en">
                      {w.term}
                    </span>
                    <span className="zh">{w.termZh}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))
      ) : (
        <p className="hint">还没有内容。明天 09:00 见。</p>
      )}
    </>
  );
}
