import { readFileSync } from "node:fs";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import {
  DAY_FILE_RE,
  SCHEMA_PATH,
  TAGS_PATH,
  TAGS_SCHEMA_PATH,
  kebab,
  listDayEntries,
  listDayFiles,
  readDayFile,
} from "./lib.mjs";

const errors = [];
const warnings = [];
const fail = (file, jsonPath, reason) =>
  errors.push(`${file}: ${jsonPath || "/"}: ${reason}`);

/* V6：content/days 下只允许 YYYY-MM-DD.json（忽略 .DS_Store） */
for (const entry of listDayEntries()) {
  if (entry.name === ".DS_Store") continue;
  if (!entry.isFile() || !DAY_FILE_RE.test(entry.name)) {
    fail(
      `content/days/${entry.name}`,
      "/",
      entry.isFile()
        ? "文件名必须形如 YYYY-MM-DD.json"
        : "不是普通文件，只允许 YYYY-MM-DD.json",
    );
  }
}

/* V1：可解析 + JSON Schema 2020-12 校验 */
const schema = JSON.parse(readFileSync(SCHEMA_PATH, "utf8"));
const ajv = new Ajv2020({ allErrors: true });
addFormats(ajv);
const validateDay = ajv.compile(schema);

/* V8：tags.json 可解析 + JSON Schema 校验；结构可信才做 V9/V10/V13 */
const validateTags = ajv.compile(
  JSON.parse(readFileSync(TAGS_SCHEMA_PATH, "utf8")),
);
let vocab = null; // { dimensions: [{ key, name, tags: [{slug, name, …}] }] }
const usedTagKeys = new Set(); // `${dimension}:${slug}`（V13 用）
try {
  vocab = JSON.parse(readFileSync(TAGS_PATH, "utf8"));
} catch (e) {
  fail("content/tags.json", "/", `JSON 解析失败：${e.message}`);
}
if (vocab !== null && !validateTags(vocab)) {
  for (const e of validateTags.errors ?? []) {
    fail("content/tags.json", e.instancePath, e.message);
  }
  vocab = null;
}

/* name → slug（按维度），词条标签核对（V10）与建索引都用它 */
const tagNameToSlug = new Map(); // `${dimension}:${name}` → slug
if (vocab !== null) {
  /* V9：维度内 slug、name 唯一 */
  for (const dim of vocab.dimensions) {
    const seenSlug = new Set();
    const seenName = new Map(); // name -> slug（报错用）
    for (const t of dim.tags) {
      if (seenSlug.has(t.slug)) {
        fail("content/tags.json", `/dimensions/${dim.key}`, `slug "${t.slug}" 重复`);
      }
      seenSlug.add(t.slug);
      if (seenName.has(t.name)) {
        fail(
          "content/tags.json",
          `/dimensions/${dim.key}`,
          `name "${t.name}" 重复（${seenName.get(t.name)} 与 ${t.slug}）`,
        );
      }
      seenName.set(t.name, t.slug);
      tagNameToSlug.set(`${dim.key}:${t.name}`, t.slug);
    }
  }
}

const seenIds = new Map(); // id -> 首次出现的文件（V4）
const days = [];
let wordCount = 0;

for (const name of listDayFiles()) {
  const file = `content/days/${name}`;
  let data;
  try {
    data = readDayFile(name);
  } catch (e) {
    fail(file, "/", `JSON 解析失败：${e.message}`);
    continue;
  }
  if (!validateDay(data)) {
    const seen = new Set();
    for (const e of validateDay.errors ?? []) {
      const line = `${e.instancePath}: ${e.message}`;
      if (seen.has(line)) continue;
      seen.add(line);
      fail(file, e.instancePath, e.message);
    }
    continue; // 结构不可信，跳过该文件的 V2–V5
  }
  days.push({ name, data });
  wordCount += data.words.length;

  /* V2：文件名（去 .json）=== date */
  const stem = name.replace(/\.json$/, "");
  if (stem !== data.date) {
    fail(file, "/date", `与文件名不一致（文件名 ${stem}，date ${data.date}）`);
  }

  data.words.forEach((w, i) => {
    /* V3：id === kebab(term) */
    const expected = kebab(w.term);
    if (w.id !== expected) {
      fail(file, `/words/${i}/id`, `必须等于 kebab(term)："${w.id}" ≠ "${expected}"`);
    }
    /* V4：id 全库唯一 */
    if (seenIds.has(w.id)) {
      fail(file, `/words/${i}/id`, `id "${w.id}" 已在 ${seenIds.get(w.id)} 中出现`);
    } else {
      seenIds.set(w.id, file);
    }

    /* V10：每个 tag name 必须在该维度词表里 */
    if (vocab !== null) {
      for (const dim of vocab.dimensions) {
        for (const name of w.tags[dim.key]) {
          const slug = tagNameToSlug.get(`${dim.key}:${name}`);
          if (slug === undefined) {
            fail(
              file,
              `/words/${i}/tags/${dim.key}`,
              `词条 ${w.id}：维度 ${dim.key}（${dim.name}）的标签 "${name}" 不在词表`,
            );
          } else {
            usedTagKeys.add(`${dim.key}:${slug}`);
          }
        }
      }
    }

    /* V11：relations 的 kebab(term) 不能等于自身 id；related+opposite 合并后不重复 */
    const seenRel = new Map(); // kebab(term) -> term（报错用）
    for (const group of ["related", "opposite"]) {
      w.relations[group].forEach((r, j) => {
        const k = kebab(r.term);
        if (k === w.id) {
          fail(
            file,
            `/words/${i}/relations/${group}/${j}/term`,
            `词条 ${w.id}：relations 指向自身（"${r.term}"）`,
          );
        }
        if (seenRel.has(k)) {
          fail(
            file,
            `/words/${i}/relations/${group}/${j}/term`,
            `词条 ${w.id}：relations 中 "${r.term}" 与 "${seenRel.get(k)}" 的 kebab 重复（${k}）`,
          );
        } else {
          seenRel.set(k, r.term);
        }
      });
    }

    /* V12：sources url 必须 http(s)——schema 已拦，这里给出带词条 id 的友好报错 */
    w.sources.forEach((s, j) => {
      if (!/^https?:\/\//.test(s.url)) {
        fail(
          file,
          `/words/${i}/sources/${j}/url`,
          `词条 ${w.id}：url 必须以 http:// 或 https:// 开头（"${s.url}"）`,
        );
      }
    });
  });

  /* V5：同一天内 termZh 不重复 */
  const seenZh = new Set();
  data.words.forEach((w, i) => {
    if (seenZh.has(w.termZh)) {
      fail(file, `/words/${i}/termZh`, `同一天内重复："${w.termZh}"`);
    }
    seenZh.add(w.termZh);
  });
}

/* V7：日期不连续只警告，不失败 */
const DAY_MS = 86400000;
const toMs = (s) => Date.parse(`${s}T00:00:00Z`);
const dates = days.map((d) => d.data.date).sort();
for (let i = 1; i < dates.length; i++) {
  const gap = Math.round((toMs(dates[i]) - toMs(dates[i - 1])) / DAY_MS);
  if (gap > 1) {
    warnings.push(`日期不连续：${dates[i - 1]} → ${dates[i]}（间隔 ${gap} 天）`);
  }
}

/* V13：词表中未被任何词使用的标签 → 仅警告 */
if (vocab !== null) {
  for (const dim of vocab.dimensions) {
    for (const t of dim.tags) {
      if (!usedTagKeys.has(`${dim.key}:${t.slug}`)) {
        warnings.push(`标签未被使用：${dim.name}/${t.name}（${dim.key}:${t.slug}）`);
      }
    }
  }
}

for (const w of warnings) console.log(`⚠ ${w}`);
if (errors.length > 0) {
  for (const e of errors) console.error(`✗ ${e}`);
  console.error(`\n校验失败：${errors.length} 个错误`);
  process.exit(1);
}
console.log(`✓ ${days.length} 个文件，${wordCount} 个词，全部通过`);
