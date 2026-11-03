import Link from "next/link";
import Chip from "./Chip";

export type ArchWord = { id: string; term: string; termZh: string; t: string[] };
export type ArchDay = { date: string; words: ArchWord[] };
export type ArchDim = { key: string; name: string };
export type ArchTag = {
  dimension: string;
  slug: string;
  name: string;
  description: string;
  count: number;
};

/**
 * 档案的展示视图：维度/标签两级胶囊 + 日期分组列表。
 * 选维度出第二行标签胶囊（带词数）；选中标签后显示其一句话说明；选中标签后按 "dimension:slug" 过滤，整天无命中则隐藏。
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
        <Chip label="全部" pressed={dim === ""} onClick={onSelect && (() => onSelect("", ""))} />
        {dims.map((d) => (
          <Chip
            key={d.key}
            label={d.name}
            pressed={dim === d.key}
            onClick={onSelect && (() => onSelect(d.key, ""))}
          />
        ))}
      </div>
      {dim && (
        <div className="chips" role="group" aria-label="按标签筛选">
          <Chip label="全部" pressed={tag === ""} onClick={onSelect && (() => onSelect(dim, ""))} />
          {dimTags.map((t) => (
            <Chip
              key={t.slug}
              label={t.name}
              count={t.count}
              title={t.description}
              pressed={tag === t.slug}
              onClick={onSelect && (() => onSelect(dim, t.slug))}
            />
          ))}
        </div>
      )}
      {selTag && (
        <p className="t-meta filtermeta">
          <Link href={`/tag/${dim}/${selTag.slug}`}>
            {dimName}：{selTag.name}
          </Link>
          <span className="subtle"> · {selTag.count} 个词</span>
          <span className="filterdesc">{selTag.description}</span>
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
