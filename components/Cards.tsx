"use client";

import { useEffect, useState } from "react";
import type { Word } from "@/lib/types";
import WordCard from "./WordCard";

/**
 * 一天的三张卡。管理展开状态；URL hash 为 #<id> 时自动展开对应卡并滚动到它。
 * （hash 形如 #/w/xxx 的是路由，不是卡片锚点，忽略。）
 */
export default function Cards({ words }: { words: Word[] }) {
  const [openIds, setOpenIds] = useState<ReadonlySet<string>>(new Set());

  useEffect(() => {
    const applyHash = () => {
      const h = decodeURIComponent(window.location.hash.slice(1));
      if (!h || h.startsWith("/")) return;
      const el = document.getElementById(h);
      if (el?.classList.contains("card")) {
        setOpenIds((prev) => {
          const next = new Set(prev);
          next.add(h);
          return next;
        });
        el.scrollIntoView({ block: "start" });
      }
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  return (
    <div className="cards">
      {words.map((word) => (
        <WordCard
          key={word.id}
          word={word}
          open={openIds.has(word.id)}
          onToggle={() =>
            setOpenIds((prev) => {
              const next = new Set(prev);
              if (next.has(word.id)) next.delete(word.id);
              else next.add(word.id);
              return next;
            })
          }
        />
      ))}
    </div>
  );
}
