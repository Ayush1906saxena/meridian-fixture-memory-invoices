const express = require("express");
const invoices = require("./invoices");

const app = express();
app.use(express.json());

app.post("/invoices", (req, res) => {
  const { customer, amountCents, dueAt } = req.body || {};
  if (!customer || !Number.isInteger(amountCents) || !Number.isFinite(dueAt)) {
    return res.status(400).json({ error: "customer, integer amountCents and dueAt (UTC ms) are required" });
  }
  res.status(201).json(invoices.create({ customer, amountCents, dueAt }));
});

app.get("/invoices/:id", (req, res) => {
  const invoice = invoices.find(Number(req.params.id));
  if (!invoice) return res.status(404).json({ error: "no such invoice" });
  res.json(invoice);
});

app.post("/invoices/:id/pay", (req, res) => {
  const invoice = invoices.markPaid(Number(req.params.id));
  if (!invoice) return res.status(404).json({ error: "no such invoice" });
  res.json(invoice);
});

module.exports = app;
