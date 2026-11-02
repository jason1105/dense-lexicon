"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * 主导航。“今日”在 / 与最新一天 /d/<latest> 上都视为当前页（与原型一致）。
 */
export default function NavLinks({ latestDate }: { latestDate?: string }) {
  const pathname = usePathname();
  const homeActive =
    pathname === "/" ||
    (latestDate !== undefined && pathname === `/d/${latestDate}`);

  const items = [
    { href: "/", label: "今日", active: homeActive },
    { href: "/archive", label: "档案", active: pathname === "/archive" },
    { href: "/search", label: "搜索", active: pathname === "/search" },
    { href: "/about", label: "关于", active: pathname === "/about" },
  ];

  return (
    <nav aria-label="主导航">
      <ul>
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={item.active ? "page" : undefined}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
