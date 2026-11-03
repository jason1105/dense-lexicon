import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getIndex,
  getTagDimension,
  getWordsByTag,
} from "@/lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return getIndex().tags.map((t) => ({
    dimension: t.dimension,
    slug: t.slug,
  }));
}

/** 维度 key + slug → 词表条目；任一未知为 null（词表是维度合法性的单一来源） */
function resolve(dimension: string, slug: string) {
  const dim = getTagDimension(dimension);
  if (!dim) return null;
  const tag = dim.tags.find((t) => t.slug === slug) ?? null;
  return tag ? { dim, tag } : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ dimension: string; slug: string }>;
}): Promise<Metadata> {
  const { dimension, slug } = await params;
  const r = resolve(dimension, slug);
  if (!r) return {};
  return { title: `${r.dim.name}：${r.tag.name}` };
}

/** 标签页：标题“维度：标签”，词列表（term / termZh / hook / 所属日期），日期倒序 */
export default async function TagPage({
  params,
}: {
  params: Promise<{ dimension: string; slug: string }>;
}) {
  const { dimension, slug } = await params;
  const r = resolve(dimension, slug);
  if (!r) notFound();
  const words = getWordsByTag(r.dim.key, slug); // index 顺序即日期倒序
  if (words.length === 0) notFound(); // 未被使用的标签不生成页面

  return (
    <>
      <Link className="back" href="/tags">
        ← 标签
      </Link>
      <h1 className="t-title page-h1">
        {r.dim.name}：{r.tag.name}
      </h1>
      {r.tag.description && <p className="tagdesc">{r.tag.description}</p>}
      <ul className="results">
        {words.map((w) => (
          <li key={w.id}>
            <Link href={`/w/${w.id}`}>
              <span className="en t-subtitle" lang="en">
                {w.term}
              </span>{" "}
              <span className="muted">{w.termZh}</span>{" "}
              <span className="subtle t-meta">· {w.date}</span>
              <span className="snip">{w.hook}</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
