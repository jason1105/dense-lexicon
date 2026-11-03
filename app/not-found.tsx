import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "404" };

export default function NotFound() {
  return (
    <div className="center">
      <div className="big" aria-hidden="true">
        404
      </div>
      <h1 className="t-subtitle">这里没有内容。</h1>
      <p>可能是词还没收录，或者链接写错了。</p>
      <div className="links">
        <Link href="/">回到今日</Link>
        <Link href="/archive">看档案</Link>
        <Link href="/tags">看标签</Link>
      </div>
    </div>
  );
}
