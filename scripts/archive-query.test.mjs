import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolveArchiveQuery } from "../lib/archive-query.ts";

const vocab = JSON.parse(readFileSync("content/tags.json", "utf8"));
const dims = vocab.dimensions.map((d) => ({ key: d.key }));
const tags = vocab.dimensions.flatMap((d) => d.tags.map((t) => ({ dimension: d.key, slug: t.slug })));
const q = (s) => resolveArchiveQuery((k) => new URLSearchParams(s).get(k), dims, tags);

test("dim + tag", () => {
  assert.deepEqual(q("dim=engineering&tag=architecture"), { dim: "engineering", tag: "architecture" });
  assert.deepEqual(q("dim=engineering"), { dim: "engineering", tag: "" });
});
test("invalid values fall back", () => {
  assert.deepEqual(q("dim=foo&tag=architecture"), { dim: "", tag: "" });
  assert.deepEqual(q("dim=engineering&tag=nope"), { dim: "engineering", tag: "" });
  assert.deepEqual(q("tag=architecture"), { dim: "", tag: "" });
  assert.deepEqual(q(""), { dim: "", tag: "" });
});
test("other params are ignored", () => {
  assert.deepEqual(q("foo=architecture"), { dim: "", tag: "" });
  assert.deepEqual(q("category=architecture&dim=level"), { dim: "level", tag: "" });
  assert.deepEqual(q("dim=constructor&tag=architecture"), { dim: "", tag: "" });
});
test("every vocabulary tag resolves", () => {
  for (const t of tags) assert.deepEqual(q(`dim=${t.dimension}&tag=${t.slug}`), { dim: t.dimension, tag: t.slug });
});
