"use client";

import { useRouter, useSearchParams } from "next/navigation";
import ArchiveView, {
  type ArchDay,
  type ArchDim,
  type ArchTag,
} from "./ArchiveView";

/**
 * 档案列表的客户端外壳：读 ?dim= / ?tag=（非法 dim 按“全部”，tag 不在该维度
 * 已用标签里按该维度“全部”，忽略旧 ?domain=），筛选同步回 URL。
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

  const rawDim = searchParams.get("dim") ?? "";
  const dim = dims.some((d) => d.key === rawDim) ? rawDim : "";
  const rawTag = dim ? (searchParams.get("tag") ?? "") : "";
  const tag =
    dim && tags.some((t) => t.dimension === dim && t.slug === rawTag)
      ? rawTag
      : "";

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
