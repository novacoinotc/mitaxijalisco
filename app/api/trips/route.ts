import { sql, hasDb } from "@/lib/db";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!hasDb) return Response.json([], { status: 200 });
  const rows = await sql`
    select t.*, u.name as user_name, d.name as driver_name, d.plate as driver_plate
    from trips t
    left join users u on u.id = t.user_id
    left join drivers d on d.id = t.driver_id
    order by t.created_at desc
    limit 100
  `;
  return Response.json(rows);
}

export async function POST(req: Request) {
  if (!hasDb) return Response.json({ ok: false }, { status: 503 });
  const b = await req.json();
  const [row] = await sql`
    insert into trips (user_id, driver_id, origin, destination, service, status, fare_mxn, driver_earnings, distance_km, duration_min)
    values (${b.user_id}, ${b.driver_id}, ${b.origin}, ${b.destination}, ${b.service ?? "ride"}, ${b.status ?? "completed"}, ${b.fare_mxn}, ${b.driver_earnings}, ${b.distance_km}, ${b.duration_min})
    returning *
  `;
  return Response.json(row);
}
