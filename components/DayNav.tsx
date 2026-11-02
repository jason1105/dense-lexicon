import Link from "next/link";
import { getAdjacentDates } from "@/lib/content";

/** 底部前后一天导航；缺失的一侧留空占位 */
export default function DayNav({ date }: { date: string }) {
  const { prev, next } = getAdjacentDates(date);
  return (
    <div className="daynav">
      {prev ? <Link href={`/d/${prev}`}>← {prev}</Link> : <span />}
      {next ? <Link href={`/d/${next}`}>{next} →</Link> : <span />}
    </div>
  );
}
