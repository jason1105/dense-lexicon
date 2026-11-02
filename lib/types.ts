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

/** content/days/YYYY-MM-DD.json 中的一个词条 */
export interface Word {
  id: string;
  term: string;
  termZh: string;
  domain: Domain;
  definition: string;
  compresses: string[];
  scene: string;
  misconception: string;
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
  definition: string;
  compresses: string[];
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

/** content/index.json（构建产物，scripts/build-index.mjs 生成） */
export interface IndexFile {
  version: 1;
  latest: string | null;
  days: DayRef[];
  words: IndexedWord[];
  domains: DomainCount[];
}
