import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { CONTENT_DIR, domainOrder, listDayFiles, readDayFile } from "./lib.mjs";

const toMs = (s) => Date.parse(`${s}T00:00:00Z`);

const asc = listDayFiles().map((name) => readDayFile(name)); // 日期升序
const desc = [...asc].reverse();

/* words：日期倒序，同一天内保持文件顺序 */
const words = [];
for (const day of desc) {
  for (const w of day.words) {
    words.push({
      id: w.id,
      term: w.term,
      termZh: w.termZh,
      domain: w.domain,
      date: day.date,
      definition: w.definition,
      compresses: w.compresses,
    });
  }
}

/* related：同领域其他词，按日期差绝对值升序，再按 id 升序，取前 3 */
for (const w of words) {
  w.related = words
    .filter((c) => c.domain === w.domain && c.id !== w.id)
    .map((c) => ({ id: c.id, diff: Math.abs(toMs(c.date) - toMs(w.date)) }))
    .sort((a, b) => a.diff - b.diff || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0))
    .slice(0, 3)
    .map((c) => c.id);
}

/* domains：只列 count>0，按 schema 枚举顺序 */
const counts = new Map();
for (const w of words) counts.set(w.domain, (counts.get(w.domain) ?? 0) + 1);

const index = {
  version: 1,
  latest: desc[0]?.date ?? null,
  days: desc.map((d) => ({ date: d.date, ids: d.words.map((w) => w.id) })),
  words,
  domains: domainOrder()
    .filter((domain) => (counts.get(domain) ?? 0) > 0)
    .map((domain) => ({ domain, count: counts.get(domain) })),
};

/* 确定性输出：同样输入 → 字节级相同，不含时间戳 */
writeFileSync(join(CONTENT_DIR, "index.json"), `${JSON.stringify(index, null, 2)}\n`);
console.log(`✓ content/index.json：${index.days.length} 天 ${index.words.length} 词`);
