create table rate_limit_events (
  id bigint generated always as identity primary key,
  user_id uuid not null,
  route text not null,
  created_at timestamptz not null default now()
);
create index rate_limit_events_user_route_idx on rate_limit_events(user_id, route, created_at);
alter table rate_limit_events enable row level security;
