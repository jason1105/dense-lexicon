import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { LEGACY_DOMAIN, resolveArchiveQuery } from "../lib/archive-query.ts";

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
test("legacy ?domain= maps to a tag", () => {
  assert.deepEqual(q("domain=architecture"), { dim: "engineering", tag: "architecture" });
  assert.deepEqual(q("domain=devops"), { dim: "engineering", tag: "continuous-delivery" });
  assert.deepEqual(q("domain=distributed-systems"), { dim: "discipline", tag: "distributed-systems" });
  assert.deepEqual(q("domain=nope"), { dim: "", tag: "" });
  assert.deepEqual(q("domain=constructor"), { dim: "", tag: "" });
  assert.deepEqual(q("domain=architecture&dim=level"), { dim: "level", tag: "" });
});
test("every legacy target exists in the vocabulary", () => {
  for (const [d, [dim, slug]] of Object.entries(LEGACY_DOMAIN)) {
    assert.ok(tags.some((t) => t.dimension === dim && t.slug === slug), `${d} → ${dim}:${slug}`);
  }
});
