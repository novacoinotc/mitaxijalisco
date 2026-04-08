import { sql, hasDb } from "@/lib/db";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!hasDb) return Response.json({ ok: false, error: "no-db" }, { status: 503 });
  const [u] = await sql`select count(*)::int as n from users`;
  const [d] = await sql`select count(*)::int as n from drivers`;
  const [t] = await sql`select count(*)::int as n from trips`;
  const [r] = await sql`select coalesce(sum(fare_mxn),0)::float as total from trips`;
  const [e] = await sql`select count(*)::int as n from drivers where online = true`;
  return Response.json({
    users: u.n, drivers: d.n, trips: t.n, revenue: r.total, online: e.n,
  });
}
