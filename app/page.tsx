import DayView from "@/components/DayView";
import { getDay, getLatest } from "@/lib/content";

/** 今日 = 最新一天（title 用布局默认 “每日三词”） */
export default function HomePage() {
  const latest = getLatest();
  const day = latest ? getDay(latest) : null;
  if (!day) {
    return (
      <div className="center">
        <h1 className="t-subtitle">还没有内容。明天 09:00 见。</h1>
      </div>
    );
  }
  return <DayView day={day} />;
}
