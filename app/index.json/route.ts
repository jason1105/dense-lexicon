import { readFileSync } from "node:fs";
import { join } from "node:path";

export const dynamic = "force-static";

/** 输出构建产物 content/index.json（供 /search 客户端 fetch） */
export function GET() {
  const data = readFileSync(
    join(process.cwd(), "content", "index.json"),
    "utf8",
  );
  return new Response(data, {
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}
