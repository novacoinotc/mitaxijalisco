import { neon } from "@neondatabase/serverless";
import fs from "fs";
import path from "path";
import "dotenv/config";

const url = process.env.DATABASE_URL;
if (!url) { console.error("DATABASE_URL missing"); process.exit(1); }
const sql = neon(url);

const schema = fs.readFileSync(path.resolve("lib/schema.sql"), "utf8");

async function main() {
  console.log("🧱 Creando esquema…");
  for (const stmt of schema.split(/;\s*\n/).map(s => s.trim()).filter(Boolean)) {
    await sql.query(stmt);
  }

  console.log("🧹 Limpiando data demo…");
  await sql.query("truncate security_events, trips, payment_methods, users, drivers restart identity cascade");

  console.log("👤 Usuarios…");
  await sql.query(
    `insert into users (name, email, phone, city) values
     ($1,$2,$3,$4),($5,$6,$7,$8),($9,$10,$11,$12),($13,$14,$15,$16)`,
    ["Sofía Ramírez","sofia@demo.mx","3312345678","Guadalajara",
     "Carlos Hernández","carlos@demo.mx","3387654321","Zapopan",
     "María López","maria@demo.mx","3311112222","Tlaquepaque",
     "Issac Villarruel","issac@demo.mx","3399998888","Guadalajara"]
  );

  console.log("🚗 Conductores…");
  await sql.query(
    `insert into drivers (name, email, phone, vehicle, plate, kind, rating, score_safety, verified, online) values
     ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10),
     ($11,$12,$13,$14,$15,$16,$17,$18,$19,$20),
     ($21,$22,$23,$24,$25,$26,$27,$28,$29,$30),
     ($31,$32,$33,$34,$35,$36,$37,$38,$39,$40)`,
    ["Don Roberto Mendoza","roberto@demo.mx","3322223333","Nissan Tsuru 2018 blanco","JAL-1234","taxi_formal",4.97,98,true,true,
     "Luis García","luis@demo.mx","3344445555","VW Vento 2020 gris","JAL-5678","particular",4.85,95,true,true,
     "Ana Pérez","ana@demo.mx","3366667777","Italika 125 roja","JAL-MT01","moto",4.90,99,true,false,
     "Pedro Salazar","pedro@demo.mx","3388889999","Chevy 2015 azul","JAL-9012","taxi_informal",4.72,88,true,true]
  );

  console.log("💳 Métodos de pago…");
  await sql.query(
    `insert into payment_methods (user_id, kind, label, last4, is_default) values
     (1,'card','BBVA Débito','4821',true),
     (1,'cash','Efectivo',null,false),
     (1,'codi','CoDi BBVA',null,false),
     (2,'card','Santander Crédito','9012',true),
     (4,'mercadopago','Mercado Pago',null,true)`
  );

  console.log("🧾 Viajes históricos…");
  const trips = [
    [1,1,"Av. Chapultepec 123","Plaza del Sol","ride","completed",68,61.2,2.4,12],
    [1,2,"Providencia","Centro Histórico","ride","completed",95,85.5,5.1,22],
    [2,1,"Andares","Minerva","ride","completed",120,108,6.8,18],
    [1,3,"Farmacia Guadalajara","Av. México 2100","farmacia","completed",45,40.5,1.2,8],
    [4,4,"Mercado San Juan","Colonia Americana","super","completed",85,76.5,3.3,15],
    [2,2,"Av. Vallarta","Aeropuerto GDL","aeropuerto","completed",280,252,18.5,35],
    [3,1,"Tlaquepaque Centro","Plaza Galerías","ride","completed",110,99,7.2,25],
    [1,2,"Casa","Oficina","ride","completed",72,64.8,3.1,14],
    [4,3,"Domicilio","Soriana Plaza Patria","favor","completed",60,54,2.8,20],
    [2,1,"Expo GDL","Hotel Riu","ride","completed",55,49.5,2.0,10],
  ];
  for (const t of trips) {
    await sql.query(
      `insert into trips (user_id, driver_id, origin, destination, service, status, fare_mxn, driver_earnings, distance_km, duration_min)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`, t
    );
  }

  console.log("🛡️ Eventos de seguridad…");
  await sql.query(
    `insert into security_events (trip_id, kind, details) values
     (2,'route_deviation','Desvío menor de 120m, verificado como tráfico'),
     (6,'stop_suspicious','Detención 3 min en semáforo, resuelto OK')`
  );

  const [{ count: uc }] = await sql.query("select count(*)::int from users");
  const [{ count: dc }] = await sql.query("select count(*)::int from drivers");
  const [{ count: tc }] = await sql.query("select count(*)::int from trips");
  console.log(`✅ Listo. users=${uc} drivers=${dc} trips=${tc}`);
}

main().catch(e => { console.error(e); process.exit(1); });
