import type { Metadata } from "next";
import { Suspense } from "react";
import ArchiveList from "@/components/ArchiveList";
import ArchiveView from "@/components/ArchiveView";
import { getIndex, getTagVocab } from "@/lib/content";

export const metadata: Metadata = { title: "档案" };

export default function ArchivePage() {
  const index = getIndex();
  const vocab = getTagVocab();

  /* 客户端只拿最小数据：词 {id, term, termZh, t}（t 为 "dimension:slug" 列表） */
  const byId = new Map(index.words.map((w) => [w.id, w]));
  const days = index.days.map((d) => ({
    date: d.date,
    words: d.ids
      .map((id) => byId.get(id))
      .filter((w): w is NonNullable<typeof w> => w !== undefined)
      .map((w) => ({
        id: w.id,
        term: w.term,
        termZh: w.termZh,
        t: vocab.dimensions.flatMap((dim) =>
          w.tags[dim.key].map((t) => `${dim.key}:${t.slug}`),
        ),
      })),
  }));

  /* 每维度被使用的标签：词数降序，同数按词表顺序（index.tags 维度内已是词表序） */
  const vocabOrder = new Map(
    vocab.dimensions.flatMap((d) =>
      d.tags.map((t, i) => [`${d.key}:${t.slug}`, i] as const),
    ),
  );
  const tags = [...index.tags].sort(
    (a, b) =>
      b.count - a.count ||
      (vocabOrder.get(`${a.dimension}:${a.slug}`) ?? 0) -
        (vocabOrder.get(`${b.dimension}:${b.slug}`) ?? 0),
  );

  const dims = vocab.dimensions.map((d) => ({ key: d.key, name: d.name }));

  return (
    <>
      <h1 className="t-title page-h1">
        档案 · 共 {index.days.length} 天 {index.words.length} 词
      </h1>
      {days.length === 0 ? (
        <p className="hint">还没有内容。明天 09:00 见。</p>
      ) : (
        <Suspense
          fallback={<ArchiveView days={days} dims={dims} tags={tags} dim="" tag="" />}
        >
          <ArchiveList days={days} dims={dims} tags={tags} />
        </Suspense>
      )}
    </>
  );
}
