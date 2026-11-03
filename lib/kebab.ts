/**
 * term → kebab-case id：转小写，连续非 [a-z0-9] 字符记为一个 -，去掉首尾 -。
 * 与 scripts/lib.mjs 的 kebab 保持同一语义（词条 id 与 relations 链接都依赖它）。
 */
export function kebab(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
