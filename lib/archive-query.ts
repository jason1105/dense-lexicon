/**
 * 档案筛选参数解析（纯函数，客户端用；scripts/archive-query.test.mjs 覆盖）。
 * - ?dim=<dimension>&tag=<slug>；非法 dim → 全部；dim 合法但 tag 不在其已用标签里 → 该维度全部。
 * - 兼容 v1 链接 ?domain=<x>：映射到对应标签（静态导出，只能在客户端做）；未知值 → 全部。
 */
export const LEGACY_DOMAIN: Readonly<Record<string, readonly [string, string]>> = {
  architecture: ["engineering", "architecture"],
  "distributed-systems": ["discipline", "distributed-systems"],
  data: ["engineering", "data-access"],
  testing: ["engineering", "testing"],
  devops: ["engineering", "continuous-delivery"],
  observability: ["engineering", "observability"],
  security: ["engineering", "security"],
  "ai-engineering": ["engineering", "ai-engineering"],
  frontend: ["engineering", "frontend"],
  process: ["engineering", "engineering-management"],
};

export function resolveArchiveQuery(
  get: (key: string) => string | null,
  dims: readonly { key: string }[],
  tags: readonly { dimension: string; slug: string }[],
): { dim: string; tag: string } {
  let rawDim = get("dim") ?? "";
  let rawTag = get("tag") ?? "";
  const legacy = get("domain") ?? "";
  if (!rawDim && Object.hasOwn(LEGACY_DOMAIN, legacy)) [rawDim, rawTag] = LEGACY_DOMAIN[legacy];
  const dim = dims.some((d) => d.key === rawDim) ? rawDim : "";
  const tag =
    dim && tags.some((t) => t.dimension === dim && t.slug === rawTag) ? rawTag : "";
  return { dim, tag };
}
