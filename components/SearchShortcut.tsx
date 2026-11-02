"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** 全站按 “/” 跳到搜索并聚焦输入框（输入框/文本域/可编辑区内除外） */
export default function SearchShortcut() {
  const router = useRouter();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      const tag = t?.tagName?.toLowerCase() ?? "";
      if (tag === "input" || tag === "textarea" || t?.isContentEditable) return;
      e.preventDefault();
      if (window.location.pathname === "/search") {
        document.getElementById("q")?.focus();
      } else {
        router.push("/search");
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [router]);
  return null;
}
