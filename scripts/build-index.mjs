import { writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  CONTENT_DIR,
  listDayFiles,
  readDayFile,
  readTagsFile,
} from "./lib.mjs";

const toMs = (s) => Date.parse(`${s}T00:00:00Z`);

/* 标签词表：name → slug（按维度），词表顺序即输出顺序 */
const vocab = readTagsFile();
const tagNameToSlug = new Map(); // `${dimension}:${name}` -> slug
for (const dim of vocab.dimensions) {
  for (const t of dim.tags) tagNameToSlug.set(`${dim.key}:${t.name}`, t.slug);
}

const asc = listDayFiles().map((name) => readDayFile(name)); // 日期升序
const desc = [...asc].reverse();

/* words：日期倒序，同一天内保持文件顺序；tags 每维度给 [{slug, name}] */
const words = [];
for (const day of desc) {
  for (const w of day.words) {
    const tags = {};
    for (const dim of vocab.dimensions) {
      tags[dim.key] = w.tags[dim.key].map((name) => ({
        slug: tagNameToSlug.get(`${dim.key}:${name}`),
        name,
      }));
    }
    words.push({
      id: w.id,
      term: w.term,
      termZh: w.termZh,
      domain: w.domain,
      date: day.date,
      hook: w.hook,
      definition: w.definition,
      compresses: w.compresses,
      tags,
    });
  }
}

/* 标签相近：共享 (dimension,slug) 标签数 ≥ 2 的其他词，
   按共享数降序 → 日期差绝对值升序 → id 升序，取前 3 */
const tagSets = new Map(
  words.map((w) => [
    w.id,
    new Set(
      vocab.dimensions.flatMap((dim) =>
        w.tags[dim.key].map((t) => `${dim.key}:${t.slug}`),
      ),
    ),
  ]),
);
for (const w of words) {
  const mine = tagSets.get(w.id);
  w.similar = words
    .filter((c) => c.id !== w.id)
    .map((c) => {
      const theirs = tagSets.get(c.id);
      let shared = 0;
      for (const k of mine) if (theirs.has(k)) shared++;
      return { id: c.id, shared, diff: Math.abs(toMs(c.date) - toMs(w.date)) };
    })
    .filter((c) => c.shared >= 2)
    .sort(
      (a, b) =>
        b.shared - a.shared ||
        a.diff - b.diff ||
        (a.id < b.id ? -1 : a.id > b.id ? 1 : 0),
    )
    .slice(0, 3)
    .map((c) => c.id);
}

/* tags：只列被使用的（count>0），维度按词表顺序、维度内按词表顺序 */
const tagCounts = new Map(); // `${dimension}:${slug}` -> count
for (const w of words) {
  for (const dim of vocab.dimensions) {
    for (const t of w.tags[dim.key]) {
      const key = `${dim.key}:${t.slug}`;
      tagCounts.set(key, (tagCounts.get(key) ?? 0) + 1);
    }
  }
}
const tags = vocab.dimensions.flatMap((dim) =>
  dim.tags
    .filter((t) => (tagCounts.get(`${dim.key}:${t.slug}`) ?? 0) > 0)
    .map((t) => ({
      dimension: dim.key,
      slug: t.slug,
      name: t.name,
      count: tagCounts.get(`${dim.key}:${t.slug}`),
    })),
);

const index = {
  version: 3,
  latest: desc[0]?.date ?? null,
  days: desc.map((d) => ({ date: d.date, ids: d.words.map((w) => w.id) })),
  words,
  tags,
};

/* 确定性输出：同样输入 → 字节级相同，不含时间戳 */
writeFileSync(join(CONTENT_DIR, "index.json"), `${JSON.stringify(index, null, 2)}\n`);
console.log(
  `✓ content/index.json：${index.days.length} 天 ${index.words.length} 词 ${index.tags.length} 个标签`,
);
