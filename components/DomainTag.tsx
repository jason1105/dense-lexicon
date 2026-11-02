import { domainLabel } from "@/lib/domains";
import type { Domain } from "@/lib/types";

/** 领域标签：胶囊样式，显示中文名 */
export default function DomainTag({ domain }: { domain: Domain }) {
  return <span className="tag">{domainLabel(domain)}</span>;
}
