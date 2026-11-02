import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Day, IndexedWord, IndexFile, Word } from "./types";

const CONTENT_DIR = join(process.cwd(), "content");

let indexCache: IndexFile | null = null;

/** content/index.json（构建产物，构建期直接读盘） */
export function getIndex(): IndexFile {
  if (!indexCache) {
    indexCache = JSON.parse(
      readFileSync(join(CONTENT_DIR, "index.json"), "utf8"),
    ) as IndexFile;
  }
  return indexCache;
}

/** 最新一天日期；空库为 null */
export function getLatest(): string | null {
  return getIndex().latest;
}

/** 全部日期，倒序（新→旧） */
export function getAllDates(): string[] {
  return getIndex().days.map((d) => d.date);
}

const dayCache = new Map<string, Day | null>();

/** 完整的一天内容；不存在为 null */
export function getDay(date: string): Day | null {
  if (!dayCache.has(date)) {
    try {
      dayCache.set(
        date,
        JSON.parse(
          readFileSync(join(CONTENT_DIR, "days", `${date}.json`), "utf8"),
        ) as Day,
      );
    } catch {
      dayCache.set(date, null);
    }
  }
  return dayCache.get(date) ?? null;
}

/** index 中的词条；不存在为 null */
export function getWord(id: string): IndexedWord | null {
  return getIndex().words.find((w) => w.id === id) ?? null;
}

/** 完整词条（含 scene / misconception，直接读 content/days/*.json） */
export function getFullWord(id: string): { word: Word; date: string } | null {
  const indexed = getWord(id);
  if (!indexed) return null;
  const day = getDay(indexed.date);
  const word = day?.words.find((w) => w.id === id);
  return word ? { word, date: indexed.date } : null;
}

/** 第 N 天：升序位次，从 1 起；未知日期为 0 */
export function getDayNumber(date: string): number {
  const asc = [...getAllDates()].reverse();
  const i = asc.indexOf(date);
  return i === -1 ? 0 : i + 1;
}

/** 升序相邻日期：prev = 更早一天，next = 更晚一天 */
export function getAdjacentDates(
  date: string,
): { prev: string | null; next: string | null } {
  const asc = [...getAllDates()].reverse();
  const i = asc.indexOf(date);
  if (i === -1) return { prev: null, next: null };
  return { prev: asc[i - 1] ?? null, next: asc[i + 1] ?? null };
}

const WEEK = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

/** 周几的中文（按日期字符串的 UTC 日，不受运行环境影响） */
export function weekdayZh(date: string): string {
  return WEEK[new Date(`${date}T00:00:00Z`).getUTCDay()] ?? "";
}

/** 相关词（index 已排好序，直接按 id 取） */
export function getRelatedWords(id: string): IndexedWord[] {
  const w = getWord(id);
  if (!w) return [];
  return w.related
    .map((rid) => getWord(rid))
    .filter((x): x is IndexedWord => x !== null);
}
