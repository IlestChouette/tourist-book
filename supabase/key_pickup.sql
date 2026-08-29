alter table properties add column if not exists key_instructions text;
alter table properties add column if not exists key_lockbox_code text;
alter table properties add column if not exists key_photos text[] not null default '{}'::text[];
