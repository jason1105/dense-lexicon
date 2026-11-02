import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getIndex, getFullWord, getRelatedWords } from "@/lib/content";
import { domainLabel } from "@/lib/domains";

export const dynamicParams = false;

export function generateStaticParams() {
  return getIndex().words.map((w) => ({ id: w.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const full = getFullWord(id);
  if (!full) return {};
  const { word } = full;
  const title = `${word.term} ${word.termZh}`; // 布局模板补 “ · 每日三词”
  const description = word.definition.slice(0, 80);
  return {
    title,
    description,
    openGraph: {
      title: `${title} · 每日三词`,
      description,
      url: `/w/${id}`,
      type: "article",
    },
  };
}

export default async function WordPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const full = getFullWord(id);
  if (!full) notFound();
  const { word, date } = full;
  const related = getRelatedWords(id); // 为空时整节隐藏

  return (
    <>
      <Link className="back" href={`/d/${date}`}>
        ← {date}
      </Link>
      <h1 className="t-display" lang="en">
        {word.term}
      </h1>
      <p className="t-subtitle wmeta">
        {word.termZh} ·{" "}
        <span className="subtle">{domainLabel(word.domain)}</span>
      </p>
      <p className="t-body wdef">{word.definition}</p>
      <div className="wsecs">
        <section className="sec">
          <h2 className="t-label">压缩了什么</h2>
          <ul>
            {word.compresses.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </section>
        <section className="sec">
          <h2 className="t-label">场景</h2>
          <p>{word.scene}</p>
        </section>
        <section className="sec">
          <h2 className="t-label">常见误解</h2>
          <p>{word.misconception}</p>
        </section>
      </div>
      {related.length > 0 && (
        <section className="related">
          <h2 className="t-label">相关词</h2>
          <ul>
            {related.map((r) => (
              <li key={r.id}>
                <Link className="wline" href={`/w/${r.id}`}>
                  <span className="en" lang="en">
                    {r.term}
                  </span>
                  <span className="zh">{r.termZh}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
