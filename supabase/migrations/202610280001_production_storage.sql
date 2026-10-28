-- Run once in the existing project's SQL editor. Additive: preserves existing tables.
begin;
create table if not exists public.bindy_documents (
  key text primary key,
  value jsonb not null,
  revision bigint not null default 1 check (revision > 0),
  updated_at timestamptz not null default now()
);
alter table public.bindy_documents enable row level security;
revoke all on public.bindy_documents from anon, authenticated;
grant all on public.bindy_documents to service_role;

create or replace function public.bindy_compare_and_swap(document_key text, document_value jsonb, expected_revision bigint)
returns boolean language plpgsql security invoker set search_path = '' as $$
declare changed integer;
begin
  if expected_revision = 0 then
    insert into public.bindy_documents(key,value,revision) values(document_key,document_value,1) on conflict do nothing;
  else
    update public.bindy_documents set value=document_value,revision=revision+1,updated_at=now()
      where key=document_key and revision=expected_revision;
  end if;
  get diagnostics changed = row_count;
  return changed = 1;
end; $$;
revoke all on function public.bindy_compare_and_swap(text,jsonb,bigint) from public, anon, authenticated;
grant execute on function public.bindy_compare_and_swap(text,jsonb,bigint) to service_role;

create table if not exists public.bindy_rate_limits (
  key text primary key, hits integer not null, expires_at timestamptz not null
);
alter table public.bindy_rate_limits enable row level security;
revoke all on public.bindy_rate_limits from anon, authenticated;
grant all on public.bindy_rate_limits to service_role;
create or replace function public.bindy_rate_limit(limit_key text, max_hits integer, window_seconds integer)
returns boolean language plpgsql security invoker set search_path = '' as $$
declare count_now integer;
begin
  insert into public.bindy_rate_limits(key,hits,expires_at) values(limit_key,1,now()+make_interval(secs=>window_seconds))
  on conflict(key) do update set
    hits=case when public.bindy_rate_limits.expires_at<=now() then 1 else public.bindy_rate_limits.hits+1 end,
    expires_at=case when public.bindy_rate_limits.expires_at<=now() then now()+make_interval(secs=>window_seconds) else public.bindy_rate_limits.expires_at end
  returning hits into count_now;
  delete from public.bindy_rate_limits where expires_at<now()-interval '1 day';
  return count_now<=max_hits;
end; $$;
revoke all on function public.bindy_rate_limit(text,integer,integer) from public,anon,authenticated;
grant execute on function public.bindy_rate_limit(text,integer,integer) to service_role;

-- Public reads for garment photography only; uploads go through authenticated server routes.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('bindy-media','bindy-media',true,8388608,array['image/jpeg','image/png','image/webp'])
on conflict(id) do nothing;
-- Restrictive policies keep existing policies for other applications unchanged.
-- Even a broader authenticated-user upload policy cannot write to this bucket.
drop policy if exists bindy_media_insert_server_only on storage.objects;
create policy bindy_media_insert_server_only on storage.objects as restrictive for insert to anon,authenticated with check(bucket_id <> 'bindy-media');
drop policy if exists bindy_media_update_server_only on storage.objects;
create policy bindy_media_update_server_only on storage.objects as restrictive for update to anon,authenticated using(bucket_id <> 'bindy-media') with check(bucket_id <> 'bindy-media');
drop policy if exists bindy_media_delete_server_only on storage.objects;
create policy bindy_media_delete_server_only on storage.objects as restrictive for delete to anon,authenticated using(bucket_id <> 'bindy-media');
notify pgrst, 'reload schema';
commit;
