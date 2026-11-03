import type { Metadata } from "next";
import Link from "next/link";
import { getIndex, getTagVocab } from "@/lib/content";
import type { TagCount, TagDimension } from "@/lib/types";

export const metadata: Metadata = { title: "标签" };

/** 标签索引：五个维度分组，只列被使用的标签（含词数），点击进入标签页 */
export default function TagsPage() {
  const index = getIndex();
  const vocab = getTagVocab();

  /* 维度内按词数降序；同数保持词表顺序（sort 稳定） */
  const byDim = new Map<TagDimension, TagCount[]>();
  for (const t of index.tags) {
    const list = byDim.get(t.dimension) ?? [];
    list.push(t);
    byDim.set(t.dimension, list);
  }
  for (const [dim, list] of byDim) byDim.set(dim, [...list].sort((a, b) => b.count - a.count));

  return (
    <>
      <h1 className="t-title page-h1">标签</h1>
      <p className="hint">
        每个词带五个维度的标签：源自什么学科、落在哪类工程与场景、锻炼哪种认知、属于哪一层。
      </p>
      {vocab.dimensions
        .filter((d) => byDim.has(d.key))
        .map((d) => (
          <section className="tagdim" key={d.key}>
            <h2 className="t-label">{d.name}</h2>
            <ul className="tagcloud">
              {(byDim.get(d.key) ?? []).map((t) => (
                <li key={t.slug}>
                  <Link className="chip" href={`/tag/${d.key}/${t.slug}`}>
                    <span>
                      {t.name}
                      <span className="tcount">{t.count}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
    </>
  );
}
