import type { Metadata } from "next";
import { Suspense } from "react";
import ArchiveList from "@/components/ArchiveList";
import ArchiveView from "@/components/ArchiveView";
import { getIndex } from "@/lib/content";
import { DOMAIN_LABELS } from "@/lib/domains";

export const metadata: Metadata = { title: "档案" };

export default function ArchivePage() {
  const index = getIndex();
  const byId = new Map(index.words.map((w) => [w.id, w]));

  const days = index.days.map((d) => ({
    date: d.date,
    words: d.ids
      .map((id) => byId.get(id))
      .filter((w): w is NonNullable<typeof w> => w !== undefined)
      .map(({ id, term, termZh, domain }) => ({ id, term, termZh, domain })),
  }));

  const domains = index.domains.map((d) => ({
    domain: d.domain,
    label: DOMAIN_LABELS[d.domain],
  }));

  return (
    <>
      <h1 className="t-title page-h1">
        档案 · 共 {index.days.length} 天 {index.words.length} 词
      </h1>
      {days.length === 0 ? (
        <p className="hint">还没有内容。明天 09:00 见。</p>
      ) : (
        <Suspense
          fallback={<ArchiveView days={days} domains={domains} selected="" />}
        >
          <ArchiveList days={days} domains={domains} />
        </Suspense>
      )}
    </>
  );
}
