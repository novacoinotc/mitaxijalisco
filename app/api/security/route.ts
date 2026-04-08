import { sql, hasDb } from "@/lib/db";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!hasDb) return Response.json([]);
  const rows = await sql`
    select s.*, t.origin, t.destination, u.name as user_name, d.name as driver_name
    from security_events s
    left join trips t on t.id = s.trip_id
    left join users u on u.id = t.user_id
    left join drivers d on d.id = t.driver_id
    order by s.created_at desc limit 50
  `;
  return Response.json(rows);
}

export async function POST(req: Request) {
  if (!hasDb) return Response.json({ ok: false }, { status: 503 });
  const b = await req.json();
  const [row] = await sql`
    insert into security_events (trip_id, kind, details)
    values (${b.trip_id ?? null}, ${b.kind}, ${b.details})
    returning *
  `;
  return Response.json(row);
}
