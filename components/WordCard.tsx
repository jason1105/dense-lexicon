import Link from "next/link";
import type { Word } from "@/lib/types";
import DomainTag from "./DomainTag";

/**
 * 词条卡片：默认收起，展开后显示 压缩了什么 / 场景 / 常见误解。
 * 展开区在卡片内左右通栏（.more 负外边距抵消卡片内边距）。
 */
export default function WordCard({
  word,
  open,
  onToggle,
}: {
  word: Word;
  open: boolean;
  onToggle: () => void;
}) {
  const moreId = `more-${word.id}`;
  return (
    <article className="card" id={word.id}>
      <div className="card-head">
        <h2 className="t-title" lang="en">
          {word.term}
        </h2>
        <span className="t-subtitle zh">{word.termZh}</span>
      </div>
      <DomainTag domain={word.domain} />
      <p className="t-body def">{word.definition}</p>
      <div className={`more${open ? " open" : ""}`} id={moreId}>
        <div>
          <div className="more-inner">
            <section className="sec">
              <h3 className="t-label">压缩了什么</h3>
              <ul>
                {word.compresses.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </section>
            <section className="sec">
              <h3 className="t-label">场景</h3>
              <p>{word.scene}</p>
            </section>
            <section className="sec">
              <h3 className="t-label">常见误解</h3>
              <p>{word.misconception}</p>
            </section>
          </div>
        </div>
      </div>
      <div className="actions">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={moreId}
          onClick={onToggle}
        >
          {open ? "收起 ▴" : "展开 ▾"}
        </button>
        <Link href={`/w/${word.id}`}>详情 →</Link>
      </div>
    </article>
  );
}
