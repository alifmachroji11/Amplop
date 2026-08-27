alter table uploads
  add column user_id uuid references auth.users(id) on delete set null;

alter table transactions
  add column user_id uuid references auth.users(id) on delete set null;

create index uploads_user_idx on uploads(user_id);
create index transactions_user_week_idx on transactions(user_id, occurred_at);

-- No RLS policy changes: uploads/transactions remain deny-all for anon/
-- authenticated roles. All app data access goes through the service_role
-- client (lib/supabase/server.ts); the anon-key client added alongside this
-- migration is used solely for auth.getUser()/signInWithOAuth()/signOut(),
-- never for querying these tables.
