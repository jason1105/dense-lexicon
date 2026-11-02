"use client";

import { useRouter, useSearchParams } from "next/navigation";
import ArchiveView, { type ArchDay } from "./ArchiveView";
import type { Domain } from "@/lib/types";

/**
 * 档案列表的客户端外壳：读 ?domain=（非法值按“全部”处理），
 * 筛选同步回 URL。静态 HTML 由 Suspense fallback 提供完整“全部”视图。
 */
export default function ArchiveList({
  days,
  domains,
}: {
  days: ArchDay[];
  domains: { domain: Domain; label: string }[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const raw = searchParams.get("domain") ?? "";
  const selected =
    raw === "" || domains.some((d) => d.domain === raw) ? raw : "";

  const select = (domain: string) => {
    router.replace(
      domain ? `/archive?domain=${domain}` : "/archive",
      { scroll: false },
    );
  };

  return (
    <ArchiveView days={days} domains={domains} selected={selected} onSelect={select} />
  );
}
