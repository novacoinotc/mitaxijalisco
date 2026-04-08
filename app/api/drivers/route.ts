import { sql, hasDb } from "@/lib/db";
export const dynamic = "force-dynamic";
export async function GET() {
  if (!hasDb) return Response.json([]);
  const rows = await sql`select * from drivers order by rating desc`;
  return Response.json(rows);
}
