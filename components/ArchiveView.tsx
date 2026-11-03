import Link from "next/link";

export type ArchWord = { id: string; term: string; termZh: string; t: string[] };
export type ArchDay = { date: string; words: ArchWord[] };
export type ArchDim = { key: string; name: string };
export type ArchTag = { dimension: string; slug: string; name: string; count: number };

/**
 * 档案的展示视图：维度/标签两级胶囊 + 日期分组列表。
 * 选维度出第二行标签胶囊（带词数）；选中标签后按 "dimension:slug" 过滤，整天无命中则隐藏。
 * onSelect 缺省时为纯静态渲染（用作 Suspense fallback，服务端可完整输出“全部”视图）。
 */
export default function ArchiveView({
  days,
  dims,
  tags,
  dim,
  tag,
  onSelect,
}: {
  days: ArchDay[];
  dims: ArchDim[];
  tags: ArchTag[];
  dim: string;
  tag: string;
  onSelect?: (dim: string, tag: string) => void;
}) {
  const sel = dim && tag ? `${dim}:${tag}` : "";
  const groups = days
    .map((d) => ({
      ...d,
      words: d.words.filter((w) => !sel || w.t.includes(sel)),
    }))
    .filter((g) => g.words.length > 0);

  const dimTags = tags.filter((t) => t.dimension === dim);
  const selTag = dimTags.find((t) => t.slug === tag);
  const dimName = dims.find((d) => d.key === dim)?.name ?? "";

  return (
    <>
      <div className="chips" role="group" aria-label="按标签维度筛选">
        <button
          className="chip"
          type="button"
          aria-pressed={dim === ""}
          onClick={onSelect ? () => onSelect("", "") : undefined}
        >
          <span>全部</span>
        </button>
        {dims.map((d) => (
          <button
            key={d.key}
            className="chip"
            type="button"
            aria-pressed={dim === d.key}
            onClick={onSelect ? () => onSelect(d.key, "") : undefined}
          >
            <span>{d.name}</span>
          </button>
        ))}
      </div>
      {dim && (
        <div className="chips" role="group" aria-label="按标签筛选">
          <button
            className="chip"
            type="button"
            aria-pressed={tag === ""}
            onClick={onSelect ? () => onSelect(dim, "") : undefined}
          >
            <span>全部</span>
          </button>
          {dimTags.map((t) => (
            <button
              key={t.slug}
              className="chip"
              type="button"
              aria-pressed={tag === t.slug}
              onClick={onSelect ? () => onSelect(dim, t.slug) : undefined}
            >
              <span>
                {t.name}
                <span className="tcount">{t.count}</span>
              </span>
            </button>
          ))}
        </div>
      )}
      {selTag && (
        <p className="t-meta filtermeta">
          <Link href={`/tag/${dim}/${selTag.slug}`}>
            {dimName}：{selTag.name}
          </Link>
          <span className="subtle"> · {selTag.count} 个词</span>
        </p>
      )}
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
