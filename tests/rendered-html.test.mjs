import assert from "node:assert/strict";
import test from "node:test";

const templateRoot = new URL("../", import.meta.url);

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request("http://localhost/", { headers: { accept: "text/html" } }), { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } }, { waitUntil() {}, passThroughOnException() {} });
}

test("server-renders the Physical AI learning program", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /Physical AI Field School/i);
  assert.match(html, /16 周具身智能学习计划/);
  assert.match(html, /从“懂 AI”到/);
  assert.match(html, /THE 16-WEEK PROGRAM/);
  assert.match(html, /毕业不是“跑起来”/);
  assert.doesNotMatch(html, /Starter Project|Your site is taking shape/);
});

test("workspace contains the project social card", async () => {
  const { access } = await import("node:fs/promises");
  await access(new URL("public/og.png", templateRoot));
});
