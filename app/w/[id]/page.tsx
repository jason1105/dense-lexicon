import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getIndex,
  getFullWord,
  getRelatedWords,
  getTagVocab,
  relationWordId,
} from "@/lib/content";
import { domainLabel } from "@/lib/domains";
import type { Relation } from "@/lib/types";

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

/** “前缀：正文”条目：前缀（含全角冒号）加粗——参与方与演化过程共用 */
function Lead({ text }: { text: string }) {
  const i = text.indexOf("：");
  if (i < 0) return <>{text}</>;
  return (
    <>
      <strong>{text.slice(0, i + 1)}</strong>
      {text.slice(i + 1)}
    </>
  );
}

/** 相关/对立列表：kebab(term) 命中现有词条则链接，否则纯文本 */
function RelationList({ items }: { items: Relation[] }) {
  return (
    <ul className="rels">
      {items.map((r) => {
        const rid = relationWordId(r.term);
        return (
          <li key={r.term}>
            <div className="rline">
              {rid ? (
                <Link className="rterm" href={`/w/${rid}`} lang="en">
                  {r.term}
                </Link>
              ) : (
                <span className="rterm plain" lang="en">
                  {r.term}
                </span>
              )}
              <span className="rzh">{r.termZh}</span>
            </div>
            {r.note && <p className="rnote">{r.note}</p>}
          </li>
        );
      })}
    </ul>
  );
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
  const indexed = getIndex().words.find((w) => w.id === id)!; // getFullWord 已确认存在
  const related = getRelatedWords(id); // 同领域推荐，为空时整节隐藏
  const vocab = getTagVocab();

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
      <p className="whook">{word.hook}</p>
      <p className="t-body wdef">{word.definition}</p>
      <div className="wsecs">
        <section className="sec">
          <h2 className="t-label">标签</h2>
          {vocab.dimensions.map((dim) => (
            <div className="tagrow" key={dim.key}>
              <h3 className="t-label">{dim.name}</h3>
              <ul className="tagcloud">
                {indexed.tags[dim.key].map((t) => (
                  <li key={t.slug}>
                    <Link className="chip" href={`/tag/${dim.key}/${t.slug}`}>
                      <span>{t.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
        <section className="sec">
          <h2 className="t-label">背景</h2>
          <p>{word.background}</p>
        </section>
        <section className="sec">
          <h2 className="t-label">要解决的问题</h2>
          <p>{word.problem}</p>
        </section>
        <section className="sec">
          <h2 className="t-label">关键参与方</h2>
          <ul className="lead">
            {word.actors.map((a) => (
              <li key={a}>
                <Lead text={a} />
              </li>
            ))}
          </ul>
        </section>
        <section className="sec">
          <h2 className="t-label">演化过程</h2>
          <ol className="lead">
            {word.evolution.map((e, i) => (
              <li key={i}>
                <Lead text={e} />
              </li>
            ))}
          </ol>
        </section>
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
        <section className="sec">
          <h2 className="t-label">相关</h2>
          <RelationList items={word.relations.related} />
        </section>
        {word.relations.opposite.length > 0 && (
          <section className="sec">
            <h2 className="t-label">对立</h2>
            <RelationList items={word.relations.opposite} />
          </section>
        )}
        <section className="sec">
          <h2 className="t-label">出处</h2>
          <ul className="srcs">
            {word.sources.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noopener noreferrer">
                  {s.title} <span aria-hidden="true">↗</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
      {related.length > 0 && (
        <section className="related">
          <h2 className="t-label">同领域</h2>
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
