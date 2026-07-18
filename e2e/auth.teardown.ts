import { test as teardown } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";
import { access, readFile, rm } from "node:fs/promises";

const authDirectory = ".playwright";

teardown("remove usuário descartável", async () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) return;

  try {
    await access(`${authDirectory}/user.json`);
  } catch {
    return;
  }

  const metadata = JSON.parse(await readFile(`${authDirectory}/user.json`, "utf8")) as { userId: string };
  const admin = createClient(url, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } });
  try {
    const { error } = await admin.auth.admin.deleteUser(metadata.userId);
    if (error && !error.message.toLowerCase().includes("not found")) throw error;
  } finally {
    await rm(authDirectory, { recursive: true, force: true });
  }
});
