/**
 * 档案筛选参数解析（纯函数，客户端用；scripts/archive-query.test.mjs 覆盖）。
 * - 只认 ?dim=<dimension>&tag=<slug>，其他参数忽略。
 * - 非法 dim → 全部；dim 合法但 tag 不在其已用标签里 → 该维度全部。
 */
export function resolveArchiveQuery(
  get: (key: string) => string | null,
  dims: readonly { key: string }[],
  tags: readonly { dimension: string; slug: string }[],
): { dim: string; tag: string } {
  const rawDim = get("dim") ?? "";
  const rawTag = get("tag") ?? "";
  const dim = dims.some((d) => d.key === rawDim) ? rawDim : "";
  const tag =
    dim && tags.some((t) => t.dimension === dim && t.slug === rawTag) ? rawTag : "";
  return { dim, tag };
}
