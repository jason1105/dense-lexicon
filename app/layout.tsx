import type { Metadata, Viewport } from "next";
import Link from "next/link";
import NavLinks from "@/components/NavLinks";
import SearchShortcut from "@/components/SearchShortcut";
import { getLatest } from "@/lib/content";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://dense-lexicon.vercel.app"),
  title: { default: "每日三词", template: "%s · 每日三词" },
  description: "每天 3 个软件研发领域的高密度词汇。",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>
        <SearchShortcut />
        <a className="skip" href="#content">
          跳到内容
        </a>
        <header>
          <div className="wrap">
            <Link className="brand" href="/">
              <span className="long">每日三词</span>
              <span className="short">三词</span>
            </Link>
            <NavLinks latestDate={getLatest() ?? undefined} />
          </div>
        </header>
        <main id="content" tabIndex={-1}>
          <div className="wrap">{children}</div>
        </main>
        <footer>
          <div className="wrap t-meta">
            © dense-lexicon ·{" "}
            <a href="https://github.com/jason1105/dense-lexicon">GitHub</a>
          </div>
        </footer>
      </body>
    </html>
  );
}
