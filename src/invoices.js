// Invoices are kept in memory; amounts in cents, times as UTC milliseconds since the epoch.
const invoices = new Map();
let nextId = 1;

function create({ customer, amountCents, dueAt }) {
  const invoice = { id: nextId++, customer, amountCents, dueAt, paid: false };
  invoices.set(invoice.id, invoice);
  return invoice;
}

function find(id) {
  return invoices.get(id) || null;
}

function markPaid(id) {
  const invoice = invoices.get(id);
  if (!invoice) return null;
  invoice.paid = true;
  return invoice;
}

function reset() {
  invoices.clear();
  nextId = 1;
}

module.exports = { create, find, markPaid, reset };
