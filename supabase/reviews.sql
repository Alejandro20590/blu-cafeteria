create table if not exists public.reviews (
	id uuid primary key default gen_random_uuid(),
	name text not null check (char_length(btrim(name)) between 2 and 60),
	rating smallint not null check (rating between 1 and 5),
	comment text not null check (char_length(btrim(comment)) between 10 and 500),
	status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
	created_at timestamptz not null default now()
);

alter table public.reviews enable row level security;

revoke all privileges on public.reviews from anon, authenticated;
grant select on public.reviews to anon, authenticated;
grant insert (name, rating, comment) on public.reviews to anon, authenticated;

drop policy if exists "Anyone can read approved reviews" on public.reviews;
create policy "Anyone can read approved reviews"
	on public.reviews
	for select
	to anon, authenticated
	using (status = 'approved');

drop policy if exists "Anyone can submit pending reviews" on public.reviews;
create policy "Anyone can submit pending reviews"
	on public.reviews
	for insert
	to anon, authenticated
	with check (status = 'pending');
