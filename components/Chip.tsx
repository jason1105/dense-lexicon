import Link from "next/link";

/**
 * 全站唯一的标签胶囊：单行“名称 词数”，外层负责 ≥44px 点击区。
 * 传 href 渲染为链接；否则为筛选按钮（aria-pressed）。
 */
export default function Chip({
  label,
  count,
  title,
  href,
  pressed,
  onClick,
}: {
  label: string;
  count?: number;
  title?: string;
  href?: string;
  pressed?: boolean;
  onClick?: () => void;
}) {
  const pill = (
    <span className="pill">
      {label}
      {count !== undefined && <span className="tcount">{count}</span>}
    </span>
  );
  return href ? (
    <Link className="chip" href={href} title={title}>
      {pill}
    </Link>
  ) : (
    <button className="chip" type="button" aria-pressed={pressed} title={title} onClick={onClick}>
      {pill}
    </button>
  );
}
