create extension if not exists pgcrypto;

create table if not exists vehicles (
  id uuid primary key default gen_random_uuid(),
  brand text not null,
  model text not null,
  year integer not null check (year between 1950 and 2100),
  kilometers integer not null default 0 check (kilometers >= 0),
  fuel text not null default 'Nafta',
  transmission text not null default 'Manual',
  category text not null default 'Auto',
  price bigint not null check (price >= 0),
  status text not null default 'Disponible' check (status in ('Disponible','Reservado','Vendido','Próximo ingreso')),
  color text,
  engine text,
  description text,
  equipment jsonb not null default '[]'::jsonb,
  images jsonb not null default '[]'::jsonb,
  featured boolean not null default false,
  published boolean not null default true,
  views integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  message text,
  vehicle_id uuid references vehicles(id) on delete set null,
  channel text not null default 'Formulario web',
  status text not null default 'Nueva',
  assigned_to text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists trade_ins (
  id uuid primary key default gen_random_uuid(),
  name text,
  phone text not null,
  brand text not null,
  model text not null,
  year integer not null,
  kilometers integer not null,
  notes text,
  images jsonb not null default '[]'::jsonb,
  estimated_value bigint,
  status text not null default 'Pendiente',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists financing_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  vehicle_id uuid references vehicles(id) on delete set null,
  vehicle_value bigint not null,
  deposit bigint not null,
  installments integer not null,
  estimated_payment bigint,
  status text not null default 'Pendiente',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists price_alerts (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid references vehicles(id) on delete cascade,
  name text,
  phone text,
  email text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists saved_searches (
  id uuid primary key default gen_random_uuid(),
  name text,
  phone text,
  email text,
  filters jsonb not null default '{}'::jsonb,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists dealership_settings (
  id integer primary key default 1 check (id = 1),
  business_name text not null default 'VZ Automotores',
  city text not null default 'Rojas, Buenos Aires',
  address text,
  phone text not null default '2475-402499',
  whatsapp text not null default '5492475402499',
  email text,
  hours text,
  instagram text,
  show_prices boolean not null default true,
  show_sold boolean not null default false,
  updated_at timestamptz not null default now()
);

create table if not exists activity_events (
  id bigint generated always as identity primary key,
  event_type text not null,
  vehicle_id uuid references vehicles(id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

insert into dealership_settings (id) values (1) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('vehicle-images', 'vehicle-images', true) on conflict (id) do update set public = true;

alter table vehicles enable row level security;
alter table leads enable row level security;
alter table trade_ins enable row level security;
alter table financing_requests enable row level security;
alter table price_alerts enable row level security;
alter table saved_searches enable row level security;
alter table dealership_settings enable row level security;
alter table activity_events enable row level security;

create index if not exists vehicles_status_idx on vehicles(status);
create index if not exists vehicles_brand_model_idx on vehicles(brand, model);
create index if not exists leads_status_created_idx on leads(status, created_at desc);
create index if not exists trade_ins_status_created_idx on trade_ins(status, created_at desc);
create index if not exists financing_status_created_idx on financing_requests(status, created_at desc);
