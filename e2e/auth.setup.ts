import { expect, test as setup } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";
import { mkdir, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";

const authDirectory = ".playwright";
const statePath = `${authDirectory}/auth.json`;
const metadataPath = `${authDirectory}/user.json`;

setup("cria usuário descartável e autentica pela interface", async ({ page }) => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) throw new Error("Credenciais administrativas E2E ausentes.");

  const admin = createClient(url, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } });
  const suffix = randomUUID();
  const email = `e2e-${suffix}@example.test`;
  const password = `Themis!${suffix}Aa1`;
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { display_name: "Usuário E2E" },
  });
  if (error || !data.user) throw error ?? new Error("Supabase não retornou o usuário E2E.");

  await mkdir(authDirectory, { recursive: true });
  await writeFile(metadataPath, JSON.stringify({ userId: data.user.id }), "utf8");

  try {
    await page.goto("/login");
    await page.waitForLoadState("networkidle");
    await page.getByLabel("E-mail").fill(email);
    await page.locator("#senha").fill(password);
    await page.getByRole("button", { name: "Entrar no Sistema" }).click();
    await expect(page).toHaveURL(/\/dashboard$/);
    await page.context().storageState({ path: statePath });
  } catch (error_) {
    await admin.auth.admin.deleteUser(data.user.id);
    throw error_;
  }
});
