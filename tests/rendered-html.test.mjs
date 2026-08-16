import assert from "node:assert/strict";
import test from "node:test";

const templateRoot = new URL("../", import.meta.url);

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request("http://localhost/", { headers: { accept: "text/html" } }), { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } }, { waitUntil() {}, passThroughOnException() {} });
}

test("server-renders the Physical AI field manual", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /Physical AI Field Manual/i);
  assert.match(html, /具身智能互动教材/);
  assert.match(html, /不是学习路线/);
  assert.match(html, /FIRST PRINCIPLES/);
  assert.match(html, /FEYNMAN CHECK/);
  assert.match(html, /INTERACTIVE LAB/);
  assert.doesNotMatch(html, /Starter Project|Your site is taking shape/);
});

test("workspace contains the field manual social card", async () => {
  const { access } = await import("node:fs/promises");
  await access(new URL("public/og-manual.png", templateRoot));
});
