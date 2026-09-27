const test = require("node:test");
const assert = require("node:assert");
const app = require("../src/app");
const invoices = require("../src/invoices");

async function withServer(fn) {
  const server = app.listen(0);
  try {
    await fn(`http://127.0.0.1:${server.address().port}`);
  } finally {
    server.close();
  }
}

test("creates and reads an invoice", async () => {
  invoices.reset();
  await withServer(async (base) => {
    const created = await fetch(`${base}/invoices`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ customer: "Asha", amountCents: 5000, dueAt: Date.UTC(2026, 2, 1) }),
    });
    assert.strictEqual(created.status, 201);
    const { id } = await created.json();
    const read = await (await fetch(`${base}/invoices/${id}`)).json();
    assert.strictEqual(read.amountCents, 5000);
    assert.strictEqual(read.paid, false);
  });
});

test("rejects an invoice without an amount", async () => {
  invoices.reset();
  await withServer(async (base) => {
    const res = await fetch(`${base}/invoices`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ customer: "Asha", dueAt: 0 }),
    });
    assert.strictEqual(res.status, 400);
  });
});
