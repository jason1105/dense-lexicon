import type { Day } from "@/lib/types";
import { getDayNumber, weekdayZh } from "@/lib/content";
import Cards from "./Cards";
import DayNav from "./DayNav";

/** 一天的完整视图：日期头 + 三张卡 + 前后导航（首页与日期页共用） */
export default function DayView({ day }: { day: Day }) {
  const nth = getDayNumber(day.date);
  return (
    <>
      <div className="dayhead">
        <h1>
          {day.date} · {weekdayZh(day.date)}
        </h1>
        <span className="t-meta subtle nth">
          第 {nth} 天
        </span>
      </div>
      <Cards words={day.words} />
      <DayNav date={day.date} />
    </>
  );
}
