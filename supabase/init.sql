-- Supabase initialization SQL
-- Run this on your Supabase project to create required tables for the site

create table if not exists public.contact_messages (
  id bigserial primary key,
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz default now()
);
