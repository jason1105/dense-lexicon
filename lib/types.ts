export type Domain =
  | "architecture"
  | "distributed-systems"
  | "data"
  | "testing"
  | "devops"
  | "observability"
  | "security"
  | "ai-engineering"
  | "frontend"
  | "process";

/** 标签的五个维度（与 content/schema/tags.schema.json 的 key 枚举一致） */
export type TagDimension =
  | "discipline"
  | "engineering"
  | "cognitive"
  | "scenario"
  | "level";

/** 词条内容文件里的标签：每维度一组中文 name（必须在词表里） */
export type WordTags = Record<TagDimension, string[]>;

/** index 里的标签引用：name 已解析成 {slug, name} */
export type IndexedTags = Record<TagDimension, TagRef[]>;

export interface TagRef {
  slug: string;
  name: string;
}

export interface Relation {
  term: string;
  termZh: string;
  note?: string;
}

export interface Source {
  title: string;
  url: string;
}

/** content/days/YYYY-MM-DD.json 中的一个词条（v2） */
export interface Word {
  id: string;
  term: string;
  termZh: string;
  domain: Domain;
  hook: string;
  definition: string;
  tags: WordTags;
  background: string;
  problem: string;
  actors: string[];
  evolution: string[];
  compresses: string[];
  scene: string;
  misconception: string;
  relations: { related: Relation[]; opposite: Relation[] };
  sources: Source[];
}

/** content/days/YYYY-MM-DD.json 的根对象 */
export interface Day {
  date: string;
  words: Word[];
}

/** content/index.json 中的词条（列表与搜索所需字段） */
export interface IndexedWord {
  id: string;
  term: string;
  termZh: string;
  domain: Domain;
  date: string;
  hook: string;
  definition: string;
  compresses: string[];
  tags: IndexedTags;
  related: string[];
}

export interface DayRef {
  date: string;
  ids: string[];
}

export interface DomainCount {
  domain: Domain;
  count: number;
}

/** index 顶层 tags：一个被使用的标签及其词数 */
export interface TagCount {
  dimension: TagDimension;
  slug: string;
  name: string;
  count: number;
}

/** content/tags.json 里的一个标签 */
export interface VocabTag {
  slug: string;
  name: string;
  description?: string;
}

/** content/tags.json 里的一个维度 */
export interface VocabDimension {
  key: TagDimension;
  name: string;
  tags: VocabTag[];
}

/** content/tags.json（受控标签词表，构建期直接读盘） */
export interface TagVocab {
  version: 1;
  dimensions: VocabDimension[];
}

/** content/index.json（构建产物，scripts/build-index.mjs 生成） */
export interface IndexFile {
  version: 2;
  latest: string | null;
  days: DayRef[];
  words: IndexedWord[];
  domains: DomainCount[];
  tags: TagCount[];
}
