import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
// Typed as (..args) => Promise<any[]> so query results don't explode TS inference at call sites.
export const sql = (url ? neon(url) : (null as any)) as unknown as (strings: TemplateStringsArray, ...values: any[]) => Promise<any[]>;
export const hasDb = Boolean(url);
