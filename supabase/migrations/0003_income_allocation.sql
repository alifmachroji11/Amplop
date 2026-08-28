-- Manually-logged income entries (via /pemasukan, not the OCR upload flow) can carry a
-- budgeting allocation breakdown alongside the plain amount/category already used by every
-- other transaction row. Kept as jsonb rather than a child table since the shape is small,
-- fixed, and only ever read/written as a whole alongside its parent row.
alter table transactions
  add column income_allocation jsonb;
