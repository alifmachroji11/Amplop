create table uploads (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  storage_path text not null,
  status text not null default 'uploaded' check (status in ('uploaded','processing','done','failed')),
  error text,
  created_at timestamptz not null default now()
);
create index uploads_session_idx on uploads(session_id);

create table transactions (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  upload_id uuid references uploads(id) on delete set null,
  merchant text not null,
  occurred_at date not null,
  amount_cents bigint not null,
  category text not null,
  confidence numeric,
  is_blurry boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint transactions_upload_id_unique unique (upload_id)
);
create index transactions_session_week_idx on transactions(session_id, occurred_at);
