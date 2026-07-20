import pg from "pg";
import { randomUUID } from "node:crypto";
import fs from "node:fs";

const envText = fs.readFileSync(new URL("../.env.local", import.meta.url), "utf8");
const readEnv = (name) => {
  const line = envText.split(/\r?\n/).find((item) => item.startsWith(`${name}=`));
  return line?.slice(name.length + 1).trim().replace(/^['"]|['"]$/g, "");
};
const connectionString = process.env.POSTGRES_URL || readEnv("POSTGRES_URL") || readEnv("POSTGRES_PRISMA_URL");
if (!connectionString) throw new Error("POSTGRES_URL ausente.");

const databaseUrl = new URL(connectionString);
databaseUrl.searchParams.delete("sslmode");
const client = new pg.Client({ connectionString: databaseUrl.toString(), ssl: { rejectUnauthorized: false } });
const userA = randomUUID();
const userB = randomUUID();
let failure;
try {
  await client.connect();
  await client.query("begin");
  for (const [id, email] of [[userA, `rls-a-${userA}@example.test`], [userB, `rls-b-${userB}@example.test`]]) {
    await client.query("insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at) values ($1, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', $2, '', now(), '{}', '{}', now(), now())", [id, email]);
  }
  await client.query("insert into public.clientes (user_id,nome,cpf) values ($1,'Cliente A','11111111111'),($2,'Cliente B','22222222222')", [userA, userB]);
  await client.query("set local role authenticated");
  await client.query("select set_config('request.jwt.claim.sub', $1, true)", [userA]);
  const visible = await client.query("select user_id from public.clientes order by user_id");
  if (visible.rowCount !== 1 || visible.rows[0].user_id !== userA) throw new Error("RLS falhou: usuário A enxergou registros indevidos.");
  const altered = await client.query("update public.clientes set nome='INVASAO' where user_id=$1", [userB]);
  if (altered.rowCount !== 0) throw new Error("RLS falhou: usuário A alterou o usuário B.");
  console.log("RLS validado: leitura e escrita isoladas por usuário.");
} catch (error) {
  failure = error;
} finally {
  try { await client.query("rollback"); } catch (rollbackError) { failure ??= rollbackError; }
  await client.end().catch(() => undefined);
}
if (failure) throw failure;
