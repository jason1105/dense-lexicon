import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

export const ROOT = process.cwd();
export const CONTENT_DIR = join(ROOT, "content");
export const DAYS_DIR = join(CONTENT_DIR, "days");
export const SCHEMA_PATH = join(CONTENT_DIR, "schema", "day.schema.json");
export const TAGS_SCHEMA_PATH = join(CONTENT_DIR, "schema", "tags.schema.json");
export const TAGS_PATH = join(CONTENT_DIR, "tags.json");

/** 合法内容文件名：YYYY-MM-DD.json */
export const DAY_FILE_RE = /^\d{4}-\d{2}-\d{2}\.json$/;

/** term → kebab-case id：转小写，连续非 [a-z0-9] 字符记为一个 -，去掉首尾 - */
export function kebab(s) {
  return String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** content/days 的全部目录条目（含目录/杂项文件，供 V6 检查） */
export function listDayEntries() {
  return readdirSync(DAYS_DIR, { withFileTypes: true });
}

/** 合法命名的日期文件，升序（YYYY-MM-DD 字典序即日期序） */
export function listDayFiles() {
  return listDayEntries()
    .filter((e) => e.isFile() && DAY_FILE_RE.test(e.name))
    .map((e) => e.name)
    .sort();
}

export function readDayFile(name) {
  return JSON.parse(readFileSync(join(DAYS_DIR, name), "utf8"));
}

/** 受控标签词表 content/tags.json */
export function readTagsFile() {
  return JSON.parse(readFileSync(TAGS_PATH, "utf8"));
}

/** 领域枚举顺序，单一来源：schema 的 $defs.word.properties.domain.enum */
export function domainOrder() {
  const schema = JSON.parse(readFileSync(SCHEMA_PATH, "utf8"));
  return schema.$defs.word.properties.domain.enum;
}
