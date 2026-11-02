import type { Domain } from "./types";

/** 领域枚举顺序，与 content/schema/day.schema.json 的 enum 一致 */
export const DOMAIN_ORDER: readonly Domain[] = [
  "architecture",
  "distributed-systems",
  "data",
  "testing",
  "devops",
  "observability",
  "security",
  "ai-engineering",
  "frontend",
  "process",
] as const;

export const DOMAIN_LABELS: Record<Domain, string> = {
  architecture: "架构",
  "distributed-systems": "分布式",
  data: "数据",
  testing: "测试",
  devops: "交付运维",
  observability: "可观测",
  security: "安全",
  "ai-engineering": "AI 工程",
  frontend: "前端",
  process: "研发过程",
};

export function domainLabel(domain: Domain): string {
  return DOMAIN_LABELS[domain];
}
