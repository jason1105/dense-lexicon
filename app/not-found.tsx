import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "404" };

export default function NotFound() {
  return (
    <div className="center">
      <div className="big" aria-hidden="true">
        404
      </div>
      <h1 className="t-subtitle">这个词还没收录。</h1>
      <div className="links">
        <Link href="/">回到今日</Link>
        <Link href="/archive">看档案</Link>
      </div>
    </div>
  );
}
