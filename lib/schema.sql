-- Mi Taxi Jalisco — schema
create table if not exists users (
  id serial primary key,
  name text not null,
  email text unique not null,
  phone text,
  city text default 'Guadalajara',
  created_at timestamptz default now()
);

create table if not exists drivers (
  id serial primary key,
  name text not null,
  email text unique not null,
  phone text,
  vehicle text,
  plate text,
  kind text,  -- taxi_formal, taxi_informal, particular, moto
  rating numeric(3,2) default 5.00,
  score_safety int default 100,
  verified boolean default false,
  online boolean default false,
  created_at timestamptz default now()
);

create table if not exists trips (
  id serial primary key,
  user_id int references users(id) on delete set null,
  driver_id int references drivers(id) on delete set null,
  origin text,
  destination text,
  service text default 'ride', -- ride, envios, super, favor, farmacia, ninos, pet, aeropuerto
  status text default 'completed', -- requested, matched, ongoing, completed, canceled
  fare_mxn numeric(10,2),
  driver_earnings numeric(10,2),
  distance_km numeric(6,2),
  duration_min int,
  created_at timestamptz default now()
);

create table if not exists payment_methods (
  id serial primary key,
  user_id int references users(id) on delete cascade,
  kind text, -- card, cash, codi, spei, mercadopago
  label text,
  last4 text,
  is_default boolean default false
);

create table if not exists security_events (
  id serial primary key,
  trip_id int references trips(id) on delete cascade,
  kind text, -- sos, route_deviation, stop_suspicious, silent_protocol
  details text,
  created_at timestamptz default now()
);
