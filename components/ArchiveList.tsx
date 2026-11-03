"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { resolveArchiveQuery } from "@/lib/archive-query";
import ArchiveView, {
  type ArchDay,
  type ArchDim,
  type ArchTag,
} from "./ArchiveView";

/**
 * 档案列表的客户端外壳：读 ?dim= / ?tag=（规则与旧 ?domain= 映射见
 * lib/archive-query.ts），筛选同步回 URL。
 * 静态 HTML 由 Suspense fallback 提供完整“全部”视图。
 */
export default function ArchiveList({
  days,
  dims,
  tags,
}: {
  days: ArchDay[];
  dims: ArchDim[];
  tags: ArchTag[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { dim, tag } = resolveArchiveQuery((k) => searchParams.get(k), dims, tags);

  const select = (nextDim: string, nextTag: string) => {
    const qs = new URLSearchParams();
    if (nextDim) qs.set("dim", nextDim);
    if (nextDim && nextTag) qs.set("tag", nextTag);
    const query = qs.toString();
    router.replace(query ? `/archive?${query}` : "/archive", { scroll: false });
  };

  return (
    <ArchiveView
      days={days}
      dims={dims}
      tags={tags}
      dim={dim}
      tag={tag}
      onSelect={select}
    />
  );
}
